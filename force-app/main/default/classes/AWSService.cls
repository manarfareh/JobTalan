public with sharing class AWSService {

    @future(callout=true)
    public static void postToS3(string recordId){
        
        //User Variables
        String key = 'AKIAWM7AWFVWBMPHDFW5'; 							
        String secret = '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'; 			
        String method = 'PUT';									
        String bucketname = 'talanjobcv'; 		
        String region = 'eu-north-1';					
        String service = 's3';												 
        String host = bucketname+'.'+service+'.'+region+'.amazonaws.com';	
        String filename = 'resume.pdf';									       
        String fileType = 'application/pdf';            //aaa
        
        List<ContentDocumentLink> links=[SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId=:recordId];
        Set<Id> ids=new Set<Id>();
        for(ContentDocumentLink link:links)
        {
            ids.add(link.ContentDocumentId);
        }
        List<ContentVersion> versions=[SELECT VersionData,Title,ContentDocumentId,FileExtension FROM ContentVersion WHERE ContentDocumentId = :ids];
        
         String attachmentBody = EncodingUtil.base64Encode(versions[0].VersionData);
        Blob fileBlob = EncodingUtil.base64Decode(attachmentBody);
    
        //Current Date and Time formatted in different ways.
        String longDate = Datetime.now().formatGMT('yyyyMMdd\'T\'HHmmss\'Z\'');
        String shortDate = Datetime.now().formatGMT('yyyyMMdd');
        String formattedDateString = Datetime.now().formatGMT('E, dd MMM yyyy HH:mm:ss z');
    
    
        //Variables User in the Signiture Process
        String algorithmName = 'HmacSHA256';
        String algorithmUsed = 'AWS4-HMAC-SHA256';
        String headersInSigniture = 'date;host;x-amz-content-sha256;x-amz-date';
    
    
        //Calculated Variables
        String url = 'https://' + bucketname + '.' + service + '.' + region + '.amazonaws.com' + '/' + filename;
        Blob paylodHashing = Crypto.generateDigest('SHA-256', fileBlob);
        String hashedPaylod = EncodingUtil.convertToHex(paylodHashing);
        String credential = key +'/'+ shortDate +'/'+ region +'/'+ service +'/aws4_request';    
    
    
        //Create Canonical Request String, Hash it, then convert to hex.
        String canonicalRequest  = 	method + '\n' + 
                        '/'+ filename + '\n' + 
                        '\n' +				                    
                        'date:'+ formattedDateString + '\n' +
                        'host:'+ host + '\n' +
                        'x-amz-content-sha256:'+ hashedPaylod + '\n'+
                        'x-amz-date:'+ longDate + '\n'+
                        '\n' + 
                        headersInSigniture + '\n' + 
                        hashedPaylod;
    
        Blob canonicalHash = Crypto.generateDigest('SHA-256', Blob.valueof(canonicalRequest));
        String canonicalHashString = EncodingUtil.convertToHex(canonicalHash);
    
    
        //Create String To Sign String, Hash it, then convert to hex.
        String stringToSign = 	algorithmUsed + '\n' + 
                      longDate + '\n' + 
                      shortDate +'/'+ region +'/'+ service +'/aws4_request' + '\n' +
                      canonicalHashString;
    
    
        //Create Signing Key by Hashing, then convert to hex.
        Blob KDate = Crypto.generateMac(algorithmName, Blob.valueof(shortDate), Blob.valueof('AWS4'+ secret));
        Blob kRegion = Crypto.generateMac(algorithmName, Blob.valueof(region), KDate);
        Blob kService = Crypto.generateMac(algorithmName, Blob.valueof(service), kRegion);
        Blob signingKey = Crypto.generateMac(algorithmName, Blob.valueof('aws4_request'), kService);
    
    
        //Create the signature by Hashing the String To Sign and Signing Key together.
        Blob blobSignature = Crypto.generateMac(algorithmName, Blob.valueof(stringToSign), signingKey);
        String signature = EncodingUtil.convertToHex(blobSignature);       
    
    
        //Create the Http Request.
        HttpRequest req = new HttpRequest();
        req.setMethod(method);
        req.setEndpoint(url);
        req.setHeader('Authorization', algorithmUsed +' Credential='+ credential +',SignedHeaders='+ headersInSigniture +',Signature='+ signature);
        req.setHeader('date', formattedDateString);
        req.setHeader('host', host);
        req.setHeader('x-amz-content-sha256', hashedPaylod);
        req.setHeader('x-amz-date', longDate);
        req.setHeader('content-type', fileType);
        //If you want to add more header Here be sure to add them to the canonicalRequest and headersInSigniture String.
        req.setBodyAsBlob(fileBlob);
    
    
        //Submit the Request.
        Http http = new Http();
        HTTPResponse res = http.send(req);
        system.debug(res);
        if (res.getStatusCode() == 200) {
            system.debug(res.getBody());
        }else{
            system.debug(res.getBody());
        }
    }
    
}