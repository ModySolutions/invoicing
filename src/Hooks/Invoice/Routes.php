<?php

namespace Invoice\Hooks\Invoice;

class Routes {
    public static function add_rewrite_rule(): void {
        add_rewrite_rule(
            'invoices/([^/]+)/?$',
            'index.php?pagename=invoice&invoice_page=$matches[1]',
            'top'
        );
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'invoice_page';
        return $vars;
    }
}