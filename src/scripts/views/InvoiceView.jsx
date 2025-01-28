import { useParams } from "react-router-dom";
import apiFetch from "@wordpress/api-fetch";
import {__} from '@wordpress/i18n';
import {useState, useEffect} from "react";
import InvoicePanel from "../components/InvoicePanel";

const InvoiceView = () => {
    const {uuid} = useParams();
    const [invoiceData, setInvoiceData] = useState();

    useEffect(() => {
        apiFetch({
            path: `invoice/v1/invoice/${uuid}`
        })
        .then(response => {
            setInvoiceData(response);
        })
        .catch(error => {
            console.error(error)
        })
    }, []);

    return (
        <>
            {invoiceData ? <InvoicePanel {...invoiceData} /> : <em>{__('Loading', 'app')}</em>}
        </>
    )
}

export default InvoiceView;