import React, {createContext, useState, useContext, useEffect} from 'react';
import apiFetch from '@wordpress/api-fetch';

const InvoicesContext = createContext(null);

export const InvoicesProvider = ({children}) => {
    const [invoices, setInvoices] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('any');

    useEffect(() => {
        apiFetch({path: `/wp/v2/invoice?status=${currentStatus}`})
            .then(response => setInvoices(response))
    }, [setInvoices, currentStatus]);

    return (
        <InvoicesContext.Provider value={{
            invoices,
            setInvoices,
            currentStatus,
            setCurrentStatus
        }}>
            {children}
        </InvoicesContext.Provider>
    );
};

export const useInvoices = () => {
    return useContext(InvoicesContext);
};
