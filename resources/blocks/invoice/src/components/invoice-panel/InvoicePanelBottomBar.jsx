// eslint-disable-next-line import/no-unresolved
import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import generatePDF, { Resolution } from 'react-to-pdf';
import { useInvoice } from '../../contexts/InvoiceContext';

const InvoicePanelToPDFButton = () => {
	const { invoice } = useInvoice();
	const printPDF = async ( event ) => {
		event.preventDefault();
		const element = () =>
			document.getElementById( `print-invoice-${ invoice?.UUID }-print` );
		const { pdf } = await generatePDF( element, {
			resolution: Resolution.HIGH,
		} ).then( () => {} );
		const blob = new Blob( invoice?.UUID, pdf, {
			type: 'application/pdf',
		} );
		window.location.href = URL.createObjectURL( blob );
	};
	return (
		<button
			type={ 'button' }
			onClick={ printPDF }
			className="btn btn-danger-light btn-wide text-charcoal mt-4 print-pdf"
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
		</button>
	);
};

const InvoicePanelBottomBar = () => {
	useEffect( () => {
		setTimeout( () => {
			document.querySelector( '.print-pdf' )?.click();
		}, 500 );
	}, [] );
	return (
		<aside className="w-100-p">
			<div style={ { margin: '0 auto', maxWidth: 300 } }>
				<InvoicePanelToPDFButton />
			</div>
		</aside>
	);
};

export default InvoicePanelBottomBar;
