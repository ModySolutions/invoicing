<?php

namespace Invoice\Hooks\Invoice;

use Invoice\Features\Schema;

class Meta
{
    use Schema;

    public function register_rest_field(): void
    {
        register_rest_field('invoice', 'invoice_date', [$this, 'invoice_date']);
        register_rest_field('invoice', 'invoice_number', [$this, 'invoice_number']);
    }

    public function invoice_date(): array
    {
        return [
            'get_callback' => function (array $invoice): string {
                return get_post_meta($invoice['id'], 'invoice_date', true);
            },
            'update_callback' => function (string $value, \WP_Post $invoice) {
                $date = strtotime($value);

                return $date ? update_post_meta($invoice->ID, 'invoice_date', $date) : null;
            },
        ];
    }

    public function invoice_number(): array
    {
        return [
            'get_callback' => function (array $invoice) {
                return get_post_meta($invoice['id'], 'invoice_number', true);
            },
            'update_callback' => function (string $value, \WP_Post $invoice) {
                if (empty($value)) {
                    return new \WP_Error(
                        'invalid_invoice_number',
                        __('Invoice number is required.', APP_THEME_LOCALE),
                        ['status' => 400],
                    );
                }

                global $wpdb;
                $existing_invoice = $wpdb->get_var($wpdb->prepare(
                    "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = 'invoice_number' AND meta_value = %s AND post_id != %d",
                    $value,
                    $invoice->ID,
                ));

                if ($existing_invoice) {
                    return new \WP_Error(
                        'duplicate_invoice_number',
                        __('Invoice number already taken.', APP_THEME_LOCALE),
                        ['status' => 400],
                    );
                }

                update_option('invoice_last_number', $value);

                return update_post_meta($invoice->ID, 'invoice_number', $value);
            },
            'schema' => [
                'description' => 'Número único de factura',
                'type' => 'string',
                'context' => ['view', 'edit'],
            ],
        ];
    }

    public function rest_prepare_invoice(
        \WP_REST_Response $response,
        \WP_Post $invoice,
        \WP_REST_Request $request,
    ): \WP_REST_Response {
        if ($invoice->post_type === 'invoice') {
            $invoice_id = $invoice->ID;
            $response->data = $this->schema($invoice_id);
        }

        return $response;
    }

    public function rest_prepare_status(
        \WP_REST_Response $response,
        object $post_status,
        \WP_REST_Request $request,
    ): \WP_REST_Response {
        if (! str_contains($post_status->name, 'invoice')) {
            return $response;
        }

        $status_to_color = [
            'invoice_draft' => ['btn-text-charcoal', 'btn-chinese-white'],
            'invoice_issued' => ['btn-text-charcoal-inverse', 'btn-secondary'],
            'invoice_sent' => ['btn-text-info-dark', 'btn-info-light'],
            'invoice_paid' => ['btn-text-success-dark', 'btn-success-light'],
            'invoice_expired' => ['btn-text-warning-dark', 'btn-warning-light'],
            'invoice_cancelled' => ['btn-text-danger-dark', 'btn-danger-light'],
        ];

        $response->data = array_merge($response->data, [
            'classNames' => $status_to_color[$post_status->name],
        ]);

        return $response;
    }
}
