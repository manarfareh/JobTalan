import { LightningElement } from 'lwc';
import home from '@salesforce/resourceUrl/home';
export default class Footer extends LightningElement {
    imageUrl = home;
    get getBackgroundImage(){
        console.log(this.imageUrl);
        return `background: rgba(0, 0, 0, .1);  background-blend-mode: darken;`;
    }
}