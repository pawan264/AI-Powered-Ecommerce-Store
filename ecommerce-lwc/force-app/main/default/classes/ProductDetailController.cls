public with sharing class ProductDetailController {

    @AuraEnabled(cacheable=true)
    public static Product__c getProductById(Id productId) {
        if (productId == null) {
            return null;
        }
        Product__c product = [
            SELECT Id,
                   Name,
                   Category__c,
                   Description__c,
                   Price__c,
                   Product_Image__c,
                   Stock__c
            FROM Product__c
            WHERE Id = :productId
            LIMIT 1
        ];
        return product;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getRelatedProducts(String category) {
        if (String.isBlank(category)) {
            return new List<Product__c>();
        }
        return [
            SELECT Id,
                   Name,
                   Category__c,
                   Price__c,
                   Product_Image__c,
                   Stock__c
            FROM Product__c
            WHERE Category__c = :category
            ORDER BY CreatedDate DESC
            LIMIT 4
        ];
    }
}
