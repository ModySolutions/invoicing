// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import nl2br from '../../../../../scripts/tools/nl2br';
import { formatDate } from '../../../../../scripts/tools/DateFormats';
import { useInvoice } from '../../contexts/InvoiceContext';
import { useSettings } from '../../contexts/SettingsContext';

const InvoicePanelDetails = ( { pub } ) => {
	const { invoice } = useInvoice();
	const { settings } = useSettings();
	const [ issuedDate ] = useState(
		invoice?.invoice_issue_date ?? new Date()
	);
	const [ dueDate ] = useState( invoice?.invoice_due_date ?? new Date() );
	const [ dateFormat ] = useState(
		settings?.invoice_date_format ?? 'MMM d, Y'
	);

	useEffect( () => {}, [ invoice, settings ] );

	return (
		<div className="grid grid-cols-7-3">
			<div className="left">
				<div className="sender w-100-p mt-4 d-block">
					<label htmlFor="client" className={ 'd-block' }>
						{ __( 'Invoice From:', 'app' ) }
					</label>
					<span
						dangerouslySetInnerHTML={ {
							__html: nl2br( invoice?.invoice_sender ?? '' ),
						} }
					/>
				</div>
				<div className="client w-100-p mt-3">
					{ ! pub && (
						<>
							<label htmlFor="client" className={ 'd-block' }>
								{ __( 'Invoice to:', 'app' ) }
							</label>
							<span
								className={ 'capitalize' }
								dangerouslySetInnerHTML={ {
									__html: nl2br(
										invoice?.invoice_client ?? ''
									),
								} }
							/>
						</>
					) }
				</div>
			</div>
			<div className="right flex flex-column justify-end mt-3">
				<div className="invoice-dates flex flex-column gap-1">
					<label htmlFor="invoice-date" className="text-right">
						{ __( 'Issued on', 'app' ) }
					</label>
					<span className={ 'text-right' }>
						{ formatDate( dateFormat, new Date( issuedDate ) ) }
					</span>
					<label
						htmlFor="invoice-due-date"
						className="text-right mt-3"
					>
						{ __( 'Due on', 'app' ) }
					</label>
					<span className={ 'text-right' }>
						{ formatDate( dateFormat, new Date( dueDate ) ) }
					</span>
				</div>
			</div>
		</div>
	);
};

export default InvoicePanelDetails;
