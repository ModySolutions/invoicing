const date = new Date();
const formatDate = (format) => {
    let options = {};

    switch (format) {
        case 'MMM d, Y':
            options = { year: 'numeric', month: 'short', day: 'numeric' };
            break;
        case 'd/m/Y':
            options = { day: 'numeric', month: 'numeric', year: 'numeric' };
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
        'value': 'd/m/Y',
        'label': formatDate('d/m/Y')
    },
];