import React, {createContext, useState, useContext, useEffect} from 'react';
import apiFetch from '@wordpress/api-fetch';
import {__} from '@wordpress/i18n';

const InvoicesContext = createContext(null);

export const InvoicesProvider = ({children}) => {
    const [invoices, setInvoices] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('any');
    const [currentStatusLabel, setCurrentStatusLabel] = useState(__('Any', 'app'));

    useEffect(() => {
        apiFetch({path: `/wp/v2/invoice?status=${currentStatus}`})
            .then(response => setInvoices(response))
    }, [currentStatus, currentStatusLabel]);

    return (
        <InvoicesContext.Provider value={{
            invoices,
            setInvoices,
            currentStatus,
            setCurrentStatus,
            currentStatusLabel,
            setCurrentStatusLabel
        }}>
            {children}
        </InvoicesContext.Provider>
    );
};

export const useInvoices = () => {
    return useContext(InvoicesContext);
};
