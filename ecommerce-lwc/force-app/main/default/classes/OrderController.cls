public with sharing class OrderController {

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrders() {

        return [
            SELECT Id,
                   Name,
                   Total_Amount__c,
                   Status__c,
                   Customer_Name__c,
                   CreatedDate
            FROM Order__c
            ORDER BY CreatedDate DESC
        ];
    }
}