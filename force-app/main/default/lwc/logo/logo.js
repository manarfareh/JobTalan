import { LightningElement } from 'lwc';
import home from '@salesforce/resourceUrl/logo';
export default class Logo extends LightningElement {
    imageUrl = home;
    get getBackgroundImage(){
        console.log(this.imageUrl);
        return `background-image: url('${this.imageUrl}'); height: 67px;  width: 127px;`;
    }
}