public class ContractPDFGenerator {
    
    @future(callout=true)
    public static void createPDFContracts(Id id) {
        contract cont=[select Id,  opportunity__r.Name  from contract where Id=:id];
        PageReference pdfPage = Page.contracttemplate;
        pdfPage.getParameters().put('id', id);
        Blob pdfBlob = pdfPage.getContentAsPDF();
        
        // Create ContentVersion
        ContentVersion cv = new ContentVersion();
        cv.Title = 'Contract' +cont.opportunity__r.Name + '.pdf';
        cv.PathOnClient = 'Contract_'  +cont.opportunity__r.Name + '.pdf';
        cv.VersionData = pdfBlob;
        cv.FirstPublishLocationId = UserInfo.getUserId(); // Optional, depending on your use case
        
        // Insert ContentVersion
        insert cv;
        
        // Ensure ContentDocumentId is populated after insertion
        cv = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id LIMIT 1];
        
        // Retrieve ContentDocument
        List<ContentDocument> documents = [SELECT Id FROM ContentDocument WHERE Id = :cv.ContentDocumentId LIMIT 1];
        System.debug(documents);
        // Check if ContentDocument is retrieved successfully
        if (!documents.isEmpty()) {
            // Create ContentDocumentLink
            List<ContentDocumentLink> contentDocumentLinks = new List<ContentDocumentLink>();
            
            ContentDocumentLink cl = new ContentDocumentLink(
                LinkedEntityId = cont.Id,
                ContentDocumentId = documents[0].Id,
                ShareType = 'V'
            );
            contentDocumentLinks.add(cl);
        
            // Insert ContentDocumentLinks
            insert contentDocumentLinks;
            
        } else {
            System.debug('Failed to retrieve ContentDocument.');
        }
        
    }
}