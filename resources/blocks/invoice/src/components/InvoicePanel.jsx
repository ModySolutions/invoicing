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
import InvoicePanelLoading from "./invoice-panel/InvoicePanelLoading";

const InvoicePanelContainer = ({print}) => {
    return (
        <div className='form-container p-4 radius-lg rounded bg-white'>
            <InvoicePanelHeader/>
            <InvoicePanelDetails/>
            <div className='mt-4 invoices-table-container'>
                <InvoicePanelItemsTable/>
                <div className='grid grid-cols-6-4 mt-5'>
                    <InvoicePanelNotesAndTerms/>
                    <InvoiceTotals/>
                </div>
            </div>
        </div>
    )
}

const PrintPDF = () => {
    const {invoice} = useInvoice();
    return(
        <div id={invoice?.uuid} className={'invoice-form invoice-panel mt-3 mb-5 p-relative'}>
            <div style={print ? {maxWidth: '800px', margin: '0 auto'} : {}}
                 className={`${!print ? 'grid grid-cols-7-3' : ''} form-container p-relative`}>
                <InvoicePanelContainer print={print}/>
                {!print && <InvoicePanelSidebar/>}
            </div>
        </div>
    )
}

const InvoicePanel = ({print}) => {
    const {invoice} = useInvoice();
    const [currentPath, setCurrentPath] = useState(window.location.path);

    useEffect(() => {
        setInvoiceHeader(false);
        setCurrentPath('/invoices/');

        return () => {
            setInvoiceHeader(true);
        };
    }, []);

    if(print) {
        setTimeout(() => {
            const element = () => document.getElementById(`print-invoice-${invoice?.UUID}`)
            generatePDF(element, {
                method: 'open',
                resolution: Resolution.HIGH,
            }).then(() => window.close());
        }, 1000);
    }

    return (
        <div className={'invoice-form invoice-panel mt-3 mb-5 p-relative'}>
            <div id={`print-invoice-${invoice?.UUID}`} style={print ? {maxWidth: '800px', margin: '0 auto'} : {}}
                 className={`${!print ? 'grid grid-cols-7-3' : ''} form-container p-relative`}>
                <InvoicePanelContainer print={print}/>
                {!print && <InvoicePanelSidebar/>}
            </div>
            {print && <InvoicePanelLoading />}
        </div>
    )
}

export default InvoicePanel;
