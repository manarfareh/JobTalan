trigger interviews on Interview__c (after update) {
    for (Interview__c inter : Trigger.new) {
        List<Opportunity> opp=[select Id,StageName,Owner.Email,Post__c from Opportunity where Id=:inter.Opportunity__c ];
        if (inter.Decision__c== 'Accept') {
            List<Interview__c> listinter=[select id from Interview__c where Opportunity__c=:opp[0].Id];
            List<InterviewDetail__c> interDetail=[select Id ,Last_Interviewer__c from InterviewDetail__c where Post__c=:opp[0].Post__c];
            Integer Number_Interview_Passed=listinter.size();
            Integer Number_Interview_To_Passed=interDetail.size();
          if(Number_Interview_Passed==Number_Interview_To_Passed)
          {
            opp[0].StageName='Interview passed';
            update opp[0];
          }
          else if(Number_Interview_Passed<Number_Interview_To_Passed)
          {
            Interview__c interview=new Interview__c();
            interview.Opportunity__c=opp[0].Id;
            List<InterviewDetail__c> new_inter_detail=[select Id ,Last_Interviewer__c from InterviewDetail__c where Order__c=:Number_Interview_Passed+1 and Post__c=:opp[0].Post__c];
            List<Interviewer__c> rec=[select Id, Interviewer__c from Interviewer__c where Interview_Detail__c=:new_inter_detail[0].Id];
            Integer i=0;
            interview.Interview_Detail__c=new_inter_detail[0].Id;
            Boolean conditionMet = false;
            if(new_inter_detail[0].Last_Interviewer__c==null)
                {
                        interview.Interviewer__c=rec[0].Interviewer__c;
                        new_inter_detail[0].Last_Interviewer__c =rec[0].Interviewer__c;
                 }
            else {for(Interviewer__c aa : rec)
            {
                
                if(!conditionMet && aa.Interviewer__c==new_inter_detail[0].Last_Interviewer__c)
                {
                    if(i<rec.size()-1)
                    {
                        interview.Interviewer__c=rec[i+1].Interviewer__c;
                        new_inter_detail[0].Last_Interviewer__c =rec[i+1].Interviewer__c;
                    }
                    else if(i==rec.size()-1)
                    {
                        interview.Interviewer__c=rec[0].Interviewer__c;
                        new_inter_detail[0].Last_Interviewer__c =rec[0].Interviewer__c;
                    }
                    conditionMet = true;
                }
                else if (conditionMet) {
                    break; // Exit the loop if the condition is already met
                }
                i++;
            }}
            opp[0].Stagename='interview scheduling';
            String bodymsg  = 'Dear Candidate,\n\nWe are pleased to inform you that a new interview has been scheduled for you.\n\nPlease login to your portail to choose a date:https://talan-8d-dev-ed.develop.my.site.com/JobTalan/s/myapplication.\n\nBest regards,\nManar Fareh';
            email.sendemail(bodymsg, opp[0].Owner.Email, 'Interview scheduling');
            update opp[0];
            update new_inter_detail;
            insert interview;
          }
        }
        else if (inter.Decision__c== 'Reject') {
            opp[0].StageName = 'Closed Lost';
            String bodymsg = 'Dear Candidate'+lead.FirstName+',<br>We regret to inform you that based on the results of your interviews, your score is .<br>We appreciate your interest in the position and encourage you to continue pursuing opportunities.<br><br>Best regards,<br>Manar Fareh';
       
                email.sendemail(bodymsg, opp[0].Owner.Email, 'Candidacy');
            update opp[0];
        }
       /* else if(Trigger.oldMap.get(inter.Id).StartDate__c != null && inter.StartDate__c == null )
        {
           String bodymsg  = 'Dear Candidate,\n\nYour interview start date is not longer disponible please choose another date.\n\nPlease login to your portail to choose a date:https://talan-8d-dev-ed.develop.my.site.com/JobTalan/s/myapplication.\n\nBest regards,\nManar Fareh';
            email.sendemail(bodymsg, opp[0].Owner.Email, 'Interview scheduling');
        }*/
    }
}