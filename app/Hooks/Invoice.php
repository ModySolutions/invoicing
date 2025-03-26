<?php

namespace Invoice\Hooks;

use Invoice\Hooks\Invoice\Api;
use Invoice\Hooks\Invoice\Meta;
use Invoice\Hooks\Invoice\Post;
use Invoice\Hooks\Invoice\Routes;
use Invoice\Hooks\Invoice\Validation;

class Invoice
{
    public function init(): void
    {
        extract($this->instances());
        add_action('init', [$post, 'register_post_type']);
        add_action('init', [$post, 'register_post_status']);
        add_action('init', [$routes, 'add_rewrite_rule']);
        add_action('rest_api_init', [$api, 'register_rest_route']);
        add_action('rest_api_init', [$meta, 'register_rest_field']);

        add_action('rest_prepare_invoice', [$meta, 'rest_prepare_invoice'], 10, 3);
        add_action('save_post_invoice', [$post, 'save_post_invoice'], 100, 3);

        add_action('rest_prepare_status', [$meta, 'rest_prepare_status'], 10, 3);
        add_filter('query_vars', [$routes, 'query_vars']);
        add_filter('views_edit-invoice', [$post, 'views_edit']);
        add_filter('acf/validate_value/name=invoice_number', [$validation, 'acf_validate_value']);
    }

    private function instances(): array
    {
        return [
            'post' => new Post(),
            'api' => new Api(),
            'meta' => new Meta(),
            'routes' => new Routes(),
            'validation' => new Validation(),
        ];
    }
}
