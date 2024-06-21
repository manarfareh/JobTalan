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
    public static List<Lead> testLead(){
        try {
            Id userId=UserInfo.getUserId();
            List<Lead> l=[select id, testscore__c, Post__r.Name,Creation_Date__c, status from lead where OwnerId=:userId and status='testsent' Limit 1];
            return l;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled()
    public static lead scoreLead(Lead lead, Decimal score){
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

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOppById(Id OppId)
    {
        try {
             return [select Name,LastModifiedDate ,	StageName   from Opportunity where id=:OppId ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<OpportunityContactRole> getOpportunityStatusByContact() {
        Id currentUserId = UserInfo.getUserId();
 
        List<OpportunityContactRole> opportunities = [
            SELECT OpportunityId, Opportunity.Name, Opportunity.StageName
            FROM OpportunityContactRole
            WHERE ContactId IN (
                SELECT ContactId
                FROM User
                WHERE Id = :currentUserId
            )
        ];
 
        return opportunities;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Interview__c> getInterview(Id OppId)
    {
        try {
             return [select Name,Third_Available_Date__c ,Interview_Detail__r.Order__c,Interview_Detail__r.Interview_Type__c,notes__c,	Start_Date__c,Second_Available_Date__c,First_Available_Date__c,Opportunity__c ,Interviewer__r.Name,Decision__c  from Interview__c where Decision__c=null and Opportunity__c=:OppId ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Interview__c> getPassedInterview(Id OppId)
    {
        try {
             return [select Name,Third_Available_Date__c ,Interview_Detail__r.Order__c,Interview_Detail__r.Interview_Type__c,notes__c,	Start_Date__c,Second_Available_Date__c,First_Available_Date__c,Opportunity__c , Decision__c,Interviewer__r.Name  from Interview__c where Decision__c='Accept' and Opportunity__c=:OppId ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<InterviewDetail__c> getAllInterview(Id OppId)
    {
        try {
            Opportunity opp=[select id,Post__c from Opportunity where id=:OppId ];
             return [select Id ,Last_Interviewer__c,Order__c,Interview_Type__c,Name from InterviewDetail__c where Post__c=:opp.Post__c ORDER BY Order__c];
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled()
    public static Interview__c updateInt(Interview__c inter, Date seldate){
        try {
            inter.Start_Date__c=seldate;
            update inter;
            Opportunity oppToUpdate = [SELECT Id, StageName FROM Opportunity WHERE Id = :inter.Opportunity__c];
            oppToUpdate.StageName = 'Interview scheduled';
            update oppToUpdate;
            return inter;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled()
    public static Opportunity updateOpp(Id OppId){
        try {
            Opportunity oppToUpdate = [SELECT Id, StageName FROM Opportunity WHERE Id = :oppid];
            oppToUpdate.StageName = 'Contract sent';
            update oppToUpdate;
            return oppToUpdate;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled()
    public static Opportunity updateOppref(Id OppId){
        try {
            Opportunity oppToUpdate = [SELECT Id, StageName FROM Opportunity WHERE Id = :oppid];
            oppToUpdate.StageName = 'Closed Lost';
            update oppToUpdate;
            return oppToUpdate;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    
    @AuraEnabled(cacheable=true)
    public static List<contract> getContractByOppId(Id OppId){
        try {            
            List<contract> cont=[select Id,status ,contractNumber,opportunity__r.Id, opportunity__r.Name,opportunity__r.Post__r.Id,opportunity__r.Post__r.Start_Date__c, opportunity__r.Post__r.Name ,opportunity__r.Post__r.Contract_Type__c,opportunity__r.Post__r.Post_Description__c, opportunity__r.Post__r.Location__c,opportunity__r.Post__r.Salary__c ,opportunity__r.Post__r.Type__c from contract where opportunity__r.Id =:OppId];
            return cont;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}