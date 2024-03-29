import { LightningElement, track, wire } from 'lwc';
import MyOpportunity  from '@salesforce/apex/opportunitycontroller.MyOpportunity';
import MyLead  from '@salesforce/apex/opportunitycontroller.MyLead';

import { NavigationMixin } from 'lightning/navigation';
export default class MyOpportynity extends NavigationMixin(LightningElement)
{
    @track opportunityList;
    @track leadList;
@wire(MyOpportunity)
wiredopportunity({error,data})
{
    if(data)
    {
        this.opportunityList=data;
        console.log(this.opportunityList);
        console.log(data);
    }
    else if(error){console.log(error);}
}

@wire(MyLead)
wiredlead({error,data})
{
    if(data)
    {
        this.leadList=data;
        console.log(this.leadList);
        console.log(data);
    }
    else if(error){console.log(error);}
}

handleclick(event) {
    event.preventDefault();
    const recordId = event.currentTarget.dataset.post;
    const recordName = event.currentTarget.dataset.name;
    console.log('cccccccccccccccc');
    console.log(recordId);
    console.log(recordName);
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: `https://talan-8d-dev-ed.develop.my.site.com/TalanJobs/workpost/${recordId}/${recordName}`
        }
    });
}
}