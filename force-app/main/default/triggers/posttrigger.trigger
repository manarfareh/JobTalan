trigger posttrigger on WorkPost__c (after insert) {
    for (WorkPost__c post : Trigger.new) {
    List<Lead> leads=[select id,Email,FirstName, Post__c from lead where Post__c=null];
    for(Lead lead :leads)
    {
    AWSService.postToS3(lead.Id);
    AwsUtility.UploadDocuments(lead.Id,post.Id);
    }
}
}