public class AwsUtility {

    @future(callout=true)
    public static void UploadDocuments(string recordId, string idpost)
    {    
                    Http scorehttp = new Http();
                    HttpRequest scorerequest = new HttpRequest();
                    WorkPost__c lead1=[select Id,Diploma__c, Name ,Skills__c,Post_Description__c from WorkPost__c where id=:idpost ];
                    String job_data;
                    job_data += 'Business Title:' + lead1.Name;
                    job_data += 'Job Description:' + lead1.Post_Description__c;
                    job_data += 'Minimum Qual Requirements' + lead1.Diploma__c;
                    job_data += 'Preferred Skills:' + lead1.Skills__c;
                
                // Construct the endpoint URL with query parameters
                scorerequest.setEndpoint('https://a3w5jnjn5d6v5cy2tvrlm4kwpu0afiuw.lambda-url.eu-north-1.on.aws/?text='+EncodingUtil.urlEncode(job_data, 'UTF-8'));
                
                // Use GET method
                scorerequest.setMethod('GET');
                
                HttpResponse response = scorehttp.send(scorerequest);
                
                // Handle the response
                if (response.getStatusCode() == 200) {
                    Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                    Decimal prediction = (Decimal) responseBody.get('prediction');
                    Lead lead=[select id,ResumeScore__c from lead where id=:recordId];
                    lead.ResumeScore__c=prediction;
                    update lead;
                } else {
                    System.debug('Error: ' + response.getStatusCode() + ' ' + response.getStatus());
                }
                }
}