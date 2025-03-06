import {useState} from 'react';
import {__} from '@wordpress/i18n';
import {toast} from "react-toastify";
import apiFetch from "@wordpress/api-fetch";
import Enums from "@invoice/tools/Enums";
import {useInvoice} from "../../contexts/InvoiceContext";
import {useInvoices} from "../../contexts/InvoicesContext";

const InvoiceStatusDropdown = ({status}) => {
    const {invoice, setInvoice} = useInvoice();
    const {setFetchNewInvoices} = useInvoices();
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(Enums.STATUS)

    const handleOnClick = (status) => {
        setIsOpen(false)
        setInvoice(prevState => ({
            ...prevState,
            ['invoice_status']: status
        }));
        const {UUID} = invoice;
        apiFetch({
            path: `invoice/v1/invoice/status/${UUID}`,
            method: 'POST',
            data: {
                'invoice_status' : status,
            },
        })
        .then((response) => {
            if (response.success) {
                toast.success(
                    __('Status updated successfully.'),
                    {
                        autoClose: 3000,
                    }
                )
                setFetchNewInvoices(true);
            } else {
                toast.error(
                    response.message ?? __('There was an error updating your invoice status'),
                    {
                        autoClose: 3000,
                    }
                )
            }
        })
    }

    return (
        <div className='dropdown'>
            <button onClick={() => setIsOpen(!isOpen)} type='button'
                    className={`btn btn-wide btn-xs ${Enums.STATUS.COLORS[status]?.join(' ')}`}>
                {Enums.STATUS.LABELS[status]}
                <span className="caret">▼</span>
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {Object.values(options).map((status, index) => {
                        if(status?.draft) return '';
                        return (
                            <li key={`status-dropdown-${index}`} onClick={() => handleOnClick(status)}>
                                {__(Enums.STATUS.LABELS[status], 'app')}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default InvoiceStatusDropdown;