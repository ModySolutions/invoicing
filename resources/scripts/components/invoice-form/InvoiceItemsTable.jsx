import {useState, useEffect} from 'react';
import {useInvoice} from "../../contexts/InvoiceContext";
import {__} from "@wordpress/i18n";
import CurrencyFormatter from "../CurrencyFormatter";
import HandleTaxesAndDiscounts from "../../tools/HandleTaxesAndDiscounts";

const InvoiceItemsTable = () => {
    const {invoice, setInvoice} = useInvoice();
    const defaultItemValues = {
        'item_description': '',
        'item_quantity': '',
        'item_price': '',
        'item_taxable': true,
        'item_total': '0',
    };
    const [invoiceItems, setInvoiceItems] = useState(invoice?.invoice_items ?? [defaultItemValues]);

    useEffect(() => {
        setInvoice(prevState  => ({
            ...prevState,
            ['invoice_items']: invoiceItems
        }));
    }, [invoiceItems]);

    const addItem = () => {
        setInvoiceItems([...invoiceItems, {...defaultItemValues}]);
    };

    const removeItem = (index) => {
        const updatedItems = invoiceItems.filter((item, i) => i !== index);
        setInvoiceItems(updatedItems);
    };

    const handleItemInputChange = (index, event) => {
        const {name, value, type, checked} = event.target;
        const updatedItems = [...invoiceItems];
        if (type === 'checkbox') {
            updatedItems[index][name] = checked;
        } else {
            updatedItems[index][name] = value;
        }

        if (name === 'item_quantity' || name === 'item_price') {
            const quantity = parseFloat(updatedItems[index].item_quantity ?? 0);
            const price = parseFloat(updatedItems[index].item_price ?? 0);
            if(quantity && price) {
                updatedItems[index].item_total = (quantity * price).toFixed(2) ?? 0;
            }
        }

        setInvoiceItems(updatedItems);
        setInvoice(prevState => ({
            ...prevState,
            ...HandleTaxesAndDiscounts(invoice),
        }));
    };

    return (
        <table className='invoices-table inverse'>
            <thead className={'rounded radius-sm'}>
            <tr className={'rounded radius-sm'}>
                <th className='w-40-p text-left'>{__('Item')}</th>
                <th className='w-10-p text-center'>{__('Quantity')}</th>
                <th className='w-10-p text-center'>{__('Price')}</th>
                <th className='w-5-p text-center'>{__('Taxable')}</th>
                <th className='w-10-p text-center'>{__('Amount')}</th>
                <th className='w-5-p text-center'></th>
            </tr>
            </thead>
            <tbody>
            {invoiceItems.map((item, index) => {
                return (
                    <tr key={`invoice-item-${index}`} className='border-0'>
                        <td data-title={__('Description', 'app')}>
                            <input required
                                   type={'text'}
                                   name='item_description'
                                   value={item.item_description}
                                   onChange={(event) => handleItemInputChange(index, event)}
                            />
                        </td>
                        <td data-title={__('Quantity', 'app')}>
                            <input required
                                   type={'text'}
                                   name='item_quantity'
                                   value={item.item_quantity}
                                   onChange={(event) => handleItemInputChange(index, event)}
                            />
                        </td>
                        <td data-title={__('Price', 'app')}>
                            <input required
                                   type={'text'}
                                   name='item_price'
                                   value={item.item_price}
                                   onChange={(event) => handleItemInputChange(index, event)}
                            />
                        </td>
                        <td className={'text-center'} data-title={__('Taxable', 'app')}>
                            <input
                                type={'checkbox'}
                                name='item_taxable'
                                checked={item.item_taxable}
                                onChange={(event) => handleItemInputChange(index, event)}
                            />
                        </td>
                        <td className='text-right' data-title={__('Amount', 'app')}>
                            <CurrencyFormatter amount={item.item_total}/>
                        </td>
                        <td className={'hidden-action text-right'}>
                            {index !== 0 && (
                                <a href='#' className='text-lg'
                                   onClick={() => removeItem(index)}>
                                    &times;
                                </a>
                            )}
                        </td>
                    </tr>
                )
            })}
            </tbody>
            <tfoot>
            <tr>
                <td>
                    <button
                        type='button'
                        className='btn btn-info btn-text-cultured btn-primary btn-sm'
                        onClick={addItem}
                    >
                        <span>+</span>&nbsp;{__('Add item', 'app')}
                    </button>
                </td>
            </tr>
            </tfoot>
        </table>
    )
}

export default InvoiceItemsTable;