import {__} from '@wordpress/i18n';

const InvoicePanelLoading = () => {
    const styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 99999,
    }
    return (
        <div style={styles} className='p-absolute w-100-p bg-cultured'>
            {__('Loading...', 'invoice')}
        </div>
    )
}

export default InvoicePanelLoading;