// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { navigate } from '../../../../../scripts/tools/navigate';

const Links = ( { routes, locationPathname = '/invoices/' } ) => {
	const [ currentPath, setCurrentPath ] = useState( locationPathname );

	if ( ! routes || Object.keys( routes ).length === 0 ) {
		return '';
	}

	const routesEntries = Object.entries( routes ).map(
		( [ key, value ] ) => ( {
			link: key.endsWith( '/' ) ? key : `${ key }/`,
			title: value,
		} )
	);

	return (
		<>
			{ routesEntries.map( ( { link = '', title = '' } ) => {
				return (
					<a
						href={ link }
						key={ link }
						onClick={ ( event ) => {
							const linkHref =
								event.currentTarget.getAttribute( 'href' );
							setCurrentPath( linkHref );
							navigate( event );
						} }
						className={ `link${
							currentPath === link ? ' active' : ''
						}` }
					>
						{ /* eslint-disable-next-line @wordpress/i18n-no-variables */ }
						{ __( title, 'app' ) }
					</a>
				);
			} ) }
		</>
	);
};

export default Links;
