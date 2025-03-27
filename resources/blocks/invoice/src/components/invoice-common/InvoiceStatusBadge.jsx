import Enums from '../../../../../scripts/tools/Enums';

const InvoiceStatusBadge = ( { status } ) => {
	return (
		<span
			className={ `btn btn-xs ${ Enums.STATUS.COLORS[ status ]?.join(
				' '
			) }` }
		>
			{ Enums.STATUS.LABELS[ status ] }
		</span>
	);
};

export default InvoiceStatusBadge;
