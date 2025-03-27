// eslint-disable-next-line import/no-unresolved
import { useEffect, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import InvoiceListTableRow from './InvoiceListTableRow';
import { useInvoices } from '../../contexts/InvoicesContext';

const InvoiceListTableBody = ( { statuses } ) => {
	const { currentStatusLabel, currentStatus, invoices } = useInvoices();
	const [ noInvoicesText, setNoInvoicesText ] = useState(
		__( 'You have no invoices', 'app' )
	);

	useEffect( () => {
		setNoInvoicesText(
			currentStatus === 'any'
				? __( 'You have no invoices', 'app' )
				: sprintf(
						// eslint-disable-next-line @wordpress/i18n-translator-comments
						__( 'You have no <strong>%s</strong> invoices', 'app' ),
						currentStatusLabel
				  )
		);
	}, [ currentStatus ] );

	return (
		<tbody>
			{ invoices &&
				invoices.map( ( invoice ) => (
					<InvoiceListTableRow
						statuses={ statuses }
						key={ invoice.UUID }
						{ ...invoice }
					/>
				) ) }
			{ invoices?.length === 0 && (
				<>
					<tr>
						<td colSpan={ 8 }>
							<em
								dangerouslySetInnerHTML={ {
									__html: noInvoicesText,
								} }
							/>
						</td>
					</tr>
				</>
			) }
		</tbody>
	);
};

export default InvoiceListTableBody;
