import { LightningElement } from 'lwc';
import home from '@salesforce/resourceUrl/home';
export default class Home extends LightningElement {
    imageUrl = home;
    get getBackgroundImage(){
        console.log(this.imageUrl);
        return `background: rgba(0, 0, 0, .40) url('${this.imageUrl}');background-size: cover;  height:350px; background-blend-mode: darken;`;
    }
}