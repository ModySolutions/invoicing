// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Enums from '../../../../scripts/tools/Enums';
import setInvoiceHeader from '../../../../scripts/tools/setInvoiceHeader';
import HandleTaxesAndDiscounts from '../../../../scripts/tools/HandleTaxesAndDiscounts';
import { useInvoices } from '../contexts/InvoicesContext';
import { useSettings } from '../contexts/SettingsContext';
import { useInvoice } from '../contexts/InvoiceContext';
import InvoiceFormHeader from '../components/invoice-form/InvoiceFormHeader';
import InvoiceFormDetails from '../components/invoice-form/InvoiceFormDetails';
import InvoiceFormItemsTable from '../components/invoice-form/InvoiceFormItemsTable';
import InvoiceFormNotesAndTerms from '../components/invoice-form/InvoiceFormNotesAndTerms';
import InvoiceFormSidebar from '../components/invoice-form/InvoiceFormSidebar';
import InvoiceTotals from '../components/invoice-common/InvoiceTotals';

const Container = () => {
	return (
		<div className="grid grid-cols-7-3 form-container p-relative">
			<InvoiceFormContainer />
			<InvoiceFormSidebar />
		</div>
	);
};

const InvoiceFormContainer = () => {
	return (
		<div className="form-container p-4 radius-lg rounded bg-white">
			<InvoiceFormHeader />
			<InvoiceFormDetails />
			<div className="mt-4 invoices-table-container">
				<InvoiceFormItemsTable />
				<div className="grid grid-cols-6-4">
					<InvoiceFormNotesAndTerms />
					<InvoiceTotals />
				</div>
			</div>
		</div>
	);
};

const InvoiceForm = () => {
	const { setSettings } = useSettings();
	const { uuid } = useParams();
	const { invoice, setInvoice } = useInvoice();
	const [ ID ] = useState( invoice?.UUID === uuid ? invoice?.ID : undefined );
	const [ UUID, setUUID ] = useState(
		invoice?.UUID === uuid ? invoice?.UUID : undefined
	);
	const { setFetchNewInvoices } = useInvoices();
	const navigate = useNavigate();

	useEffect( () => {
		setInvoiceHeader( false );
		setInvoice( ( prevState ) => ( {
			...prevState,
			invoice_tax_amount: invoice?.invoice_tax_amount ?? Enums.TAXES.IVA,
			invoice_discount_amount:
				invoice?.invoice_discount_amount ?? Enums.DISCOUNTS.IRPF,
		} ) );

		return () => {
			setInvoiceHeader( true );
		};
	}, [
		invoice?.invoice_discount_amount,
		invoice?.invoice_tax_amount,
		setInvoice,
	] );

	useEffect( () => {}, [ invoice ] );

	const handleSubmit = ( event ) => {
		event.preventDefault();

		let url = 'invoice/v1/invoice';
		if ( ID && UUID ) {
			url += `/${ UUID }`;
		}
		apiFetch( {
			path: url,
			method: 'POST',
			data: {
				acf: { ...invoice, ...HandleTaxesAndDiscounts( invoice ) },
			},
		} ).then( ( response ) => {
			if ( response.success ) {
				toast.success( __( 'Invoice saved successfully.' ), {
					autoClose: 3000,
				} );
				if ( ! ID && ! UUID ) {
					setUUID( response.UUID );
				}
				setFetchNewInvoices( true );
				setSettings( ( prevSettings ) => ( {
					...prevSettings,
					invoice_last_number: response.invoice_last_number,
				} ) );
				navigate( `/invoices/view/${ UUID }` );
			} else {
				toast.error(
					response.message ??
						__( 'There was an error saving your invoice' ),
					{
						autoClose: 3000,
					}
				);
			}
		} );
	};

	return (
		<form
			onSubmit={ handleSubmit }
			className={ 'invoice-form mt-3 mb-5 p-relative' }
			encType="multipart/form-data"
		>
			<Container />
		</form>
	);
};

export default InvoiceForm;
