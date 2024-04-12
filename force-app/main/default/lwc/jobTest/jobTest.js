import { LightningElement, wire, track } from 'lwc';
import gettest from '@salesforce/apex/testcontroller.gettest';
import testLead from '@salesforce/apex/opportunitycontroller.testLead';
export default class JobTest extends LightningElement {
    @track timeRemaining = '';
    showbutton=true;
    showContent=false;
    totaltests;
    visibletests;
    score=0;
    message='thank you for passing the test you will get your result soon';
    message1='You Have already passed this test';
    @track progressValue =false;
    @track progressValue1 =false;
    value = [];
    startTimer() {
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
            this.lead=data;
            if(!this.lead.Id || this.lead.testscore__c>0)
            {
                this.progressValue1 = true;
            }
        }
        else if(error){console.log(error);}
    }
    initializeTimer() {
        const countDownDate = new Date();
        countDownDate.setMinutes(countDownDate.getMinutes() + 30); // Add 30 minutes to the current time
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
            this.totaltests = data[0].tests__r;
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