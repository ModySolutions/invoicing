<?php

namespace Invoice\Hooks\Invoice;

use function Env\env;

class Post {
    public static function register_post_type(): void {
        $labels = array(
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
        );

        register_post_type('invoice', array(
            'labels' => $labels,
            'public' => true,
            'exclude_from_search' => true,
            'show_in_nav_menus' => false,
            'show_in_rest' => true,
            'publicly_queryable' => false,
            'menu_position' => 9,
            'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#005f6b"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>'),
            'supports' => array(
                'author',
                'custom-fields',
                'title',
            ),
            'has_archive' => true,
            'delete_with_user' => false,
        ));
    }

    public static function register_post_status(): void {
        foreach(self::get_statuses_array() as $invoice_status => $data) {
            register_post_status($invoice_status, $data);
        }
    }

    public static function post_submitbox_misc_actions() : void {
        global $post;

        if( $post->post_type == 'invoice' ){
            $options = '';
            $label = '';

            foreach(self::get_statuses_array() as $invoice_status => $data) {
                $complete = '';
                if( $post->post_status == $invoice_status ){
                    $complete = 'selected=\"selected\"';
                    $label = " {$data['label']}";
                }
                $options .= "<option value=\"{$invoice_status}\" $complete>{$data['label']}</option>";
            }

            echo <<<EOF
<script>
jQuery(document).ready(function($){
    $("select#post_status").html('');
    $("select#post_status").append('{$options}');
    $("#post-status-display").text('{$label}');
});
</script>
<style>
  #publish {
    display: none;
  }
</style>
EOF;
        }
    }

    public static function save_post_invoice(int $post_id, \WP_Post $post, bool $update) : void {
        global $wpdb;
        $uuid = get_post_meta($post_id, 'uuid', true);
        $invoice_number = get_field('invoice_number', $post_id);
        $wpdb->update(
            $wpdb->posts,
            array(
                'post_title' => "{$uuid}-{$invoice_number}",
                'post_content' => APP_INVOICE_BLOCK_CONTENT,
                'post_name' => get_post_meta($post_id, 'uuid', true),
            ),
            array(
                'ID' => $post_id
            )
        );
    }

    public static function views_edit(array $views) : array {
        global $post_type;

        if ($post_type == 'invoice') {
            $status_count = wp_count_posts('invoice');

            $current = array_key_exists('post_status', $_GET) ?
                sanitize_text_field($_GET['post_status']) : '';
            foreach(self::get_statuses_array() as $status => $data) {
                $draft_count = $status_count->{$status};
                $class = $current === $status ? ' class="current"' : '';
                $views[$status] = '<a href="' . admin_url("edit.php?post_type=invoice&post_status={$status}") .
                    '"' . $class . '>' . $data['label'] . ' (' . $draft_count . ')</a>';
            }
        }

        return $views;
    }

    public static function acf_validate_invoice_number($valid, $value, $field, $input_name) : bool {
        return $valid;
    }

    public static function get_statuses_array() : array {
        return array(
            'draft' => array(
                'label' => _x('Draft', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Draft <span class="count">(%s)</span>', 'Drafts <span class="count">(%s)</span>')
            ),
            'invoice_issued' => array(
                'label' => _x('Issued', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Issued <span class="count">(%s)</span>', 'Issued <span class="count">(%s)</span>')
            ),
            'invoice_sent' => array(
                'label' => _x('Sent', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Sent <span class="count">(%s)</span>', 'Sent <span class="count">(%s)</span>')
            ),
            'invoice_expired' => array(
                'label' => _x('Expired', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Expired <span class="count">(%s)</span>',
                    'Expired <span class="count">(%s)</span>')
            ),
            'invoice_paid' => array(
                'label' => _x('Paid', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Paid <span class="count">(%s)</span>', 'Paid <span class="count">(%s)</span>')
            ),
            'invoice_cancelled' => array(
                'label' => _x('Cancelled', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Cancelled <span class="count">(%s)</span>',
                    'Cancelled <span class="count">(%s)</span>')
            ),
        );
    }
}