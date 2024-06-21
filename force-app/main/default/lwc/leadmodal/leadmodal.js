import LightningModal from 'lightning/modal';
import { api, wire,track } from 'lwc';
import getInterview from '@salesforce/apex/opportunitycontroller.getInterview';
import getOppById from '@salesforce/apex/opportunitycontroller.getOppById';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateInt from '@salesforce/apex/opportunitycontroller.updateInt';
import getRelatedFilesByRecordId from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId';
//import getLeadById from '@salesforce/apex/LeadController.getLeadById';
export default class LeadModal extends LightningModal {
    @api oppid;
    @api leadid;
    filesList =[]
    interview;
    lead;
    selectedDate;
    opportunity;
    @track opportunityStatus;
    @track currentStep = '0';
    @track error;
    value = [];
    get options() {
        return [
            { label: this.interview[0].First_Available_Date__c, value: this.interview[0].First_Available_Date__c },
            { label: this.interview[0].Second_Available_Date__c, value: this.interview[0].Second_Available_Date__c },
            { label: this.interview[0].Third_Available_Date__c, value: this.interview[0].Third_Available_Date__c}
        ];
    }
    get isStepOne() {
        return this.currentStep === '1';
    }
 
    get isStepTwo() {
        return this.currentStep === '2';
    }
 
    get isStepThree() {
        return this.currentStep === '3';
    }
 
    get isStepFour() {
        return this.currentStep === '4';
    }
 
    get isStepFive() {
        return this.currentStep === '5';
    }
 
    get isStepSix() {
        return this.currentStep === '6' ;
    }
    get isStepSeven() {
        return  this.currentStep === '7';
    }
    get isdateselected()
    {
        console.log(this.interview[0].First_Available_Date__c);
        if(this.interview[0].First_Available_Date__c=== undefined) 
        {
            console.log("llllllllllll");
            return true;
        }
        
            console.log("pppppppppp");
            return false;
        
    }
    handleNext() {
        const currentStepNumber = parseInt(this.currentStep, 10);
        if (currentStepNumber < 10) {
            this.currentStep = (currentStepNumber + 1).toString();
        }
    }

    @wire(getOppById, {OppId:'$oppid' })
    wiredGetOppById({ error, data }) {
        if (data) {
            this.opportunity = data;
            console.log('aaaaa',data);
            console.log(this.opportunity[0].StageName);
            this.opportunityStatus = this.opportunity[0].StageName;
                const lastStageName = this.opportunity[0].StageName;
                const stageToStepMap = {
                    'interview scheduling': '1',
                    'Interview scheduled': '2',
                    'Interview passed': '3',
                    'Contract sent': '4',
                    'Closed Won': '5',
                    'Closed Lost': '6'
                };
                if(data && this.opportunity[0].StageName==='Closed Won')
                {
                getRelatedFilesByRecordId({recordId: this.opportunity[0].Id})
                .then(result => {
                    console.log('rrfgbjvhcgfxcvb');
                    console.log(result);
                    this.filesList = Object.keys(result).map(item=>({"label":result[item],
                    "value": item,
                    "url":`/sfc/servlet.shepherd/document/download/${item}`
                    }))
                    console.log(this.filesList);
                }).catch(error1 => {
                    console.error('Error interview:', error1);
                });
                }
                this.currentStep = stageToStepMap[lastStageName] || '0';
                if(this.opportunity[0].StageName==="interview scheduling" || this.opportunity[0].StageName==="Interview scheduled")
                {
                    console.log('aaaaaaaaaaaaaaaaa');
                    getInterview({OppId:this.opportunity[0].Id})
                    .then(result => {
                        this.interview=result;
                        
            console.log(this.interview[0].First_Available_Date__c);
            console.log(!(this.interview[0].First_Available_Date__c=== undefined));
                        console.log(this.interview);
                    })
                    .catch(error2 => {
                        console.error('Error interview:', error2);
                    });
                }
                console.log(this.currentStep);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
    
   /* @wire(getLeadById, { LeadId: '$leadid' })
    wiredGetLeadById({ error, data }) {
        if (data) {
            this.lead = data;
            console.log(data);
            console.log(this.lead);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }*/
    handleOptionSelection(event) {
        
        this.selectedDate = event.detail.value;
        console.log(this.value[0]);
        console.log(this.selectedDate);
    }
    

    handleOkay() {
        console.log(this.selectedDate);
        if(this.isStepOne && !this.isdateselected && this.selectedDate===undefined)
        {
            console.log("aaaaaaaaaaa");
            const event = new ShowToastEvent({
                title:'error',
                variant: 'error',
                message:
                    'you need to choose a date.',
            });
            this.dispatchEvent(event);
        }
        else if(!(this.selectedDate===undefined))
        {
            console.log("bbbbbbbbbb");
            const event = new ShowToastEvent({
                title: 'success',
                variant: 'success',
                message:
                    'Date Submitted Successfully.',
            });
            this.dispatchEvent(event);
            updateInt({ inter: this.interview[0], seldate: this.selectedDate[0] })
        .then(cl => {
            console.log('int updated :', cl);
        })
        .catch(error => {
            console.error('Error updating int:', error);
        });
            this.close('okay');
        }
        else 
        {
            this.close('okay');
        }
       
    }
   
}