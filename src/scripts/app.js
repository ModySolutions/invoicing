import '../scss/app.scss';
import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot, useEffect} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Invoices from './app/Invoices';
import Settings from "./app/Settings";
import {InvoiceProvider} from "./app/Context";
import {ToastContainer} from "react-toastify";

const InvoiceContainer = () => {
    return (
        <div>
            <InvoiceProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/invoices" element={<Invoices/>}/>
                        <Route path="/invoices/settings" element={<Settings/>}/>
                    </Routes>
                </BrowserRouter>
                <ToastContainer draggable />
            </InvoiceProvider>
        </div>
    )
}

const AppInvoiceContainer = document.getElementById('app-invoice-container');
if(AppInvoiceContainer) {
    domReady(() => {
        const root = createRoot(
            AppInvoiceContainer
        );

        root.render(<InvoiceContainer/>);
    });
}
