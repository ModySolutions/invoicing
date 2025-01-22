<?php

namespace Invoice\Hooks\Invoice;

class Settings {
    public static function register_setting() : void {
        register_setting(
            'options',
            'invoice_last_number',
            array(
                'type' => 'integer',
                'label' => __('Invoice last number'),
                'show_in_rest' => true,
                'default' => 1,
            )
        );
    }
}