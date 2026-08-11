import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CartPage extends NavigationMixin(LightningElement) {

    cartItems = [];

    connectedCallback() {

        const data =
            localStorage.getItem('cartItems');

        if (data) {

            this.cartItems =
                JSON.parse(data);
        }
    }

    get hasCartItems() {

        return this.cartItems.length > 0;
    }

    get cartTotal() {

    return this.cartItems.reduce(
        (total, item) =>
            total + ((item.price || 0) * (item.quantity || 1)),
        0
    );
}

    removeItem(event) {

        const productId =
            event.target.dataset.id;

        this.cartItems =
            this.cartItems.filter(
                item => item.id !== productId
            );

        localStorage.setItem(
            'cartItems',
            JSON.stringify(this.cartItems)
        );
    }

    increaseQty(event) {
        const productId = event.target.dataset.id;
        this.cartItems = this.cartItems.map(item => {
            if (item.id === productId) {
                item.quantity = (item.quantity || 1) + 1;
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    decreaseQty(event) {
        const productId = event.target.dataset.id;
        this.cartItems = this.cartItems.map(item => {
            if (item.id === productId && item.quantity > 1) {
                item.quantity = item.quantity - 1;
            }
            return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    goToProducts() {
        window.history.back();
    }

    goToCheckout() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'checkoutPage'
            }
        });
    }
}