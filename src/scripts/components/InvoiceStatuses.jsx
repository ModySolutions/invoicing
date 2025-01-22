import {v4 as uuidv4} from "uuid";
import {__} from '@wordpress/i18n';
import {useInvoices} from "../contexts/InvoicesContext";

const StatusButton = ({textClassName, bgClassName, status, label, onClick, active}) => {
    return (
        <button type='button'
                onClick={onClick}
                className={`btn btn-sm ${textClassName} ${bgClassName} btn-${status} btn-status-${status}
            ${active ? ' active' : ''}`}>
            {label}
        </button>
    );
};

const InvoiceStatuses = ({statuses}) => {
    const {currentStatus, setCurrentStatus} = useInvoices();
    return (
        <div className={'flex gap-1 justify-start'}>
            <StatusButton
                textClassName='text-charcoal'
                bgClassName='btn-grey-80'
                onClick={() => setCurrentStatus('any')}
                active={currentStatus === 'any'}
                status='any'
                label={__('Any')}/>

            {Object.entries(statuses).map(([status, data]) => {
                const [textClassName, bgClassName] = data?.classNames;
                return <StatusButton
                    textClassName={textClassName}
                    bgClassName={bgClassName}
                    status={status}
                    onClick={() => setCurrentStatus(status)}
                    active={currentStatus === status}
                    label={data?.name}
                    key={`invoice-status-filter-btn-${uuidv4()}`}
                />
            })}
        </div>
    )
}
export default InvoiceStatuses