// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useInvoice } from '../../contexts/InvoiceContext';
import { useSettings } from '../../contexts/SettingsContext';
import DropFileInput from '../DropFileInput';

const InvoiceFormHeader = () => {
	const { invoice, setInvoice } = useInvoice();
	const { settings, setSettings } = useSettings();
	const [ logo, setLogo ] = useState( settings?.invoice_logo ?? '' );
	const [ invoiceNumber, setInvoiceNumber ] = useState(
		invoice?.invoice_number?.toString()
	);

	useEffect( () => {
		setInvoice( ( prevState ) => ( {
			...prevState,
			invoice_number: invoiceNumber,
		} ) );
	}, [ invoiceNumber, setInvoice ] );

	useEffect( () => {}, [ invoice ] );

	const syncSiteLogo = ( invoiceLogoId ) => {
		apiFetch( {
			path: 'wp/v2/settings',
			method: 'POST',
			data: { site_logo: invoiceLogoId },
		} ).then( () => {} );
	};

	const handleInvoiceNumberChange = ( event ) => {
		const { name, value } = event.target;
		setInvoiceNumber( value );
		setInvoice( ( prevState ) => ( {
			...prevState,
			[ name ]: value,
		} ) );
	};

	return (
		<div className="grid grid-cols-7-3 invoice-header gap-3">
			<div className="left flex flex-column gap-3">
				<DropFileInput
					onFileChange={ ( elem ) => {
						setSettings( ( prevSettings ) => ( {
							...prevSettings,
							invoice_logo: elem?.source_url,
							invoice_logo_id: elem?.id,
						} ) );
						syncSiteLogo( elem?.id ?? 0 );
						setLogo( elem?.source_url );
					} }
					logo={ logo ?? '' }
				/>
			</div>
			<div className="right flex flex-column justify-space-between gap-2 text-right">
				<div className="flex justify-end flex-column items-end">
					<h1 className="invoice-title">
						{ __( 'Invoice', 'app' ) }
					</h1>
					<div className="invoice-number flex items-end gap-2 p-relative">
						<input
							type="text"
							className="text-right"
							name="invoice_number"
							id="invoice_number"
							value={ invoiceNumber }
							onChange={ handleInvoiceNumberChange }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvoiceFormHeader;
