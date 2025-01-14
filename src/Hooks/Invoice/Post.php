<?php

namespace Invoice\Hooks\Invoice;

class Post {
    public static function register_post_type() : void {
        register_post_type( 'invoice', array(
            'labels' => array(
                'name' => __('Invoices'),
                'singular_name' => __('Invoice'),
                'menu_name' => __('Invoice'),
                'all_items' => __('All Invoice'),
                'edit_item' => __('Edit Invoice'),
                'view_item' => __('View Invoice'),
                'view_items' => __('View Invoice'),
                'add_new_item' => __('Add New Invoice'),
                'add_new' => __('Add New Invoice'),
                'new_item' => __('New Invoice'),
                'parent_item_colon' => __('Parent Invoice:'),
                'search_items' => __('Search Invoice'),
                'not_found' => __('No invoice found'),
                'not_found_in_trash' => __('No invoice found in Trash'),
                'archives' => __('Invoice Archives'),
                'attributes' => __('Invoice Attributes'),
                'insert_into_item' => __('Insert into invoice'),
                'uploaded_to_this_item' => __('Uploaded to this invoice'),
                'filter_items_list' => __('Filter invoice list'),
                'filter_by_date' => __('Filter invoice by date'),
                'items_list_navigation' => __('Invoice list navigation'),
                'items_list' => __('Invoice list'),
                'item_published' => __('Invoice published.'),
                'item_published_privately' => __('Invoice published privately.'),
                'item_reverted_to_draft' => __('Invoice reverted to draft.'),
                'item_scheduled' => __('Invoice scheduled.'),
                'item_updated' => __('Invoice updated.'),
                'item_link' => __('Invoice Link'),
                'item_link_description' => __('A link to a invoice.'),
            ),
            'public' => true,
            'exclude_from_search' => true,
            'show_in_nav_menus' => false,
            'show_in_rest' => true,
            'menu_position' => 9,
            'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#005f6b"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>'),
            'supports' => array(
                0 => 'title',
                1 => 'author',
                2 => 'custom-fields',
            ),
            'has_archive' => true,
            'rewrite' => array(
                'feeds' => false,
            ),
            'delete_with_user' => false,
        ) );
    }
}