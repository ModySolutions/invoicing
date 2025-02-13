import {useEffect, useState} from "react";
import apiFetch from '@wordpress/api-fetch';
import InvoiceStatuses from "@invoice/components/InvoiceStatuses";
import InvoicesList from "@invoice/components/InvoicesList";

const Invoices = () => {
    const [statuses] = useState(Invoice.statuses);

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