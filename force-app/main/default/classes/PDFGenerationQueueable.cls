public class PDFGenerationQueueable implements Queueable {
    List<Contract> contracts;

    public PDFGenerationQueueable(List<Contract> contracts) {
        this.contracts = contracts;
    }

    public void execute(QueueableContext context) {
       // ContractPDFGenerator.createPDFContracts(contracts[0]);
    }
}