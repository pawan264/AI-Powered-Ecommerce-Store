import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getWishlistItems from '@salesforce/apex/WishlistController.getWishlistItems';
import removeWishlistItem
from '@salesforce/apex/WishlistController.removeWishlistItem';
import { NavigationMixin } from 'lightning/navigation';

export default class WishlistPage extends NavigationMixin(LightningElement) {
    wishlistItems = [];

    @wire(getWishlistItems)
    wiredWishlist({ data, error }) {

        if (data) {

            console.log('Wishlist Data:', data);

            this.wishlistItems = data;

        } else if (error) {

            console.error('Wishlist Error:', error);
        }
    }

    handleRemove(event) {

    const wishlistId =
        event.target.dataset.id;

    removeWishlistItem({
        wishlistId: wishlistId
    })
    .then(() => {

        this.wishlistItems =
            this.wishlistItems.filter(
                item => item.Id !== wishlistId
            );

    })
    .catch(error => {

        console.error(error);

    });
}

handleViewProduct(event) {

    const productId =
        event.target.dataset.id;

    this[NavigationMixin.Navigate]({

        type: 'standard__navItemPage',

        attributes: {
            apiName: 'ProductDetail'
        },

        state: {
            c__productId: productId
        }
    });
}

handleAddToCart(event) {

    const wishlistId =
        event.target.dataset.id;

    const selectedItem =
        this.wishlistItems.find(
            item => item.Id === wishlistId
        );

    let cartItems =
        JSON.parse(
            localStorage.getItem('cartItems')
        ) || [];

    const existingItem =
        cartItems.find(
            item =>
                item.id ===
                selectedItem.Product_Id__c
        );

    if (existingItem) {

        existingItem.quantity =
            (existingItem.quantity || 1) + 1;

    } else {

        cartItems.push({

            id:
                selectedItem.Product_Id__c,

            name:
                selectedItem.Product_Name__c,

            price:
                selectedItem.Price__c,

            quantity: 1
        });
    }

    localStorage.setItem(
        'cartItems',
        JSON.stringify(cartItems)
    );

    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Success',
        message: 'Added To Cart',
        variant: 'success'
      })
    );
  }

}