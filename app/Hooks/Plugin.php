<?php

namespace Invoice\Hooks;

use Invoice\Hooks\Invoice\Post;
use Invoice\Hooks\Invoice\Settings;

class Plugin {
    const last_update = 'Rare|Backache|Peter|Savage';
    public static function init() : void {
        add_action('init', self::wp_init(...));
        add_action('wp_enqueue_scripts', self::wp_enqueue_scripts(...), 100);
    }

    public static function wp_init() : void {
        $invoice_page_id = get_option('invoice_page_id');
        $invoice_module_last_update = get_option('invoice_option_last_update');
        if(!$invoice_page_id || $invoice_module_last_update !== self::last_update) {
            if(!$invoice_page_id) {
                $invoice_page_id = wp_insert_post(array(
                    'post_type' => 'page',
                    'post_title' => __('Invoices'),
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_name' => 'invoices',
                    'post_content' => APP_INVOICE_BLOCK_CONTENT
                ));
            }

            $invoice_routes = array(
                '/invoices/' => __('Invoices', 'app'),
                '/invoices/business' => __('Business', 'app'),
                '/invoices/settings' => __('Settings', 'app'),
            );

            $main_cta = array(
                'route' => '/invoices/new',
                'title' => __('New invoice', 'app')
            );

            $spain_iva = array(
                0 => '0%',
                2 => '2%',
                4 => '4%',
                5 => '5%',
                7 => '7%',
                '7.5' => '7.5%',
                8 => '8%',
                10 => '10%',
                16 => '16%',
                18 => '18%',
                21 => '21%',
            );

            $spain_irpf = array(
                0 => __('0% - No retention', APP_THEME_LOCALE),
                1 => __('1% - Module or livestock activities', APP_THEME_LOCALE),
                2 => __('2% - Agricultural sector', APP_THEME_LOCALE),
                7 => __('7% - Professionals in the first two years of activity', APP_THEME_LOCALE),
                15 => __('15 % - Professionals', APP_THEME_LOCALE),
                19 => __('19% - Rent or Interest (capital assets)', APP_THEME_LOCALE),
                '2.8' => __('2.8% - Professionals in the first two years of activity (Ceuta and Melilla)',
                    APP_THEME_LOCALE),
                6 => __('6% - Professionals (from Ceuta and Melilla)',APP_THEME_LOCALE),
                '7.6' => __('7.6% - Rental (Ceuta and Melilla)',APP_THEME_LOCALE),
            );

            $invoices = get_posts(array(
                'post_type' => 'invoice',
                'post_status' => 'any',
                'numberposts' => -1
            ));
            if(count($invoices)) {
                global $wpdb;
                foreach($invoices as $invoice) {
                    $wpdb->delete(
                        $wpdb->postmeta,
                        array(
                            'post_id' => $invoice->ID,
                        )
                    );
                    wp_delete_post($invoice->ID, true);
                }
            }

            update_post_meta($invoice_page_id, 'routes', $invoice_routes);
            update_post_meta($invoice_page_id, 'main_cta', $main_cta);
            update_option('spain_iva', $spain_iva);
            update_option('spain_irpf', $spain_irpf);
            update_option('invoice_page_id', $invoice_page_id);
            update_option('invoice_option_last_update', self::last_update);
            flush_rewrite_rules();
        }
    }

    public static function wp_enqueue_scripts() : void {
        $app_file = APP_INVOICE_DIR . '/dist/invoice.asset.php';
        if(is_file($app_file) && is_page('invoices') || get_post_type() === 'invoice') {
           $app_assets = include $app_file;
           wp_register_script(
               'app-invoice',
               APP_INVOICE_DIR_URL . 'dist/invoice.js',
               $app_assets['dependencies'],
               $app_assets['version'],
               ['in_footer' => true]
           );
           wp_localize_script(
               'app-invoice',
               'Invoice',
               array(
                   'settings' => Settings::get_settings(),
                   'invoice_page_id' => get_option('invoice_page_id'),
                   'statuses' => Post::get_statuses_array(),
               ),
           );
           wp_enqueue_script('app-invoice');

           wp_enqueue_style(
               'app-invoice',
               APP_INVOICE_DIR_URL . 'dist/invoice.css',
               [],
               $app_assets['version']
           );

           wp_enqueue_style(
               'app-invoice-print',
               APP_INVOICE_DIR_URL . 'dist/print.css',
               [],
               $app_assets['version'],
               'print'
           );
        }
    }
}