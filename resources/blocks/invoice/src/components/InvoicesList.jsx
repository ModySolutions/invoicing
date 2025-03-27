// eslint-disable-next-line import/no-unresolved
import { useEffect, useState } from 'react';
import { sprintf, __ } from '@wordpress/i18n';
import { useInvoices } from '../contexts/InvoicesContext';
import InvoiceListTableHeader from './invoice-list/InvoiceListTableHeader';
import InvoiceListTableBody from './invoice-list/InvoiceListTableBody';

const InvoicesList = ( { statuses } ) => {
	const { currentStatusLabel, currentStatus } = useInvoices();
	const [ noInvoicesText, setNoInvoicesText ] = useState(
		__( 'You have no invoices', 'app' )
	);

	useEffect( () => {
		// eslint-disable-next-line @wordpress/i18n-translator-comments
		const noInvoicesInStatus = __(
			'You have no <strong>%s</strong> invoices',
			'app'
		);
		setNoInvoicesText(
			currentStatus === 'any'
				? noInvoicesText
				: sprintf( noInvoicesInStatus, currentStatusLabel )
		);
	}, [ currentStatus, currentStatusLabel, noInvoicesText ] );

	return (
		<div className="invoices-table-container">
			<table className="invoices-table mt-2">
				<InvoiceListTableHeader />
				<InvoiceListTableBody statuses={ statuses } />
			</table>
		</div>
	);
};

export default InvoicesList;
