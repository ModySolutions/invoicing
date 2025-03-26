<?php

namespace Invoice\Hooks;

class Blocks {
	public function init() : void {
        add_action('init', array($this, 'register_block_types'));
	}

    public function register_block_types(): void
    {
        $block_types = glob(APP_INVOICE_DIR . '/blocks/*');
        if (count($block_types) > 0) {
            foreach ($block_types as $block) {
                if (is_dir($block)) {
                    register_block_type($block);
                }
            }
        }
    }
}