const StatusBadge = ({status}) => {
    return (
        <span className={`btn btn-xs ${status?.classNames?.join(' ')}`}>
            {status?.name}
        </span>
    )
}

export default StatusBadge;