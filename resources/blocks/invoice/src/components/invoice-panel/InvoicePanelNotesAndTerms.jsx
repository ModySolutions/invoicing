import {__} from '@wordpress/i18n';
import {useInvoice} from "../../contexts/InvoiceContext";

const InvoicePanelNotesAndTerms = ({pub}) => {
    const {invoice} = useInvoice();
    return (
        <div className='left'>
            <div className='notes-container container'>
                <div className='form-group col-8'>
                    {!pub && invoice?.invoice_notes &&
                        <label htmlFor='notes'>
                            {__('Notes', 'app')}
                        </label>
                    }
                    {!pub && <div dangerouslySetInnerHTML={{__html: invoice?.invoice_notes}}></div>}
                </div>
                <div className='col-4'></div>
                <div className='form-group col-8'>
                    {!pub && invoice?.invoice_terms &&
                        <label htmlFor='terms'>
                            {__('Terms', 'app')}
                        </label>
                    }
                    {!pub && <div dangerouslySetInnerHTML={{__html: invoice?.invoice_terms}}></div>}
                </div>
            </div>
        </div>
    )
}

export default InvoicePanelNotesAndTerms;