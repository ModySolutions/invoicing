export default function ( visible ) {
	const header = document.querySelector( '.header' );
	const content = document.querySelector( '.content' );
	const main = document.querySelector( 'main' );
	if ( ! visible ) {
		if ( header ) {
			header.style.display = 'none';
		}

		if ( main ) {
			main.style.padding = 0;
			main.style.marginTop = '-1rem';
		}

		if ( content ) {
			content.style.backgroundColor = 'transparent';
		}
	} else {
		header.style = false;
		main.style = false;
		content.style = false;
	}
}
