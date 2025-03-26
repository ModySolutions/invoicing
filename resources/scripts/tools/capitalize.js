export default ( text ) =>
	text.toLowerCase().replace( /\b\w/g, ( char ) => char.toUpperCase() );
