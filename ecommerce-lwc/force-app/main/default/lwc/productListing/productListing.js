import { LightningElement, wire } from "lwc";
import getProducts from "@salesforce/apex/ProductController.getProducts";
//import iphoneImage from '@salesforce/resourceUrl/iphoneImage';
import { NavigationMixin } from 'lightning/navigation';



const DEFAULT_PAGE_SIZE = 6;

export default class ProductListing extends NavigationMixin(LightningElement) {
  searchTerm = "";
  activeCategory = "All";
  sortOption = "priceAsc";
  currentPage = 1;
  pageSize = DEFAULT_PAGE_SIZE;

  categories = [
    "All",
    "Mobiles",
    "Laptops",
    "Shoes",
    "Watches",
    "Perfumes",
    "Accessories"
  ];

  sortOptions = [
    { label: "Price Low to High", value: "priceAsc" },
    { label: "Price High to Low", value: "priceDesc" },
    { label: "Highest Rated", value: "ratingDesc" }
  ];

  get categoryOptions() {
    return this.categories.map((category) => ({
      category,
      className:
        this.activeCategory === category
          ? "category-pill active"
          : "category-pill"
    }));
  }

 products = [];

 cartItems = [];
 cartCount = 0;

selectedProductId = null;
showProductDetail = false;

@wire(getProducts)
wiredProducts({ data, error }) {

    if (data) {

        console.log("Data:", data);

        this.products = data.map(product => ({
           id: product.Id,
           name: product.Name,
           category: product.Category__c,
            price: product.Price__c,
            imageUrl: product.Product_Image__c,
           rating: 4.8,
            stockStatus: "In Stock",
            stockClass: "in-stock",
            tag: "Popular"
            
        }));

        console.log("Products:", this.products);

    } else if (error) {

        console.error(error);

    }
}


  get filteredProducts() {
    const searchTerm = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesCategory =
        this.activeCategory === "All" ||
        product.category === this.activeCategory;
      const matchesSearch =
        !searchTerm || product.name.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }

  get sortedProducts() {
    return [...this.filteredProducts].sort((a, b) => {
      if (this.sortOption === "priceAsc") {
        return a.price - b.price;
      }
      if (this.sortOption === "priceDesc") {
        return b.price - a.price;
      }
      if (this.sortOption === "ratingDesc") {
        return b.rating - a.rating;
      }
      return 0;
    });
  }

  get pagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedProducts.slice(start, start + this.pageSize);
  }

  get filteredProductCount() {
    return this.filteredProducts.length;
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.filteredProductCount / this.pageSize));
  }

  get pageNumbers() {
    return Array.from({ length: this.pageCount }, (_, index) => {
      const page = index + 1;
      return {
        page,
        className: page === this.currentPage ? "active-page" : ""
      };
    });
  }

  get isFirstPage() {
    return this.currentPage <= 1;
  }

  get isLastPage() {
    return this.currentPage >= this.pageCount;
  }

  handleSearchInput(event) {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
  }

  handleSortChange(event) {
    this.sortOption = event.detail.value;
    this.currentPage = 1;
  }

  handleCategoryClick(event) {
    const selectedCategory = event.currentTarget.dataset.category;
    this.activeCategory = selectedCategory;
    this.currentPage = 1;
  }

  goPrevious() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  goNext() {
    if (this.currentPage < this.pageCount) {
      this.currentPage += 1;
    }
  }

  goToPage(event) {
    const selectedPage = Number(event.currentTarget.dataset.page);
    if (selectedPage && selectedPage !== this.currentPage) {
      this.currentPage = selectedPage;
    }
  }
 
handleViewDetails(event) {
    const productId = event.currentTarget.dataset.id;

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
handleBackToProducts() {
this.showProductDetail = false;
this.selectedProductId = null;
}



  
  handleAddToCart(event) {
    const productId = event.currentTarget.dataset.id;
    const selectedProduct = this.products.find(
        product => product.id === productId
    );

    if (!selectedProduct) {
      return;
    }

    const existingItem = this.cartItems.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      this.cartItems = [...this.cartItems];
    } else {
      this.cartItems = [
        ...this.cartItems,
        { ...selectedProduct, quantity: 1 }
      ];
    }

    this.cartCount = this.cartItems.length;

localStorage.setItem(
    'cartItems',
    JSON.stringify(this.cartItems)
);

console.log("Cart Items:", this.cartItems);
console.log("Cart Count:", this.cartCount);
  }

  removeFromCart(event) {
    const productId = event.currentTarget.dataset.id;
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.cartCount = this.cartItems.length;
  }

  get cartTotal() {
    return this.cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  }

  get hasCartItems() {
    return this.cartItems.length > 0;
  }
}
