import {useEffect, useState} from "react";
import {__} from "@wordpress/i18n";
import {useInvoice} from "../../contexts/InvoiceContext";
import {useSettings} from "../../contexts/SettingsContext";
import HandleTaxesAndDiscounts from "../../tools/HandleTaxesAndDiscounts";
import Enums from "../../tools/Enums";

const SubmitButton = () => (
    <button type='submit' className='btn btn-wide mt-2'>
        {__('Save Invoice', 'app')}
    </button>
);

const InvoiceSettings = () => {
    const {invoice, setInvoice} = useInvoice();
    const {settings} = useSettings();
    const [invoiceTaxAmount, setInvoiceTaxAmount] = useState(invoice?.invoice_tax_amount ?? Enums.TAXES.IVA);
    const [invoiceDiscountAmount, setInvoiceDiscountAmount] = useState(
        invoice?.invoice_discount_amount ?? Enums.DISCOUNTS.IRPF
    );

    useEffect(() => {
        setInvoice(prevState => ({
            ...prevState,
            ['invoice_tax_amount']: invoiceTaxAmount,
            ['invoice_discount_amount']: invoiceDiscountAmount,
            ...HandleTaxesAndDiscounts(invoice)
        }))
    }, [invoiceTaxAmount, invoiceDiscountAmount]);

    const handleSelectChange = (event) => {
        const {name, value} = event.target;
        switch(name) {
            case 'invoice_tax_amount':
                setInvoiceTaxAmount(value);
                break;
            case 'invoice_discount_amount':
                setInvoiceDiscountAmount(value);
                break;
        }
        setInvoice(prevState => ({
            ...prevState,
            [name]: value,
            ...HandleTaxesAndDiscounts(invoice)
        }))
    }

    return (
        <div className='flex flex-column gap-1'>
            <div className='flex flex-column'>
                <label htmlFor='invoice_tax_amount'>{__('I.V.A.', 'app')}</label>
                <select name='invoice_tax_amount'
                        id='invoice_tax_amount'
                        onChange={handleSelectChange}
                        value={invoiceTaxAmount}
                        className={'text-right'}>
                    {settings?.spain_iva && Object.entries(settings?.spain_iva).map(([value, label]) => (
                        <option key={`option_iva_${value}`} value={value}>{label}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-column'>
                <label htmlFor='invoice_discount_amount'>{__('I.R.P.F.', 'app')}</label>
                <select name='invoice_discount_amount'
                        id='invoice_discount_amount'
                        className={'text-right'}
                        onChange={handleSelectChange}
                        value={invoiceDiscountAmount}>
                    {settings?.spain_irpf && Object.entries(settings?.spain_irpf).map(([value, label]) => (
                        <option key={`option_irpf_${value}`} value={value}>{label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

const InvoiceFormSidebar = () => {
    return (
        <aside className='sidebar pl-4 pr-4 pt-0 flex flex-column gap-4'>
            <SubmitButton />
            <hr className='b-bottom-grey-10-4 mx-4'/>
            <InvoiceSettings />
        </aside>
    )
}

export default InvoiceFormSidebar;