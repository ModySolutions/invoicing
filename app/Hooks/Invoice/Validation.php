<?php

namespace Invoice\Hooks\Invoice;

class Validation
{
    public function acf_validate_value(
        bool|string $valid,
        $value,
        array $field,
        string $input_name,
    ): bool|string {
        if ($valid !== true) {
            return $valid;
        }
        global $wpdb;
        $query = $wpdb->get_row(
            $wpdb->prepare(
                'SELECT meta_value AS invoice_number FROM %s WHERE meta_key = %s && meta_value = %d',
                $wpdb->postmeta,
                'invoice_number',
                $value,
            ),
        );

        return false;
    }
}
