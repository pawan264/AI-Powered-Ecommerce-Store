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

    get statusClass() {

    if (!this.order) {
        return '';
    }

    switch (this.order.Status__c) {

        case 'Delivered':
            return 'status delivered';

        case 'Processing':
            return 'status processing';

        case 'Pending':
            return 'status pending';

        case 'Cancelled':
            return 'status cancelled';

        default:
            return 'status';
    }
}

get formattedDate() {

    if (!this.order?.CreatedDate) {
        return '';
    }

    return new Date(
        this.order.CreatedDate
    ).toLocaleDateString('en-IN');
}

}