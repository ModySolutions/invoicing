import React, {createContext, useState, useContext, useEffect} from 'react';
import {createRoot} from "@wordpress/element";
import apiFetch from '@wordpress/api-fetch';
import Links from "../components/Links";
import {Country} from "country-state-city";
import EuropeCountries from "@invoice/tools/EuropeCountries";
import {navigate} from "@modycloud/tools/navigate";

const SettingsContext = createContext(null);

export const SettingsProvider = ({children}) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [europeCountries, setEuropeCountries] = useState([]);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setEuropeCountries(allCountries.filter(country => EuropeCountries.includes(country.name)));
        apiFetch({path: `/wp/v2/pages/${Invoice.invoice_page_id}`})
        .then(page => {
            if (page?.routes) {
                const nav = createRoot(
                    document.getElementById('dynamic-sidebar-nav')
                )
                nav.render(<Links routes={page.routes}/>);
            }

            if (page?.call_to_action) {
                const call_to_action = document.getElementById('dynamic-sidebar-button');
                call_to_action.addEventListener('click', (event) => {
                    event.preventDefault();
                    navigate(event);
                })
            }
        })
        .catch(error => {
            console.log(error)
        });

        apiFetch({path: `/invoice/v1/settings`})
        .then(responseSettings => {
            setSettings(responseSettings)
            setLoading(false)
        });
    }, []);

    useEffect(() => {
        apiFetch({path: '/wp/v2/statuses'})
        .then(response => {
            const invoiceStatuses = Object.fromEntries(
                Object.entries(response).filter(([key]) => key.includes('invoice'))
            ) ?? [];
            setStatuses(invoiceStatuses);
        })
    }, []);

    return (
        <SettingsContext.Provider value={{settings, setSettings, europeCountries, currentPath, setCurrentPath, loading, error, statuses}}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};
