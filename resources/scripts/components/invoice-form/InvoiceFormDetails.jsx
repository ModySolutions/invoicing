import {useState, useEffect} from 'react';
import {useInvoice} from "../../contexts/InvoiceContext";
import {useSettings} from "../../contexts/SettingsContext";
import capitalize from "../../tools/capitalize";
import {findCountryByIsoCode} from "../../tools/Countries";
import {__} from "@wordpress/i18n";
import DatePicker from "react-datepicker";

const InvoiceFormDetails = () => {
    const {invoice, setInvoice} = useInvoice();
    const {settings} = useSettings();
    const [issuedDate, setIssuedDate] = useState(invoice?.invoice_issue_date ?? new Date());
    const [dueDate, setDueDate] = useState(invoice?.invoice_due_date ?? new Date());
    const [dateFormat] = useState(settings?.invoice_date_format ?? 'MMM d, Y');

    useEffect(() => {
        const invoiceSender = [
            settings?.invoice_business_fni.toString().toUpperCase(),
            capitalize(settings?.invoice_business_name.toString()),
            capitalize([
                settings?.invoice_business_city.toString(),
                findCountryByIsoCode(settings?.invoice_business_country)?.name,
            ].join(', ')),
        ].join("\n");

        setInvoice(prevState => ({
            ...prevState,
            ['invoice_sender']: invoiceSender,
            ['invoice_sender_address']: invoiceSender,
            ['invoice_issue_date']: issuedDate,
            ['invoice_due_date']: dueDate
        }))
    }, [settings]);

    useEffect(() => {
        setInvoice(prevState => ({
            ...prevState,
            ['invoice_issue_date']: issuedDate,
            ['invoice_due_date']: dueDate
        }));
    }, [issuedDate, dueDate]);

    const handleTextChange = (event) => {
        const {name, value} = event.target;
        setInvoice(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if(name === 'invoice_client') {
            setInvoice(prevState => ({
                ...prevState,
                ['invoice_client_address']: value,
            }));
        }
    }

    return (
        <div className='grid grid-cols-7-3'>
            <div className='left'>
                <div className='sender w-100-p mt-4'>
                    <textarea required
                              className={'input-lg no-resize'}
                              placeholder={__('Who is this from?', 'app')}
                              name='sender'
                              id='sender'
                              value={invoice?.invoice_sender}
                              onChange={handleTextChange}
                              cols='30'
                              rows='3'></textarea>
                </div>
                <div className='client w-100-p mt-3'>
                    <label htmlFor='client'>{__('Bill to:', 'app')}</label>
                    <textarea required
                              className={'input-lg no-resize'}
                              placeholder={__('Who is this to?', 'app')}
                              name='invoice_client'
                              onChange={handleTextChange}
                              value={invoice?.invoice_client}
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
    )
}

export default InvoiceFormDetails;