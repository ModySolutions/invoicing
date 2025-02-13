import {useEffect, useState} from "react";
import apiFetch from '@wordpress/api-fetch';
import InvoiceStatuses from "@invoice/components/InvoiceStatuses";
import InvoicesList from "@invoice/components/InvoicesList";

const Invoices = () => {
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        apiFetch({path: '/wp/v2/statuses'})
            .then(response => {
                const invoiceStatuses = Object.fromEntries(
                    Object.entries(response).filter(([key]) => key.includes('invoice'))
                ) ?? [];
                setStatuses(invoiceStatuses);
            })
    }, [setStatuses]);

    return (
        <>
            <div>
                <InvoiceStatuses statuses={statuses}/>
                <InvoicesList statuses={statuses} />
            </div>

        </>
    )
}

export default Invoices;