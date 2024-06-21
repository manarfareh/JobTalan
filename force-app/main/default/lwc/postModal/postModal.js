import { api, track, wire } from 'lwc';
import LightningModal from 'lightning/modal';
import getPostById from '@salesforce/apex/postcontroller.getPostById';
import getUserId from '@salesforce/apex/LeadController.getUserId';
import createLead from '@salesforce/apex/LeadController.createLead';
import isGuest from '@salesforce/user/isGuest';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LeadFile from '@salesforce/apex/LeadController.LeadFile';
import getInterviewDetailsById from '@salesforce/apex/postcontroller.getInterviewDetailsById';
export default class PostModal extends LightningModal {
    @api content;
    fileName;
    uploadedFiles;
    @api idpost=false;
    @api postname;
    @track cvupl;
    myRecordId;
   post;
   guest=isGuest;
   fileid;
   interview;

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
         this.uploadedFiles = event.detail.files;
        this.fileid=this.uploadedFiles[0].documentId;
        if (this.uploadedFiles.error) {
            console.error('Error uploading file:', this.uploadedFiles.error[0].message);
            this.cvupl=false;
        } else {
            console.log('File uploaded successfully');
            this.cvupl=true;
            this.fileName = this.uploadedFiles[0].name;
        }
    }
    handleSubmit(event) {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        if(this.idpost){const leadData = {
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
            const event = new ShowToastEvent({
                title: 'success',
                variant: 'success',
                message:
                    'Candidacy Submitted Successfully.',
            });
            this.dispatchEvent(event);
            this. handleOkay();
        })
        .catch(error => {
            console.error('Error creating lead:', error);
        });}
        else 
        {
            const leadData = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                email: formData.get('email')
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
                const event = new ShowToastEvent({
                    title: 'success',
                    variant: 'success',
                    message:
                        'Candidacy Submitted Successfully.',
                });
                this.dispatchEvent(event);
                this. handleOkay();
            })
            .catch(error => {
                console.error('Error creating lead:', error);
            });
        }
    }
    handleOkay() {
        console.log(this.idpost);
        this.close('okay');
    }



    
    @wire(getInterviewDetailsById, { PostId: '$idpost' })
    wiredgetInterviewDetailsById({ error, data }) {
        if (data) {
            this.interview = data;
            console.log(data);
            console.log(this.interview);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
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