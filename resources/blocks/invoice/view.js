import '@inscss/invoice.scss';
import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Invoices from './src/views/Invoices';
import Settings from './src/views/Settings';
import {SettingsProvider} from './src/contexts/SettingsContext';
import {ToastContainer} from 'react-toastify';
import Business from './src/views/Business';
import InvoiceNew from './src/views/InvoiceNew';
import {InvoicesProvider} from "./src/contexts/InvoicesContext";
import {InvoiceProvider} from "./src/contexts/InvoiceContext";
import InvoiceViewOrEdit from "./src/views/InvoiceViewOrEdit";

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
                                <Route path='/invoices/edit/:uuid' element={<InvoiceViewOrEdit action='edit'/>}/>
                                <Route path='/invoices/view/:uuid' element={<InvoiceViewOrEdit action='view'/>}/>
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
