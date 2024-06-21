trigger testpassed on Lead (before update,after insert) {
    for (Lead lead : Trigger.new) {
        if (Trigger.isUpdate) {
        if ( lead.testscore__c != 0 && lead.Status == 'testsent' ) {
            if(lead.testscore__c>=60) 
            {
                lead.Status = 'Resume Review';
                String bodymsg='Dear '+lead.FirstName+',<br> I hope this email finds you well.<br>I am pleased to inform you that you have successfully completed the online test . Your score reflects your dedication and capabilities, and we appreciate the time and effort you invested in this assessment.<br> Your results indicate that you have'+ lead.testscore__c+'% showcasing your strong understanding of the key concepts and requirements for this role. We are impressed by your performance and believe that your skills align well with our expectations.<br> We will review your candidacy and inform you soon<br';
                
                
                bodymsg+='Best regards,<br> Manar Fareh, <br> RH,<br> Talan.';
                email.sendemail(bodymsg, lead.Email, 'Test Passed');
            }
            else 
            {
                lead.Status = 'Closed - Not Converted';
                String bodymsg = 'Dear Candidate'+lead.FirstName+',<br><br>Thank you for participating in the online test for our position.<br>We regret to inform you that based on the results of your assessment, your score is '+lead.testscore__c+'.<br>We appreciate your interest in the position and encourage you to continue pursuing opportunities.<br><br>Best regards,<br>Manar Fareh';
       
                email.sendemail(bodymsg, lead.Email, 'Test Passed');
            }
        }
        if ( lead.ResumeScore__c != 0 && lead.Status == 'Resume Scoring' &&  lead.testscore__c == 0 && lead.Post__c!=null) {
            if(lead.ResumeScore__c>=30) 
            {
                lead.Status = 'testsent';
                List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();

                for (Lead mylead : Trigger.new) {
                    if (mylead.Email != null && mylead.FirstName != null) {
                        Messaging.SingleEmailMessage newMail = new Messaging.SingleEmailMessage();
                        newMail.setToAddresses(new List<String> { mylead.Email });
                        newMail.setSubject('technical test');
                        String body = 'Hello ' + mylead.FirstName + ', <br> <br>';
                        body += 'Subject: Invitation to Complete a technical test Evaluation .<br>';
                        body += 'I hope this email finds you well.<br>';
                        body += 'Below, you will find the details regarding the test technique:<br>';
                        body += ' Link: https://talan-8d-dev-ed.develop.my.site.com/TestTalanJob/login. <br>';
                        body += ' Duration: 30 min.<br>';
                        body += 'Instructions: You can start your test only once, and you cannot open other windows.<br>';
                        body += 'Deadline: 5 days.<br>';
                        body += ' Please let us know if you have any questions or concerns regarding the test technique or the evaluation process. We are here to support you throughout this stage and ensure a smooth experience.<br>';
                        body += ' We truly appreciate your interest in joining Talan, and we look forward to reviewing your performance on the test technique.<br><br>';
                        body += 'Best regards.<br>';
                        body += 'Manar FAREH,<br>';
                        body += 'HR,<br>';
                        body += 'Talan.';    
                        newMail.setHtmlBody(body);
                        OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address = 'farehmanar89@gmail.com'];
                        newMail.setOrgWideEmailAddressId(owea.get(0).Id);
                        mailList.add(newMail);
                    }
                }
            
                Messaging.SendEmailResult[] results = Messaging.sendEmail(mailList);
                for (Messaging.SendEmailResult result : results) {
                    if (!result.isSuccess()) {
                        System.debug('Failed to send email. Reason: ' + result.getErrors()[0].getMessage());
                    }
                }
            }
            else 
            {
                lead.Status = 'Closed - Not Converted';
                String bodymsg = 'Dear Candidate'+lead.FirstName+',<br><br>Thank you for participating in the online test for our position.<br>We regret to inform you that based on the results of your assessment, your score is '+lead.testscore__c+'.<br>We appreciate your interest in the position and encourage you to continue pursuing opportunities.<br><br>Best regards,<br>Manar Fareh';
       
                email.sendemail(bodymsg, lead.Email, 'Test Passed');
            }
        }


        else if ( lead.ResumeScore__c != 0 && lead.Status == 'Resume Scoring' &&  lead.testscore__c == 0 && lead.Post__c==null) {
            if(lead.ResumeScore__c>=30) 
            {
                List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();

                for (Lead mylead : Trigger.new) {
                    if (mylead.Email != null && mylead.FirstName != null) {
                        Messaging.SingleEmailMessage newMail = new Messaging.SingleEmailMessage();
                        newMail.setToAddresses(new List<String> { mylead.Email });
                        newMail.setSubject('Matching Job');
                        String body = 'Hello ' + mylead.FirstName + ', <br> <br>';
                        body += 'Subject: Matching Job <br>';
                        body += 'I hope this email finds you well.<br>';
                        body += 'We find a job that we think it is right fo you , you can postulate on it here:<br>';
                        body += ' Link: https://talan-8d-dev-ed.develop.my.site.com/JobTalan/. <br>';
                        body += 'Best regards.<br>';
                        body += 'Manar FAREH,<br>';
                        body += 'HR,<br>';
                        body += 'Talan.';    
                        newMail.setHtmlBody(body);
                        OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address = 'farehmanar89@gmail.com'];
                        newMail.setOrgWideEmailAddressId(owea.get(0).Id);
                        mailList.add(newMail);
                    }
                }
            
                Messaging.SendEmailResult[] results = Messaging.sendEmail(mailList);
                for (Messaging.SendEmailResult result : results) {
                    if (!result.isSuccess()) {
                        System.debug('Failed to send email. Reason: ' + result.getErrors()[0].getMessage());
                    }
                }
            }
        }
    }
    }
}
