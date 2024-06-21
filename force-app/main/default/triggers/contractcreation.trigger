trigger contractcreation on Opportunity (after update, after insert) {
for(Opportunity opp : trigger.new)
{
    Opportunity oppo=[select id, Owner.Email from opportunity where id=:opp.ID];
    if (Trigger.isUpdate) {
        if(opp.StageName=='Contract sent')
        {
        Contract cont=new Contract();
        cont.Opportunity__c=opp.Id;
        cont.Status='sent to client';
        cont.AccountId='001Qy00000EKnu9IAD';
        cont.StartDate=opp.Post__r.Start_Date__c;
        cont.ContractTerm=1;
        insert cont;
        system.debug('email   lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll' +oppo.Owner.Email);
        String bodymsg  = 'Dear Candidate,<br><br>We are pleased to inform you that a  contract has been created for you and you need to sign it within 20 days.<br>Please login to your portail to Sign your contract :https://talan-8d-dev-ed.develop.my.site.com/JobTalan/s/myapplication.<br><br>Best regards,<br><br>Manar Fareh';
            email.sendemail(bodymsg, oppo.Owner.Email, 'Signing Contract');
        }
    }
    if (Trigger.isInsert) {
        Interview__c interview=new Interview__c();
        interview.Opportunity__c=opp.Id;
        List<InterviewDetail__c> inter=[select Id ,Last_Interviewer__c from InterviewDetail__c where Order__c=1 and Post__c=:opp.Post__c];
        List<Interviewer__c> rec=[select Id, Interviewer__c from Interviewer__c where Interview_Detail__c=:inter[0].Id];
        interview.Interview_Detail__c=inter[0].Id;
        Integer i=0;
        Boolean conditionMet = false;
        if(inter[0].Last_Interviewer__c==null)
            {
                    interview.Interviewer__c=rec[0].Interviewer__c;
                    inter[0].Last_Interviewer__c =rec[0].Interviewer__c;
             }
        else {for(Interviewer__c aa : rec)
        {
            
            if(!conditionMet && aa.Interviewer__c==inter[0].Last_Interviewer__c)
            {
                if(i<rec.size()-1)
                {
                    interview.Interviewer__c=rec[i+1].Interviewer__c;
                    inter[0].Last_Interviewer__c =rec[i+1].Interviewer__c;
                }
                else if(i==rec.size()-1)
                {
                    interview.Interviewer__c=rec[0].Interviewer__c;
                    inter[0].Last_Interviewer__c =rec[0].Interviewer__c;
                }
                conditionMet = true;
            } else if (conditionMet) {
            break; // Exit the loop if the condition is already met
        }
            i++;
        }}
    
        system.debug('email   lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll' +oppo.Owner.Email);
        String bodymsg  = 'Dear Candidate,<br><br>We are pleased to inform you that a new interview has been scheduled for you.<br><br>Please login to your portail to choose a date:https://talan-8d-dev-ed.develop.my.site.com/JobTalan/s/myapplication.<br><br>Best regards,<br>Manar Fareh';
            email.sendemail(bodymsg, oppo.Owner.Email, 'Interview scheduling');
        update inter;
        insert interview;
    }
}
}