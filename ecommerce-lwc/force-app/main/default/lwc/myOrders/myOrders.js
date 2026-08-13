import { LightningElement, wire } from 'lwc';
import getOrders from '@salesforce/apex/OrderController.getOrders';
import { NavigationMixin } from 'lightning/navigation';
export default class MyOrders extends NavigationMixin(LightningElement) {

    orders = [];

    @wire(getOrders)
    wiredOrders({ data, error }) {

        if (data) {
            this.orders = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleViewDetails(event) {

        const orderId = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'OrderDetailPage'
            },
            state: {
                c__orderId: orderId
            }
        });
    }
}