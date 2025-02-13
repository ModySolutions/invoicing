const StatusBadge = ({status}) => {
    return (
        <span className={`btn btn-xs ${status?.classNames?.join(' ')}`}>
            {status?.label}
        </span>
    )
}

export default StatusBadge;