public with sharing class WishlistController {

    @AuraEnabled
    public static void addToWishlist(
        String productName,
        String productId,
        Decimal price,
        String imageUrl
    ) {

        Wishlist__c item = new Wishlist__c();

        item.Product_Name__c = productName;
        item.Product_Id__c = productId;
        item.Price__c = price;
        item.Image_URL__c = imageUrl;

        insert item;
    }

    @AuraEnabled(cacheable=true)
    public static List<Wishlist__c> getWishlistItems() {

        return [
            SELECT Id,
                   Product_Name__c,
                   Product_Id__c,
                   Price__c,
                   Image_URL__c
            FROM Wishlist__c
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void removeWishlistItem(Id wishlistId) {

        delete [
            SELECT Id
            FROM Wishlist__c
            WHERE Id = :wishlistId
        ];
    }
}