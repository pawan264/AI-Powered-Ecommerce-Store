public with sharing class ProductController {

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts() {

        return [
            SELECT Id,
                   Name,
                   Category__c,
                   Price__c,
                   Description__c,
                   Product_Image__c,
                   Stock__c
            FROM Product__c
        ];
    }
}