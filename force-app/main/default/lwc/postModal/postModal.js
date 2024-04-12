import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getPostById from '@salesforce/apex/postcontroller.getPostById';
import getUserId from '@salesforce/apex/LeadController.getUserId';
import createLead from '@salesforce/apex/LeadController.createLead';
import LeadFile from '@salesforce/apex/LeadController.LeadFile';
export default class PostModal extends LightningModal {
    @api content;
    @api idpost;
    @api postname;
    myRecordId;
   post;
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
            email: formData.get('email'),
            post: this.idpost,
        };
        createLead({ leadData: leadData })
            .then(leadId => {
                console.log('Lead created with ID:', leadId);
                LeadFile({ leadid: leadId,idfile: this.fileid  })
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
        console.log(this.idpost);
        this.close('okay');
    }




    
    @wire(getPostById, { PostId: '$idpost' })
    wiredGetPostById({ error, data }) {
        if (data) {
            this.post = data;
            console.log(data);
            console.log(this.post);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
}