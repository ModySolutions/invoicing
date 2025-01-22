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
    }

    public static function get_settings(\WP_REST_Request $request): \WP_REST_Response {
        return rest_ensure_response(array(
            'invoice_last_number' => get_option('invoice_last_number', 0),
            'invoice_series' => get_option('invoice_series', array()),
            'invoice_date_format' => get_option('invoice_date_format', get_option('date_format')),
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
            'spain_iva' => get_option('spain_iva'),
            'spain_irpf' => get_option('spain_irpf'),
            'selected_invoice_tax' => get_option('selected_invoice_tax', 21),
            'selected_invoice_discount' => get_option('selected_invoice_discount', 15),
        ));
    }

    public static function save_business_settings(\WP_REST_Request $request): \WP_REST_Response {
        $fields = $request->get_params();
        $required_fields = self::_set_business_settings_fields_labels();
        extract(app_validate_required($required_fields, $fields));

        $data = array();
        if($success) {
            $insert_fields = array_merge($required_fields, array(
                'invoice_business_address_cont' => __('Address <small>(cont)</small>')
            ));

            foreach($insert_fields as $field => $label) {
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

    public static function save_invoice_settings(\WP_REST_Request $request) : \WP_REST_Response {
        $fields = $request->get_params();
        $required_fields = self::_set_invoice_settings_fields_labels();
        extract(app_validate_required($required_fields, $fields));

        $data = array();
        if($success) {
            foreach($required_fields as $field => $label) {
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

    private static function _set_business_settings_fields_labels() : array {
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

    private static function _set_invoice_settings_fields_labels() : array {
        return array(
            'invoice_last_number' => __('Last invoice number', APP_THEME_LOCALE),
            'invoice_date_format' => __('Date format', APP_THEME_LOCALE),
            'invoice_currency' => __('Currency', APP_THEME_LOCALE),
        );
    }
}