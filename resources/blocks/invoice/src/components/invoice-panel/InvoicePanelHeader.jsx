import {useState} from 'react';
import {__} from "@wordpress/i18n";
import {QRCodeSVG} from "qrcode.react";
import {useInvoice} from "../../contexts/InvoiceContext";
import {useSettings} from "../../contexts/SettingsContext";
import DropFileInput from "../DropFileInput";

const InvoicePanelHeader = () => {
    const {invoice} = useInvoice();
    const {settings} = useSettings();
    const [logo] = useState(invoice?.invoice_logo ?? settings?.invoice_logo);
    const [invoiceUrl] = useState(window.location.href);

    return (
        <div className='grid grid-cols-7-3 invoice-header gap-3'>
            <div className='left flex flex-column gap-3'>
                <DropFileInput onFileChange={(elem) => {
                }} logo={logo ?? ''} disabled={true}/>
            </div>
            <div className='right flex flex-column justify-space-between gap-2 text-right'>
                <div className='flex justify-end flex-column items-end'>
                    <h2 className='invoice-title uppercase'>
                        {sprintf(__('Invoice %s', 'app'), invoice?.invoice_number ?? '')}
                    </h2>
                    <div className='invoice-qr-code'>
                        <QRCodeSVG value={invoiceUrl} size={75} level={'H'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoicePanelHeader;