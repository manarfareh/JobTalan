public with sharing class LeadController {
    @AuraEnabled(cacheable=false)
    public static String createLead(Map<String, String> leadData) {
        Lead newLead = new Lead(
            FirstName = leadData.get('first_name'),
            LastName = leadData.get('last_name'),
            Email = leadData.get('email'),
            Status ='Closed - Not Converted'
        );
        if (leadData.containsKey('post')) {
            newLead.Post__c = leadData.get('post');
        }
        insert newLead;

        return newLead.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Id getUserId()
    {
        return UserInfo.getUserId();
    }
    

    @AuraEnabled()
    public static List<ContentDocumentLink> LeadFile(Id leadid,Id idfile)
    {
        Id userId = UserInfo.getUserId();
        List<ContentDocument> documents = [SELECT Id FROM ContentDocument WHERE OwnerId = :userId and Id=:idfile];
        if (!documents.isEmpty()) {
            List<ContentDocumentLink> contentDocumentLinks = new List<ContentDocumentLink>();
            ContentDocumentLink cl = new ContentDocumentLink(
                LinkedEntityId = leadid,
                ContentDocumentId = documents[0].Id,
                ShareType = 'V'
            );
            contentDocumentLinks.add(cl);
            insert contentDocumentLinks;
            return contentDocumentLinks;
        }
        List<ContentDocumentLink> contentDocumentLinks = new List<ContentDocumentLink>();
        return contentDocumentLinks;
    }


    @AuraEnabled(cacheable=true)
    public static List<Lead> getLead(){
        try {
            return [select id, name, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}