import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class EcommerceHome extends NavigationMixin(LightningElement) {
    searchTerm = '';
    cartCount = 0;

    categories = [
        { name: 'Electronics', description: 'Smart devices and audio', icon: '📱' },
        { name: 'Home & Living', description: 'Comfort and style', icon: '🏠' },
        { name: 'Fashion', description: 'Fresh seasonal picks', icon: '👗' },
        { name: 'Wellness', description: 'Elevate everyday routines', icon: '🧘' }
    ];

    featuredProducts = [
        { name: 'Aurora Laptop', description: 'Ultra-light design with all-day power', price: 1299, rating: 4.9, badge: 'Bestseller', icon: '💻' },
        { name: 'Echo Soundbuds', description: 'Immersive audio with noise control', price: 189, rating: 4.8, badge: 'New', icon: '🎧' },
        { name: 'Luma Smart Lamp', description: 'Ambient lighting with voice control', price: 89, rating: 4.7, badge: 'Editor Pick', icon: '💡' }
    ];

    recommendedProducts = [
        { name: 'Nova Smart Watch', description: 'Fitness tracking with calm health insights', price: 249, rating: 4.9, icon: '⌚' },
        { name: 'Stride Backpack', description: 'Built for travel and daily commutes', price: 119, rating: 4.8, icon: '🎒' },
        { name: 'Glow Desk Set', description: 'Minimal workspace essentials', price: 74, rating: 4.6, icon: '🖊️' }
    ];

    trendingProducts = [
        { name: 'AirFlow Headphones', description: 'Cloud-soft comfort with spatial audio', price: 159, rating: 4.9, icon: '🎵' },
        { name: 'Mira Robot Vacuum', description: 'Intelligent cleaning for busy homes', price: 329, rating: 4.8, icon: '🧹' },
        { name: 'Cove Travel Bottle', description: 'Sleek hydration companion for every trip', price: 39, rating: 4.7, icon: '💧' }
    ];

    benefits = [
        { title: 'Fast Delivery', description: 'Same-day dispatch and premium packaging', icon: '🚚' },
        { title: 'Trusted Quality', description: 'Curated products backed by top-rated brands', icon: '🛡️' },
        { title: 'Personalized Shopping', description: 'Recommendations that adapt to your taste', icon: '✨' }
    ];

    get filteredFeaturedProducts() {
        return this.filterProducts(this.featuredProducts);
    }

    get filteredRecommendedProducts() {
        return this.filterProducts(this.recommendedProducts);
    }

    get filteredTrendingProducts() {
        return this.filterProducts(this.trendingProducts);
    }

    handleSearchInput(event) {
        this.searchTerm = event.target.value;
    }

    handleSearchSubmit() {
        this.template.querySelector('lightning-input').value = this.searchTerm;
    }

    filterProducts(products) {
        const term = this.searchTerm.trim().toLowerCase();

        if (!term) {
            return products;
        }

        return products.filter((product) => {
            return (
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
            );
        });
    }
    navigateToProducts() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'ProductListingPage'
            }
        });
    }

    navigateToCart(){
        this[NavigationMixin.Navigate]({
            type:'standard__navItemPage',
            attributes:{
                apiName:'cartPage'
            }
        });
    }
}
