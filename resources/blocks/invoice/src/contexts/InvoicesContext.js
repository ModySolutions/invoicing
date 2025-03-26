// eslint-disable-next-line import/no-unresolved
import { createContext, useState, useContext, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

const InvoicesContext = createContext( null );

export const InvoicesProvider = ( { children } ) => {
	const [ invoices, setInvoices ] = useState( null );
	const [ currentStatus, setCurrentStatus ] = useState( 'any' );
	const [ fetchNewInvoices, setFetchNewInvoices ] = useState( true );
	const [ currentStatusLabel, setCurrentStatusLabel ] = useState(
		__( 'Any', 'app' )
	);

	useEffect( () => {
		if ( fetchNewInvoices ) {
			apiFetch( {
				path: `/wp/v2/invoice?status=${ currentStatus }&orderby=date&order=desc`,
			} ).then( ( response ) => {
				setInvoices( response );
				setFetchNewInvoices( false );
			} );
		}
	}, [ currentStatus, currentStatusLabel, fetchNewInvoices ] );

	return (
		<InvoicesContext.Provider
			value={ {
				invoices,
				setInvoices,
				currentStatus,
				setCurrentStatus,
				currentStatusLabel,
				setCurrentStatusLabel,
				setFetchNewInvoices,
			} }
		>
			{ children }
		</InvoicesContext.Provider>
	);
};

export const useInvoices = () => {
	return useContext( InvoicesContext );
};
