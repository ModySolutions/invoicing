const CurrencyFormatter = ( { amount, currency = 'EUR' } ) => {
	const formatted = new Intl.NumberFormat( 'en-US', {
		style: 'currency',
		currency,
	} ).format( amount );

	return <>{ formatted }</>;
};

export default CurrencyFormatter;
