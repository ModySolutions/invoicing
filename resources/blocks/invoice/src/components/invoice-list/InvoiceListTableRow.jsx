// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../../../scripts/tools/DateFormats';
import { useSettings } from '../../contexts/SettingsContext';
import CurrencyFormatter from '../invoice-common/CurrencyFormatter';
import InvoiceStatusBadge from '../invoice-common/InvoiceStatusBadge';

const InvoiceListTableRow = ( {
	generated_invoice_number: generatedInvoiceNumber,
	invoice_edit_url: invoiceEditUrl,
	invoice_view_url: invoiceViewUrl,
	invoice_issue_date: invoiceIssueDate,
	invoice_due_date: invoiceDueDate,
	invoice_client: invoiceClient,
	invoice_total: invoiceTotal,
	invoice_status: invoiceStatus,
} ) => {
	const navigate = useNavigate();
	const { settings } = useSettings();
	const [ showEdit ] = useState( true );
	const [ showView ] = useState( true );
	const [ clientName, setClientName ] = useState( invoiceClient );
	const [ dateFormat ] = useState( settings?.invoice_date_format );

	useEffect( () => {
		const fullName = invoiceClient
			? invoiceClient.split( '\n' )
			: [ __( 'unknown', 'app' ) ];
		if ( fullName[ 0 ] ) {
			setClientName( fullName[ 0 ] );
		}
	}, [ setClientName ] );

	const editButton = () => {
		return (
			<a
				href={ invoiceEditUrl }
				className="text-charcoal"
				style={ {
					padding: '.3rem .6rem',
					borderRadius: '.4rem',
				} }
				onClick={ ( event ) => {
					event.preventDefault();
					navigate( invoiceEditUrl );
				} }
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="16px"
					viewBox="0 -960 960 960"
					width="16px"
					fill="#333333"
				>
					<path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
				</svg>
			</a>
		);
	};

	const viewButton = () => {
		return (
			<a
				href={ invoiceViewUrl }
				className="text-info"
				style={ {
					padding: '.3rem .6rem',
					borderRadius: '.4rem',
				} }
				onClick={ ( event ) => {
					event.preventDefault();
					navigate( invoiceViewUrl );
				} }
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="16px"
					viewBox="0 -960 960 960"
					width="16px"
					fill="#3178c6"
				>
					<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
				</svg>
			</a>
		);
	};

	return (
		<tr key={ `invoice-row-${ generatedInvoiceNumber }` }>
			<td data-title={ __( 'Number', 'app' ) }>
				<strong>{ generatedInvoiceNumber ?? '' }</strong>
			</td>
			<td data-title={ __( 'Client', 'app' ) }>
				<strong>{ clientName }</strong>
			</td>
			<td data-title={ __( 'Issued', 'app' ) } className="text-center">
				{ formatDate( dateFormat, new Date( invoiceIssueDate ) ) }
			</td>
			<td data-title={ __( 'Due', 'app' ) } className="text-center">
				{ formatDate( dateFormat, new Date( invoiceDueDate ) ) }
			</td>
			<td data-title={ __( 'Amount', 'app' ) } className="text-right">
				<strong>
					<CurrencyFormatter currency="EUR" amount={ invoiceTotal } />
				</strong>
			</td>
			<td data-title={ __( 'Status', 'app' ) } className="text-center">
				<InvoiceStatusBadge status={ invoiceStatus } />
			</td>
			<td className="text-center" data-title={ __( 'Actions', 'app' ) }>
				<div className="text-center flex justify-center gap-1">
					{ showView && viewButton() }
					{ showEdit && editButton() }
				</div>
			</td>
		</tr>
	);
};

export default InvoiceListTableRow;
