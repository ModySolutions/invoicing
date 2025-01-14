<?php

namespace Invoice\Hooks;

use Invoice\Hooks\Invoice\Post;
use Invoice\Hooks\Invoice\Routes;

class InvoiceHook {
    public static function init() : void {
        add_action('init' , Post::register_post_type(...));
        add_action('init' , Routes::add_rewrite_rule(...));
        add_filter('query_vars', Routes::query_vars(...));
    }
}