public with sharing class email {
    public static void sendemail(String bodymsg, String Email, String subject) {
        List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();

        
                Messaging.SingleEmailMessage newMail = new Messaging.SingleEmailMessage();
                newMail.setToAddresses(new List<String> { Email });
                newMail.setSubject(subject);
                String body = bodymsg;   
                newMail.setHtmlBody(body);
                OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address = 'farehmanar89@gmail.com'];
                newMail.setOrgWideEmailAddressId(owea.get(0).Id);
                mailList.add(newMail);
        
    
        Messaging.SendEmailResult[] results = Messaging.sendEmail(mailList);
        for (Messaging.SendEmailResult result : results) {
            if (!result.isSuccess()) {
                System.debug('Failed to send email. Reason: ' + result.getErrors()[0].getMessage());
            }
        }
    }
}