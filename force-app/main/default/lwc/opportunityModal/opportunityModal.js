import LightningModal from 'lightning/modal';
import { api, wire,track } from 'lwc';
import getInterview from '@salesforce/apex/opportunitycontroller.getInterview';
import getAllInterview from '@salesforce/apex/opportunitycontroller.getAllInterview';
import getOppById from '@salesforce/apex/opportunitycontroller.getOppById';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateInt from '@salesforce/apex/opportunitycontroller.updateInt';
import getRelatedFilesByRecordId from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId';
//import getLeadById from '@salesforce/apex/LeadController.getLeadById';
export default class OpportunityModal extends LightningModal {
    @api oppid;
    @api leadid;
    filesList =[]
     @track lastStageName;
    @track interview;
    lead;
    selectedDate;
    opportunity;
     currentStep;
    @track error;
    i;
    value = [];
    interviewDetails;
     stageToStepMap = {
        'Interview passed': '1',
        'Contract sent': '2',
        'Closed Won': '3',
        'Closed Lost': '4'
    };
    @wire(getInterview, {OppId:'$oppid' })
    wiredGetInter({ error, data }) {
        if (data) {
            this.interview = data;
            console.log('interview', this.interview);  
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
     compare( a, b ) {
        if ( a.Order__c < b.Order__c ){
          return -1;
        }
        if ( a.Order__c > b.Order__c ){
          return 1;
        }
        return 0;
      }
      
    @wire(getAllInterview, {OppId:'$oppid' })
    wiredGetIntertot({ error, data }) {
        if (data) {
            this.interviewDetails = data;
        this.i=this.interviewDetails.length;
        console.log('interviewDetails', this.interviewDetails);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
    currentstageget(){
        if(this.opportunity.length>0 )
        {
            if(this.opportunity[0].StageName==='Closed Won')
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
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                setTimeout(() => {
                    this.currentStep = this.i + parseInt(this.stageToStepMap[this.lastStageName], 10);
                    console.log('this.currentStep 2', this.currentStep); 
                }, 500);
            }
            else if(this.opportunity[0].StageName==="interview scheduling" || this.opportunity[0].StageName==="Interview scheduled")
            {
                console.error('this.currentStep 1', this.currentStep);
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                setTimeout(() => {
                    console.log('interviewwwww', this.interview); 
                    this.currentStep=this.interview[0].Interview_Detail__r.Order__c;
                
                    console.log('this.currentStep 1', this.currentStep);  
                }, 500);
                                 
            }
            else {
                 // eslint-disable-next-line @lwc/lwc/no-async-operation
                    setTimeout(() => {
                        this.currentStep = this.i + parseInt(this.stageToStepMap[this.lastStageName], 10);
                        console.log('this.currentStep 2', this.currentStep); 
                    }, 500);
                                   
                
            }
        }
    }
    @wire(getOppById, {OppId:'$oppid' })
    wiredGetOppById({ error, data }) {
        if (data) {
            this.opportunity = data;
            console.log('aaaaa',data);
            console.log(this.opportunity[0].StageName);
            this.lastStageName = this.opportunity[0].StageName;
            this.currentstageget();
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
    get x3()
    { 
        
        return this.i + 1;
    }
    get x4()
    {
        return this.i + 2;
    }
    get x5()
    {
        return this.i +3;
    }
    get x6()
    {
        return this.i +4;
    }
    
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }
    get options() {
        if(this.interview){
        return [
            { label: this.formatDate(this.interview[0].First_Available_Date__c), value: this.interview[0].First_Available_Date__c },
            { label: this.formatDate(this.interview[0].Second_Available_Date__c), value: this.interview[0].Second_Available_Date__c },
            { label: this.formatDate(this.interview[0].Third_Available_Date__c), value: this.interview[0].Third_Available_Date__c }
        ];}
        return 0;
    }
    
    
    handleNext() {
        const currentStepNumber = parseInt(this.currentStep, 10);
        if (currentStepNumber < 10) {
            this.currentStep = (currentStepNumber + 1).toString();
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

    get isStepOne() {
        return this.opportunity[0].StageName==="interview scheduling";
    }
 
    get isStepTwo() {
        return  this.opportunity[0].StageName==="Interview scheduled";
    }
 
    get isStepThree() {
        console.log('jjj');
        console.log('jjj',this.currentStep === this.i+1);
        return this.currentStep === this.i+1;
    }
 
    get isStepFour() {
        console.log('lll');
        console.log('lll',this.currentStep === this.i+2);
        return this.currentStep === this.i+2;
    }
 
    get isStepFive() {
        console.log('ppp');
        console.log('ppp',this.currentStep === this.i+3);
        return this.currentStep === this.i+3;
    }
 
    get isStepSix() {
        console.log('mmm');
        console.log('mmm',this.currentStep === this.i+4);
        return this.currentStep === this.i+4 ;
    }
    get isStepSeven() {
        console.log('sss');
        console.log('sss',this.currentStep === this.i+5);
        return  this.currentStep === this.i+5;
    }
    get isdateselected()
    {
        if(this.interview[0].First_Available_Date__c=== undefined) 
        {
            console.log("llllllllllll");
            return true;
        }
        
            console.log("pppppppppp");
            return false;
    }
    
   
}