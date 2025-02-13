<?php

namespace Invoice\Hooks;

class Gutenberg {
	public static function init() : void {
        add_filter('block_categories_all', self::block_categories_all(...), 10, 2);
	}

	public static function block_categories_all(array $categories, $post) : array {
		return array_merge(
			$categories,
			array (
				array(
					'slug' => 'invoice',
					'title' => __( 'Invoice' ),
				),
			),
		);
	}
}