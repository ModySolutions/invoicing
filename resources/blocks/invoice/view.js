import '../../scss/invoice.scss';
// eslint-disable-next-line import/no-unresolved
import { useEffect } from 'react';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Invoices from './src/views/Invoices';
import Settings from './src/views/Settings';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ToastContainer } from 'react-toastify';
import Business from './src/views/Business';
import InvoiceNew from './src/views/InvoiceNew';
import { InvoicesProvider } from './src/contexts/InvoicesContext';
import { InvoiceProvider } from './src/contexts/InvoiceContext';
import InvoiceViewOrEdit from './src/views/InvoiceViewOrEdit';

const InvoiceContainer = () => {
	useEffect( () => {
		const login = document.querySelector( 'body.logged-in' );
		const allowed = [ 'invoices/public' ];
		const currentLocation = location.href;
		const isAllowed = allowed.some( ( route ) =>
			currentLocation.includes( route )
		);
		if ( ! login && ! isAllowed ) {
			location.href = '/auth/sign-out';
		}
	}, [] );
	return (
		<div>
			<SettingsProvider>
				<InvoicesProvider>
					<InvoiceProvider>
						<BrowserRouter>
							<Routes>
								<Route
									path="/invoices"
									element={ <Invoices /> }
								/>
								<Route
									path="/invoices/new"
									element={ <InvoiceNew /> }
								/>
								<Route
									path="/invoices/edit/:uuid"
									element={
										<InvoiceViewOrEdit action="edit" />
									}
								/>
								<Route
									path="/invoices/view/:uuid"
									element={
										<InvoiceViewOrEdit action="view" />
									}
								/>
								<Route
									path="/invoices/print/:uuid"
									element={
										<InvoiceViewOrEdit
											action="view"
											print={ true }
										/>
									}
								/>
								<Route
									path="/invoices/public/:uuid"
									element={
										<InvoiceViewOrEdit
											action="view"
											pub={ true }
										/>
									}
								/>
								<Route
									path="/invoices/business"
									element={ <Business /> }
								/>
								<Route
									path="/invoices/settings"
									element={ <Settings /> }
								/>
							</Routes>
						</BrowserRouter>
					</InvoiceProvider>
					<ToastContainer draggable position="bottom-right" />
				</InvoicesProvider>
			</SettingsProvider>
		</div>
	);
};

const AppInvoiceContainer = document.getElementById( 'app-invoice-container' );
if ( AppInvoiceContainer ) {
	domReady( () => {
		const root = createRoot( AppInvoiceContainer );

		root.render( <InvoiceContainer /> );
	} );
}
