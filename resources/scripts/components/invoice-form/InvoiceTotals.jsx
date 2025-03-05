import {useEffect} from "react";
import {__, sprintf} from "@wordpress/i18n";
import {useInvoice} from "../../contexts/InvoiceContext";
import CurrencyFormatter from "../CurrencyFormatter";

const InvoiceTotals = () => {
    const {invoice} = useInvoice();
    useEffect(() => {

    }, [invoice]);
    return (
        <div className='right flex flex-column justify-end pr-2'>
            <div className='invoice-totals flex flex-column gap-3'>
                <div className='invoice-subtotal grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-subtotal' className='text-right pr-2'>
                        {__('Subtotal', 'app')}
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_subtotal ?? 0}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-taxes' className='text-right pr-2'>
                        {sprintf(
                            __('I.V.A. (%s)', 'app'),
                            `${invoice?.invoice_tax_amount ?? 0}%`
                        )}
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_taxes_total ?? 0}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-discounts' className='text-right pr-2'>
                        {sprintf(
                            __('I.R.P.F. (%s)', 'app'),
                            `${invoice?.invoice_discount_amount ?? 0}%`
                        )}
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_discount_total ?? 0}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-total' className='text-right pr-2'>
                        <strong>{__('Total', 'app')}</strong>
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_total ?? 0}/>
                    </strong>
                </div>
            </div>
        </div>
    )
}

export default InvoiceTotals;