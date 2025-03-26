<?php

namespace Invoice\Hooks;

use Invoice\Hooks\Invoice\Api;
use Invoice\Hooks\Invoice\Post;
use Invoice\Hooks\Invoice\Meta;
use Invoice\Hooks\Invoice\Routes;
use Invoice\Hooks\Invoice\Validation;

class Invoice {
    public function init() : void {
        extract($this->instances());
        add_action('init' , array($post, 'register_post_type'));
        add_action('init' , array($post, 'register_post_status'));
        add_action('init' , array($routes, 'add_rewrite_rule'));
        add_action('rest_api_init', array($api, 'register_rest_route'));
        add_action('rest_api_init' , array($meta, 'register_rest_field'));

        add_action('rest_prepare_invoice' , array($meta, 'rest_prepare_invoice'), 10, 3);
        add_action('save_post_invoice', array($post, 'save_post_invoice'), 100, 3);

        add_action('rest_prepare_status' , array($meta, 'rest_prepare_status'), 10, 3);
        add_filter('query_vars', array($routes, 'query_vars'));
        add_filter('views_edit-invoice', array($post, 'views_edit'));
        add_filter('acf/validate_value/name=invoice_number', array($validation, 'acf_validate_value'));
    }

    private function instances() : array {
        return array(
            'post' => new Post(),
            'api' => new Api(),
            'meta' => new Meta(),
            'routes' => new Routes(),
            'validation' => new Validation(),
        );
    }
}