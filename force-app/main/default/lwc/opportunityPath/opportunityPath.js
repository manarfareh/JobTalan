import { LightningElement } from 'lwc';
import { api, wire,track } from 'lwc';
import getInterview from '@salesforce/apex/opportunitycontroller.getInterview';
import getAllInterview from '@salesforce/apex/opportunitycontroller.getAllInterview';
import getOppById from '@salesforce/apex/opportunitycontroller.getOppById';
import getRelatedFilesByRecordId from '@salesforce/apex/filePreviewAndDownloadController.getRelatedFilesByRecordId';

export default class OpportunityPath extends LightningElement {4
    @api recordId; 
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
    @wire(getInterview, {OppId:'$recordId' })
    wiredGetInter({ error, data }) {
        if (data) {
            this.interview = data;
            console.log('interview', this.interview);  
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }
    @wire(getAllInterview, {OppId:'$recordId' })
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
                }, 500);
            }
            else if(this.opportunity[0].StageName==="interview scheduling" || this.opportunity[0].StageName==="Interview scheduled")
            {
                
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
    @wire(getOppById, {OppId:'$recordId' })
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
}