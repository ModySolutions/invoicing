import {useInvoice} from "../../contexts/InvoiceContext";
import {__} from "@wordpress/i18n";

const InvoiceFormNotesAndTerms = () => {
    const {invoice, setInvoice} = useInvoice();

    const handleTextChange = (event) => {
        const {name, value} = event.target;
        setInvoice(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }
    return (
        <div className='left'>
            <div className='notes-container container'>
                <div className='form-group col-10'>
                    <label htmlFor='notes'>
                        {__('Notes', 'app')}
                    </label>
                    <textarea
                        className={'input-lg no-resize'}
                        placeholder={__(
                            'Notes - any relevant information not already covered',
                            'app'
                        )}
                        onChange={handleTextChange}
                        name='invoice_notes'
                        value={invoice?.invoice_notes}
                        id='notes'
                        cols='30'
                        rows='3'></textarea>
                </div>
                <div className='form-group col-10'>
                    <label htmlFor='terms'>
                        {__('Terms', 'app')}
                    </label>
                    <textarea
                        className={'input-lg no-resize'}
                        placeholder={__(
                            'Terms and conditions - late fees, payment methods, delivery schedule',
                            'app'
                        )}
                        onChange={handleTextChange}
                        name='invoice_terms'
                        value={invoice?.invoice_terms}
                        id='terms'
                        cols='30'
                        rows='3'></textarea>
                </div>
            </div>
        </div>
    )
}

export default InvoiceFormNotesAndTerms;