import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import createLead from '@salesforce/apex/LeadController.createLead';
import idpost from 'c/getoffre'
export default class MyModal extends LightningModal {
    @api content;
    @api idpost;
   @api  myRecordId='00QQy000006dBHuMAM';

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        console.log('cccccccccccccc' +uploadedFiles.length);
    }
    handleSubmit(event) {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const leadData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            post: this.idpost,
        };
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
         console.log(idpost);
        createLead({ leadData: leadData })
            .then(leadId => {
                console.log('Lead created with ID:', leadId);
            })
            .catch(error => {
                console.error('Error creating lead:', error);
            });
    }
    handleOkay() {
        console.log(this.postid);
        this.close('okay');
    }
}