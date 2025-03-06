import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import DatePicker from "react-datepicker";
import {useSettings} from "../contexts/SettingsContext";
import CurrencyFormatter from "../components/CurrencyFormatter";
import DropFileInput from "../components/DropFileInput";
import {findCountryByIsoCode} from "../tools/Countries";
import apiFetch from "@wordpress/api-fetch";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useInvoices} from "../contexts/InvoicesContext";
import Enums from "../tools/Enums";
import setNextInvoiceNumber from "../tools/setNextInvoiceNumber";
import setInvoiceHeader from "../tools/setInvoiceHeader";
import {useInvoice} from "../contexts/InvoiceContext";
import InvoiceFormHeader from "../components/invoice-form/InvoiceFormHeader";
import InvoiceFormDetails from "../components/invoice-form/InvoiceFormDetails";
import InvoiceFormItemsTable from "../components/invoice-form/InvoiceFormItemsTable";
import InvoiceFormNotesAndTerms from "../components/invoice-form/InvoiceFormNotesAndTerms";
import InvoiceFormSidebar from "../components/invoice-form/InvoiceFormSidebar";
import HandleTaxesAndDiscounts from "../tools/HandleTaxesAndDiscounts";
import InvoiceTotals from "../components/invoice-common/InvoiceTotals";

const Container = () => {
    return (
        <div className='grid grid-cols-7-3 form-container p-relative'>
            <InvoiceFormContainer/>
            <InvoiceFormSidebar />
        </div>
    )
}

const InvoiceFormContainer = ({invoice}) => {
    return (
        <div className='form-container p-4 radius-lg rounded bg-white'>
            <InvoiceFormHeader/>
            <InvoiceFormDetails/>
            <div className='mt-4 invoices-table-container'>
                <InvoiceFormItemsTable />
                <div className='grid grid-cols-6-4'>
                    <InvoiceFormNotesAndTerms />
                    <InvoiceTotals />
                </div>
            </div>
        </div>
    )
}

const InvoiceForm = (props = null) => {
    let {ID, UUID} = props;
    const {setSettings} = useSettings();
    const {invoice, setInvoice} = useInvoice();
    const [currentPath, setCurrentPath] = useState(window.location.path);
    const {setFetchNewInvoices} = useInvoices();
    const navigate = useNavigate()

    useEffect(() => {
        setInvoiceHeader(false);
        setCurrentPath('/invoices/');
        setInvoice(prevState => ({
            ...prevState,
            ['invoice_tax_amount']: invoice?.invoice_tax_amount ?? Enums.TAXES.IVA,
            ['invoice_discount_amount']: invoice?.invoice_discount_amount ?? Enums.DISCOUNTS.IRPF,
        }));

        return () => {
            setInvoiceHeader(true);
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        let url = 'invoice/v1/invoice';
        if (ID && UUID) {
            url += `/${UUID}`;
        }
        apiFetch({
            path: url,
            method: 'POST',
            data: {
                'acf': {...invoice, ...HandleTaxesAndDiscounts(invoice)},
            },
        })
        .then((response) => {
            if (response.success) {
                toast.success(
                    __('Invoice saved successfully.'),
                    {
                        autoClose: 3000,
                    }
                )
                if (!ID && !UUID) {
                    UUID = response.UUID;
                }
                setFetchNewInvoices(true);
                setSettings(prevSettings => ({
                    ...prevSettings,
                    ['invoice_last_number']: response.invoice_last_number
                }))
                navigate(`/invoices/view/${UUID}`)
            } else {
                toast.error(
                    response.message ?? __('There was an error saving your invoice'),
                    {
                        autoClose: 3000,
                    }
                )
            }
        })
    };

    return (
        <form onSubmit={handleSubmit}
              className={'invoice-form mt-3 mb-5 p-relative'}
              encType='multipart/form-data'>
            <Container invoice={props}/>
        </form>
    )
}

export default InvoiceForm;
