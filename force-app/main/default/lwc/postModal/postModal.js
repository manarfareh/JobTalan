import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getPostById from '@salesforce/apex/postcontroller.getPostById'
import createLead from '@salesforce/apex/LeadController.createLead';
import idpost from 'c/getoffre'
export default class PostModal extends LightningModal {
    @api content;
    @api idpost;
    @api postname;
   @api  myRecordId='00QQy000006dBHuMAM';
   post;

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }


    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
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