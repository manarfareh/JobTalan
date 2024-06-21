trigger resumereviewtrig on Lead (after update) {
        for (Lead lead : Trigger.new) {
          if(lead.resume_verified__c==true)
            {
                if (TriggerHandlerUtility.isLeadInsertProcessed()) {
                    return;
                }
                List<Database.LeadConvert> leadConverts = new List<Database.LeadConvert>();
             
                for (Lead l : Trigger.new) {
                        Database.LeadConvert lc = new Database.LeadConvert();
                        lc.setLeadId(l.Id);
                        lc.setConvertedStatus(LeadController.convertStatus('Closed - Converted')); 
                        leadConverts.add(lc);
                }
             
                if (!leadConverts.isEmpty()) {
                    TriggerHandlerUtility.setLeadInsertProcessed(true);
                    List<Database.LeadConvertResult> results = Database.convertLead(leadConverts, false);
                    for (Database.LeadConvertResult result : results) {
                        if (!result.isSuccess()) {
                        }
                    }
                    TriggerHandlerUtility.setLeadInsertProcessed(false);
                }
            }
        }
}