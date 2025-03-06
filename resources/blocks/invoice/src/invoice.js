import './style.scss';
import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Invoices from './views/Invoices';
import Settings from './views/Settings';
import {SettingsProvider} from './contexts/SettingsContext';
import {ToastContainer} from 'react-toastify';
import Business from './views/Business';
import InvoiceNew from './views/InvoiceNew';
import InvoiceEdit from './views/InvoiceEdit';
import InvoiceView from './views/InvoiceView';
import {InvoicesProvider} from "./contexts/InvoicesContext";
import {InvoiceProvider} from "./contexts/InvoiceContext";

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
