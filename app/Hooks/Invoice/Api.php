<?php

namespace Invoice\Hooks\Invoice;

class Api {
    public static function register_rest_route(): void {
        register_rest_route('invoice/v1', '/settings/', array(
            'methods' => \WP_REST_Server::READABLE,
            'callback' => self::get_settings(...),
            'permission_callback' => function () {
                return is_user_logged_in();
            }
        ));
        register_rest_route('invoice/v1', '/settings/business', array(
            'methods' => \WP_REST_Server::EDITABLE,
            'callback' => self::save_business_settings(...),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        register_rest_route('invoice/v1', '/settings/invoice', array(
            'methods' => \WP_REST_Server::EDITABLE,
            'callback' => self::save_invoice_settings(...),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        register_rest_route('invoice/v1',
            '/invoice/(?P<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', array(
                'methods' => \WP_REST_Server::READABLE,
                'callback' => self::get_invoice(...),
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                }
            ));
        register_rest_route('invoice/v1',
            '/invoice/(?P<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => self::update_invoice(...),
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                }
            ));
        register_rest_route('invoice/v1',
            '/invoice/status/(?P<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})',
            array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => self::update_invoice_status(...),
                'permission_callback' => function () {
                    return current_user_can('manage_options');
                }
            ));
        register_rest_route('invoice/v1', '/invoice/new-invoice', array(
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::new_invoice(...),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
        register_rest_route('invoice/v1', '/invoice/', array(
            'methods' => \WP_REST_Server::CREATABLE,
            'callback' => self::create_invoice(...),
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ));
    }

    public static function get_settings(\WP_REST_Request $request): \WP_REST_Response {
        return rest_ensure_response(Settings::get_settings());
    }

    public static function save_business_settings(\WP_REST_Request $request): \WP_REST_Response {
        $fields = $request->get_params();
        $required_fields = self::_set_business_settings_fields_labels();
        extract(app_validate_required($required_fields, $fields));

        $data = array();
        if ($success) {
            $insert_fields = array_merge($required_fields, array(
                'invoice_business_address_cont' => __('Address <small>(cont)</small>')
            ));

            foreach ($insert_fields as $field => $label) {
                $value = sanitize_text_field($fields[$field]);
                update_option($field, $value);
                $data[$field] = $fields[$field];
            }

            $message = __('Your business information was saved successfully.');
        }

        return rest_ensure_response(array(
            'message' => $message,
            'success' => $success,
            'data' => $data,
        ));
    }

    public static function save_invoice_settings(\WP_REST_Request $request): \WP_REST_Response {
        $fields = $request->get_params();
        $required_fields = self::_set_invoice_settings_fields_labels();
        extract(app_validate_required($required_fields, $fields));

        $data = array();
        if ($success) {
            foreach ($required_fields as $field => $label) {
                $value = sanitize_text_field($fields[$field]);
                update_option($field, $value);
                $data[$field] = $fields[$field];
            }

            $message = __('Your invoice settings were saved successfully.');
        }

        return rest_ensure_response(array(
            'message' => $message,
            'success' => $success,
            'data' => $data,
        ));
    }

    public static function get_invoice(\WP_REST_Request $request): \WP_REST_Response {
        $uuid = $request->get_param('uuid');
        if (!$uuid) {
            return rest_ensure_response(array());
        }

        $uuid = sanitize_text_field($uuid);
        global $wpdb;
        $invoice =
            $wpdb->get_row($wpdb->prepare("SELECT post_id as id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s",
                'uuid', $uuid));

        return rest_ensure_response(Meta::schema($invoice->id));
    }

    public static function new_invoice(\WP_REST_Request $request) : \WP_REST_Response {
        $invoice_id = wp_insert_post(array(
            'post_title' => __('Draft', APP_THEME_LOCALE),
            'post_type' => APP_INVOICE_POST_TYPE,
        ));
        return rest_ensure_response(
            self::_update_invoice(
                $invoice_id,
                $request->get_params()
            )
        );
    }

    public static function create_invoice(\WP_REST_Request $request): \WP_REST_Response {
        $data = $request->get_params();
        $form_validation = self::_validate_invoice_data($data['acf'], null);
        if (!$form_validation['success']) {
            return rest_ensure_response(array(
                'success' => $form_validation['success'],
                'message' => $form_validation['message'],
            ));
        }

        $invoice_id = wp_insert_post(array(
            'post_title' => __('Draft', APP_THEME_LOCALE),
            'post_type' => APP_INVOICE_POST_TYPE,
        ));

        return rest_ensure_response(self::_update_invoice($invoice_id, $data));
    }

    public static function update_invoice(\WP_REST_Request $request): \WP_REST_Response {
        $uuid = $request->get_param('uuid');
        if (!$uuid) {
            return rest_ensure_response(array());
        }

        $uuid = sanitize_text_field($uuid);
        global $wpdb;
        $invoice =
            $wpdb->get_row($wpdb->prepare("SELECT post_id as id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s",
                'uuid', $uuid));

        if (!$invoice) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => __('Non existent invoice UUID', APP_THEME_LOCALE),
            ));
        }

        $invoice_id = $invoice->id;
        $data = $request->get_params();
        $form_validation = self::_validate_invoice_data($data['acf'], $invoice_id);
        if (!$form_validation['success']) {
            return rest_ensure_response(array(
                'success' => $form_validation['success'],
                'message' => $form_validation['message'],
            ));
        }

