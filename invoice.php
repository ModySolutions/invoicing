<?php

/**
 * Plugin name: Mody Cloud Invoicing.
 * Plugin URI:   https://mody.cloud/invoicing
 * Description:  All your invoices in one place.
 * Author:       Mody Solutions
 * Author URI:   https://wmodysolutions.com
 * Version:      0.0.1
 * Text Domain:  modycloud
 * Domain Path:  /languages/
 * Requires at least: 5.9
 * Requires PHP: 7.4
 */

namespace Invoice;

define('APP_INVOICE_DIR', __DIR__);
define('APP_INVOICE_DIR_URL', plugin_dir_url(__FILE__));
define('APP_INVOICE_POST_TYPE', 'invoice');
define('APP_INVOICE_TEMPLATE_DIR', APP_INVOICE_DIR . '/resources/templates/');
define('APP_INVOICE_VIEWS_DIR', APP_INVOICE_DIR . '/resources/views/');
define('APP_INVOICE_BLOCK_CONTENT', <<<EOF
<!-- wp:app/invoice-v2 --><p class="wp-block-app-invoice-v2">Example – hello from the saved content!</p><!-- /wp:app/invoice-v2 -->
EOF);

require_once __DIR__ . '/vendor/autoload.php';
class Invoice
{
    public static function start() : void {
        self::loader(APP_INVOICE_DIR . '/app/Hooks/*.php', 'Invoice\\Hooks\\');
    }

    public static function loader(string $path, string $namespace = 'Invoice\\') : void {
        foreach(glob($path) as $config_file) {
            $class_name = $namespace;
            $class_name .= basename($config_file, '.php');
            if(method_exists($class_name, 'init')) {
                $class_name::init();
            }
        }
    }
}

Invoice::start();
