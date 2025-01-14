<?php

namespace Invoice\Setup;

class Plugin {
    public static function init() : void {
        add_action('init', self::wp_init(...));
        add_action('wp_enqueue_scripts', self::wp_enqueue_scripts(...));
    }

    public static function wp_init() : void {
        $invoice_page_id = get_option('invoice_page_id');
        if(!$invoice_page_id) {
            $invoice_page_id = wp_insert_post(array(
                'post_type' => 'page',
                'post_title' => __('Invoices'),
                'post_status' => 'publish',
                'post_author' => 1,
                'post_name' => 'invoices',
                'post_content' => '<!-- wp:app/invoice {"name":"app/invoice","data":array(),"mode":"edit"} /-->'
            ));

            $invoice_routes = array(
                '/invoices/' => __('Invoices'),
                '/invoices/settings' => __('Settings'),
            );
            update_post_meta($invoice_page_id, 'routes', $invoice_routes);
            update_option('invoice_page_id', $invoice_page_id);
            flush_rewrite_rules();
        }
    }

    public static function wp_enqueue_scripts() : void {
        $app_file = APP_INVOICE_DIR . '/dist/app.asset.php';
        if(is_file($app_file) && is_page('invoices')) {
           $app_assets = include $app_file;
           wp_register_script(
               'app-invoice',
               APP_INVOICE_DIR_URL . '/dist/app.js',
               $app_assets['dependencies'],
               $app_assets['version'],
               ['in_footer' => true]
           );
           wp_localize_script(
               'app-invoice',
               'Invoice',
               array(
                   'invoice_page_id' => get_option('invoice_page_id'),
               )
           );
           wp_enqueue_script('app-invoice');

           wp_enqueue_style(
               'app-invoice',
               APP_INVOICE_DIR_URL . '/dist/app.css',
               [],
               $app_assets['version']
           );
        }
    }
}