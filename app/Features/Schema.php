<?php

namespace Invoice\Features;

trait Schema {
    use Settings;
    public function schema($invoice_id, $public = false) : array {
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

        $private_data = array(
            'invoice_client' => get_field('invoice_client', $invoice_id, false),
            'invoice_client_address' => get_field('invoice_client_address', $invoice_id, false),
            'invoice_view_url' => $invoice_view_url,
            'invoice_edit_url' => $invoice_edit_url,
            'invoice_notes' => get_field('invoice_notes', $invoice_id),
            'invoice_terms' => get_field('invoice_terms', $invoice_id),
        );

        $public_data = array(
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
            'invoice_sender_address' => get_field('invoice_sender_address', $invoice_id, false),
            'invoice_currency' => get_field('invoice_currency', $invoice_id, false),
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
            'invoice_logo' => $this->get_logo($invoice_id),
        );

        return $public ? $public_data : array_merge($public_data, $private_data);
    }
}