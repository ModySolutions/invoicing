<?php

namespace Invoice\Hooks;

class Theme
{
    public static function init(): void
    {
        add_filter('theme_page_templates', self::theme_page_templates(...));
        add_filter('template_include', self::template_include(...));

        if (\Timber::class) {
            add_action('timber/context', self::timber_context(...));
            add_filter('timber/locations', self::timber_locations(...), 100);
        }
    }

    public static function theme_page_templates(array $templates): array
    {
        $templates[APP_INVOICE_TEMPLATE_DIR . 'print-invoice-template.php'] = __(
            'Print Invoice',
            APP_THEME_LOCALE,
        );

        return $templates;
    }

    public static function template_include(string $template): string
    {
        global $post;

        if (! $post) {
            return $template;
        }

        $templates = [
            APP_INVOICE_TEMPLATE_DIR . 'print-invoice-template.php' => APP_INVOICE_TEMPLATE_DIR . 'print-invoice-template.php',
        ];

        $meta = get_post_meta($post->ID, '_wp_page_template', true);

        if (isset($templates[$meta])) {
            return $templates[$meta];
        }

        return $template;
    }

    public static function timber_context(array $context): array
    {
        return $context;
    }

    public static function timber_locations(array $paths): array
    {
        $paths['invoice'] = [
            untrailingslashit(APP_INVOICE_VIEWS_DIR),
        ];
        if (defined('SRC_PATH')) {
            $paths['app'] = [
                SRC_PATH . '/views',
            ];
        }

        return $paths;
    }
}
