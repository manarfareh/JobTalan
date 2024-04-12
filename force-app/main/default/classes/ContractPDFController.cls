public class ContractPDFController {
    public Contract contract { get; set; }
    
    public ContractPDFController() {
        String contractId = ApexPages.currentPage().getParameters().get('id'); 
        contract = [SELECT Id, opportunity__r.Name   FROM Contract WHERE Id = :contractId];
    }
}