<?php

namespace Invoice\Hooks\Invoice;

class Post
{
    use \Invoice\Features\Post;

    public function register_post_type(): void
    {
        $labels = [
            'name' => __('Invoices'),
            'singular_name' => __('Invoice'),
            'menu_name' => __('Invoices'),
            'all_items' => __('All Invoices'),
            'edit_item' => __('Edit Invoice'),
            'view_item' => __('View Invoice'),
            'view_items' => __('View Invoices'),
            'add_new_item' => __('Add New Invoice'),
            'add_new' => __('Add New Invoice'),
            'new_item' => __('New Invoice'),
            'parent_item_colon' => __('Parent Invoice:'),
            'search_items' => __('Search Invoice'),
            'not_found' => __('No invoices found'),
            'not_found_in_trash' => __('No invoices found in Trash'),
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
        ];

        register_post_type('invoice', [
            'labels' => $labels,
            'public' => true,
            'exclude_from_search' => true,
            'show_in_nav_menus' => false,
            'show_in_rest' => true,
            'publicly_queryable' => false,
            'menu_position' => 9,
            'menu_icon' => 'data:image/svg+xml;base64,' .
                base64_encode('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#005f6b"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>'),
            'supports' => [
                'author',
                'custom-fields',
                'title',
            ],
            'has_archive' => true,
            'delete_with_user' => false,
        ]);
    }

    public function register_post_status(): void
    {
        foreach ($this->get_statuses_array() as $invoice_status => $data) {
            register_post_status($invoice_status, $data);
        }
    }

    public function save_post_invoice(int $post_id, \WP_Post $post, bool $update): void
    {
        global $wpdb;
        $uuid = get_post_meta($post_id, 'uuid', true);
        $invoice_number = get_field('invoice_number', $post_id);
        $wpdb->update($wpdb->posts, [
            'post_title' => "{$uuid}-{$invoice_number}",
            'post_content' => APP_INVOICE_BLOCK_CONTENT,
            'post_name' => get_post_meta($post_id, 'uuid', true),
        ], [
            'ID' => $post_id,
        ]);
    }

    public function _is_number_in_use(int $number): bool
    {
        global $wpdb;
        $number_exists = true;
        while ($number_exists) {
            $is_number_in_use = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT post_id from {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %d",
                    'invoice_number',
                    $number,
                ),
            );
            if ($is_number_in_use?->post_id) {
                $number++;
            } else {
                $number_exists = false;
            }
        }

        return $number_exists;
    }

    public function views_edit(array $views): array
    {
        global $post_type;

        if ($post_type == 'invoice') {
            $status_count = wp_count_posts('invoice');

            $current = array_key_exists('post_status', $_GET) ? sanitize_text_field($_GET['post_status']) : '';
            foreach ($this->get_statuses_array() as $status => $data) {
                $draft_count = $status_count->{$status};
                $class = $current === $status ? ' class="current"' : '';
                $views[$status] = '<a href="' .
                    admin_url("edit.php?post_type=invoice&post_status={$status}") .
                    '"' .
                    $class .
                    '>' .
                    $data['label'] .
                    ' (' .
                    $draft_count .
                    ')</a>';
            }
        }

        return $views;
    }

    public function acf_validate_invoice_number($valid, $value, $field, $input_name): bool
    {
        return $valid;
    }
}
