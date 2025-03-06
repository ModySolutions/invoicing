import Enums from "@invoice/tools/Enums";

const StatusBadge = ({status}) => {
    return (
        <span className={`btn btn-xs ${Enums.STATUS.COLORS[status]?.join(' ')}`}>
            {Enums.STATUS.LABELS[status]}
        </span>
    )
}

export default StatusBadge;