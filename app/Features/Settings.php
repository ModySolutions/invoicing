<?php

namespace Invoice\Features;

trait Settings
{
    public function get_logo($invoice_id = null): ?string
    {
        if ($invoice_id) {
            $invoice_logo = get_field('invoice_logo', $invoice_id);
            if ($invoice_logo) {
                return $invoice_logo;
            }
        }
        $custom_logo_id = get_theme_mod('custom_logo');

        return $custom_logo_id ?
            wp_get_attachment_image_src($custom_logo_id, 'full', true)[0] :
            null;
    }

    public function get_settings(): array
    {
        return [
            'invoice_last_number' => get_option('invoice_last_number', 0),
            'invoice_series' => get_option('invoice_series', []),
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
            'invoices_taxes' => get_option('invoice_taxes', []),
            'invoice_discounts' => get_option('invoice_discounts', []),
            'invoice_currency' => get_option('invoice_currency', 'EUR'),
            'invoice_currency_symbol' => get_option('invoice_currency_symbol', '&euro;'),
            'invoice_logo' => $this->get_logo(),
            'spain_iva' => get_option('spain_iva'),
            'spain_irpf' => get_option('spain_irpf'),
            'selected_invoice_tax' => get_option('selected_invoice_tax', 21),
            'selected_invoice_discount' => get_option('selected_invoice_discount'),
        ];
    }
}
