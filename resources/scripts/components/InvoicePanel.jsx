import {useState, useEffect} from 'react';
import setInvoiceHeader from "../tools/setInvoiceHeader";
import {useInvoice} from "../contexts/InvoiceContext";
import InvoicePanelHeader from "./invoice-panel/InvoicePanelHeader";
import InvoicePanelDetails from "./invoice-panel/InvoicePanelDetails";
import InvoicePanelItemsTable from "./invoice-panel/InvoicePanelItemsTable";
import InvoicePanelNotesAndTerms from "./invoice-panel/InvoicePanelNotesAndTerms";
import InvoicePanelTotals from "./invoice-panel/InvoicePanelTotals";
import InvoicePanelSidebar from "./invoice-panel/InvoicePanelSidebar";

const InvoicePanelContainer = () => {
    return (
        <div className='form-container p-4 radius-lg rounded bg-white'>
            <InvoicePanelHeader />
            <InvoicePanelDetails />
            <div className='mt-4 invoices-table-container'>
                <InvoicePanelItemsTable />
                <div className='grid grid-cols-7-3 mt-5'>
                    <InvoicePanelNotesAndTerms />
                    <InvoicePanelTotals />
                </div>
            </div>
        </div>
    )
}

const InvoicePanel = (props = null) => {
    const {invoice, setInvoice} = useInvoice(props);
    const [currentPath, setCurrentPath] = useState(window.location.path);

    useEffect(() => {
        setInvoiceHeader(false);
        setCurrentPath('/invoices/');
        setInvoice(props);

        return () => {
            setInvoiceHeader(true);
        };
    }, [props]);

    return (
        <div className={'invoice-form invoice-panel mt-3 mb-5 p-relative'}>
            <div className='grid grid-cols-7-3 form-container p-relative'>
                <InvoicePanelContainer />
                <InvoicePanelSidebar />
            </div>
        </div>
    )
}

export default InvoicePanel;
