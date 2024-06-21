public class ContractPDFController {
    public Contract contract { get; set; }
    public List<String> signatureUrlsclient { get; set; }
    public List<String> signatureUrlsmanager { get; set; }
    public List<Attachment> signatureAttachmentsclient { get; set; }
    public List<Attachment> signatureAttachmentsmanager { get; set; }
    public ContractPDFController() {
        String contractId = ApexPages.currentPage().getParameters().get('id'); 
        contract  =[select Id,status ,contractNumber,opportunity__r.Id, opportunity__r.Name,opportunity__r.Post__r.Id,opportunity__r.Post__r.Start_Date__c, opportunity__r.Post__r.Name ,opportunity__r.Post__r.Contract_Type__c,opportunity__r.Post__r.Post_Description__c, opportunity__r.Post__r.Location__c,opportunity__r.Post__r.Salary__c ,opportunity__r.Post__r.Type__c from contract where Id = :contractId];

        signatureAttachmentsclient = [SELECT Id, Name, ParentId FROM Attachment WHERE ParentId = :contract.Id AND Name LIKE '%SignatureClient%' LIMIT 1];
        signatureUrlsclient = new List<String>();
        for (Attachment attachment : signatureAttachmentsclient) {
            signatureUrlsclient.add('/servlet/servlet.FileDownload?file=' + attachment.Id);
        }
        signatureAttachmentsmanager = [SELECT Id, Name, ParentId FROM Attachment WHERE ParentId = :contract.Id AND Name LIKE '%SignatureManager%' LIMIT 1];
        signatureUrlsmanager = new List<String>();
        for (Attachment attachment : signatureAttachmentsmanager) {
            signatureUrlsmanager.add('/servlet/servlet.FileDownload?file=' + attachment.Id);
        }
    }
}

