public with sharing class FileUploadController {
    @AuraEnabled
    public static String uploadFile(String fileName, String base64Data, String leadId) 
    {
        Blob fileBlob = EncodingUtil.base64Decode(base64Data);
        Attachment attachment = new Attachment();
        attachment.Name = fileName;
        attachment.Body = fileBlob;
        attachment.ParentId = leadId; 
            insert attachment;
            return attachment.Id;
    }
}