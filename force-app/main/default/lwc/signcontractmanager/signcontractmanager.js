import { LightningElement, api, wire, track } from 'lwc';
import getContractByOppId from '@salesforce/apex/opportunitycontroller.getContractByOppId';

export default class Signcontractmanager extends LightningElement {
    @api recordId; 
    @track contractData;
    @track getstatus = false;
    aa=false;
    @wire(getContractByOppId, { OppId: '$recordId' })
    wiredGetContractByOppId({ error, data }) {
        if (data) {
            this.contractData = data[0];
           // console.log('Contract data:',data[0]);
            if (data[0] && data[0].Status==="signed by client") {
                //console.log('true');
                this.getstatus = true;
            } else {
                console.log('false');
                this.getstatus = false;
            }
        } else if (error) {
            console.error('Error fetching contract data:', error);
        }
    }
}
