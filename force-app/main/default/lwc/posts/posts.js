import { LightningElement ,wire} from 'lwc';
import getoffre  from '@salesforce/apex/postcontroller.getoffre';
import getoffreByDepartmentandType  from '@salesforce/apex/postcontroller.getoffreByDepartmentandType';
import getDepartment  from '@salesforce/apex/postcontroller.getDepartment';
import style from "./style.css";
import MyModal from 'c/postModal';
import Modal from 'c/myModal';
export default class Posts extends LightningElement {
    static stylesheets = [style];
    totalPosts;
    visiblePosts;
    departmentlist = [];
    depName = "All";
    typeName="All";
    Typelist = [{ label: 'All', value: 'All' },{ label: 'Job', value: 'Job' },{ label: 'Internship', value: 'Internship' }];
     postid;
     link;
     getoffreByDepartmentandType
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
    loadOffreByDepartmentandType()
    {
        if (this.typeName === "All" && this.depName==="All") {
            getoffre()
            .then(result => {
                this.totalPosts = result.map(post => ({ ...post, id: String(post.Id) }));
            })
            .catch(error => {
                console.error('Error fetching all offers:', error);
            });
        } else {
            getoffreByDepartmentandType ({ DepartmentName: this.depName, Type:this.typeName })
            .then(result => {
                this.totalPosts = result.length ? result[0].Posts__r : [];
                this.totalPosts = result.map(post => ({ ...post, id: String(post.Id) }));
                console.log("tttttttttttt");
                
                console.log(this.typeName);
                console.log(this.totalPosts);
                console.log(this.departmentlist);
            })
            .catch(error => {
                console.error('Error fetching offre by department:', error);
            });
        }
    }
    get isEmptyVisiblePosts() {
        return this.visiblePosts.length() === 0;
    }

    handleChange(event) {
        this.depName = event.target.value;
        this.loadOffreByDepartmentandType();
    }
    handleTypeChange(event) {
        this.typeName = event.target.value;
        this.loadOffreByDepartmentandType();
    }


    async handleReadMore(event) {
        event.preventDefault();
        console.log('wwwwwwwwwww');
        this.postid=event.currentTarget.dataset.post;
        console.log(this.postid);
        console.log('aaaaaaawwwwwwwwwww');
        console.log(event.currentTarget.dataset.post);
        const result = await MyModal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            idpost: this.postid,
            postname: event.currentTarget.dataset.name
        });
        console.log(result);
    }
    async handleApply(event) {
        event.preventDefault();
        console.log('wwwwwwwwwww');
        const result = await Modal.open({
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api'
        });
        console.log(result);
    }

}