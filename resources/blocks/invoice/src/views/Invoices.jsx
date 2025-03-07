import {useState} from "react";
import InvoiceListStatusButtons from "../components/invoice-list/InvoiceListStatusButtons";
import InvoicesList from "../components/InvoicesList";

const Invoices = () => {
    const [statuses] = useState(Invoice.statuses);

    return (
        <>
            <div>
                <InvoiceListStatusButtons statuses={statuses}/>
                <InvoicesList statuses={statuses} />
            </div>

        </>
    )
}

export default Invoices;