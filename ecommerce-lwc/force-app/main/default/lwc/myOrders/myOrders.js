import { LightningElement, wire } from 'lwc';
import getOrders from '@salesforce/apex/OrderController.getOrders';

export default class MyOrders extends LightningElement {

    orders = [];

    @wire(getOrders)
    wiredOrders({ data, error }) {

        if (data) {
            this.orders = data;
        } else if (error) {
            console.error(error);
        }
    }
}