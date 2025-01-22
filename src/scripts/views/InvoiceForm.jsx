import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import DatePicker from "react-datepicker";
import {useSettings} from "../contexts/SettingsContext";
import CurrencyFormatter from "../components/CurrencyFormatter";
import DropFileInput from "../components/DropFileInput";
import {findCountryByIsoCode} from "../tools/Countries";
import apiFetch from "@wordpress/api-fetch";

const InvoiceForm = () => {
    const {settings, setSettings, europeCountries} = useSettings();
    const [issuedDate, setIssuedDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [dateFormat, setDateFormat] = useState('MMM d, Y');
    const {currentPath, setCurrentPath} = useSettings();
    const defaultItemValues = {
        'description': '',
        'quantity': '',
        'price': '',
        'taxable': true,
        'amount': '0',
    };
    const [invoiceItems, setInvoiceItems] = useState([defaultItemValues]);
    const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
    const [invoiceTotal, setInvoiceTotal] = useState(0);
    const [invoiceTaxes, setInvoiceTaxes] = useState(0);
    const [selectedInvoiceTax, setSelectedInvoiceTax] = useState('');
    const [invoiceDiscounts, setInvoiceDiscounts] = useState(0);
    const [selectedInvoiceDiscount, setSelectedInvoiceDiscount] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceSender, setInvoiceSender] = useState('');

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

        if (settings?.selected_invoice_tax > 0) {
            setSelectedInvoiceTax(settings?.selected_invoice_tax)
            setSelectedInvoiceDiscount(settings?.selected_invoice_discount)
            setInvoiceNumber(prevInvoiceNumber => {
                return Number(settings?.invoice_last_number) + 1;
            })
        }

        const capitalize = (text) => text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

        if (settings?.invoice_business_fni && settings?.invoice_business_name) {
            setInvoiceSender([
                settings?.invoice_business_fni.toString().toUpperCase(),
                capitalize(settings?.invoice_business_name.toString()),
                capitalize([
                    settings?.invoice_business_city.toString(),
                    findCountryByIsoCode(settings?.invoice_business_country)?.name,
                ].join(', ')),
            ].join("\n"))
        }

        if (settings?.invoice_logo) {
            apiFetch({
                path: 'wp/v2/settings',
                method: 'POST',
                data: {'site_logo': settings?.invoice_logo_id}
            })
            .then((response) => {
                console.log(response)
            })
        }

        return () => {
            header.style = false;
            main.style = false;
            content.style = false;
        };
    }, [
        currentPath,
        setCurrentPath,
        setSelectedInvoiceTax,
        setSelectedInvoiceDiscount,
        settings,
        europeCountries
    ]);

    useEffect(() => {
        if (settings?.invoice_date_format) {
            setDateFormat(settings?.invoice_date_format)
        }
    }, [settings, setDateFormat]);

    useEffect(() => {
        handleTaxesAndDiscounts();
    }, [selectedInvoiceTax, selectedInvoiceDiscount]);

    const handleTaxesAndDiscounts = () => {
        let subtotal = 0;
        let taxes = 0;
        let discounts = 0;

        invoiceItems.forEach(item => {
            const itemAmount = (parseFloat(item.amount) || 0);
            subtotal += itemAmount;
            if (item.taxable) {
                taxes += (itemAmount * selectedInvoiceTax) / 100; // Sumar solo impuestos si taxable es true
            }
        });

        if (selectedInvoiceDiscount > 0) {
            discounts = (subtotal * selectedInvoiceDiscount) / 100;
        }

        setInvoiceSubtotal(subtotal);
        setInvoiceTaxes(taxes);
        setInvoiceDiscounts(discounts);
        setInvoiceTotal(subtotal - discounts + taxes);
    };


    const handleInputChange = (index, event) => {
        const {name, value, type, checked} = event.target;
        const updatedItems = [...invoiceItems];
        if (type === 'checkbox') {
            updatedItems[index][name] = checked;
        } else {
            updatedItems[index][name] = value;
        }

        if (name === 'quantity' || name === 'price') {
            const quantity = updatedItems[index].quantity || 0;
            const price = updatedItems[index].price || 0;
            updatedItems[index].amount = (quantity * price).toFixed(2);
        }

        setInvoiceItems(updatedItems);
        handleTaxesAndDiscounts();
    };

    const handleSelectChange = (event) => {
        const select = event.target;
        const value = select.value;

        if (select.name === 'iva') {
            setSelectedInvoiceTax(value);
        }

        if (select.name === 'irpf') {
            setSelectedInvoiceDiscount(value);
        }

        handleTaxesAndDiscounts();
    }

    const addItem = () => {
        setInvoiceItems([...invoiceItems, {...defaultItemValues}]);
    };

    const removeItem = (index) => {
        const updatedItems = invoiceItems.filter((item, i) => i !== index);
        setInvoiceItems(updatedItems);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(invoiceItems);
    };

    return (
        <form onSubmit={handleSubmit} className={'invoice-form mt-3 mb-5 p-relative'} encType='multipart/form-data'>
            <div className='grid grid-cols-7-3 form-container p-relative'>
                <div className='form-container p-4 radius-lg rounded bg-white'>
                    <div className='grid grid-cols-7-3 invoice-header gap-3'>
                        <div className='left flex flex-column gap-3'>
                            <DropFileInput onFileChange={(elem) => {
                                setSettings(prevSettings => ({
                                    ...prevSettings,
                                    'invoice_logo': elem?.source_url,
                                    'invoice_logo_id': elem?.id,
                                }))
                            }}/>
                        </div>
                        <div className='right flex flex-column justify-space-between gap-2 text-right'>
                            <div className='flex justify-end flex-column items-end'>
                                <h1 className='invoice-title'>
                                    {__('Invoice', 'app')}
                                </h1>
                                <div className='invoice-number flex items-end gap-2 p-relative'>
                                    <label htmlFor='invoice-number' className={'p-absolute top center p-2 pt-1'}>
                                        #
                                    </label>
                                    <input
                                        required
                                        type='text'
                                        placeholder='#'
                                        className='text-right'
                                        name='invoice-number'
                                        id='invoice-number'
                                        value={invoiceNumber}
                                        onChange={(number) => {
                                            setInvoiceNumber(number);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-7-3'>
                        <div className='left'>
                            <div className='sender w-100-p mt-4'>
                                <textarea required
                                          className={'input-lg no-resize'}
                                          placeholder={__('Who is this from?', 'app')}
                                          name='sender'
                                          id='sender'
                                          value={invoiceSender}
                                          onChange={(event) => setInvoiceSender(event.target.value)}
                                          cols='30'
                                          rows='3'></textarea>
                            </div>
                            <div className='client w-100-p mt-3'>
                                <label htmlFor='client'>{__('Bill to:', 'app')}</label>
                                <textarea required
                                    className={'input-lg no-resize'}
                                    placeholder={__('Who is this to?', 'app')}
                                    name='client'
                                    id='client'
                                    cols='30'
                                    rows='3'></textarea>
                            </div>
                        </div>
                        <div className='right flex flex-column justify-end mt-3'>
                            <div className='invoice-dates flex flex-column gap-3'>
                                <div className='invoice-date grid grid-cols-4-6 items-center gap-2'>
                                    <label htmlFor='invoice-date' className='text-right'>
                                        {__('Issued date', 'app')}
                                    </label>
                                    <DatePicker
                                        required={true}
                                        selected={issuedDate}
                                        dateFormat={dateFormat}
                                        onChange={(date) => setIssuedDate(date)}/>
                                </div>
                                <div className='invoice-due-date grid grid-cols-4-6 items-center gap-2'>
                                    <label htmlFor='invoice-due-date' className='text-right'>
                                        {__('Due date', 'app')}
                                    </label>
                                    <DatePicker
                                        rqeuired={true}
                                        selected={dueDate}
                                        dateFormat={dateFormat}
                                        onChange={(date) => setDueDate(date)}/>
                                </div>
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
                                            <input required
                                                type={'text'}
                                                name='description'
                                                value={item.description}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </td>
                                        <td data-title={__('Quantity', 'app')}>
                                            <input required
                                                type={'text'}
                                                name='quantity'
                                                value={item.quantity}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </td>
                                        <td data-title={__('Price', 'app')}>
                                            <input required
                                                type={'text'}
                                                name='price'
                                                value={item.price}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </td>
                                        <td className={'text-center'} data-title={__('Taxable', 'app')}>
                                            <input
                                                type={'checkbox'}
                                                name='taxable'
                                                checked={item.taxable}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </td>
                                        <td className='text-right' data-title={__('Amount', 'app')}>
                                            <CurrencyFormatter amount={item.amount}/>
                                        </td>
                                        <td className={'hidden-action text-right'}>
                                            {index !== 0 && (
                                                <a href='#' className='text-lg'
                                                   onClick={() => removeItem(index)}>
                                                    &times;
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td>
                                    <button
                                        type='button'
                                        className='btn btn-info btn-text-cultured btn-primary btn-sm'
                                        onClick={addItem}
                                    >
                                        <span>+</span>&nbsp;{__('Add item', 'app')}
                                    </button>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                        <div className='grid grid-cols-7-3'>
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
                                            name='notes'
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
                                            name='terms'
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
                                            <CurrencyFormatter amount={invoiceSubtotal}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-taxes' className='text-right pr-2'>
                                            {__('I.V.A.', 'app')}
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={invoiceTaxes}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-discounts' className='text-right pr-2'>
                                            {__('I.R.P.F.', 'app')}
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={invoiceDiscounts}/>
                                        </strong>
                                    </div>
                                    <div className='invoice-taxes grid grid-cols-4-6 items-center gap-y-2'>
                                        <label htmlFor='invoice-total' className='text-right pr-2'>
                                            <strong>{__('Total', 'app')}</strong>
                                        </label>
                                        <strong className={'text-right'}>
                                            <CurrencyFormatter amount={invoiceTotal}/>
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
                    <div className='invoice-taxes flex flex-column items-center gap-y-2'>
                        <select name='iva'
                                id='iva'
                                onChange={handleSelectChange}
                                value={selectedInvoiceTax}
                                className={'text-right'}>
                            {settings?.spain_iva && Object.entries(settings?.spain_iva).map(([value, label]) => (
                                <option key={`option_iva_${value}`} value={value}>{label}</option>
                            ))}
                        </select>
                        <hr className={'my-2'}/>
                        <select name='irpf'
                                id='irpf'
                                className={'text-right'}
                                onChange={handleSelectChange}
                                value={selectedInvoiceDiscount}>
                            {settings?.spain_irpf && Object.entries(settings?.spain_irpf).map(([value, label]) => (
                                <option key={`option_irpf_${value}`} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </aside>
            </div>
        </form>
    )
}

export default InvoiceForm;
