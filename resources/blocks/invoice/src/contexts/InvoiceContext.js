import React, {createContext, useState, useContext, useEffect} from 'react';
import apiFetch from "@wordpress/api-fetch";

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({children}) => {
    const [invoice, setInvoice] = useState(null);
    const [invoiceUuid, setInvoiceUuid] = useState(null);

    useEffect(() => {
    }, [invoice]);

    return (
        <InvoiceContext.Provider value={{
            invoice,
            invoiceUuid,
            setInvoice,
            setInvoiceUuid
        }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoice = () => {
    return useContext(InvoiceContext);
};
