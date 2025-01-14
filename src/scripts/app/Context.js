import React, { createContext, useState, useContext, useEffect } from 'react';
import {createRoot} from "@wordpress/element";
import apiFetch from '@wordpress/api-fetch';
import Links from "./Links";

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch({ path: `/wp/v2/pages/${Invoice.invoice_page_id}` })
            .then(page => {
                if(page.routes) {
                    const nav = createRoot(
                        document.getElementById('dynamic-sidebar-nav')
                    )
                    nav.render(<Links routes={page.routes}/>);
                }
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    return (
        <InvoiceContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoice = () => {
    return useContext(InvoiceContext);
};
