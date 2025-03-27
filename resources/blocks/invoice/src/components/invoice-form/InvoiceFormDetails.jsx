// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { __ } from '@wordpress/i18n';
import { findCountryByIsoCode } from '../../../../../scripts/tools/Countries';
import capitalize from '../../../../../scripts/tools/capitalize';
import { useInvoice } from '../../contexts/InvoiceContext';
import { useSettings } from '../../contexts/SettingsContext';
import Enums from '../../../../../scripts/tools/Enums';

const InvoiceFormDetails = () => {
	const { invoice, setInvoice } = useInvoice();
	const { settings } = useSettings();
	const [ issuedDate, setIssuedDate ] = useState(
		invoice?.invoice_issue_date ?? ''
	);
	const [ invoiceSender, setInvoiceSender ] = useState(
		invoice?.invoice_sender ??
			[
				settings?.invoice_business_fni.toString().toUpperCase(),
				capitalize( settings?.invoice_business_name.toString() ),
				capitalize(
					[
						settings?.invoice_business_city.toString(),
						findCountryByIsoCode(
							settings?.invoice_business_country
						)?.name,
					].join( ', ' )
				),
			].join( '\n' )
	);
	const [ dueDate, setDueDate ] = useState( invoice?.invoice_due_date ?? '' );
	const [ dateFormat ] = useState(
		Enums.DATE.FORMATS?.[ settings?.invoice_date_format ] ?? 'MMM d, Y'
	);

	useEffect( () => {
		setInvoice( ( prevState ) => ( {
			...prevState,
			invoice_sender: invoiceSender,
			invoice_sender_address: invoiceSender,
			invoice_issue_date: issuedDate,
			invoice_due_date: dueDate,
		} ) );
	}, [ dueDate, invoiceSender, issuedDate, setInvoice, settings ] );

	useEffect( () => {
		setInvoice( ( prevState ) => ( {
			...prevState,
			invoice_issue_date: issuedDate,
			invoice_due_date: dueDate,
		} ) );
	}, [ issuedDate, dueDate, setInvoice ] );

	const handleTextChange = ( event ) => {
		const { name, value } = event.target;
		setInvoice( ( prevState ) => ( {
			...prevState,
			[ name ]: value,
		} ) );

		if ( name === 'invoice_sender' ) {
			setInvoiceSender( value );
			setInvoice( ( prevState ) => ( {
				...prevState,
				invoice_sender_address: value,
			} ) );
		}

		if ( name === 'invoice_client' ) {
			setInvoice( ( prevState ) => ( {
				...prevState,
				invoice_client_address: value,
			} ) );
		}
	};

	return (
		<div className="grid grid-cols-7-3">
			<div className="left">
				<div className="sender w-100-p mt-4">
					<label htmlFor="invoice_sender">
						{ __( 'Invoice to:', 'app' ) }
					</label>
					<textarea
						required
						className={ 'input-lg no-resize' }
						placeholder={ __( 'Who is this from?', 'app' ) }
						name="invoice_sender"
						id="invoice_sender"
						value={ invoiceSender }
						onChange={ handleTextChange }
						cols="30"
						rows="3"
					></textarea>
				</div>
				<div className="client w-100-p mt-3">
					<label htmlFor="invoice_client">
						{ __( 'Bill to:', 'app' ) }
					</label>
					<textarea
						required
						className={ 'input-lg no-resize' }
						placeholder={ __( 'Who is this to?', 'app' ) }
						name="invoice_client"
						onChange={ handleTextChange }
						value={ invoice?.invoice_client ?? '' }
						id="invoice_client"
						cols="30"
						rows="3"
					></textarea>
				</div>
			</div>
			<div className="right flex flex-column justify-end mt-3">
				<div className="invoice-dates flex flex-column gap-3">
					<div className="invoice-date grid grid-cols-4-6 items-center gap-2">
						<label htmlFor="invoice-date" className="text-right">
							{ __( 'Issued date', 'app' ) }
						</label>
						<DatePicker
							required={ true }
							selected={ issuedDate }
							dateFormat={ dateFormat }
							onChange={ ( date ) => setIssuedDate( date ) }
						/>
					</div>
					<div className="invoice-due-date grid grid-cols-4-6 items-center gap-2">
						<label
							htmlFor="invoice-due-date"
							className="text-right"
						>
							{ __( 'Due date', 'app' ) }
						</label>
						<DatePicker
							rqeuired={ true }
							selected={ dueDate }
							dateFormat={ dateFormat }
							onChange={ ( date ) => setDueDate( date ) }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvoiceFormDetails;
