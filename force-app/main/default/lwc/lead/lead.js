
import { LightningElement, track, wire, api } from 'lwc';
import getLead from '@salesforce/apex/LeadController.getLead';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone' },
    {
        type: "button", label: 'View', initialWidth: 100, typeAttributes: {
            label: 'View',
            name: 'View',
            title: 'View',
            disabled: false,
            value: 'view',
            iconPosition: 'left',
            iconName:'utility:preview',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    }
];
export default class Lead extends  NavigationMixin(LightningElement) {

    @track data;
    @track wireResult;
    @track error;
    columns = columns;
    visibleDatas;


    clickHandler() {
        let downloadRecords = [];
        downloadRecords = [...this.data];
        let csvFile = this.convertArrayToCsv(downloadRecords)
        this.createLinkForDownload(csvFile);
    }

    convertArrayToCsv(downloadRecords) {
        let csvHeader = Object.keys(downloadRecords[0]).toString() ;
        console.log('header: '+csvHeader);
        let csvBody = downloadRecords.map((currItem) => Object.values(currItem).toString());
        console.log('body: '+csvBody);
        let csvFile = csvHeader + "\n" + csvBody.join("\n");
        return csvFile;
    }

    createLinkForDownload(csvFile) {
        const downLink = document.createElement("a");
        downLink.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
        downLink.target = '_blank';
        downLink.download = "Account_Record_Data.csv"
        downLink.click();
    }

    isLoading = false; 
    @track autoCompleteOptions = []; // filtered list of options based on search string
    @track objectsList = []; // complete list of objects returned by the apex method
    @track objectsMap = {}; // useful to get a map

     selectedObjectAPIName = '';
     isObjectSelectionRO = false;
    isRequired = false;

    @api validate() {
        // to be called from parent LWC if for example the search box is present
        // on a form and needs to be validated before submission.
        this.template.querySelector('lightning-input').reportValidity();
    }

    /**
     * Getter and setters
     */
    get selectedObjectReference() {
        return this.objectsMap[this.selectedObjectAPIName]?.reference;
    }
    handleInputChange(event) {
        this.selectedObjectAPIName = ''; // resets the selected object whenever the search box is changed
        const inputVal = event.target.value; // gets search input value

        // filters in real time the list received from the wired Apex method
        this.autoCompleteOptions = this.data.filter(item => item.Name.toLowerCase().includes(inputVal.toLowerCase()));
        console.log('vvvvvvvvvv');
        console.log(this.autoCompleteOptions);

        // makes visible the combobox, expanding it.
        if (this.autoCompleteOptions.length && inputVal) {
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.add('slds-is-open');
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.focus();
        }
    }
    handleOnBlur(event) {
        // Trickiest detail of this LWC.
        // the setTimeout is a workaround required to ensure the user click selects the record.
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            if (!this.selectedObjectAPIName) {
                this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.remove('slds-is-open');
            }
        }, 300);
    }
    handleOptionClick(event) {
        // Stores the selected objected and hides the combobox
        this.selectedObjectAPIName = event.currentTarget?.dataset?.name;
        this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.remove('slds-is-open');
        this.visibleDatas=this.data.filter(item => item.Name.toLowerCase().includes(this.selectedObjectAPIName.toLowerCase()));
        console.log('nnnnnnnnnnnnn');
        console.log(this.visibleDatas);
    }


    @wire(getLead)
    wiredAccounts(result) {
        this.wireResult = result;
        if (result.data) {
            this.data = result.data;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    handleButtonClick() {
        console.log("Button clicked");
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://talan-8d-dev-ed.develop.lightning.force.com/lightning/r/Dashboard/01ZQy000000Rrt3MAC/view?queryScope=userFolders`
            }
        });
    }


    callRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(recId, 'edit');
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(recId);
        } else if (actionName === 'View') {
            this.handleAction(recId, 'view');
        }
    }
    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Lead',
                actionName: mode
            }
        })
    }
    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(result => {
                this.showToast('Success!!', 'Record deleted successfully!!', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
    }
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    updateContactHandler(event){
        this.visibleDatas=[...event.detail.records];
        console.log(event.detail.records);
    }
}  