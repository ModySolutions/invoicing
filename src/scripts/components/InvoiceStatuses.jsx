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
    const {currentStatus, setCurrentStatus, setCurrentStatusLabel} = useInvoices();
    return (
        <div className={'flex gap-1 justify-start'}>
            <StatusButton
                textClassName='text-charcoal'
                bgClassName='btn-grey-80'
                onClick={() => {
                    setCurrentStatus('any')
                    setCurrentStatusLabel(__('Any', 'app'));
                }}
                active={currentStatus === 'any'}
                status='any'
                label={__('Any')}/>

            {Object.entries(statuses).map(([status, data]) => {
                const [textClassName, bgClassName] = data?.classNames;
                return <StatusButton
                    textClassName={textClassName}
                    bgClassName={bgClassName}
                    status={status}
                    onClick={() => {
                        setCurrentStatus(status);
                        setCurrentStatusLabel(data?.name)
                    }}
                    active={currentStatus === status}
                    label={data?.name}
                    key={`invoice-status-filter-btn-${status}`}
                />
            })}
        </div>
    )
}
export default InvoiceStatuses