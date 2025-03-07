<?php

namespace Invoice\Hooks\Invoice;

use function Env\env;

class Meta {
    public static function register_rest_field(): void {
        register_rest_field('invoice', 'invoice_date', self::invoice_date(...));
        register_rest_field('invoice', 'invoice_number', self::invoice_number(...));
    }

    public static function invoice_date(): array {
        return array(
            'get_callback' => function (array $invoice): string {
                return get_post_meta($invoice['id'], 'invoice_date', true);
            },
            'update_callback' => function (string $value, \WP_Post $invoice) {
                $date = strtotime($value);
                return $date ? update_post_meta($invoice->ID, 'invoice_date', $date) : null;
            }
        );
    }

    public static function invoice_number() : array {
        return array(
            'get_callback'    => function (array $invoice) {
                return get_post_meta($invoice['id'], 'invoice_number', true);
            },
            'update_callback' => function (string $value, \WP_Post $invoice) {
                if (empty($value)) {
                    return new \WP_Error(
                        'invalid_invoice_number',
                        __('Invoice number is required.', APP_THEME_LOCALE),
                        ['status' => 400]
                    );
                }

                global $wpdb;
                $existing_invoice = $wpdb->get_var($wpdb->prepare(
                    "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'invoice_number' AND meta_value = %s AND post_id != %d",
                    $value,
                    $invoice->ID
                ));

                if ($existing_invoice) {
                    return new \WP_Error(
                        'duplicate_invoice_number',
                        __('Invoice number already taken.', APP_THEME_LOCALE),
                        ['status' => 400]
                    );
                }

                update_option('invoice_last_number', $value);
                return update_post_meta($invoice->ID, 'invoice_number', $value);
            },
            'schema'          => [
                'description' => 'Número único de factura',
                'type'        => 'string',
                'context'     => ['view', 'edit'],
            ],
        );
    }

    public static function rest_prepare_invoice(
        \WP_REST_Response $response,
        \WP_Post $invoice,
        \WP_REST_Request $request
    ): \WP_REST_Response {
        if ('invoice' === $invoice->post_type) {
            $invoice_id = $invoice->ID;
            $response->data = self::schema($invoice_id);
        }

        return $response;
    }

    public static function rest_prepare_status(
        \WP_REST_Response $response,
        object $post_status,
        \WP_REST_Request $request
    ): \WP_REST_Response {
        if(!str_contains($post_status->name, 'invoice')) {
            return $response;
        }

        $status_to_color = array(
            'invoice_draft' => array('btn-text-charcoal', 'btn-chinese-white'),
            'invoice_issued' => array('btn-text-charcoal-inverse', 'btn-secondary'),
            'invoice_sent' => array('btn-text-info-dark', 'btn-info-light'),
            'invoice_paid' => array('btn-text-success-dark', 'btn-success-light'),
            'invoice_expired' => array('btn-text-warning-dark', 'btn-warning-light'),
            'invoice_cancelled' => array('btn-text-danger-dark', 'btn-danger-light'),
        );

        $response->data = array_merge($response->data, array(
            'classNames' => $status_to_color[$post_status->name],
        ));

        return $response;
    }

    public static function schema($invoice_id) : array {
        $stored_invoice_series_number = get_field('invoice_series_number', $invoice_id);
        $stored_invoice_number = get_field('invoice_number', $invoice_id);
        $invoice_number = '';
        if($stored_invoice_series_number) {
            $invoice_number = "{$stored_invoice_number}-";
        }
        $invoice_number .= $stored_invoice_number;
        $invoice_number = $stored_invoice_number === 99999 ? null : $invoice_number;
        $uuid = get_post_meta($invoice_id, 'uuid', true);
        $invoice_view_url = "/invoices/view/{$uuid}";
        $invoice_edit_url = "/invoices/edit/{$uuid}";
        return array(
            'ID' => $invoice_id,
            'UUID' => $uuid,
            'invoice_series_number' => $stored_invoice_series_number,
            'invoice_number' => $stored_invoice_number,
            'generated_invoice_number' => $invoice_number,
            'invoice_issue_date' => get_field(
                'invoice_issue_date',
                $invoice_id,
                false
            ),
            'invoice_due_date' => get_field(
                'invoice_due_date',
                $invoice_id,
                false
            ),
            'invoice_sender' => get_field('invoice_sender', $invoice_id, false),
            'invoice_currency' => get_field('invoice_currency', $invoice_id, false),
            'invoice_client' => get_field('invoice_client', $invoice_id, false),
            'invoice_sender_address' => get_field('invoice_sender_address', $invoice_id, false),
            'invoice_client_address' => get_field('invoice_client_address', $invoice_id, false),
            'invoice_items' => get_field('invoice_items', $invoice_id),
            'invoice_status' => get_post_status($invoice_id),
            'invoice_tax_amount' => get_field('invoice_tax_amount', $invoice_id),
            'invoice_taxes' => get_field('invoice_taxes', $invoice_id),
            'invoice_discount_amount' => get_field('invoice_discount_amount', $invoice_id),
            'invoice_discounts' => get_field('invoice_discounts', $invoice_id),
            'invoice_subtotal' => get_field('invoice_subtotal', $invoice_id),
            'invoice_tax_subtotal' => get_field('invoice_tax_subtotal', $invoice_id),
            'invoice_taxes_total' => get_field('invoice_taxes_total', $invoice_id),
            'invoice_discount_subtotal' => get_field('invoice_discount_subtotal', $invoice_id),
            'invoice_discount_total' => get_field('invoice_discount_total', $invoice_id),
            'invoice_total' => get_field('invoice_total', $invoice_id),
            'invoice_view_url' => $invoice_view_url,
            'invoice_edit_url' => $invoice_edit_url,
            'invoice_notes' => get_field('invoice_notes', $invoice_id),
            'invoice_terms' => get_field('invoice_terms', $invoice_id),
            'invoice_logo' => get_field('invoice_logo', $invoice_id),
        );
    }
}