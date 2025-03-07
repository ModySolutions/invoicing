import {__} from "@wordpress/i18n";

const InvoiceListTableHeader = () => {
    return (
        <thead>
        <tr>
            <th>
                <svg xmlns='http://www.w3.org/2000/svg'
                     height='20px'
                     viewBox='0 -960 960 960'
                     width='20px'
                     fill='#333'>
                    <path d='m264-192 30-120H144l18-72h150l42-168H192l18-72h162l36-144h72l-36 144h144l36-144h72l-36 144h156l-18 72H642l-42 168h168l-18 72H582l-30 120h-72l30-120H366l-30 120h-72Zm120-192h144l42-168H426l-42 168Z'/>
                </svg>
            </th>
            <th>{__('Client')}</th>
            <th>{__('Issued')}</th>
            <th>{__('Due')}</th>
            <th>{__('Amount')}</th>
            <th>{__('Status')}</th>
            <th>{__('Actions')}</th>
        </tr>
        </thead>
    )
}

export default InvoiceListTableHeader;