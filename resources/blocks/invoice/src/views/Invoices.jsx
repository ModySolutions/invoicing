import {useState} from "react";
import InvoiceStatuses from "../components/InvoiceStatuses";
import InvoicesList from "../components/InvoicesList";

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