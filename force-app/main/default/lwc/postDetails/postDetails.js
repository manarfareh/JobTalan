import { LightningElement,  wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getPostById from '@salesforce/apex/postcontroller.getPostById'
import MyModal from 'c/myModal';
export default class PostDetails extends LightningElement {
    postid;
    @wire(CurrentPageReference)
    currentPageReference;
    post;

    connectedCallback() {      
        this.postid=this.currentPageReference.attributes.recordId; 
    }

    @wire(getPostById, { PostId: '$postid' })
    wiredGetPostById({ error, data }) {
        if (data) {
            this.post = data;
            console.log(data);
            console.log(this.post);
        } else if (error) {
            console.error('Error fetching post:', error);
        }
    }

    async handleClick(event)
    {
        console.log(this.currentPageReference);
        console.log('wwwwwwwwwww');
        console.log(this.postid);
        const result = await MyModal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            idpost: this.postid
        });
        console.log(result);
    }
}