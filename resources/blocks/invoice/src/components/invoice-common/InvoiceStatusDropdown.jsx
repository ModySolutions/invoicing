import {useState} from 'react';
import {__} from '@wordpress/i18n';
import Enums from "@invoice/tools/Enums";
import {useInvoice} from "../../contexts/InvoiceContext";
import {useInvoices} from "../../contexts/InvoicesContext";

const InvoiceStatusDropdown = ({
                                   status,
                                   onClick = (status) => {
                                   },
                                   className = '',
                                   params = {}
                               }) => {
    const {showAll, allValue, allLabel} = params;
    const {invoice, setInvoice} = useInvoice();
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(Enums.STATUS)

    const handleOnClick = (status) => {
        setIsOpen(false)
        setInvoice(prevState => ({
            ...prevState,
            ['invoice_status']: status
        }));
        onClick(status, Enums.STATUS.LABELS[status]);
    }

    return (
        <div className={`dropdown ${className}`}>
            <button onClick={() => setIsOpen(!isOpen)} type='button'
                    className={`btn btn-wide btn-xs ${Enums.STATUS.COLORS[status]?.join(' ')}`}>
                {Enums.STATUS.LABELS[status]}
                <span className='caret'>▼</span>
            </button>
            {isOpen && (
                <ul className='dropdown-menu'>
                    {showAll && <li onClick={() => {
                        handleOnClick(allValue)
                    }}>
                        {allLabel}
                    </li>}
                    {Object.values(options).map((status, index) => {
                        if (status?.draft) return '';
                        return (
                            <li key={`status-dropdown-${index}`} onClick={() => {
                                handleOnClick(status)
                            }}>
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