import { __ } from '@wordpress/i18n';
import { useInvoices } from '../../contexts/InvoicesContext';
import Enums from '../../../../../scripts/tools/Enums';

const StatusButton = ( {
	textClassName,
	bgClassName,
	status,
	label,
	onClick,
	active,
} ) => {
	return (
		<button
			type="button"
			onClick={ onClick }
			className={ `btn btn-sm ${ textClassName } ${ bgClassName } btn-${ status } btn-status-${ status }
            ${ active ? ' active' : '' }` }
		>
			{ label }
		</button>
	);
};

const InvoiceListStatusButtons = ( { statuses } ) => {
	const {
		currentStatus,
		setCurrentStatus,
		setCurrentStatusLabel,
		setFetchNewInvoices,
	} = useInvoices();

	const handleSetStatus = ( status, label ) => {
		setCurrentStatus( status );
		setCurrentStatusLabel( label );
		setFetchNewInvoices( true );
	};

	return (
		<div className={ 'flex gap-1 justify-start' }>
			<StatusButton
				textClassName="text-charcoal"
				bgClassName="btn-grey-80"
				onClick={ () => handleSetStatus( 'any', 'Any' ) }
				active={ currentStatus === 'any' }
				status="any"
				label={ __( 'Any' ) }
			/>

			{ statuses &&
				Object.entries( statuses ).map( ( [ status ] ) => {
					const [ textClassName, bgClassName ] =
						Enums.STATUS.COLORS[ status ];
					return (
						<StatusButton
							textClassName={ textClassName }
							bgClassName={ bgClassName }
							status={ status }
							onClick={ () =>
								handleSetStatus(
									status,
									Enums.STATUS.LABELS[ status ]
								)
							}
							active={ currentStatus === status }
							label={ Enums.STATUS.LABELS[ status ] }
							key={ `invoice-status-filter-btn-${ status }` }
						/>
					);
				} ) }
		</div>
	);
};
export default InvoiceListStatusButtons;
