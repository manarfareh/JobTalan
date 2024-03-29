import { LightningElement } from 'lwc';
import uploadFile from '@salesforce/apex/FileUploadController.uploadFile';
export default class LeadCreation extends LightningElement {
     leadId='00Qaj000002BaWsEAK';
    handleFileInputChange(event) {
        this.file = event.target.files[0];
    }
    
    uploadFile() {
        if (!this.file || !this.leadId) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const fileContents = reader.result;
            const base64 = 'base64,';
            const dataStart = fileContents.indexOf(base64) + base64.length;
            const fileContent = fileContents.substring(dataStart);
            console.log(fileContents);
            console.log(base64);
            console.log(dataStart);
            console.log(fileContents);
            uploadFile({
                fileName: this.file.name,
                base64Data: fileContent,
                leadId: this.leadId
            })
            .then(result => {
                if (result) {
                    // File uploaded successfully
                } else {
                    // File upload failed
                }
            })
        };

        reader.readAsDataURL(this.file);
    }
}