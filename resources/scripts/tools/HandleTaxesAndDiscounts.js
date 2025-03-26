const HandleTaxesAndDiscounts = ( invoice ) => {
	let subtotal = 0;
	let taxes = 0;
	let discounts = 0;

	invoice?.invoice_items?.forEach( ( item ) => {
		const itemAmount = parseFloat( item.item_total ) ?? 0;
		subtotal += itemAmount;
		if ( item.item_taxable && invoice?.invoice_tax_amount ) {
			taxes += ( itemAmount * invoice?.invoice_tax_amount ) / 100 ?? 0;
		}
	} );

	if (
		invoice?.invoice_discount_amount &&
		invoice?.invoice_discount_amount > 0
	) {
		discounts = ( subtotal * invoice?.invoice_discount_amount ) / 100 ?? 0;
	}

	return {
		invoice_subtotal: parseFloat( subtotal ?? 0 ),
		invoice_taxes_total: parseFloat( taxes ?? 0 ),
		invoice_tax_subtotal: parseFloat( taxes ?? 0 ),
		invoice_discount_total: discounts ?? 0,
		invoice_discount_subtotal: discounts ?? 0,
		invoice_total: subtotal - discounts + taxes ?? 0,
	};
};

export default HandleTaxesAndDiscounts;
