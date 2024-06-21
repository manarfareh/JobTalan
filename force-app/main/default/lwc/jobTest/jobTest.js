import { LightningElement, wire, track } from 'lwc';
import gettest from '@salesforce/apex/testcontroller.gettest';
import testLead from '@salesforce/apex/opportunitycontroller.testLead';
import updateLeadref from '@salesforce/apex/LeadController.updateLeadref';
export default class JobTest extends LightningElement {
    @track timeRemaining = '';
    showbutton=true;
    showContent=false;
    totaltests;
    visibletests;
    score=0;
    message='thank you for passing the test you will get your result soon';
    message1='You Have already passed this test';
    @track started=false;
    @track progressValue =false;
    @track progressValue1 =false;
    @track postname;
    value = [];

    connectedCallback() {
        window.addEventListener('beforeunload', this.handleUnload.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('beforeunload', this.handleUnload.bind(this));
    }

    handleUnload(event) {
        // Update lead status to "Closed Lost" if the test is not completed
        if (!this.progressValue && !this.progressValue1 && this.started) {
            this.progressValue1=true;
            this.updateLeadStatusToClosedLost();
        }
    }

    updateLeadStatusToClosedLost() {
        // Call Apex method to update lead status
        // Replace 'apexMethodName' with your actual Apex method name
        // Make sure to pass the Lead Id or any relevant information needed to identify the lead
        updateLeadref({ LeadId: this.lead.Id })
            .then(result => {
                // Handle success response
                console.log('Lead status updated to Closed Lost');
            })
            .catch(error => {
                // Handle error
                console.error('Error updating lead status:', error);
            });
    }




    startTimer() {
        this.started=true;
        clearInterval(this.timerInterval);
        this.initializeTimer();
        this.showbutton=false;
        this.showContent=true;
    }
    @wire(testLead)
    wiredlead({error,data})
    {
        if(data)
        {
            this.lead=data[0];
            console.log('lead',data[0]);
            console.log('lead', this.lead);
            console.log('length:',data.length);
            if(data.length===0 || this.lead.testscore__c>0 )
            { 
                console.log('jjjjjjjjjjjj');
                console.log(this.lead);
                console.log('jjjjjjjjjjjj');
                this.progressValue1 = true;

            }
                this.postname=data[0].Post__r.Name;
                console.log('jjjjjjjjjjjj');
        }
        else if(error){console.log(error);}
    }
    initializeTimer() {
        const countDownDate = new Date();
        countDownDate.setMinutes(countDownDate.getMinutes() + this.totaltests.length*1); // Add 30 minutes to the current time
        const targetTime = countDownDate.getTime();
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this.timeRemaining = `${hours}h ${minutes}m ${seconds}s`;
            if (distance < 0) {
                clearInterval(this.timerInterval);
                this.timeRemaining = "EXPIRED";
                this.message='Time remaining expired ,thank you for passing the test you will get your result soon';
                this.progressValue=true;
            }
        }, 1000);
    }


    get options() {
        return [
            { label: this.visibletests[0].option_1__c, value: this.visibletests[0].option_1__c },
            { label: this.visibletests[0].option_2__c, value: this.visibletests[0].option_2__c },
            { label: this.visibletests[0].option_3__c, value: this.visibletests[0].option_3__c },
        ];
    }

    get selectedValues() {
        return this.value;
    }

    handleChange(e) {
        this.value = e.detail.value;
    }

    @wire(gettest)
    wiredGettest({ error, data }) {
        if (data) {
            this.totaltests = data;
            console.log(data);
            console.log(this.totaltests);
        } else if (error) {
            console.error('Error fetching tests:', error);
        }
    }
    
    updateContactHandler(event){
        if(this.visibletests) {
        if(this.selectedValues[0]===this.visibletests[0].correct__c) this.score=this.score+1;
        console.log('kkk' +this.visibletests);
        console.log('bbaaaaaaaaaaaaaaaaaaaaaa    '+this.selectedValues[0]+'            '+this.visibletests[0].correct__c+'            '+this.score);
        this.value = [];
        }
        this.visibletests=[...event.detail.records];
        console.log(event.detail.records);
        console.log('this.totaltests[this.totaltests.length-1].Id'+this.totaltests[this.totaltests.length-1].Id);
        console.log('this.visibletests[0].Id' +this.visibletests[0].Id);
    }


    hanldeProgressValueChange(event) {
        this.progressValue = event.detail;
        console.log('fffffffffffffff', this.progressValue);
      }
}