<?php

namespace Invoice\Features;

class Settings {
    public static function get_logo($invoice_id = null) : ?string {
        if($invoice_id) {
            $invoice_logo = get_field('invoice_logo', $invoice_id);
            if($invoice_logo) {
                return $invoice_logo;
            }
        }
        $custom_logo_id = get_theme_mod('custom_logo');
        return $custom_logo_id ?
            wp_get_attachment_image_src($custom_logo_id, 'full', true)[0] :
            null;
    }
}