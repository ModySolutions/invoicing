import {__} from '@wordpress/i18n';
export default {
  "STATUS": {
    "DRAFT": "draft",
    "ISSUED": "invoice_issued",
    "SENT": "invoice_sent",
    "EXPIRED": "invoice_expired",
    "PAID": "invoice_paid",
    "CANCELLED": "invoice_cancelled",
    "LABELS": {
      "draft": __('Draft', 'app'),
      "invoice_issued": __('Issued', 'app'),
      "invoice_sent": __('Sent', 'app'),
      "invoice_expired": __('Expired', 'app'),
      "invoice_paid": __('Paid', 'app'),
      "invoice_cancelled": __('Cancelled', 'app'),
    },
    "COLORS": {
      "draft": ['btn-text-charcoal', 'btn-chinese-white'],
      "invoice_issued": ['btn-text-charcoal-inverse', 'btn-secondary'],
      "invoice_sent": ['btn-text-info-dark', 'btn-info-light'],
      "invoice_expired": ['btn-text-success-dark', 'btn-success-light'],
      "invoice_paid": ['btn-text-warning-dark', 'btn-warning-light'],
      "invoice_cancelled": ['btn-text-danger-dark', 'btn-danger-light'],
    }
  }
}
