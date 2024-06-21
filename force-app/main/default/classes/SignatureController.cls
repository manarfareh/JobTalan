public with sharing class SignatureController {
 
    @AuraEnabled(cacheable=true)
    public static List<Attachment> getContractAttachments(Id contractId) {
        return [SELECT Id, Name, Body, ContentType FROM Attachment WHERE ParentId = :contractId];
    }
 
   
    @AuraEnabled
    public static Attachment saveSignature(String signElement,Id ContId){

        Blob signContent = EncodingUtil.base64Decode(signElement);
               
       /* ContentVersion cv = new ContentVersion();
        cv.Title = 'signclient' +'.png';
        cv.PathOnClient = 'signclient'+'.png';
        cv.VersionData = signContent;
        cv.FirstPublishLocationId = UserInfo.getUserId();
        
        insert cv;
        cv = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id LIMIT 1];
        
        // Retrieve ContentDocument
        List<ContentDocument> documents = [SELECT Id FROM ContentDocument WHERE Id = :cv.ContentDocumentId LIMIT 1];
       
        ContentDocumentLink cl = new ContentDocumentLink(
                LinkedEntityId = ContId,
                ContentDocumentId = documents[0].Id,
                ShareType = 'V',
                Visibility = 'AllUsers'
            );
        insert cl;
     return documents[0];*/
       
                // Create new Attachment Object
               List<Contract> cnt = [SELECT Id, Status FROM Contract WHERE Id=:ContId LIMIT 1];
               Attachment newAttachment = new Attachment();
                newAttachment.ParentId = ContId;  // Assuming contractId is passed correctly to this method
               if(cnt[0].Status=='sent to client') newAttachment.Name = 'SignatureClient.png';
               else newAttachment.Name = 'SignatureManager.png';
                newAttachment.ContentType = 'image/png';
                newAttachment.Body = signContent; 
                insert newAttachment;
                updateContractStage(ContId);
                return newAttachment;
    }
 
    @AuraEnabled
    public static void updateContractStage(Id ContId) {
 
            List<Contract> contractRecord = [ SELECT Id, Status, opportunity__c  FROM Contract  WHERE id = :ContId  LIMIT 1  ];
 
           Id recId =contractRecord[0].Id;
           if(contractRecord[0].Status=='sent to client') 
           {
            contractRecord[0].Status='signed by client';

            CustomNotificationType notificationType = 
            [SELECT Id, DeveloperName 
             FROM CustomNotificationType 
             WHERE DeveloperName='interviewer'];
        
        // Create a new custom notification
        Messaging.CustomNotification notification = new Messaging.CustomNotification();

        // Set the contents for the notification
        notification.setTitle('New Contract to sign');
        notification.setBody('You have a new contract to sign');

        // Set the notification type and target
        notification.setNotificationTypeId(notificationType.Id);
        notification.setTargetId('005Qy000003aPkXIAU');
       Set<String> recipientsIds = new Set<String>{'005Qy000003aPkXIAU'};
        // Actually send the notification
        try {
            notification.send(recipientsIds);
        }
        catch (Exception e) {
            System.debug('Problem sending notification: ' + e.getMessage());
        }
           }
           else 
           {
            contractRecord[0].Status = 'signed';
            List<Opportunity> oppsToUpdate = [SELECT Id, StageName, ContractId FROM Opportunity WHERE Id=:contractRecord[0].opportunity__c];
                        oppsToUpdate[0].StageName = 'Closed Won';
                        update oppsToUpdate[0];
           }
                update contractRecord[0];
     }


     @AuraEnabled(cacheable=true)
    public static String getSign(Id ContId) {
      
     List<Attachment>  signatureAttachmentsclient= [SELECT Id, Name, ParentId FROM Attachment WHERE ParentId = :ContId AND Name LIKE '%SignatureClient%' LIMIT 1];
    
        String signatureUrlsclient='/servlet/servlet.FileDownload?file=' + signatureAttachmentsclient[0].Id;
        return signatureUrlsclient;
    }
     
 
}