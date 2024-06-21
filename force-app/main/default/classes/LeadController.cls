public with sharing class LeadController {
    @AuraEnabled(cacheable=false)
    public static String createLead(Map<String, String> leadData) {
        Lead newLead = new Lead(
            FirstName = leadData.get('first_name'),
            LastName = leadData.get('last_name'),
            Email = leadData.get('email')
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

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeadById(Id LeadId){
        try {
            return [select id, name, Post__r.Name,Creation_Date__c, LastTransferDate, status from lead where Id=:LeadId];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled()
    public static Lead updateLeadref(Id LeadId){
        try {
            Lead l=[select id, name, status from lead where Id=:LeadId];
            l.Status='Closed - Not Converted';
            update l;
            return l;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled()
    public static Lead updateLead(Id LeadId){
        try {
            Lead l=[select id, name,resume_verified__c, status from lead where Id=:LeadId];
            l.resume_verified__c=true;
            //l.Interviewer__c=UserName;
            update l;
            return l;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    

    @AuraEnabled(cacheable=true)
    public static List<User> getInterviewer(Id LeadId){
        try {
            Lead p=[select id,Post__r.Department__r.Name from lead where Id=:LeadId];
            List<User> l=[Select Id, Name, Email, profile.Name, IsActive FROM  User where profile.Name='Interviewer' and Department=:p.Post__r.Department__r.Name];
            return l;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static String convertStatus(String statusName){
        List<LeadStatus> leadStatuses = [SELECT MasterLabel FROM LeadStatus WHERE IsConverted = true];
       
        for (LeadStatus ls : leadStatuses) {
            if (ls.MasterLabel.equals(statusName)) {
                return ls.MasterLabel;
            }
        }
     
        return null; 
    }
}