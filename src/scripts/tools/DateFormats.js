export const formatDate = (format, date) => {
    date = date ?? new Date();
    let options = {};
    console.log(format)
    switch (format) {
        case 'MMM d, Y':
            options = { year: 'numeric', month: 'short', day: 'numeric' };
            break;
        case 'd/M/Y':
            options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            break;
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