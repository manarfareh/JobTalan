import { LightningElement ,wire} from 'lwc';
import getoffre  from '@salesforce/apex/postcontroller.getoffre';
import getoffreByDepartment  from '@salesforce/apex/postcontroller.getoffreByDepartment';
import getDepartment  from '@salesforce/apex/postcontroller.getDepartment';
import style from "./style.css";
import MyModal from 'c/postModal';
export default class Posts extends LightningElement {
    static stylesheets = [style];
    totalPosts;
    visiblePosts;
    departmentlist = [];
    depName = "All";
     idpost;
     link;
     postid;

    @wire(getoffre)
    wiredContact({error, data}){
        if(data){ 
            this.totalPosts = data;
            console.log(this.totalPosts);
        }
        if(error){
            console.error(error);
        }
    }

    updateContactHandler(event){
        this.visiblePosts=[...event.detail.records];
        console.log(event.detail.records);
    }




    
    @wire(getoffre)
    wiredOffre({ error, data }) {
        if (data) {
            this.totalPosts = data.map(off => ({
                ...off,
                id: off.Id ? off.Id : '', 
                detailUrl: `/workpost/${off.Id}/${encodeURIComponent(off.Name)}`,
            }));
            console.log(this.totalPosts);
            console.log('aaaaaaaaaaaaaaaaaa');
            console.log(data);
        } else if (error) {
            console.error(error);
        }
    }
    connectedCallback() {
        this.loadDepartmentOptions();
    }

    loadDepartmentOptions() {
        getDepartment()
            .then(result => {
                this.departmentlist = [{ label: 'All', value: 'All' }]; 
                this.departmentlist = [...this.departmentlist, ...result.map(dep => ({ label: dep.Name, value: dep.Name }))];
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }

    handleChange(event) {
        this.depName = event.target.value;
        this.loadOffreByDepartment();
    }

    loadOffreByDepartment() {
        if (this.depName === 'All') {
            getoffre()
                .then(result => {
                    this.totalPosts = result;
                })
                .catch(error => {
                    console.error('Error fetching all offers:', error);
                });
        } else {
            getoffreByDepartment({ DepartmentName: this.depName })
                .then(result => {
                    this.totalPosts = result.length ? result[0].Posts__r : [];
                    console.log("tttttttttttt");
                    console.log(this.totalPosts);
                })
                .catch(error => {
                    console.error('Error fetching offre by department:', error);
                });
        }
    }



    async handleReadMore(event) {
        event.preventDefault();
        console.log('wwwwwwwwwww');
        this.postid=event.currentTarget.dataset.post;
        console.log(this.postid);
        const result = await MyModal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            idpost: event.currentTarget.dataset.post,
            postname: event.currentTarget.dataset.name
        });
        console.log(result);
    }

}