        return rest_ensure_response(self::_update_invoice($invoice_id, $data));
    }

    public static function update_invoice_status(\WP_REST_Request $request) : \WP_REST_Response {
        $success = true;
        $message = '';
        $uuid = $request->get_param('uuid');
        if (!$uuid) {
            return rest_ensure_response(array());
        }

        $uuid = sanitize_text_field($uuid);
        global $wpdb;
        $invoice =
            $wpdb->get_row($wpdb->prepare("SELECT post_id as id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s",
                'uuid', $uuid));

        if (!$invoice) {
            return rest_ensure_response(array(
                'success' => false,
                'message' => __('Non existent invoice UUID', APP_THEME_LOCALE),
            ));
        }

        $invoice_id = $invoice->id;
        wp_update_post(array(
            'ID' => $invoice_id,
            'post_status' => $request->get_param('invoice_status'),
        ));

        return rest_ensure_response(array(
            'success' => true,
            'message' => __('Invoice status updated', APP_THEME_LOCALE),
        ));
    }

    private static function _update_invoice(int $invoice_id, array $data): array {
        global $wpdb;
        $invoice_data = get_post($invoice_id);

        if (!$invoice_data) {
            return array(
                'success' => false,
                'message' => __('Couldn\'t save invoice data', APP_THEME_LOCALE),
            );
        }

        $wpdb->update($wpdb->posts, array(
            'post_status' => $data['post_status'],
        ), array(
            'ID' => $invoice_id
        ));
        wp_update_post(array(
            'ID' => $invoice_id,
            'post_status' => $data['post_status'],
        ));

        foreach ($data['acf'] as $key => $value) {
            update_field($key, $value, $invoice_id);
        }

        $invoice_last_number = self::_maybe_update_invoice_last_number($data['acf']['invoice_number']);

        return array_merge(array(
            'message' => __('Invoice updated successfully', APP_THEME_LOCALE),
            'success' => true,
            'invoice_last_number' => $invoice_last_number,
        ), Meta::schema($invoice_id));
    }

    private static function _validate_invoice_data(array $data, ?int $invoice_id): array {
        $valid = true;
        $required = array(
            'invoice_number' => __('Invoice number', APP_THEME_LOCALE),
            'invoice_issue_date' => __('Issue date', APP_THEME_LOCALE),
            'invoice_sender' => __('Sender', APP_THEME_LOCALE),
            'invoice_items' => __('Items', APP_THEME_LOCALE),
            'invoice_currency' => __('Currency', APP_THEME_LOCALE),
            'invoice_sender_address' => __('Sender', APP_THEME_LOCALE),
            'invoice_client_address' => __('Client', APP_THEME_LOCALE),
        );

        foreach ($required as $key => $label) {
            if (!array_key_exists($key, $data)) {
                return array(
                    'success' => false,
                    'message' => sprintf(__('The %s field is required', APP_THEME_LOCALE), $label)
                );
            }

            if (is_string($data[$key]) && $data[$key] == '') {
                return array(
                    'success' => false,
                    'message' => sprintf(__('The %s field is required', APP_THEME_LOCALE), $label)
                );
            } elseif (is_array($data[$key])) {
                foreach ($data[$key] as $item) {
                    if (empty($item['item_description']) ||
                        empty($item['item_quantity']) ||
                        empty($item['item_price'])) {
                        return array(
                            'success' => false,
                            'message' => __('Items should contain a description, quantity and price', APP_THEME_LOCALE),
                        );
                    }
                }
            }
        }

        global $wpdb;
        if ($invoice_id) {
            $query =
                "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'invoice_number' AND meta_value = %s AND post_id != %d";
        } else {
            $query = "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'invoice_number' AND meta_value = %s";
        }
        $existing_invoice = $wpdb->get_var($wpdb->prepare($query, $data['invoice_number'], $invoice_id));

        if ($existing_invoice) {
            return array(
                'success' => false,
                'message' => sprintf(__('The invoice number %s is already taken', APP_THEME_LOCALE),
                    $data['invoice_number'])
            );
        }

        return array('success' => true);
    }

    private static function _set_business_settings_fields_labels(): array {
        return array(
            'invoice_business_fni_country_code' => __('Country code', APP_THEME_LOCALE),
            'invoice_business_fni' => __('Fiscal Identification Number', APP_THEME_LOCALE),
            'invoice_business_name' => __('Business name', APP_THEME_LOCALE),
            'invoice_business_country' => __('Country', APP_THEME_LOCALE),
            'invoice_business_state' => __('State', APP_THEME_LOCALE),
            'invoice_business_address' => array(
                'required' => __('At least one address is required.', APP_THEME_LOCALE)
            ),
            'invoice_business_city' => __('City', APP_THEME_LOCALE),
            'invoice_business_postal_code' => __('Postal code', APP_THEME_LOCALE)
        );
    }

    private static function _maybe_update_invoice_last_number(string $invoice_number): string {
        $invoice_last_number = get_option('invoice_last_number');
        if ($invoice_number > $invoice_last_number) {
            update_option('invoice_last_number', $invoice_number);
            $invoice_last_number = $invoice_number;
        }
        return $invoice_last_number;
    }

    private static function _set_invoice_settings_fields_labels(): array {
        return array(
            'invoice_last_number' => __('Last invoice number', APP_THEME_LOCALE),
            'invoice_date_format' => __('Date format', APP_THEME_LOCALE),
            'invoice_currency' => __('Currency', APP_THEME_LOCALE),
        );
    }
}