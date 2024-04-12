trigger testpassed on Lead (before update) {
    for (Lead lead : Trigger.new) {
        if (lead.testscore__c != 0) {
            lead.Status = 'TestCompleted';
        }
    }
}
