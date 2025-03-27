// eslint-disable-next-line import/no-unresolved
import { useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { useNavigate } from 'react-router-dom';
import Enums from '../../../../scripts/tools/Enums';
import setNextInvoiceNumber from '../../../../scripts/tools/setNextInvoiceNumber';
import { useInvoice } from '../contexts/InvoiceContext';
import { useSettings } from '../contexts/SettingsContext';
import { useInvoices } from '../contexts/InvoicesContext';

const InvoiceNew = () => {
	const { settings, setSettings } = useSettings();
	const navigate = useNavigate();
	const { setInvoice } = useInvoice();
	const { setFetchNewInvoices } = useInvoices();

	useEffect( () => {
		apiFetch( {
			path: '/invoice/v1/invoice/new-invoice',
			method: 'POST',
			data: {
				post_status: Enums.STATUS.DRAFT,
				acf: {
					invoice_number: setNextInvoiceNumber(
						settings?.invoice_last_number
					),
					invoice_currency: 'EUR',
					invoice_issue_date: new Date(),
					invoice_due_date: new Date(),
					invoice_items: [ Enums.DEFAULT_ITEMS ],
					invoice_notes: '',
					invoice_terms: '',
					invoice_tax_amount: Enums.TAXES.IVA,
					invoice_discount_amount: Enums.TAXES.IRPF,
				},
			},
		} ).then( ( response ) => {
			setInvoice( response );
			setFetchNewInvoices( true );
			setSettings( ( prevSettings ) => ( {
				...prevSettings,
				invoice_last_number: response.invoice_last_number,
			} ) );
			navigate( `/invoices/edit/${ response.UUID }` );
		} );
	} );

	return '';
};

export default InvoiceNew;
