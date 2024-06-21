public with sharing class testcontroller {
    @AuraEnabled(cacheable=true)
    public static list<Test__c> gettest(){
            Id userId = UserInfo.getUserId();
            List<Lead> leads = [SELECT Id, Name, Post__c, Post__r.Name, Creation_Date__c, LastTransferDate, Post__r.department__c, Status  FROM Lead  WHERE OwnerId = :userId AND Status = 'testsent' LIMIT 1];
            WorkPost__c post=[select id, Department__c from WorkPost__c where id=:leads[0].Post__c];
            List<Test__c> allTests = [SELECT Id, Question__c, Option_1__c, Option_2__c, Option_3__c, Correct__c, Department__c  FROM Test__c  WHERE Department__c = :post.Department__c];
            
            List<Test__c> selectedTests = new List<Test__c>();
            Set<Integer> selectedIndices = new Set<Integer>();
            
            // Ensure we have at least 10 questions to choose from
            if (allTests.size() > 0) {
                while (selectedIndices.size() < 6) {
                    Integer randomIndex = (Integer)Math.floor(Math.random() * allTests.size());
                    if (!selectedIndices.contains(randomIndex)) {
                        selectedIndices.add(randomIndex);
                        selectedTests.add(allTests[randomIndex]);
                    }
                }
            }
            
            return selectedTests;
    }
}
