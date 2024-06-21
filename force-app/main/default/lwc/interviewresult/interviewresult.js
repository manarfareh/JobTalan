
import { LightningElement, api, wire, track } from 'lwc';
import getPassedInterview from '@salesforce/apex/opportunitycontroller.getPassedInterview';
import updateOpp from '@salesforce/apex/opportunitycontroller.updateOpp';
import updateOppref from '@salesforce/apex/opportunitycontroller.updateOppref';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Interviewresult extends LightningElement {
    @api recordId; 
    @track isModalOpen = false;
    @track interviewData;

    @wire(getPassedInterview, {OppId: '$recordId' })
    wiredInterview({ error, data }) {
        if (data) {
            console.log(data);
            console.log(this.recordId);
            this.interviewData = data;
        } else if (error) {
            console.error('Error:', error);
        }
    }
accept()
{
    updateOpp({ OppId:this.recordId })
    .then(cl => {
        console.log('opp updated :', cl);
        const event = new ShowToastEvent({
            title: 'success',
            variant: 'success',
            message:
                'Candidate Accepted Successfully.',
        });
        this.dispatchEvent(event);
        this.closeModal();
    })
    .catch(error => {
        console.error('Error updating opp:', error);
    });
}
refuse()
{
    updateOppref({ OppId: this.recordId })
    .then(cl => {
        console.log('opp updated :', cl);
        const event = new ShowToastEvent({
            title: 'success',
            variant: 'success',
            message:
                'Candidacy Annulled.',
        });
        this.dispatchEvent(event);
        this.closeModal();
    })
    .catch(error => {
        console.error('Error updating opp:', error);
    });
}
    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
