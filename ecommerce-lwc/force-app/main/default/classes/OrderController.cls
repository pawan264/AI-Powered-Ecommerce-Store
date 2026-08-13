public with sharing class OrderController {

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrders() {

        return [
            SELECT Id,
                   Name,
                   Customer_Name__c,
                   Total_Amount__c,
                   Status__c,
                   CreatedDate
            FROM Order__c
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Order__c getOrderById(Id orderId) {

        return [
            SELECT Id,
                   Name,
                   Customer_Name__c,
                   Customer_Email__c,
                   Customer_Phone__c,
                   Delivery_Address__c,
                   Total_Amount__c,
                   Status__c,
                   CreatedDate
            FROM Order__c
            WHERE Id = :orderId
            LIMIT 1
        ];
    }
}