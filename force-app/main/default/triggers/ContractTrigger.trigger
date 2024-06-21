trigger ContractTrigger on Contract (after update) {
    if (Trigger.isUpdate) {
        for (Contract newContract : Trigger.new) {
            if (newContract.Status == 'signed') {
                if (newContract.Opportunity__c != null) {
                        List<Opportunity> oppsToUpdate = [SELECT Id,Owner.Email, StageName FROM Opportunity WHERE Id=:newContract.Opportunity__c];
                            oppsToUpdate[0].StageName = 'Closed Won';
                        update oppsToUpdate[0];
                        ContractPDFGenerator.createPDFContracts(newContract.Id);
                        String bodymsg  = 'Dear Candidate,\n\nWe are pleased to inform you that a contract has been signed by the manager .\n\nPlease login to your portail to Consult your contract :https://talan-8d-dev-ed.develop.my.site.com/JobTalan/s/myapplication.\n\nBest regards,\nManar Fareh';
                        email.sendemail(bodymsg, oppsToUpdate[0].Owner.Email, 'Contract Signed');
                    }
                }
            }
        }
}

        