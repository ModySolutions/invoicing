<?php

namespace Invoice\Features;

trait Post
{
    public function get_statuses_array(): array
    {
        return [
            'draft' => [
                'label' => _x('Draft', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop(
                    'Draft <span class="count">(%s)</span>',
                    'Drafts <span class="count">(%s)</span>',
                ),
            ],
            'invoice_issued' => [
                'label' => _x('Issued', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop(
                    'Issued <span class="count">(%s)</span>',
                    'Issued <span class="count">(%s)</span>',
                ),
            ],
            'invoice_sent' => [
                'label' => _x('Sent', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Sent <span class="count">(%s)</span>', 'Sent <span class="count">(%s)</span>'),
            ],
            'invoice_expired' => [
                'label' => _x('Expired', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop(
                    'Expired <span class="count">(%s)</span>',
                    'Expired <span class="count">(%s)</span>',
                ),
            ],
            'invoice_paid' => [
                'label' => _x('Paid', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop('Paid <span class="count">(%s)</span>', 'Paid <span class="count">(%s)</span>'),
            ],
            'invoice_cancelled' => [
                'label' => _x('Cancelled', 'invoice post status'),
                'public' => true,
                'show_in_admin_all_list' => true,
                'show_in_admin_status_list' => true,
                'date_floating' => true,
                'label_count' => _n_noop(
                    'Cancelled <span class="count">(%s)</span>',
                    'Cancelled <span class="count">(%s)</span>',
                ),
            ],
        ];
    }
}
