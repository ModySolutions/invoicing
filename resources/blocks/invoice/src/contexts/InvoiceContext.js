import React, {createContext, useState, useContext, useEffect} from 'react';

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({children}) => {
    const [invoice, setInvoice] = useState(null);
    const [invoiceUuid, setInvoiceUuid] = useState(null);

    useEffect(() => {

    }, [invoiceUuid, invoice]);

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
