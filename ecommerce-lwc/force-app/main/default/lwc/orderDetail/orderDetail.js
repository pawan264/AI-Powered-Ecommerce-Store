import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getOrderById from '@salesforce/apex/OrderController.getOrderById';

export default class OrderDetail extends LightningElement {

    orderId;
    order;

    @wire(CurrentPageReference)
    getPageState(currentPageReference) {

        if (currentPageReference) {

            this.orderId =
                currentPageReference.state?.c__orderId;
        }
    }

    @wire(getOrderById, {
        orderId: '$orderId'
    })
    wiredOrder({ data, error }) {

        if (data) {
            this.order = data;
        } else if (error) {
            console.error(error);
        }
    }
}