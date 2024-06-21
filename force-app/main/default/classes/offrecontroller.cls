public with sharing class offrecontroller {
    @AuraEnabled(cacheable=true)
    public static List<Integer> getoffre()
    {
        List<Integer> l;//l=[select Id, Name,department__c, description__c from offre__c];
        return l;
    }
}