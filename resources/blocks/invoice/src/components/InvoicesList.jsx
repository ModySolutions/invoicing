import {useEffect, useState} from "react";
import {sprintf, __} from '@wordpress/i18n';
import {useInvoices} from "../contexts/InvoicesContext";
import InvoiceListTableHeader from "./invoice-list/InvoiceListTableHeader";
import InvoiceListTableBody from "./invoice-list/InvoiceListTableBody";

const InvoicesList = ({statuses}) => {
    const {currentStatusLabel, currentStatus} = useInvoices();
    const [noInvoicesText, setNoInvoicesText] = useState(__('You have no invoices', 'app'));

    useEffect(() => {
        setNoInvoicesText(currentStatus === 'any' ? __('You have no invoices', 'app') : sprintf(
            __('You have no <strong>%s</strong> invoices', 'app'),
            currentStatusLabel
        ))
    }, [currentStatus])

    return (
        <div className='invoices-table-container'>
            <table className='invoices-table mt-2'>
                <InvoiceListTableHeader />
                <InvoiceListTableBody statuses={statuses}/>
            </table>
        </div>
    )
}

export default InvoicesList;