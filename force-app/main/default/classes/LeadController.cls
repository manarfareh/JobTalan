public with sharing class LeadController {
    @AuraEnabled(cacheable=false)
    public static String createLead(Map<String, String> leadData) {
        Lead newLead = new Lead(
            FirstName = leadData.get('first_name'),
            LastName = leadData.get('last_name'),
            Email = leadData.get('email'),
            Status ='Closed - Not Converted',
            Post__c =leadData.get('post'),
            User__c=UserInfo.getUserId()
        );
        insert newLead;

        return newLead.Id;
    }
}