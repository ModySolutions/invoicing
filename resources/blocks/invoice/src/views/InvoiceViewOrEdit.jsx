// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useParams } from 'react-router-dom';
import InvoicePanel from '../components/InvoicePanel';
import { useInvoice } from '../contexts/InvoiceContext';
import InvoiceForm from '../components/InvoiceForm';

const InvoiceViewOrEdit = ( { action, print, pub } ) => {
	const { uuid } = useParams();
	const { setInvoice, invoiceUuid, setInvoiceUuid } = useInvoice();
	const [ invoiceAction ] = useState(
		location.href.includes( 'public' ) ? 'public' : ''
	);
	const [ loading, setLoading ] = useState( true );

	useEffect( () => {
		setInvoiceUuid( uuid );
		if ( uuid !== invoiceUuid ) {
			const url =
				invoiceAction === 'public'
					? `invoice/v1/invoice/public/${ uuid }`
					: `invoice/v1/invoice/${ uuid }`;
			apiFetch( { path: url } )
				.then( ( response ) => {
					setInvoice( response );
					setInvoiceUuid( response?.UUID );
					setLoading( false );
				} )
				.catch( () => {
					setLoading( false );
				} );
		}

		return () => {
			setInvoiceUuid( null );
		};
	} );

	return (
		<>
			{ /* eslint-disable-next-line no-nested-ternary */ }
			{ ! loading && invoiceUuid ? (
				action === 'view' ? (
					<InvoicePanel print={ print } pub={ pub } />
				) : (
					<InvoiceForm />
				)
			) : (
				<em>{ __( 'Loading', 'app' ) }</em>
			) }
		</>
	);
};

export default InvoiceViewOrEdit;
