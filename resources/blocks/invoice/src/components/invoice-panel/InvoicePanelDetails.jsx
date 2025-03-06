import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import {findCountryByIsoCode} from "@invoice/tools/Countries";
import nl2br from "@invoice/tools/nl2br";
import capitalize from "@invoice/tools/capitalize";
import {formatDate} from "@invoice/tools/DateFormats";
import {useInvoice} from "../../contexts/InvoiceContext";
import {useSettings} from "../../contexts/SettingsContext";

const InvoicePanelDetails = () => {
    const {invoice} = useInvoice();
    const {settings} = useSettings();
    const [issuedDate] = useState(invoice?.invoice_issue_date ?? new Date());
    const [dueDate] = useState(invoice?.invoice_due_date ?? new Date());
    const [dateFormat] = useState(settings?.invoice_date_format ?? 'MMM d, Y');
    const [invoiceSender, setInvoiceSender] = useState([
        settings?.invoice_business_fni.toString().toUpperCase(),
        capitalize(settings?.invoice_business_name?.toString() ?? ''),
        capitalize([
            settings?.invoice_business_city?.toString() ?? '',
            findCountryByIsoCode(settings?.invoice_business_country)?.name ?? '',
        ].join(', ')),
    ].join("\n"));

    useEffect(() => {
    }, [invoice, settings])

    return (
        <div className='grid grid-cols-7-3'>
            <div className='left'>
                <div className='sender w-100-p mt-4 d-block'>
                    <label htmlFor='client' className={'d-block'}>
                        {__('Invoice From:', 'app')}
                    </label>
                    <span dangerouslySetInnerHTML={{__html: nl2br(invoiceSender ?? '')}}/>
                </div>
                <div className='client w-100-p mt-3'>
                    <label htmlFor='client' className={'d-block'}>
                        {__('Invoice to:', 'app')}
                    </label>
                    <span className={'capitalize'}
                          dangerouslySetInnerHTML={{__html: nl2br(invoice?.invoice_client ?? '')}}/>
                </div>
            </div>
            <div className='right flex flex-column justify-end mt-3'>
                <div className='invoice-dates flex flex-column gap-1'>
                    <label htmlFor='invoice-date' className='text-right'>
                        {__('Issued on', 'app')}
                    </label>
                    <span className={'text-right'}>{formatDate(dateFormat, new Date(issuedDate))}</span>
                    <label htmlFor='invoice-due-date' className='text-right mt-3'>
                        {__('Due on', 'app')}
                    </label>
                    <span className={'text-right'}>
                                    {formatDate(dateFormat, new Date(dueDate))}
                                </span>
                </div>
            </div>
        </div>
    )
}

export default InvoicePanelDetails;