import {useNavigate} from "react-router-dom";
import {__} from "@wordpress/i18n";
import {useInvoice} from "../../contexts/InvoiceContext";
import InvoiceStatusDropdown from "../invoice-common/InvoiceStatusDropdown";
import {toast} from "react-toastify";
import {useInvoices} from "../../contexts/InvoicesContext";

const InvoicePanelEditButton = () => {
    const {invoice} = useInvoice();
    const navigate = useNavigate();
    return (
        <a href={`#`}
           onClick={(event) => {
               event.preventDefault();
               navigate(`/invoices/edit/${invoice?.UUID}/`)
           }} className='btn btn-wide mt-2'>
            {__('Edit Invoice', 'app')}
        </a>
    )
}

const InvoicePanelPrintButton = () => {
    const handlePrint = (event) => {
        event.preventDefault();
        window.print();
    }
    return (
        <a href='#'
           onClick={handlePrint}
           className='btn btn-white text-charcoal mt-4'>
            <svg xmlns='http://www.w3.org/2000/svg'
                 height='24px'
                 viewBox='0 -960 960 960'
                 width='24px'
                 style={{fill: '#666666'}}
                 fill='#666666'>
                <path d='M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z'/>
            </svg>
        </a>
    )
}

const InvoicePanelToPDFButton = () => {
    return (
        <a href='#'
           onClick={(event) => {
               event.preventDefault();
           }}
           className='btn btn-danger-light text-charcoal mt-4'>
            <svg xmlns='http://www.w3.org/2000/svg'
                 height='24px'
                 viewBox='0 -960 960 960'
                 width='24px'
                 style={{fill: '#992424'}}
                 fill='#666666'>
                <path d='M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z'/>
            </svg>
        </a>
    )
}

const InvoicePanelSidebar = () => {
    const {invoice} = useInvoice();
    const {setFetchNewInvoices} = useInvoices();

    return (
        <aside className='sidebar pl-4 pr-4 pt-0 flex flex-column gap-4'>
            <InvoicePanelEditButton />
            <hr className='b-bottom-grey-10-4 mx-4'/>
            <div className='flex flex-column'>
                <InvoiceStatusDropdown
                    onClick={(status) => {
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
                    }}
                    status={invoice?.invoice_status}/>
                <div className='flex flex-row gap-3'>
                    <InvoicePanelPrintButton />
                    <InvoicePanelToPDFButton />
                </div>
            </div>
        </aside>
    )
}

export default InvoicePanelSidebar;