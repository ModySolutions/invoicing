<?php

namespace Invoice\Hooks\Invoice;

class Routes {
    public static function add_rewrite_rule(): void {
        add_rewrite_rule(
            'invoices/([^/]+)/?$',
            'index.php?pagename=invoices&invoice_page=$matches[1]',
            'top'
        );

        add_rewrite_rule(
            'invoices/(view|edit)/([^/]+)/?$',
            'index.php?pagename=invoices&invoice_page=$matches[1]&post_name=$matches[2]&uuid=$matches[3]',
            'top'
        );

        add_rewrite_rule(
            'invoices/print/([^/]+)/?$',
            'index.php?pagename=print-invoice&uuid=$matches[1]',
            'top'
        );
    }

    public static function query_vars(array $vars): array {
        $vars[] = 'invoice_page';
        $vars[] = 'invoice_action';
        $vars[] = 'uuid';
        $vars[] = 'invoice_id';
        return $vars;
    }
}