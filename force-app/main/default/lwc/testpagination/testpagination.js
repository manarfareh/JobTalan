import { LightningElement, api , wire } from 'lwc';
import testLead from '@salesforce/apex/opportunitycontroller.testLead';
import scoreLead from '@salesforce/apex/opportunitycontroller.scoreLead';
export default class Testpagination extends LightningElement {
    @api score;
    @api progressValue=false;
    @api progressValue1=false;
    @api test;
    @api value;
    lead;
    currentPage =1;
    totalRecords;
    @api recordSize = 1;
    totalPage = 0;
    next='next';
    showsubmit=false;
    showcontent=true;
    get records(){
        console.log('ccccccccccc'+this.visibleRecords);
        return this.visibleRecords;
    }
    @api 
    set records(data){
        if(data){ 
            this.totalRecords = data;
            console.log(this.totalRecords);
            console.log('llllllllllll'+data.length);
            this.totalPage = Math.ceil(data.length/this.recordSize);
            console.log('aaaaaaaaaaaa'+this.totalPage);
            this.updateRecords();
        }
    }

    get disablePrevious(){ 
        return this.currentPage<=100;
    }
    get disableNext(){ 
        return this.currentPage>this.totalPage;
    }
    previousHandler(){ 
        if(this.currentPage>1){
            this.currentPage = this.currentPage-1;
            this.updateRecords();
        }
    }
    nextHandler(){
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage+1;
            this.updateRecords();
        }
    }
    onsubmit()
    {
        var c=0;
        console.log(this.value[0]);
        console.log(this.test[0].correct__c);
        if(this.value[0]===this.test[0].correct__c) c=c+1;
        console.log('bbaaaaaaaaaaaaaaaaaaaaaa    '+this.value[0]+'     '+this.test[0].correct__c+'     '+this.score);
        console.log(typeof(this.lead.testscore__c));
        console.log(typeof(this.score));
        console.log(c);
        console.log('eeeeeeeeeee',this.lead.testscore__c);
            scoreLead({ lead: this.lead, score:this.score+c })
        .then(cl => {
            console.log('lead updated :', cl);
        })
        .catch(error => {
            console.error('Error updating lead:', error);
        });
        this.progressValue = true;
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("progressvaluechange", {
          detail: this.progressValue
        });
    
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
    updateRecords(){ 
        const start = (this.currentPage-1)*this.recordSize;
        const end = this.recordSize*this.currentPage;
        this.visibleRecords = this.totalRecords.slice(start, end);
        console.log('vvvvvvvvvvv'+this.visibleRecords);
        this.dispatchEvent(new CustomEvent('update',{ 
            detail:{ 
                records:this.visibleRecords
            }
        }))
        
        if(this.currentPage === this.totalPage){
            this.showsubmit=true;
            this.showcontent=false;
        }
    }

    @wire(testLead)
    wiredlead({error,data})
    {
        if(data)
        {
            this.lead=data;
        }
        else if(error){console.log(error);}
    }
}