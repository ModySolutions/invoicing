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

require_once __DIR__ . '/vendor/autoload.php';
class Invoice
{
    const INVOICE_SRC_PATH = __DIR__;
    public static function start() : void {
        self::loader(self::INVOICE_SRC_PATH . '/src/Setup/*.php', 'Invoice\\Setup\\');
        self::loader(self::INVOICE_SRC_PATH . '/src/Hooks/*.php', 'Invoice\\Hooks\\');
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

if(!function_exists('app_invoice_render')) {
    function app_invoice_render() : void {
        echo '<div id="app-invoice-container"></div>';
    }
}
