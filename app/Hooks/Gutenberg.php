<?php

namespace Invoice\Hooks;

class Gutenberg
{
    public function init(): void
    {
        add_filter('block_categories_all', [$this, 'block_categories_all'], 10, 2);
    }

    public function block_categories_all(array $categories, $post): array
    {
        return array_merge(
            $categories,
            [
                [
                    'slug' => 'invoice',
                    'title' => __('Invoice'),
                ],
            ],
        );
    }
}
