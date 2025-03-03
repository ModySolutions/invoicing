import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import {useSettings} from "../contexts/SettingsContext";
import CurrencyFormatter from "../components/CurrencyFormatter";
import DropFileInput from "../components/DropFileInput";
import apiFetch from "@wordpress/api-fetch";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useInvoices} from "../contexts/InvoicesContext";
import {formatDate} from "../tools/DateFormats";
import StatusBadge from "./StatusBadge";
import {QRCodeSVG} from "qrcode.react";
import setInvoiceHeader from "../tools/setInvoiceHeader";

const InvoicePanel = (props = null) => {
    const {ID, UUID} = props;
    const {settings, europeCountries, statuses} = useSettings();
    const {setInvoices} = useInvoices();
    const [issuedDate] = useState(props?.invoice_issue_date ?? new Date());
    const [dueDate] = useState(props?.invoice_due_date ?? new Date());
    const [dateFormat, setDateFormat] = useState(settings?.invoice_date_format);
    const {currentPath, setCurrentPath} = useSettings();
    const [invoiceItems, setInvoiceItems] = useState(props?.invoice_items);
    const [invoiceUrl, setInvoiceUrl] = useState('');
    const [invoiceSender] = useState(props?.invoice_sender ?? '');
    const [formData] = useState({
        invoice_client: props?.invoice_client ?? '',
        invoice_notes: props?.invoice_notes ?? '',
        invoice_terms: props?.invoice_terms ?? '',
    });
    const [logo, setLogo] = useState(props?.invoice_logo ?? settings?.invoice_logo);
    const [invoiceStatus] = useState(props?.invoice_status);
    const [invoiceCurrentStatus] = useState(props?.invoice_status);
    const [allowedStatuses, setAllowedStatuses] = useState(statuses);
    const [invoiceData] = useState(props ?? {});
    const navigate = useNavigate()

    useEffect(() => {
        setInvoiceHeader(false);
        setCurrentPath('/invoices/');

        if (props?.invoice_items) {
            setInvoiceItems(props?.invoice_items);
            setInvoiceUrl(window.location.href)
        }

        if (props?.invoice_logo) {
            setLogo(props?.invoice_logo);
        }

        let statusReached = false;
        if (statuses) {
            const allowed = [];
            Object.entries(statuses).forEach(([status, data]) => {
                if (status === invoiceCurrentStatus) {
                    statusReached = true;
                }

                if (statusReached) {
                    allowed.push({value: status, label: data.label});
                }
            })
            setAllowedStatuses(allowed);
        }

        if (settings?.invoice_date_format) {
            setDateFormat(settings?.invoice_date_format);
        }

        return () => {
            setInvoiceHeader(true);
        };
    }, [
        currentPath,
        settings,
        europeCountries,
        invoiceStatus,
        statuses,
        props
    ]);

    const handleSubmit = (event) => {
        event.preventDefault();
        apiFetch({
            path: `invoice/v1/invoice/${UUID}`,
            method: 'POST',
            data: {
                'post_status': invoiceStatus,
            },
        })
        .then((response) => {
            toast.success(
                __('Invoice saved successfully.'),
                {
                    autoClose: 3000,
                }
            )
            if (!ID && !UUID) {
                setInvoices((prevInvoices) => [...prevInvoices, ...[response]]);
            }
            navigate(`/invoices/view/${response.UUID}`)
        })
    };

    return (
        <form onSubmit={handleSubmit}
              className={'invoice-form invoice-panel mt-3 mb-5 p-relative'}
              encType='multipart/form-data'>
            <div className='grid grid-cols-7-3 form-container p-relative'>
                <div className='form-container p-4 radius-lg rounded bg-white'>
                    <div className='grid grid-cols-7-3 invoice-header gap-3'>
                        <div className='left flex flex-column gap-3'>
                            <DropFileInput onFileChange={(elem) => {
                            }} logo={logo ?? ''} disabled={true}/>
                        </div>
                        <div className='right flex flex-column justify-space-between gap-2 text-right'>
                            <div className='flex justify-end flex-column items-end'>
                                <h2 className='invoice-title uppercase'>
                                    {sprintf(__('Invoice %s', 'app'), invoiceData?.invoice_number ?? '')}
                                </h2>
                                <div className='invoice-qr-code'>
                                    <QRCodeSVG value={invoiceUrl} size={75} level={'H'}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-7-3'>
                        <div className='left'>
                            <div className='sender w-100-p mt-4 d-block'>
                                <label htmlFor='client' className={'d-block'}>
                                    {__('Bill From:', 'app')}
                                </label>
                                <span dangerouslySetInnerHTML={{__html: invoiceSender}}/>
                            </div>
                            <div className='client w-100-p mt-3'>
                                <label htmlFor='client' className={'d-block'}>
                                    {__('Bill to:', 'app')}
                                </label>
                                <span className={'capitalize'}
                                      dangerouslySetInnerHTML={{__html: formData?.invoice_client}}/>
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
                    <div className='mt-4 invoices-table-container'>
                        <table className='invoices-table inverse'>
                            <thead className={'rounded radius-sm'}>
                            <tr className={'rounded radius-sm'}>
                                <th className='w-40-p text-left'>{__('Item')}</th>
                                <th className='w-10-p text-center'>{__('Quantity')}</th>
                                <th className='w-10-p text-center'>{__('Price')}</th>
                                <th className='w-5-p text-center'>{__('Taxable')}</th>
                                <th className='w-10-p text-center'>{__('Amount')}</th>
                                <th className='w-5-p text-center'></th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoiceItems.map((item, index) => {
                                return (
                                    <tr key={`invoice-item-${index}`} className='border-0'>
                                        <td data-title={__('Description', 'app')}>
                                            {item.item_description}
                                        </td>
                                        <td data-title={__('Quantity', 'app')}>
                                            {item.item_quantity}
                                        </td>
                                        <td data-title={__('Price', 'app')}>
                                            <CurrencyFormatter amount={item.item_price}/>
                                        </td>
                                        <td className={'text-center'} data-title={__('Taxable', 'app')}>
                                            <input
                                                readOnly={true}
                                                type={'checkbox'}
                                                name='item_taxable'
                                                checked={item.item_taxable}
                                                onChange={(event) => {
                                                }}
                                            />
                                        </td>
                                        <td className='text-right' data-title={__('Amount', 'app')}>
                                            <CurrencyFormatter amount={item.item_total}/>
                                        </td>
                                        <td className={'hidden-action text-right'}>

                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <div className='grid grid-cols-7-3 mt-5'>
                            <div className='left'>
                                <div className='notes-container container'>
                                    <div className='form-group col-8'>
                                        {formData?.invoice_notes &&
                                            <label htmlFor='notes'>
                                                {__('Notes', 'app')}
                                            </label>
                                        }
                                        <div dangerouslySetInnerHTML={{__html: formData?.invoice_notes}}></div>
                                    </div>
                                    <div className='col-4'></div>
                                    <div className='form-group col-8'>
                                        {formData?.invoice_terms &&
                                            <label htmlFor='terms'>
                                                {__('Terms', 'app')}
                                            </label>
                                        }
                                        <div dangerouslySetInnerHTML={{__html: formData?.invoice_terms}}></div>
                                    </div>
                                </div>
                            </div>
                            <div className='right flex flex-column justify-end pr-2'>
                                <div className='invoice-totals flex flex-column gap-3'>
                                    <div className='invoice-subtotal grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-subtotal' className='text-right pr-2'>
                                            {__('Subtotal', 'app')}
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={props?.invoice_subtotal}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-taxes' className='text-right pr-2'>
                                            {__('I.V.A.', 'app')}
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={props?.invoice_tax_subtotal}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-discounts' className='text-right pr-2'>
                                            {__('I.R.P.F.', 'app')}
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={props?.invoice_discount_subtotal}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-total' className='text-right pr-2'>
                                            <strong>{__('Total', 'app')}</strong>
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={props?.invoice_tax_subtotal}/>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <aside className='sidebar pl-4 pr-4 pt-0 flex flex-column gap-4'>
                    {invoiceStatus === 'draft' &&
                        <>
                            <a href={`#`}
                               onClick={(event) => {
                                   event.preventDefault();
                                   navigate(`/invoices/edit/${props?.UUID}/`)
                               }} className='btn btn-wide mt-2'>
                                {__('Edit Invoice', 'app')}
                            </a>
                            <hr className='b-bottom-grey-10-4 mx-4'/>
                        </>
                    }
                    <div className='flex flex-column'>
                        {invoiceStatus ===
                            'draft' &&
                            <label htmlFor='invoice_status'>{__('Invoice status', 'app')}</label>}
                        <StatusBadge status={invoiceStatus}/>
                        <div className='flex flex-row gap-3'>
                            <a href='#'
                               onClick={(event) => {
                                   event.preventDefault();
                                   window.print();
                               }}
                               className='btn btn-white text-charcoal mt-4'>
                                <svg xmlns='http://www.w3.org/2000/svg'
                                     height='24px'
                                     viewBox='0 -960 960 960'
                                     width='24px'
                                     style={{fill: '#666666'}}
                                     fill='#666666'>
                                    <path d='M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z'/>
                                </svg>
                                <span className='text-charcoal'>
                                    {__('Print', 'app')}
                                </span>
                            </a>
                            <a href='#'
                               onClick={(event) => {
                                   event.preventDefault();
                                   document.print();
                               }}
                               className='btn btn-danger-light text-charcoal mt-4'>
                                <svg xmlns='http://www.w3.org/2000/svg'
                                     height='24px'
                                     viewBox='0 -960 960 960'
                                     width='24px'
                                     style={{fill: '#992424'}}
                                     fill='#666666'>
                                    <path d='M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z'/>
                                </svg>
                                <span className='text-danger-dark'>
                                    {__('PDF', 'app')}
                                </span>
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    )
}

export default InvoicePanel;
