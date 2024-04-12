trigger ContractTrigger on Contract (after insert) {
    if (Trigger.isAfter && Trigger.isInsert) {
        for (Contract newContract : Trigger.new) {
            ContractPDFGenerator.createPDFContracts(newContract.Id);
        }
    }
}
