export const formatDate = (format, date) => {
    date = date ?? new Date();
    let options = {};
    switch (format) {
        case 'MMM d, Y':
            options = { year: 'numeric', month: 'short', day: 'numeric' };
            break;
        case 'd/M/Y':
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        default:
            options = { year: 'numeric', month: 'short', day: 'numeric' };
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default [
    {
        'value': 'MMM d, Y',
        'label': formatDate('MMM d, Y')
    },
    {
        'value': 'd/M/Y',
        'label': formatDate('d/M/Y')
    },
];