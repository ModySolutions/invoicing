import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import apiFetch from "@wordpress/api-fetch";
import {useParams} from "react-router-dom";
import InvoicePanel from "../components/InvoicePanel";
import {useInvoice} from "../contexts/InvoiceContext";
import InvoiceForm from "../components/InvoiceForm";

const InvoiceViewOrEdit = ({action, print}) => {
    const {uuid} = useParams();
    const {invoice, setInvoice, invoiceUuid, setInvoiceUuid, setFetchNewInvoice} = useInvoice()
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setInvoiceUuid(uuid);
        if(uuid !== invoiceUuid) {
            apiFetch({path: `invoice/v1/invoice/${uuid}`})
            .then(response => {
                setInvoice(response);
                setInvoiceUuid(response?.UUID)
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error(error)
            })
        }

        return () => {
            setInvoiceUuid(null);
        }
    }, [])

    return (
        <>
            {
                !loading && invoiceUuid ?
                action === 'view' ? <InvoicePanel print={print} /> : <InvoiceForm /> :
                <em>{__('Loading', 'app')}</em>
            }
        </>
    )
}

export default InvoiceViewOrEdit;