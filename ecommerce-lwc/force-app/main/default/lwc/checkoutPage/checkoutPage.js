import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class CheckoutPage extends NavigationMixin(LightningElement) {

    customerName = '';
    email = '';
    phone = '';
    address = '';

cartItems = [];
cartTotal = 0;

connectedCallback() {

    const data =
        localStorage.getItem('cartItems');

    if (data) {

        this.cartItems =
            JSON.parse(data);

        this.cartTotal =
            this.cartItems.reduce(
                (total, item) =>
                    total + ((item.price || 0) * (item.quantity || 1)),
                0
            );
    }
}
    handleChange(event) {

        const field = event.target.name;

        this[field] = event.target.value;
    }

    placeOrder() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Order Placed Successfully',
                variant: 'success'
            })
        );
    }

    navigateToProducts() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'ProductListingPage'
            }
        });
    }
}