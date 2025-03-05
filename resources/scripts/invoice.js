import '@inscss/invoice.scss';
import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Invoices from '@invoice/views/Invoices';
import Settings from '@invoice/views/Settings';
import {SettingsProvider} from '@invoice/contexts/SettingsContext';
import {ToastContainer} from 'react-toastify';
import Business from '@invoice/views/Business';
import InvoiceNew from '@invoice/views/InvoiceNew';
import InvoiceEdit from '@invoice/views/InvoiceEdit';
import InvoiceView from '@invoice/views/InvoiceView';
import {InvoicesProvider} from "@invoice/contexts/InvoicesContext";
import {InvoiceProvider} from "@invoice/contexts/InvoiceContext";

const InvoiceContainer = () => {
    return (
        <div>
            <SettingsProvider>
                <InvoicesProvider>
                    <InvoiceProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path='/invoices' element={<Invoices/>}/>
                                <Route path='/invoices/new' element={<InvoiceNew/>}/>
                                <Route path='/invoices/edit/:uuid' element={<InvoiceEdit/>}/>
                                <Route path='/invoices/view/:uuid' element={<InvoiceView/>}/>
                                <Route path='/invoices/business' element={<Business/>}/>
                                <Route path='/invoices/settings' element={<Settings/>}/>
                            </Routes>
                        </BrowserRouter>
                    </InvoiceProvider>
                    <ToastContainer draggable position='bottom-right'/>
                </InvoicesProvider>
            </SettingsProvider>
        </div>
    )
}

const AppInvoiceContainer = document.getElementById('app-invoice-container');
if (AppInvoiceContainer) {
    domReady(() => {
        const root = createRoot(
            AppInvoiceContainer
        );

        root.render(<InvoiceContainer/>);
    });
}
