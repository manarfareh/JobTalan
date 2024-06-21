trigger resumescoretrigger on ContentDocumentLink (after insert) {
    for (ContentDocumentLink cont : Trigger.new) {
    List<Lead> leads=[select id,Email,FirstName, Post__c from lead where id=: cont.LinkedEntityId];
    if(!leads.isEmpty() && leads[0].Post__c!=null)
    {
    AWSService.postToS3(cont.LinkedEntityId);
    AwsUtility.UploadDocuments(cont.LinkedEntityId, leads[0].Post__c);
    }
    else if(!leads.isEmpty() && leads[0].Post__c==null)
    {
        String bodymsg='Dear '+leads[0].FirstName+',<br> I hope this email finds you well.<br>I am pleased to inform you that you have successfully completed the online test . Your score reflects your dedication and capabilities, and we appreciate the time and effort you invested in this assessment.<br> Your results indicate that you have showcasing your strong understanding of the key concepts and requirements for this role. We are impressed by your performance and believe that your skills align well with our expectations.<br> We will review your candidacy and inform you soon<br';
        
        
        bodymsg+='Best regards,<br> Manar Fareh, <br> RH,<br> Talan.';
        email.sendemail(bodymsg, leads[0].Email, 'Candidature spontanée');
    }
}
}