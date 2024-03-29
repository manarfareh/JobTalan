public with sharing class opportunitycontroller {
    @AuraEnabled(cacheable=true)
    public static List<OpportunityContactRole> MyOpportunity()
    {
        try {
            Id userId=UserInfo.getUserId();
            system.debug(userId);
             return [select Opportunity.Name,Opportunity.LastModifiedDate__c ,	Opportunity.StageName , Contact.Name, Contact.Post__r.Name  from OpportunityContactRole  where ContactId In (select Id from contact where OwnerId=:userId) ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Lead> MyLead(){
        try {
            Id userId=UserInfo.getUserId();
            return [select id, name, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead where User__c=:userId and status !='Closed - Converted'];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}