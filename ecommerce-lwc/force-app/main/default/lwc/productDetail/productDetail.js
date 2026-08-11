import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductById from '@salesforce/apex/ProductDetailController.getProductById';
import getRelatedProducts from '@salesforce/apex/ProductDetailController.getRelatedProducts';


const DEFAULT_RATING = 4.8;
const DEFAULT_REVIEW_COUNT = 126;

export default class ProductDetail extends LightningElement {
  @api recordId;
  @api productId;
  currentProductId;
  @track product = {};
  @track relatedProductsList = [];
  @track recommendedProducts = [];
  pageRef;
  @track isLoading = true;
  @track errorMessage = '';
  @track selectedQuantity = 1;
  @track wishlistActive = false;
  @track descriptionExpanded = false;
  @track mainImageIndex = 0;
  @track hasRendered = false;

  cartItems = [];

  get effectiveProductId() {
    return (
      this.recordId ||
      this.productId ||
      this.currentProductId
    );
  }

  @wire(CurrentPageReference)
  wiredPageRef(currentPageReference) {
    if (currentPageReference) {
      this.currentProductId = currentPageReference.state?.c__productId;
      console.log('Received Product Id:', this.currentProductId);
    }
  }

  @wire(getProductById, { productId: '$effectiveProductId' })
  wiredProduct({ error, data }) {
    this.isLoading = true;
    this.errorMessage = '';
    if (data) {
      this.product = data;
      this.selectedQuantity = 1;
      this.mainImageIndex = 0;
      this.prepareRecommendations();
      this.isLoading = false;
    } else if (error) {
      this.handleError(error);
      this.isLoading = false;
    }
  }

  renderedCallback() {
    if (!this.hasRendered) {
      this.hasRendered = true;
      if (!this.effectiveProductId) {
        this.isLoading = false;
        this.errorMessage = 'Product identifier was not provided. Use this component on a Product record page or pass a productId attribute.';
      }
    }
  }

  @wire(getRelatedProducts, { category: '$product.Category__c' })
  wiredRelatedProducts({ error, data }) {
    if (data) {
      this.relatedProductsList = data.map((item) => this.normalizeCardProduct(item));
    } else if (error) {
      this.relatedProductsList = [];
    }
  }

  get hasProduct() {
    return !!this.product && !!this.product.Id && !this.errorMessage;
  }

  get productPrice() {
    return this.product.Price__c ? `$${this.product.Price__c.toFixed(2)}` : '$0.00';
  }

  get skuValue() {
    return this.product.SKU__c || 'Unavailable';
  }

  get availabilityLabel() {
    const stock = this.product.Stock__c || 0;
    if (stock === 0) {
      return 'Out Of Stock';
    }
    if (stock < 10) {
      return 'Only Few Left';
    }
    return 'In Stock';
  }

  get availabilityClass() {
    const stock = this.product.Stock__c || 0;
    if (stock === 0) {
      return 'stock-indicator out-of-stock';
    }
    if (stock < 10) {
      return 'stock-indicator low-stock';
    }
    return 'stock-indicator in-stock';
  }

  get isOutOfStock() {
    return !this.product.Stock__c || this.product.Stock__c <= 0;
  }

  get isQuantityMinimum() {
    return this.selectedQuantity <= 1;
  }

  get isQuantityMaximum() {
    return this.product.Stock__c && this.selectedQuantity >= this.product.Stock__c;
  }

  get mainImageUrl() {
    return this.imageGalleryData.length ? this.imageGalleryData[this.mainImageIndex].url : '/assets/images/default-product.png';
  }

  get imageGalleryUrls() {
    const images = [];
    const defaultImage = '/assets/images/default-product.png';
    if (this.product.Product_Image__c) {
      images.push(this.product.Product_Image__c);
    }
    for (let i = 1; i <= 3; i += 1) {
      images.push(this.product.Product_Image__c || defaultImage);
    }
    return images;
  }

  get imageGalleryData() {
    return this.imageGalleryUrls.map((url, index) => ({
      url,
      index,
      alt: this.product.Name || 'Product image',
      title: `Select image ${index + 1}`,
      ariaLabel: `View image ${index + 1}`,
      className: index === this.mainImageIndex ? 'thumbnail-button selected' : 'thumbnail-button'
    }));
  }

  get ratingAverage() {
    return DEFAULT_RATING.toFixed(1);
  }

  get reviewCount() {
    return DEFAULT_REVIEW_COUNT;
  }

  get shortDescription() {
    if (!this.product.Description__c) {
      return 'No description is available for this product.';
    }
    return this.descriptionExpanded || this.product.Description__c.length < 220
      ? this.product.Description__c
      : `${this.product.Description__c.slice(0, 220)}...`;
  }

  get descriptionText() {
    return this.product.Description__c || 'No additional product details are available.';
  }

  get descriptionToggleLabel() {
    return this.descriptionExpanded ? 'Read Less' : 'Read More';
  }

  get wishlistButtonClass() {
    return this.wishlistActive ? 'wishlist-button active' : 'wishlist-button';
  }

  get wishlistButtonLabel() {
    return this.wishlistActive ? 'Remove from wishlist' : 'Add to wishlist';
  }

  get wishlistIcon() {
    return this.wishlistActive ? '♥' : '♡';
  }

