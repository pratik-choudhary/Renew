import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/services/auth-guard';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent implements OnInit {
  user_info: any;
  contractor_list = [];
  status_arr = [
    {
      'label': 'Active',
      'value': 'Active'
    },
    {
      'label': 'Inactive',
      'value': 'Inactive'
    }
  ];
  departmentList: any;
  departments: any = [];
  departmentsCopy: any;
  Notification: string;
  display: boolean;
  constructor(
    public dialog: MdDialog,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private api_service: ApiService,
    private fb: FormBuilder,
    private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private auth_service: AuthGuard
  ) {
    this.user_info = this.auth_service.getUserInfo();
    if (this.user_info) {
      if (this.user_info.role.toUpperCase() !== 'ADMIN' && this.user_info.role.toUpperCase() !== 'SITE_MIS' && this.user_info.role.toUpperCase() !== 'PM') {
        this.router.navigate(['/site-dashboard']);
      }
    }
  }

  ngOnInit() {
    this.getDepartments();
    this.getAllContractors();
  }

  getAllContractors() {
    var temp = [];
    this.api_service.getAllContractors().subscribe(data => {
      console.log(data);
      for (var item of data) {
        var obj: { [k: string]: any } = {};
        obj.contractor_id = item.contractor_id;
        obj.department_id = item.department_id;
        obj.contractor_name = item.contractor_name;
        obj.department_name = item.department_name;
        obj.status = item.status;
        obj.saveFlag = false;
        temp.push(obj);
      }
      this.contractor_list = temp;
    }, err => { });

  }

  showSaveButton(index: any) {
    this.contractor_list[index].saveFlag = true;
  }

  getDepartments() {
    this.api_service.getAllDepartments().subscribe(
      data => {

        this.departmentList = data;
        for (var i of data) {
          this.departments.push({
            'label': i.name,
            'value': i.name
          });
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  addNewContractor() {
    var obj: { [k: string]: any } = {};
    obj.contractor_id = 0;
    obj.department_id = 0;
    obj.contractor_name = '';
    obj.department_name = '';
    obj.status = "Active";
    obj.saveFlag = false;
    this.contractor_list.unshift(obj);
  }
  changeDepartment(i, row) {
    this.contractor_list[i].department_name = this.departments.filter(x => x.label == row.department_name)[0].label;
    this.contractor_list[i].saveFlag = true;
  }


  deleteEmptyRow(index) {
    this.contractor_list.splice(index, 1);
  }


  onNotification() {
    if (this.Notification == 'Contractor added successfully'
      || this.Notification == 'Contractor updated successfully'
    ) {
      this.contractor_list = [];
      this.getAllContractors();
      this.display = false;    
    }
    else {
      this.display = false;
    }
  }

  saveEditContractor(contractor_obj: any, index: any) {
    var obj: { [k: string]: any } = {};
    if (contractor_obj.contractor_id == 0) //add new contractor
    {
      obj.contractor_name = contractor_obj.contractor_name;
      obj.status = contractor_obj.status;
      obj.department_id = this.departmentList.filter(x => x.name == contractor_obj.department_name)[0].id;
      console.log(obj);
      this.api_service.addContractor(obj).subscribe(data => {

        setTimeout(() => {
          this.display = true;
          this.Notification = data;
        }, 400);
      }, err => { });
    }
    else //edit contractor
    {
      obj.contractor_name = contractor_obj.contractor_name;
      obj.status = contractor_obj.status;
      obj.department_id = this.departmentList.filter(x => x.name == contractor_obj.department_name)[0].id;
      console.log(obj);
      this.api_service.editContractor(obj, contractor_obj.contractor_id).subscribe(data => {
        setTimeout(() => {
          this.display = true;
          this.Notification = data;
        }, 400);

      }, err => { });
    }
  }
}
