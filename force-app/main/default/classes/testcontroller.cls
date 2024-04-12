public with sharing class testcontroller {
    @AuraEnabled(cacheable=true)
    public static list<WorkPost__c> gettest(){
        Id userId=UserInfo.getUserId();
        list<Lead> l= [select id, name, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead where OwnerId=:userId and status ='testsent' Limit 1];
        list<WorkPost__c> c=[select id,(select id from leads__r where id='00QQy000006k7HZMAY'), (select id , question__c, option_1__c, option_2__c, option_3__c,correct__c from tests__r) from WorkPost__c  ];
        List<WorkPost__c> workPosts = new List<WorkPost__c>();
        for (WorkPost__c workPost : c) {
            if (!workPost.leads__r.isEmpty()) {
                workPosts.add(workPost);
            }
        }
        return workPosts;
    }
}
