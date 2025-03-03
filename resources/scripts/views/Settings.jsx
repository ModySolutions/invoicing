import {useEffect, useState} from 'react';
import {__} from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {useSettings} from "@invoice/contexts/SettingsContext";
import {toast} from "react-toastify";
import DateFormats from "@invoice/tools/DateFormats";

const Settings = () => {
    const {settings, setSettings, loading, error} = useSettings();
    const [formData, setFormData] = useState(settings);
    const [dateFormats, setDateFormats] = useState(DateFormats)
    const [updating, setUpdating] = useState(false);
    const [selectedDateFormat, setSelectedDateFormat] = useState(formData?.invoice_date_format ?? 'F j, Y');
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState(formData?.invoice_last_number ?? 0);

    useEffect(() => {
        if (null !== settings) {
            setFormData(formData ?? settings);
            setLastInvoiceNumber(formData?.invoice_last_number ?? settings?.invoice_last_number);
            setSelectedDateFormat(formData?.invoice_date_format ?? settings?.invoice_date_format);
        }
    }, [formData, settings])

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        if(name === 'invoice_last_number') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
            setLastInvoiceNumber(value);
        }
    };

    const handleSelectChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]:value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setUpdating(true);
        apiFetch({
            path: `invoice/v1/settings/invoice`,
            method: 'PUT',
            data: {
                ...formData,
                ...{
                    'invoice_last_number': lastInvoiceNumber,
                    'invoice_date_format': selectedDateFormat,
                }
            },
        })
            .then((response) => {
                const { success, message, data } = response
                if(success) {
                    setSettings(prevState => ({
                        ...prevState,
                        ...data
                    }));
                    toast.success(
                        message || __('Invoice settings updated successfully.'),
                        {
                            autoClose: 3000,
                        }
                    )
                } else {
                    toast.error(
                        message || __('There was an error updating invoice settings.'),
                        {
                            autoClose: 10000,
                        }
                    )
                }
                setUpdating(false);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    if (loading) {
        return <div className={'loading-icon-primary-2'}></div>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <>
            {formData &&
                <form className={'container'} onSubmit={handleSubmit}>
                    <div className='col-6'>
                        <h3>{__('Invoice number.')}</h3>
                    </div>
                    <div className='col-6 justify-end items-start p-relative'>
                        {updating && <div className='loading-icon-primary-2 p-absolute top right'></div>}
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_last_number'>{__('Last invoice number')}</label>
                        <input
                            type='number'
                            className='input-lg'
                            value={lastInvoiceNumber}
                            id='invoice_last_number'
                            name='invoice_last_number'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                        <em className='text-gray-60 text-sm'>
                            {__('The last invoice number you have used.')} <br/>
                            {__('We automatically will keep your next invoice number updated.')}
                        </em>
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_date_format'>{__('Date format')}</label>
                        <select
                            className='input-lg'
                            value={selectedDateFormat}
                            id='invoice_date_format'
                            name='invoice_date_format'
                            disabled={updating}
                            onChange={handleSelectChange}
                        >
                            {dateFormats && dateFormats.map((dateFormat) =>
                                <option value={dateFormat?.value} key={dateFormat?.value}>
                                    {dateFormat.label}
                                </option>)}
                        </select>
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_currrency'>{__('Currency')}</label>
                        <select
                            className='input-lg'
                            value={formData.invoice_currency}
                            id='invoice_currrency'
                            name='invoice_currrency'
                            disabled={updating}
                            onChange={handleSelectChange}
                        >
                            <option value='EUR' key='EUR'>
                                EUR
                            </option>
                        </select>
                    </div>
                    <div className='form-group col-12'>
                        <button type='submit' className='btn btn-primary text-white' disabled={updating}>
                            {__('Save invoice settings')}
                        </button>
                    </div>
                </form>
            }
        </>
    );
};

export default Settings;
