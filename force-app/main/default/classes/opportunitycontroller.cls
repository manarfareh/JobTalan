public with sharing class opportunitycontroller {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> MyOpportunity()
    {
        try {
            Id userId=UserInfo.getUserId();
            system.debug(userId);
             return [select Name, LastModifiedDate__c ,	StageName ,Post__r.Name  from Opportunity  where  OwnerId=:userId ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> MyLead(){
        try {
            Id userId=UserInfo.getUserId();
            return [select id, name, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead where OwnerId=:userId and status !='Closed - Converted'];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Lead testLead(){
        try {
            Id userId=UserInfo.getUserId();
            return [select id, testscore__c, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead where OwnerId=:userId and status='testsent' Limit 1];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled()
    public static lead scoreLead(Lead lead, Integer score){
        try {
            lead.testscore__c=score;
            update lead;
            return lead;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity()
    {
        try {
             return [select Name,LastModifiedDate__c ,	StageName   from Opportunity ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}