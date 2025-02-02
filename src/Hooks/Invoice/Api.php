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
    }

    public static function get_settings(\WP_REST_Request $request): \WP_REST_Response {
        $custom_logo_id = get_theme_mod('custom_logo');
        $custom_logo = $custom_logo_id ? wp_get_attachment_image_src($custom_logo_id, 'full', true)[0] : null;
        return rest_ensure_response(array(
            'invoice_last_number' => get_option('invoice_last_number', 0),
            'invoice_series' => get_option('invoice_series', array()),
            'invoice_date_format' => get_option('invoice_date_format', 'd/M/Y'),
            'invoice_business_fni_country_code' => get_option('invoice_business_fni_country_code', 'ES'),
            'invoice_business_fni' => get_option('invoice_business_fni', ''),
            'invoice_business_name' => get_option('invoice_business_name', get_bloginfo()),
            'invoice_business_country' => get_option('invoice_business_country', 'ES'),
            'invoice_business_state' => get_option('invoice_business_state', ''),
            'invoice_business_address' => get_option('invoice_business_address', ''),
            'invoice_business_address_cont' => get_option('invoice_business_address_cont', ''),
            'invoice_business_city' => get_option('invoice_business_city', ''),
            'invoice_business_postal_code' => get_option('invoice_business_postal_code', ''),
            'invoices_taxes' => get_option('invoice_taxes', array()),
            'invoice_discounts' => get_option('invoice_discounts', array()),
            'invoice_currency' => get_option('invoice_currency', 'EUR'),
            'invoice_currency_symbol' => get_option('invoice_currency_symbol', '&euro;'),
            'invoice_logo' => $custom_logo,
            'spain_iva' => get_option('spain_iva'),
            'spain_irpf' => get_option('spain_irpf'),
            'selected_invoice_tax' => get_option('selected_invoice_tax', 21),
            'selected_invoice_discount' => get_option('selected_invoice_discount'),
        ));
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
                $data[] = array($field => $fields[$field]);
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
                $data[] = array($field => $fields[$field]);
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
            return rest_ensure_response(array());
        }

        $invoice_id = $invoice->id;
        $data = $request->get_params();
        $invoice_data = get_post($invoice_id);

        if (!$invoice_data)
            return rest_ensure_response(array());

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

        return rest_ensure_response(array(
            'message' => __('Invoice update successfully', APP_THEME_LOCALE),
            'success' => true,
        ));
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

    private static function _set_invoice_settings_fields_labels(): array {
        return array(
            'invoice_last_number' => __('Last invoice number', APP_THEME_LOCALE),
            'invoice_date_format' => __('Date format', APP_THEME_LOCALE),
            'invoice_currency' => __('Currency', APP_THEME_LOCALE),
        );
    }
}