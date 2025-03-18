import {useEffect} from 'react';
import {__} from "@wordpress/i18n";
import {useInvoice} from "../../contexts/InvoiceContext";
import CurrencyFormatter from "../invoice-common/CurrencyFormatter";
import InvoiceItemsTableHeader from "../invoice-common/InvoiceItemsTableHeader";

const InvoicePanelItemsTable = () => {
    const {invoice} = useInvoice();
    const defaultItemValues = {
        'item_description': '',
        'item_quantity': '',
        'item_price': '',
        'item_taxable': true,
        'item_total': '0',
    };

    useEffect(() => {}, [invoice])
    return (
        <table className='invoices-table inverse'>
            <InvoiceItemsTableHeader />
            <tbody>
            {invoice?.invoice_items && invoice?.invoice_items?.map((item, index) => {
                return (
                    <tr key={`invoice-item-${index}`} className='border-0'>
                        <td data-title={__('Description', 'app')}>
                            {item.item_description}
                        </td>
                        <td data-title={__('Quantity', 'app')}>
                            {item.item_quantity}
                        </td>
                        <td data-title={__('Price', 'app')}>
                            <CurrencyFormatter amount={item.item_price}/>
                        </td>
                        <td className={'text-center'} data-title={__('Taxable', 'app')}>
                            {item.item_taxable && `X`}
                        </td>
                        <td className='text-right' data-title={__('Amount', 'app')}>
                            <CurrencyFormatter amount={item.item_total}/>
                        </td>
                        <td className={'hidden-action text-right'}>

                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}

export default InvoicePanelItemsTable;