import {useEffect, useState} from "react";
import {__} from '@wordpress/i18n';
import InvoicesList from "../components/InvoicesList";
import InvoiceStatusDropdown from "../components/invoice-common/InvoiceStatusDropdown";
import {useInvoices} from "../contexts/InvoicesContext";
import Enums from "../../../../scripts/tools/Enums";

const Invoices = () => {
    const {currentStatus, setCurrentStatus, setCurrentStatusLabel, setFetchNewInvoices} = useInvoices();
    const [statuses] = useState(Invoice.statuses);

    useEffect(() => {}, [currentStatus])

    return (
        <>
            <div>
                <div className='flex flex-row-reverse gap-x-2'>
                    <InvoiceStatusDropdown
                        className='w-200'
                        status={currentStatus}
                        onClick={(status, label) => {
                            setCurrentStatus(status);
                            setCurrentStatusLabel(label)
                            setFetchNewInvoices(true);
                        }}
                        params={{showAll: true, allValue: 'any', allLabel: Enums.STATUS.LABELS['any']}}
                    />
                    <div className='w-400'>
                        {/*<input placeholder={__('Search...', 'app')} />*/}
                    </div>
                </div>
                <InvoicesList statuses={statuses} />
            </div>

        </>
    )
}

export default Invoices;