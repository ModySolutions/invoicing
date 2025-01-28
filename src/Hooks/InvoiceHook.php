<?php

namespace Invoice\Hooks;

use Invoice\Hooks\Invoice\Api;
use Invoice\Hooks\Invoice\Meta;
use Invoice\Hooks\Invoice\Post;
use Invoice\Hooks\Invoice\Routes;

class InvoiceHook {
    public static function init() : void {
        add_action('init' , Post::register_post_type(...));
        add_action('init' , Post::register_post_status(...));
        add_action('init' , Routes::add_rewrite_rule(...));
        add_action('init' , Routes::add_rewrite_rule(...));
        add_action('rest_api_init', Api::register_rest_route(...));
        add_action('rest_api_init' , Meta::register_rest_field(...));
        add_action('rest_prepare_invoice' , Meta::rest_prepare_invoice(...), 10, 3);
        add_action('post_submitbox_misc_actions' , Post::post_submitbox_misc_actions(...));
        add_action('save_post_invoice', Post::save_post_invoice(...), 100, 3);

        add_action('rest_prepare_status' , Meta::rest_prepare_status(...), 10, 3);
        add_filter('query_vars', Routes::query_vars(...));
        add_filter('views_edit-invoice', Post::views_edit(...));
        add_filter('acf/validate_value/name=invoice_number', Post::acf_validate_invoice_number(...));
    }
}