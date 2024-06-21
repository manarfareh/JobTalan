import { LightningElement ,wire, api,track} from 'lwc';
import getRelatedFilesByRecordIdLead from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordIdLead';
import updateLead from '@salesforce/apex/LeadController.updateLead';
import updateLeadref from '@salesforce/apex/LeadController.updateLeadref';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
export default class Resumereview extends NavigationMixin(LightningElement) {
    @api recordId; 
    filesList;
    @track isModalOpen = false;
    @track interviewerData;
    userlist= [];
    userName;
    @track Interviewervalue;
    @wire(getRelatedFilesByRecordIdLead, { recordId: '$recordId' })
    wiredFiles({ error, data }) {
        if (data) {
            console.log(data);
            this.filesList = Object.keys(data).map(item => ({
                label: data[item],
                value: item,
                "url":`/sfc/servlet.shepherd/document/download/${item}`
            }));
            console.log(this.filesList);
        } else if (error) {
            console.error('Error fetching files:', error);
        }
    }
    accept()
{
    updateLead({ LeadId:this.recordId })
    .then(cl => {
        console.log('opp updated :', cl);
        const event = new ShowToastEvent({
            title: 'success',
            variant: 'success',
            message:
                'Lead Convarted Successfully.',
        });
        this.dispatchEvent(event);
        this.closeModal();
    })
    .catch(error => {
        console.error('Error updating opp:', error);
    });
   /* this.isModalOpen=true;
    getInterviewer({LeadId: this.recordId})
    .then(cl => {
        this.interviewerData=cl;
        this.userlist = [...cl.map(dep => ({ label: dep.Name, value: dep.Name }))];
        console.log('opp updated :',  this.userlist);
    })
    .catch(error => {
        console.error('Error updating opp:', error);
    });*/
}
submit()
{
   
}
refuse()
{
    updateLeadref({ LeadId: this.recordId })
    .then(cl => {
        console.log('opp updated :', cl);
        const event = new ShowToastEvent({
            title: 'success',
            variant: 'success',
            message:
                'Lead Rejected Successfully.',
        });
        this.dispatchEvent(event);
        this.closeModal();
    })
    .catch(error => {
        console.error('Error updating opp:', error);
    });
}
previewHandler(event){
    console.log(event.target.dataset.id)
    this[NavigationMixin.Navigate]({ 
        type:'standard__namedPage',
        attributes:{ 
            pageName:'filePreview'
        },
        state:{ 
            selectedRecordId: event.target.dataset.id
        }
    })
}

handleChange(event) {
    this.userName = event.target.value;
}
closeModal()
{
    this.close('okay');
}
}