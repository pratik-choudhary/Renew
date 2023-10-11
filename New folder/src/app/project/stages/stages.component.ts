import { Component ,OnInit } from '@angular/core';
import {SelectItem} from 'primeng/primeng'
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router,ActivatedRoute } from "@angular/router";
import { ApiService } from 'app/services/api.service';
@Component({
  selector: 'app-project',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {

  public form: FormGroup;
  userCtrl: FormControl;
  reactiveUsers: any;
  isClosed= false;
  brands: SelectItem[];
  stageList = [
    {index: 0, name: 'Stage 1'},
    {index: 1, name: 'Stage 2'},
    {index: 2, name: 'Stage 3'},
    {index: 3, name: 'Stage 4'},
    {index: 4, name: 'Stage 5'},
    {index: 5, name: 'Stage 6'},
    {index: 6, name: 'Stage 7'},
    {index: 7, name: 'Stage 8'},
    {index: 8, name: 'Stage 9'}
  ];
  users = [];
  userList = [
    'User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6'
  ];

  checkList = [
    'Checklist 1', 'Checklist 2', 'Checklist 3', 'Checklist 4', 'Checklist 5', 'Checklist 6'
  ];
  checklist_forms = [];
  constructor(public fb: FormBuilder, private router: Router, private _routeParams: ActivatedRoute, private api_service: ApiService) {
     this.isClosed = false;
    this.checklist_forms.push({});
    this.userCtrl = new FormControl();
    //location list
    this.reactiveUsers = this.userCtrl.valueChanges
    .startWith(this.userCtrl.value)
    .map(val =>  this.displayFnUser(val))
    .map(name =>  this.filterUser(name));
    this.loadUsers();
  }
  displayFnUser(value: any): string {
    return value && typeof value === 'object' ? value.name : value;
  }
  filterUser(val: string) {
    return val ? this.users.filter((user) =>  user.name.match(new RegExp(val, 'gi'))) : this.users;
  }
  loadUsers(){
     this.api_service.getUsers().subscribe(
      data => {
        this.users = data;
      },
      err => {  });
  }  
  toggleCard(){
    if (!this.isClosed){
      this.isClosed = true;
    }else{
      this.isClosed = false;
    }
  }
  loadChecklists(){
    this.checklist_forms.unshift({});
  }
  removeCheklistIns($event, index) {
    this.checklist_forms.splice(index, 1);
  }
  private sub: any;
  

  name: any;
  ngOnInit(){
    this.form = this.fb.group({
      name: [null],
      checklist: [null],
      startDate : [null],
      endDate : [null],
      projectManager : [null]
    });
    this.sub = this._routeParams.params.subscribe(params => {
      this.name = params['name'];
  });

}
goBack() {
    this.router.navigateByUrl('/project');
}
saveStage() {

}
}
