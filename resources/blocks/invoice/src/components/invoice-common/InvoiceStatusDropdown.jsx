// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import Enums from '../../../../../scripts/tools/Enums';
import { useInvoice } from '../../contexts/InvoiceContext';

const InvoiceStatusDropdown = ( {
	status,
	onClick = () => {},
	className = '',
	params = {},
} ) => {
	const { showAll, allValue, allLabel } = params;
	const { setInvoice } = useInvoice();
	const [ isOpen, setIsOpen ] = useState( false );
	const [ options ] = useState( Enums.STATUS );

	const handleOnClick = ( newStatus ) => {
		setIsOpen( false );
		setInvoice( ( prevState ) => ( {
			...prevState,
			invoice_status: newStatus,
		} ) );
		onClick( newStatus, Enums.STATUS.LABELS[ newStatus ] );
	};

	return (
		<div className={ `dropdown ${ className }` }>
			<button
				onClick={ () => setIsOpen( ! isOpen ) }
				type="button"
				className={ `btn btn-wide btn-xs ${ Enums.STATUS.COLORS[
					status
				]?.join( ' ' ) }` }
			>
				{ Enums.STATUS.LABELS[ status ] }
				<span className="caret">▼</span>
			</button>
			{ isOpen && (
				<ul className="dropdown-menu">
					{ /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */ }
					{ showAll && (
						<li
							role={ 'button' }
							tabIndex={ 0 }
							onClick={ () => {
								handleOnClick( allValue );
							} }
							onKeyDown={ ( e ) =>
								e.key === 'Enter' && handleOnClick( allValue )
							}
						>
							{ allLabel }
						</li>
					) }
					{ Object.values( options ).map( ( newStatus, index ) => {
						if ( newStatus?.draft ) {
							return '';
						}
						return (
							<li
								role={ 'button' }
								tabIndex={ 0 }
								key={ `status-dropdown-${ index }` }
								onClick={ () => {
									handleOnClick( newStatus );
								} }
								onKeyDown={ ( e ) =>
									e.key === 'Enter' &&
									handleOnClick( newStatus )
								}
							>
								{ /* eslint-disable-next-line @wordpress/i18n-no-variables */ }
								{ __(
									Enums.STATUS.LABELS[ newStatus ],
									'app'
								) }
							</li>
						);
					} ) }
				</ul>
			) }
		</div>
	);
};

export default InvoiceStatusDropdown;
