import { useNavigate } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import apiFetch from '@wordpress/api-fetch';
import { useInvoice } from '../../contexts/InvoiceContext';
import InvoiceStatusDropdown from '../invoice-common/InvoiceStatusDropdown';
import { useInvoices } from '../../contexts/InvoicesContext';

const InvoicePanelEditButton = () => {
	const { invoice } = useInvoice();
	const navigate = useNavigate();
	return (
		<button
			type={ 'button' }
			onClick={ ( event ) => {
				event.preventDefault();
				navigate( `/invoices/edit/${ invoice?.UUID }/` );
			} }
			className="btn btn-wide mt-2"
		>
			{ __( 'Edit Invoice', 'app' ) }
		</button>
	);
};

const InvoicePanelToPDFButton = () => {
	const url = window.location.href.toString().replace( '/view/', '/print/' );
	return (
		<a
			href={ url }
			target={ '_blank' }
			className="btn btn-danger-light btn-wide text-charcoal mt-4"
			rel="noreferrer"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				style={ { fill: '#992424' } }
				fill="#666666"
			>
				<path d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
			</svg>
			<small>
				<strong className="text-danger-dark">
					{ __( 'Print PDF', 'invoice' ) }
				</strong>
			</small>
		</a>
	);
};

const InvoicePanelSidebar = () => {
	const { invoice } = useInvoice();
	const { setFetchNewInvoices } = useInvoices();

	return (
		<aside className="sidebar pl-4 pr-4 pt-0 flex flex-column gap-4">
			<InvoicePanelEditButton />
			<hr className="b-bottom-grey-10-4 mx-4" />
			<div className="flex flex-column">
				<InvoiceStatusDropdown
					onClick={ ( status ) => {
						apiFetch( {
							path: `invoice/v1/invoice/status/${ invoice?.UUID }`,
							method: 'POST',
							data: {
								invoice_status: status,
							},
						} ).then( ( response ) => {
							if ( response.success ) {
								toast.success(
									__( 'Status updated successfully.' ),
									{
										autoClose: 3000,
									}
								);
								setFetchNewInvoices( true );
							} else {
								toast.error(
									response.message ??
										__(
											'There was an error updating your invoice status'
										),
									{
										autoClose: 3000,
									}
								);
							}
						} );
					} }
					status={ invoice?.invoice_status }
				/>
				<div className="flex flex-row gap-3">
					<InvoicePanelToPDFButton />
				</div>
			</div>
		</aside>
	);
};

export default InvoicePanelSidebar;
