import {__} from "@wordpress/i18n";
import {useSettings} from "../contexts/SettingsContext";
import {useEffect, useState} from "react";
import {State} from 'country-state-city';
import apiFetch from '@wordpress/api-fetch';
import {toast} from "react-toastify";
import toKebabCase from "@modycloud/tools/kebabcase";

const Business = () => {
    const {settings, setSettings, europeCountries, loading, error} = useSettings();
    const [formData, setFormData] = useState(settings);
    const [updating, setUpdating] = useState(false);
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('ES');
    const [selectedCountry, setSelectedCountry] = useState('ES');
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        if (!formData?.invoice_business_fni && null !== settings) {
            setFormData(settings);
            setSelectedCountryCode(settings?.invoice_business_fni_country_code);
            setSelectedCountry(settings?.invoice_business_country);
            setSelectedState(settings?.invoice_business_state);
            setCountries(europeCountries);
        }
    }, [formData, setFormData, settings, europeCountries]);

    useEffect(() => {
        if (selectedCountry) {
            const countryStates = State.getStatesOfCountry(selectedCountry) || [];
            setStates(countryStates);
            setSelectedState(formData?.invoice_business_state ?? '')
        }
    }, [selectedCountry, setStates, setSelectedState, formData]);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (event) => {
        const {name, value} = event.target;
        if (name === 'invoice_business_fni_country_code') {
            setSelectedCountryCode(value);
        }
        if (name === 'invoice_business_country') {
            setSelectedCountry(value);
            const countryStates = State.getStatesOfCountry(value);
            setStates(countryStates);
            setSelectedState('');
        }
        if (name === 'invoice_business_state') {
            setSelectedState(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setUpdating(true);
        apiFetch({
            path: `invoice/v1/settings/business`,
            method: 'PUT',
            data: {
                ...formData,
                ...{
                    'invoice_business_fni_country_code': selectedCountryCode,
                    'invoice_business_country': selectedCountry,
                    'invoice_business_state': selectedState,
                }
            },
        })
            .then((response) => {
                const { success, message, newState } = response
                if(success) {
                    setSettings(prevState => ({
                        ...prevState,
                        ...newState
                    }));
                    toast.success(
                        message || __('Business data update successfully.'),
                        {
                            autoClose: 3000,
                        }
                    )
                } else {
                    toast.error(
                        message || __('There was an error updating business data.'),
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
    };

    if (loading) {
        return <div className={'loading-icon-primary-2'}></div>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <>
            {formData && (
                <form className={'container'} onSubmit={handleSubmit} noValidate={true}>
                    <h3 className='col-12'>{__('Business information')}</h3>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_fni'>
                            {__('Fiscal Identification Number (NIF / VAT)')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <div className='grid grid-cols-2-8 gap-1 mt-3 mx-0 px-0'>
                            <div>
                                <label htmlFor='invoice_business_fni_country_code'
                                       className={'text-sm'}
                                       title={__('Country code')}>
                                    {__('CID')}
                                    <span className='text-danger ml-2'>*</span>
                                </label>
                                <select name='invoice_business_fni_country_code'
                                        placeholder={'ES'}
                                        id='invoice_business_fni_country_code'
                                        className={'input-lg'}
                                        value={selectedCountryCode}
                                        onChange={handleSelectChange}>
                                    {europeCountries && europeCountries.map((country) =>
                                        <option value={country.isoCode}
                                                key={`${country.isoCode}-${toKebabCase(country.name)}`}>
                                            {country.isoCode.toUpperCase()}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label htmlFor='invoice_business_fni' className={'text-sm'}>
                                    {__('NIF/VAT')}
                                    <span className='text-danger ml-2'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='input-lg uppercase'
                                    maxLength='16'
                                    required
                                    value={formData.invoice_business_fni}
                                    id='invoice_business_fni'
                                    name='invoice_business_fni'
                                    placeholder={'Y123456789C'}
                                    disabled={updating}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-6 p-relative'>
                        {updating && <div className="loading-icon-primary-2 p-absolute top right"></div>}
                    </div>
                    <div className='form-group col-12'>
                        <label htmlFor='invoice_business_name'>
                            {__('Business Name (Legal name for individuals or company)')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <input
                            type='text'
                            className='input-lg'
                            required
                            value={formData.invoice_business_name}
                            id='invoice_business_name'
                            name='invoice_business_name'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_country'>
                            {__('Country')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <select
                            className='input-lg'
                            required
                            value={selectedCountry}
                            id='invoice_business_country'
                            name='invoice_business_country'
                            disabled={updating}
                            onChange={handleSelectChange}
                        >
                            <option value=''>{__('Select a country')}</option>
                            {europeCountries && europeCountries.map((data) =>
                                <option value={data.isoCode} key={data.isoCode}>{data.name}</option>
                            )}
                        </select>
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_state'>
                            {__('State')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <select
                            className='input-lg'
                            required
                            value={selectedState}
                            id='invoice_business_state'
                            name='invoice_business_state'
                            disabled={updating}
                            onChange={handleSelectChange}
                        >
                            <option value=''>{__('Select a state')}</option>
                            {states?.map((state) =>
                                <option value={state.isoCode} key={state.isoCode}>{state.name}</option>
                            )}
                        </select>
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_address'>
                            {__('Address')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <input
                            type='text'
                            className='input-lg'
                            required
                            value={formData.invoice_business_address}
                            id='invoice_business_address'
                            name='invoice_business_address'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_address_cont'
                               dangerouslySetInnerHTML={{
                                   __html: __('Address <small>(cont)</small>')
                               }}>
                        </label>
                        <input
                            type='text'
                            className='input-lg'
                            value={formData.invoice_business_address_cont}
                            id='invoice_business_address_cont'
                            name='invoice_business_address_cont'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_city'>
                            {__('City')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <input
                            type='text'
                            className='input-lg'
                            required
                            value={formData.invoice_business_city}
                            id='invoice_business_city'
                            name='invoice_business_city'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group col-6'>
                        <label htmlFor='invoice_business_postal_code'>
                            {__('Postal code')}
                            <span className='text-danger ml-2'>*</span>
                        </label>
                        <input
                            type='text'
                            className='input-lg'
                            required
                            value={formData.invoice_business_postal_code}
                            id='invoice_business_postal_code'
                            name='invoice_business_postal_code'
                            disabled={updating}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group col-12'>
                        <span className='text-danger'>*</span> Required fields
                    </div>
                    <div className='form-group col-12'>
                        <button type='submit' className='btn btn-primary text-white' disabled={updating}>
                            {__('Save business information')}
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

export default Business;
