import {__} from '@wordpress/i18n';
import {useEffect} from 'react';
import {useInvoice} from "../../contexts/InvoiceContext";
import CurrencyFormatter from "../CurrencyFormatter";

const InvoicePanelTotals = () => {
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
                        <CurrencyFormatter amount={invoice?.invoice_subtotal}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-taxes' className='text-right pr-2'>
                        {__('I.V.A.', 'app')}
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_tax_subtotal}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-discounts' className='text-right pr-2'>
                        {__('I.R.P.F.', 'app')}
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_discount_subtotal}/>
                    </strong>
                </div>
                <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                    <label htmlFor='invoice-total' className='text-right pr-2'>
                        <strong>{__('Total', 'app')}</strong>
                    </label>
                    <strong className={'text-right'}>
                        <CurrencyFormatter amount={invoice?.invoice_total}/>
                    </strong>
                </div>
            </div>
        </div>
    )
}

export default InvoicePanelTotals;