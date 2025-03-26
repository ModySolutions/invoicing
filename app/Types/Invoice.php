<?php

namespace Invoice\Types;

final class Invoice {
    public int $ID;
    public string $UUID;
    public string $invoice_series_number;
    public string $invoice_number;
    public string $invoice_generated_number;
    public string $invoice_issue_date;
    public string $invoice_due_date;

    public string $invoice_client;
    public string $invoice_client_address;
    public string $invoice_view_url;
    public string $invoice_edit_url;
    public string $invoice_notes;
    public string $invoice_terms;

    public string $invoice_sender;
    public string $invoice_sender_address;

    public string $invoice_status;
    public string $invoice_currency;
    public string $invoice_tax_amount;
    public string $invoice_discount_amount;

    public string $invoice_items;
    public string $invoice_taxes;
    public string $invoice_discounts;
    public string $invoice_subtotal;
    public string $invoice_tax_subtotal;
    public string $invoice_taxes_total;
    public string $invoice_discount_subtotal;
    public string $invoice_discount_total;

    public string $invoice_total;
    public string $invoice_logo;
}
