public with sharing class postcontroller {
    @AuraEnabled(cacheable=true)
    public static List<WorkPost__c> getoffre()
    {
        List<WorkPost__c> l=[select Id,Location__c, Name, Salary__c, Type__c, Skills__c,Years_Of_Experience__c, Start_Date__c,  Diploma__c,	Contract_Type__c,Post_Description__c from WorkPost__c];
        return l;
    }


    @AuraEnabled(cacheable=true)
    public static List<Department__c> getoffreByDepartmentandType(String DepartmentName ,String Type)
    {
        List<Department__c> l=new List<Department__c>();
        if(Type=='All') l=[select Id, (select  Id,Location__c, Name, Salary__c, Type__c, Skills__c,Years_Of_Experience__c, Start_Date__c, Diploma__c,	Contract_Type__c,Post_Description__c from Posts__r) from Department__c where Name= :DepartmentName];
        else if(DepartmentName=='All') l=[select Id, (select  Id,Location__c, Name, Salary__c, Type__c, Skills__c,Years_Of_Experience__c, Start_Date__c, Diploma__c,	Contract_Type__c,Post_Description__c from Posts__r where Type__c=:Type) from Department__c ];
        else l=[select Id, (select  Id,Location__c, Name, Salary__c, Type__c, Skills__c,Years_Of_Experience__c, Start_Date__c, Diploma__c,	Contract_Type__c,Post_Description__c from Posts__r where Type__c=:Type) from Department__c where Name= :DepartmentName];
        return l;
    }


    @AuraEnabled(cacheable=true)
    public static List<Department__c> getDepartment(){
        try {
            return [select Id,Name from Department__c];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static WorkPost__c getPostById( Id PostId){
        try {
            return [select Id,Location__c, Name, Salary__c, Type__c, Skills__c,Years_Of_Experience__c, Start_Date__c,  Diploma__c,	Contract_Type__c,Post_Description__c from WorkPost__c where id=:PostId];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<InterviewDetail__c> getInterviewDetailsById( Id PostId){
        try {
            return [select Id,Interview_Type__c, Order__c, Post__c from InterviewDetail__c where Post__c=:PostId Order by Order__c];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

