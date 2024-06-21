import { LightningElement,api,track } from 'lwc';
import saveSignature from '@salesforce/apex/SignatureController.saveSignature';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContractByOppId from '@salesforce/apex/opportunitycontroller.getContractByOppId';
import getSign from '@salesforce/apex/SignatureController.getSign'
//import SIGNATURE from '@salesforce/resourceUrl/signature';
import updateContractStage from '@salesforce/apex/SignatureController.updateContractStage';
 
let isMousePressed,
    isDotFlag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0;            
       
let penColor = "#000000";
let lineWidth = 1.5;    
 
let canvasElement, ctx;
let dataURL,convertedDataURI; //holds image data
 
export default class SignatureContract extends LightningElement {    

   // @track signatureUrl = SIGNATURE;
    oppid;
    oppName;
    @track signurl;
   @track getstatus=false;
    contractData;
    get idopp(){
        return this.oppid;
    }
    @api 
    set idopp(data){
        if(data){ 
            this.oppid=data;
        }
        console.log(this.oppid);
        getContractByOppId({OppId: this.oppid })
            .then(result => {
                this.contractData = result[0];
                console.log(result);
                console.log('ggggggggggggg',this.contractData);
                if (result[0] && result[0].Status==="signed by client") {
                    console.log('trueeeeeeeeeee');
                    this.getstatus=true;
                    getSign({ContId: this.contractData.Id })
                    .then(aaa => {
                        this.signurl = aaa;
                        console.log('trueeeeeeeeeee',this.signurl);
                    }).catch(error11 => {
                        console.error('Error interview:', error11);
                    });
                } else {
                    console.log('falseeeeeee');
                    this.getstatus = false;
                }
            }).catch(error1 => {
                console.error('Error interview:', error1);
            });
    }

   
 
 
    @api recordId;
    fileName;
    @api headerText='Pour traiter votre processus de candidature actuel, signez votre contrat';
    addEvents() {
        canvasElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvasElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvasElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
        canvasElement.addEventListener('mouseout', this.handleMouseOut.bind(this));
        canvasElement.addEventListener("touchstart", this.handleTouchStart.bind(this));
        canvasElement.addEventListener("touchmove", this.handleTouchMove.bind(this));
        canvasElement.addEventListener("touchend", this.handleTouchEnd.bind(this));
    }
 
     handleMouseMove(event){
        if (isMousePressed) {
            this.setupCoordinate(event);
            this.redraw();
        }    
    }    
    handleMouseDown(event){
        event.preventDefault();
        this.setupCoordinate(event);          
        isMousePressed = true;
        isDotFlag = true;
        if (isDotFlag) {
            this.drawDot();
            isDotFlag = false;
        }    
    }    
 
    handleMouseUp(){
        isMousePressed = false;      
    }
    handleMouseOut(){
        isMousePressed = false;      
    }
    handleTouchStart(event) {
        if (event.targetTouches.length === 1) {
            this.setupCoordinate(event);    
        }
    }
 
    handleTouchMove(event) {
        // Prevent scrolling.
        event.preventDefault();
        this.setupCoordinate(event);
        this.redraw();
    }
    handleTouchEnd(event) {
        var wasCanvasTouched = event.target === canvasElement;
        if (wasCanvasTouched) {
            event.preventDefault();
            this.setupCoordinate(event);
            this.redraw();
        }
    }
    renderedCallback() {
        canvasElement = this.template.querySelector('canvas');
        ctx = canvasElement.getContext("2d");
        ctx.lineCap = 'round';
        this.addEvents();
     }
    signIt(e)
    {
        var signText = e.detail.value;
        this.fileName=signText;
        ctx.font = "30px GreatVibes-Regular";
        this.handleClearClick(e);
        ctx.fillText(signText, 30, canvasElement.height/2);
    }
 
    // eslint-disable-next-line no-unused-vars
    saveSignature(e)
    {
        console.log('aaaaaaaaaaa');
        dataURL = canvasElement.toDataURL("image/jpg");
        console.log('aaaaaaaaaaa');
        //convert that as base64 encoding
        convertedDataURI = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        console.log('aaaaaaaaaaa');
 
        saveSignature({ signElement: convertedDataURI, ContId: this.contractData.Id })
            .then(result => {
                console.log(result);
                console.log('bbbbbbbb');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Signature Image saved in record',
                        variant: 'success',
                    })
                );
                this.updateContractStage();
            })
            .catch(error => {
                console.log('aaaaaaaaaaa');
            });
        }
        updateContractStage() {
        updateContractStage({ ContId: this.contractData[0].Id})
            .then(() => {
                console.log('Negotiation stage updated successfully');
                location.reload();  // Not typically recommended in LWC due to SPA nature of Salesforce Lightning Experience
            })
            .catch(error => {
                console.error('Error updating negotiation stage:', error);
            });
        }
 
    handleClearClick()
    {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
 
    setupCoordinate(eventParam){
        const clientRect = canvasElement.getBoundingClientRect();
        prevX = currX;
        prevY = currY;
        currX = eventParam.clientX -  clientRect.left;
        currY = eventParam.clientY - clientRect.top;
    }
 
    redraw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = lineWidth;        
        ctx.closePath();
        ctx.stroke();
    }
    drawDot(){
        ctx.beginPath();
        ctx.fillStyle = penColor;
        ctx.fillRect(currX, currY, lineWidth, lineWidth);
        ctx.closePath();
    }
}