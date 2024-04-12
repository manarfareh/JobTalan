import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getUserId from '@salesforce/apex/LeadController.getUserId';
import createLead from '@salesforce/apex/LeadController.createLead';
import LeadFile from '@salesforce/apex/LeadController.LeadFile';
export default class MyModal extends LightningModal {
    @api content;
    myRecordId;
    fileid;
    get acceptedFormats() {
        return ['.pdf', '.png'];
    }
    @wire(getUserId)
    wiredGetUserId({ error, data }) {
        if (data) {
            this.myRecordId = data;
            console.log(data);
            console.log(this.myRecordId);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        this.fileid=uploadedFiles[0].documentId;
        if (uploadedFiles.error) {
            console.error('Error uploading file:', uploadedFiles.error[0].message);
        } else {
            console.log('File uploaded successfully');
        }
    }
    handleSubmit(event) {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const leadData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email')
        };
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
         console.log(this.idpost);
        createLead({ leadData: leadData })
            .then(leadId => {
                console.log('Lead created with ID:', leadId);
                LeadFile({ leadid: leadId,idfile: this.fileid })
                .then(cl => {
                    console.log('file created :', cl);
                })
                .catch(error => {
                    console.error('Error creating file:', error);
                });
            })
            .catch(error => {
                console.error('Error creating lead:', error);
            });
    }
    handleOkay() {
        this.close('okay');
    }
}