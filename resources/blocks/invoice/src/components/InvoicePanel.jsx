import {useState, useEffect, useRef} from 'react';
import generatePDF, {Resolution} from 'react-to-pdf';
import {useInvoice} from "../contexts/InvoiceContext";
import setInvoiceHeader from "@invoice/tools/setInvoiceHeader";
import InvoicePanelHeader from "./invoice-panel/InvoicePanelHeader";
import InvoicePanelDetails from "./invoice-panel/InvoicePanelDetails";
import InvoicePanelItemsTable from "./invoice-panel/InvoicePanelItemsTable";
import InvoicePanelNotesAndTerms from "./invoice-panel/InvoicePanelNotesAndTerms";
import InvoicePanelSidebar from "./invoice-panel/InvoicePanelSidebar";
import InvoiceTotals from "./invoice-common/InvoiceTotals";
import InvoicePanelBottomBar from "./invoice-panel/InvoicePanelBottomBar";

const InvoicePanelContainer = ({pub}) => {
    return (
        <div className='form-container p-4 radius-lg rounded bg-white'>
            <InvoicePanelHeader/>
            <InvoicePanelDetails pub={pub}/>
            <div className='mt-4 invoices-table-container'>
                <InvoicePanelItemsTable/>
                <div className='grid grid-cols-6-4 mt-5'>
                    <InvoicePanelNotesAndTerms pub={pub}/>
                    <InvoiceTotals/>
                </div>
            </div>
        </div>
    )
}

const InvoicePanel = ({print, pub}) => {
    const {invoice} = useInvoice();
    const [currentPath, setCurrentPath] = useState(window.location.path);

    useEffect(() => {
        setInvoiceHeader(false);
        setCurrentPath('/invoices/');

        return () => {
            setInvoiceHeader(true);
        };
    }, []);

    return (
        <div className={'invoice-form invoice-panel mt-3 mb-5 p-relative'}>
            <div id={`print-invoice-${invoice?.UUID}${print ? '-print' : ''}`}
                 style={print || pub ? {maxWidth: 800, margin: '0 auto'} : {}}
                 className={`${!print && !pub ? 'grid grid-cols-7-3' : ''} form-container p-relative`}>
                <InvoicePanelContainer print={print} pub={pub}/>
                {!print && !pub && <InvoicePanelSidebar/>}
            </div>
            {print && <InvoicePanelBottomBar/>}
        </div>
    )
}

export default InvoicePanel;
