import { __ } from '@wordpress/i18n';

const InvoiceItemsTableHeader = () => (
	<thead className={ 'rounded radius-sm' }>
		<tr className={ 'rounded radius-sm' }>
			<th className="w-40-p text-left">{ __( 'Item' ) }</th>
			<th className="w-10-p text-center">{ __( 'Quantity' ) }</th>
			<th className="w-10-p text-center">{ __( 'Price' ) }</th>
			<th className="w-5-p text-center">{ __( 'Taxable' ) }</th>
			<th className="w-10-p text-center">{ __( 'Amount' ) }</th>
			<th className="w-5-p text-center"></th>
		</tr>
	</thead>
);

export default InvoiceItemsTableHeader;