  get specRows() {
    return [
      { label: 'Brand', value: this.product.Brand__c || 'N/A' },
      { label: 'Model', value: this.product.Model__c || 'N/A' },
      { label: 'Category', value: this.product.Category__c || 'N/A' },
      { label: 'Color', value: this.product.Color__c || 'N/A' },
      { label: 'Weight', value: this.product.Weight__c || 'N/A' },
      { label: 'Storage', value: this.product.Storage__c || 'N/A' },
      { label: 'RAM', value: this.product.RAM__c || 'N/A' },
      { label: 'Warranty', value: this.product.Warranty__c || 'N/A' }
    ];
  }

  get relatedProductsListCount() {
    return this.relatedProductsList.length;
  }

  get reviews() {
    return [
      { id: 'rev1', author: 'Mia', rating: 5.0, text: 'Fantastic quality and fast delivery. Highly recommend!' },
      { id: 'rev2', author: 'Noah', rating: 4.5, text: 'Great experience overall, the product exceeded expectations.' },
      { id: 'rev3', author: 'Ava', rating: 4.8, text: 'Love the design and performance. Worth the purchase.' }
    ];
  }

  handleError(error) {
    this.errorMessage = 'We could not load the selected product. Please try again later.';
    if (Array.isArray(error.body?.pageErrors) && error.body.pageErrors.length) {
      this.errorMessage = error.body.pageErrors[0].message;
    } else if (error.body?.message) {
      this.errorMessage = error.body.message;
    }
    this.product = {};
  }

  handleThumbnailClick(event) {
    const index = Number(event.currentTarget.dataset.index);
    if (!Number.isNaN(index)) {
      this.mainImageIndex = index;
    }
  }

  handleDecrease() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity -= 1;
    }
  }

  handleIncrease() {
    if (!this.product.Stock__c || this.selectedQuantity >= this.product.Stock__c) {
      return;
    }
    this.selectedQuantity += 1;
  }

  handleToggleWishlist() {
    this.wishlistActive = !this.wishlistActive;
    const message = this.wishlistActive
      ? 'Added to wishlist.'
      : 'Removed from wishlist.';
    this.showToast('Wishlist Updated', message, 'success');
  }

  handleAddToCart() {
    if (this.isOutOfStock) {
      this.showToast('Unavailable', 'This product is currently out of stock.', 'error');
      return;
    }
    const exists = this.cartItems.some((item) => item.Id === this.product.Id);
    if (exists) {
      this.showToast('Already in Cart', 'This item is already in your cart.', 'info');
      return;
    }
    this.cartItems = [...this.cartItems, { ...this.product, quantity: this.selectedQuantity }];
    this.showToast('Added to Cart', `${this.product.Name} was added to your cart.`, 'success');
    this.dispatchCartUpdate();


  }

  

  handleBuyNow() {
    if (this.isOutOfStock) {
      this.showToast('Unavailable', 'This product is currently out of stock.', 'error');
      return;
    }
    this.showToast('Checkout', `Proceeding to checkout with ${this.selectedQuantity} item(s).`, 'success');
    const checkoutEvent = new CustomEvent('buyproduct', {
      detail: { productId: this.product.Id, quantity: this.selectedQuantity }
    });
    this.dispatchEvent(checkoutEvent);
  }

  handleRelatedViewDetails(event) {
    const productId = event.currentTarget.dataset.id;
    const detailsEvent = new CustomEvent('navigateproduct', { detail: { productId } });
    this.dispatchEvent(detailsEvent);
  }

  handleRelatedAddToCart(event) {
    const productId = event.currentTarget.dataset.id;
    const item = this.relatedProductsList.find((product) => product.id === productId);
    if (!item) {
      return;
    }
    const exists = this.cartItems.some((product) => product.Id === item.id);
    if (exists) {
      this.showToast('Already in Cart', 'This item is already in your cart.', 'info');
      return;
    }
    this.cartItems = [...this.cartItems, { ...item, quantity: 1 }];
    this.showToast('Added to Cart', `${item.name} was added to your cart.`, 'success');
    this.dispatchCartUpdate();
  }

  handleWriteReview() {
    this.showToast('Write Review', 'Review creation is available in the next release.', 'info');
  }

  handleBackToProducts() {
    const event = new CustomEvent('backtoproducts');
    this.dispatchEvent(event);
  }

  handleReadMoreToggle() {
    this.descriptionExpanded = !this.descriptionExpanded;
  }

  prepareRecommendations() {
    this.recommendedProducts = [
      { id: 'rec1', name: 'Smart Premium Watch', price: '$189.99', rating: 4.7, imageUrl: this.product.Product_Image__c },
      { id: 'rec2', name: 'Wireless Noise Cancelling Earbuds', price: '$129.99', rating: 4.6, imageUrl: this.product.Product_Image__c },
      { id: 'rec3', name: 'Ultra Slim Laptop Sleeve', price: '$39.99', rating: 4.9, imageUrl: this.product.Product_Image__c },
      { id: 'rec4', name: 'Portable Power Bank', price: '$24.99', rating: 4.5, imageUrl: this.product.Product_Image__c }
    ];
  }

  normalizeCardProduct(item) {
    return {
      id: item.Id,
      name: item.Name,
      category: item.Category__c,
      price: item.Price__c ? `$${item.Price__c.toFixed(2)}` : '$0.00',
      imageUrl: item.Product_Image__c || '/assets/images/default-product.png',
      rating: DEFAULT_RATING
    };
  }

  dispatchCartUpdate() {
    const cartEvent = new CustomEvent('cartupdate', {
      detail: { cartCount: this.cartItems.length }
    });
    this.dispatchEvent(cartEvent);
  }

  showToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant
      })
    );
  }
}
