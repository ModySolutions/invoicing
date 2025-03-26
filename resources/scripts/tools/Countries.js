import { Country } from 'country-state-city';
import EuropeCountries from '../tools/EuropeCountries';

const allCountries = Country.getAllCountries();
const countries = allCountries.filter( ( country ) =>
	EuropeCountries.includes( country.name )
);

export const findCountryByIsoCode = ( isoCode ) => {
	const country = countries.find( ( c ) => c.isoCode === isoCode );
	return country ? country : {};
};
