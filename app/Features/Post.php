<?php

namespace Invoice\Features;

trait Post {
    public function get_statuses_array(): array {
        return array(
            'draft' => array(
                'label' => _x('Draft', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Draft <span class="count">(%s)</span>',
                    'Drafts <span class="count">(%s)</span>')
            ),
            'invoice_issued' => array(
                'label' => _x('Issued', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Issued <span class="count">(%s)</span>',
                    'Issued <span class="count">(%s)</span>')
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