import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import {useSettings} from "../contexts/SettingsContext";
import CurrencyFormatter from "../components/CurrencyFormatter";
import DropFileInput from "../components/DropFileInput";
import apiFetch from "@wordpress/api-fetch";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useInvoices} from "../contexts/InvoicesContext";
import Enums from "../tools/Enums";
import {formatDate} from "../tools/DateFormats";

const InvoicePanel = (props = null) => {
    const {ID, UUID} = props;
    const {settings, setSettings, europeCountries, statuses} = useSettings();
    const {setInvoices} = useInvoices();
    const [issuedDate, setIssuedDate] = useState(props?.invoice_issue_date ?? new Date());
    const [dueDate, setDueDate] = useState(props?.invoice_due_date ?? new Date());
    const [dateFormat, setDateFormat] = useState(settings?.invoice_date_format);
    const {currentPath, setCurrentPath} = useSettings();
    const [invoiceItems, setInvoiceItems] = useState(props?.invoice_items);
    const [invoiceSubtotal, setInvoiceSubtotal] = useState(props?.invoice_items);
    const [invoiceTotal, setInvoiceTotal] = useState(props?.invoice_items);
    const [invoiceTaxes, setInvoiceTaxes] = useState(props?.invoice_tax_subtotal);
    const [selectedInvoiceTax, setSelectedInvoiceTax] = useState(props?.invoice_taxes?.[0]?.invoice_tax_amount);
    const [invoiceDiscounts, setInvoiceDiscounts] = useState(props?.invoice_discount_subtotal);
    const [selectedInvoiceDiscount, setSelectedInvoiceDiscount] = useState(props?.invoice_discounts?.[0]?.invoice_discount_amount);
    const [invoiceSender, setInvoiceSender] = useState(props?.invoice_sender ?? '');
    const [formData, setFormData] = useState({
        invoice_client: props?.invoice_client ?? '',
        invoice_notes: props?.invoice_notes ?? '',
        invoice_terms: props?.invoice_terms ?? '',
    });
    const [logo, setLogo] = useState(settings?.invoice_logo ?? '');
    const [invoiceStatus, setInvoiceStatus] = useState(props?.invoice_status);
    const [invoiceCurrentStatus, setInvoiceCurrentStatus] = useState(props?.invoice_status);
    const [allowedStatuses, setAllowedStatuses] = useState(statuses);
    const [invoiceData, setInvoiceData] = useState(props ?? {});
    const [invoiceAvailableStatuses, setInvoiceAvailableStatuses] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const header = document.querySelector('.header');
        const content = document.querySelector('.content');
        const main = document.querySelector('main');
        if (header) {
            header.style.display = 'none';
        }

        if (main) {
            main.style.padding = 0;
            main.style.marginTop = '-1rem';
        }

        if (content) {
            content.style.backgroundColor = 'transparent';
        }
        setCurrentPath('/invoices/');

        if (props?.invoice_items) {
            setInvoiceItems(props?.invoice_items);
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
                    allowed.push({value: status, label: data.name});
                }
            })
            setAllowedStatuses(allowed);
        }

        if (settings?.invoice_date_format) {
            setDateFormat(settings?.invoice_date_format);
        }

        return () => {
            header.style = false;
            main.style = false;
            content.style = false;
        };
    }, [
        currentPath,
        settings,
        europeCountries,
        invoiceStatus,
        statuses,
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
                navigate(`/invoices/edit/${response.UUID}`)
            }
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
                                <h1 className='invoice-title'>
                                    {__('Invoice', 'app')}
                                </h1>
                                <div className='invoice-number flex items-end gap-2 p-relative'>
                                    <h4>{invoiceData?.invoice_number ?? ''}</h4>
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
                                        <label htmlFor='notes'>
                                            {__('Notes', 'app')}
                                        </label>
                                        <textarea
                                            className={'input-lg no-resize'}
                                            placeholder={__(
                                                'Notes - any relevant information not already covered',
                                                'app'
                                            )}
                                            onChange={() => {
                                            }}
                                            name='invoice_notes'
                                            value={formData?.invoice_notes}
                                            id='notes'
                                            cols='30'
                                            rows='3'></textarea>
                                    </div>
                                    <div className='col-4'></div>
                                    <div className='form-group col-8'>
                                        <label htmlFor='terms'>
                                            {__('Terms', 'app')}
                                        </label>
                                        <textarea
                                            className={'input-lg no-resize'}
                                            placeholder={__(
                                                'Terms and conditions - late fees, payment methods, delivery schedule',
                                                'app'
                                            )}
                                            onChange={() => {
                                            }}
                                            name='invoice_terms'
                                            value={formData?.invoice_terms}
                                            id='terms'
                                            cols='30'
                                            rows='3'></textarea>
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
                    <button type='submit' className='btn btn-wide mt-2'>
                        {__('Save Invoice', 'app')}
                    </button>
                    <hr className='b-bottom-grey-10-4 mx-4'/>
                    <div className='flex flex-column'>
                        <label htmlFor='invoice_status'>{__('Invoice status', 'app')}</label>
                        <select name='invoice_status'
                                id='invoice_status'
                                value={invoiceStatus}
                                onChange={(elem) => setInvoiceStatus(elem.target.value)}
                        >
                            {allowedStatuses.length && allowedStatuses.map((item) => {
                                return (
                                    <option key={`option_status_${item.value}`}
                                            value={item.value}
                                            disabled={invoiceStatus === item.value}>
                                        {__(item.label, 'app')}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </aside>
            </div>
        </form>
    )
}

export default InvoicePanel;
