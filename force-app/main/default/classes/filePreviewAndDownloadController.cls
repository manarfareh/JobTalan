public with sharing class filePreviewAndDownloadController {
    @AuraEnabled(cacheable=true)
        public static Map<ID, String> getRelatedFilesByRecordId(String recordId) {
            // Get record file IDs  
            List<contract> cont=[select Id,  opportunity__r.Id  from contract where opportunity__r.Id =:recordId];      
            List<ContentDocumentLink> files = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :cont[0].Id];
            List<ID> fileIDs = new List<ID>();
            for (ContentDocumentLink docLink : files) {
                fileIDs.add(docLink.ContentDocumentId);
            }
     
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
            Map<ID, String> mapIdTitle = new Map<ID, String>();
            for (ContentVersion docLink : docs) {
                mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
            }
            return mapIdTitle;
        }

        @AuraEnabled(cacheable=true)
        public static Map<ID, String> getRelatedFilesByRecordIdLead(Id recordId) {

            List<ContentDocumentLink> files = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
            List<ID> fileIDs = new List<ID>();
            for (ContentDocumentLink docLink : files) {
                fileIDs.add(docLink.ContentDocumentId);
            }
     
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
            Map<ID, String> mapIdTitle = new Map<ID, String>();
            for (ContentVersion docLink : docs) {
                mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
            }
            return mapIdTitle;
        }
}