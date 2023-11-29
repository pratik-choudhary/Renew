import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { UserDialog } from 'app/Dialogs/user/user.component';
import { ApiService } from 'app/services/api.service';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import * as toastr from 'toastr';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss'],
  providers: [ConfirmationService]
})

export class UserModelListComponent {
  checklistForm: FormGroup
  @Input() data;
  userList: any;
  Notification: string;
  display = false;
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
  // roles = [
  //   {
  //     'label': 'Engineer',
  //     'value': 'Engineer'
  //   },
  //   {
  //     'label': 'PM',
  //     'value': 'PM'
  //   },
  //   {
  //     'label': 'HoD',
  //     'value': 'HoD'
  //   },
  //   {
  //     'label': 'QA',
  //     'value': 'QA'
  //   },
  //   {
  //     'label': 'ADMIN',
  //     'value': 'ADMIN'
  //   },
  //   {
  //     'label': 'Site_MIS',
  //     'value': 'Site_MIS'
  //   }
  // ];
  statusList = [
    'Active', 'Inactive'
  ];
  roles = [
    {
      'role': 'Engineer'
    },
    {
      'role': 'QA'
    },
    {
      'role': 'ADMIN'
    },
    {
      'role': 'SITE INCHARGE'
    }
  ];
  departments = [];
  rolesCopy = [];
  departmentList: any;
  currentUser: any;
  departmentsCopy = [];
  isSeeHistoryDiv = true;
  sites = [];
  formSubmitted: boolean = false;
  constructor(public dialog: MdDialog, private api_service: ApiService, private confirmationService: ConfirmationService, private auth_service: AuthGuard, private fb: FormBuilder,) {
    this.userList = [];
    this.rolesCopy = this.roles;
  }
  ngOnInit() {
    this.getAllSite();
    this.getAllDepartments();
    this.checklistForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
       password: [''],
      department: ['', Validators.required],
      role: ['', Validators.required],
      Status: ['', Validators.required],
      site: ['', Validators.required],
      id: ['']
    })
    this.getUsers();
    this.getDepartments();
    this.currentUser = this.auth_service.getUserInfo();
  }
  ngOnChanges() {
    if (this.data === 'refreshList') {
      this.getUsers();
    }

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
        this.departmentsCopy = this.departments;
      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  setDashboardUser(i: number) {
    // if (this.userList[i].is_dashboard_user == true) {
    //   this.userList[i].is_dashboard_user = false;
    // }
    // else if(this.userList[i].is_dashboard_user == false) {
    //   this.userList[i].is_dashboard_user = true;
    // }
    this.userList[i].saveFlag = true;

  }
  getUsers() {
    this.api_service.getUsers().subscribe(
      data => {
        this.userList = [];
        if (data.data != null) {
          this.userList = [];
          //data.reverse();
          var index = 0;
          for (var i of data.data) {
            var obj: { [k: string]: any } = {};
            obj.index = index;
            obj.employee_id = i.employee_id;
            obj.user_id = i.user_id;
            obj.name = i.name;
            obj.email = i.employeeEmail;
            obj.role = i.role;
            obj.is_dashboard_user = i.is_dashboard_user;
            obj.department = i.department;
            obj.department_id = i.department_id;
            obj.status = i.status;
            obj.saveFlag = false;
            obj.siteNameList =[];
            obj.siteIdList=[];
            for(var site of i.siteList){
              obj.siteNameList.push(site.Site);
              obj.siteIdList.push(site.Id )
            }
            this.userList.push(obj);
            index++;
          }
          if (this.currentUser.role.toString().toLowerCase() == 'hod') {
            this.userList = this.userList.filter(x => x.department == this.currentUser.department);
          }
        }
      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  showSaveButton(i: number, row: any) {
    this.userList[i].saveFlag = true;
  }
  updateRolesByDept(row) {
    if (row.department == "PMO") {
      this.roles = [];
      for (var k = 0; k < this.rolesCopy.length; k++) {
        if (this.rolesCopy[k].label == "PM" || this.rolesCopy[k].label == "ADMIN" || this.rolesCopy[k].label == "Site_MIS") {
          this.roles.push(this.rolesCopy[k]);
        }
      }
    }
    if (row.department == "QA") {
      this.roles = [];
      var role = this.rolesCopy.filter(x => x.label == "QA" || x.label == "HoD");
      // console.log(role);
      for (var j of role) {
        this.roles.push(j);
      }
    }
    if (row.department != "QA" && row.department != "PMO") {
      this.roles = [];
      var role = this.rolesCopy.filter(x => x.label != "QA" && x.label != "PM" && x.label != "ADMIN" && x.label != "Site_MIS");
      for (var j of role) {
        this.roles.push(j);
      }
    }
  }
  deptChange(i: number, row: any) {
    if (row.department == "PMO") {
      this.roles = [];
      for (var k = 0; k < this.rolesCopy.length; k++) {
        if (this.rolesCopy[k].label == "PM" || this.rolesCopy[k].label == "ADMIN" || this.rolesCopy[k].label == "Site_MIS") {
          this.roles.push(this.rolesCopy[k]);
        }
      }
    }
    if (row.department === 'QA') {
      this.roles = [];
      var role = this.rolesCopy.filter(x => x.label === 'QA' || x.label === 'HoD');
      // console.log(role);
      for (var j of role) {
        this.roles.push(j);
      }
    }
    if (row.department !== 'QA' && row.department !== 'PMO') {
      var role = this.rolesCopy.filter(x => x.label !== 'QA' && x.label !== 'PM' && x.label !== 'ADMIN' && x.label !== 'Site_MIS');
      for (var j of role) {
        this.roles.push(j);
      }
    }
    this.userList[i].saveFlag = true;
  }
  lettersOnly(evnet) {

  }

  onNotification() {
    debugger;
    if (this.Notification == "User Updated Successfully") {
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
      let save_count = this.userList.filter(x => x.saveFlag == true);
      if (save_count.length == 0) {
        this.getUsers();
      }
    }
    if (this.Notification == "User Update Failed" || this.Notification == "Invalid Roles") {
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    }

  }
  validateRoles(role: string, dept: string) {
    // if(role === 'QA' && dept !== 'QA') {
    //   return true;
    // } else 
    if (role === 'ADMIN') {
      if (dept === 'PMO') {
        return false;
      } else {
        return true;
      }
    } else if (role === 'PM') {
      if (dept == "PMO") {
        return false;
      } else {
        return true;
      }
    } else if (role === 'Site_MIS') {
      if (dept == "PMO") {
        return false;
      } else {
        return true;
      }
    }
    else if (role == "Engineer" || role == "HoD") {
      if (dept === 'QA' || dept === 'Civil' || dept === 'Mechanical' || dept == 'Electrical' || dept == 'OMS Pre-Comm' || dept == 'OMS-Comm' || dept == 'OMS-Ops') {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  toggleDisplaySeeHistory() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
  saveEditUser(row, index) {
    debugger;
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    this.checklistForm.get('name').setValue(row.name);
    this.checklistForm.get('emailId').setValue(row.email);
    // this.checklistForm.get('password').setValue(row.name);
    this.checklistForm.get('department').setValue(row.department_id);
    this.checklistForm.get('role').setValue(row.role);
    this.checklistForm.get('Status').setValue(row.status);
     this.checklistForm.get('site').setValue(row.siteIdList);
    this.checklistForm.get('id').setValue(row.user_id);





    //console.log(row);



    debugger;
    // console.log(row);
    // var obj: { [k: string]: any } = {};
    // obj.role = row.role;
    // var id;
    // for (var i of this.departmentList) {
    //   if (i.name == row.department) {
    //     id = i.id;
    //     break;
    //   }
    // }
    // obj.department_id = id;
    // obj.status = row.status;
    // obj.is_dashboard_user = row.is_dashboard_user;
    // if (this.validateRoles(obj.role, row.department) == false) {
    //   this.confirmationService.confirm({
    //     message: 'This will update user profile in the HOTO database. This may affect HOTO existing assignments.',
    //     header: 'Confirmation',
    //     icon: 'fa fa-info',
    //     accept: () => {
    //       this.api_service.updateUser(obj, row.user_id).subscribe(
    //         data => {
    //           if (data != null) {
    //             this.userList.filter(x => x.user_id === row.user_id)[0].saveFlag = false;
    //             setTimeout(() => {
    //               this.Notification = "User Updated Successfully";
    //               this.display = true;
    //             }, 400);
    //           }
    //         },
    //         err => {
    //           // console.log(err);
    //           this.api_service.checkStatus(err);
    //           setTimeout(() => {
    //             this.Notification = "Failed to update";
    //             this.display = true;
    //           }, 400);
    //         });
    //     }
    //   });
    // }
    // else {
    //   this.Notification = "Invalid Roles";
    //   this.display = true;
    // }

  }
  getAllSite() {
    this.api_service.getAllSite().subscribe(
      data => {
        this.sites = data.data;
      }, err => {
        console.log(err);
      });
  }
  getAllDepartments() {
    this.api_service.getAllDepartments().subscribe(
      data => {
        this.departments = data.data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  submitUserForm() {
    debugger
    this.formSubmitted = true 
    if (this.checklistForm.valid) {
      debugger;
      var obj = {
        user_id: this.checklistForm.value.id,
        name: this.checklistForm.value.name,
        password: this.checklistForm.value.password,
        employeeEmail: this.checklistForm.value.emailId,
        department_id: this.checklistForm.value.department,
        role: this.checklistForm.value.role,
        status: this.checklistForm.value.Status,
        siteIdList: this.checklistForm.value.site,
        // siteIdList: [30083 ,30084,30085 ]
      }
      this.api_service.updateUser(obj, this.checklistForm.value.id).subscribe(
        data => {
          this.formSubmitted = false
          if (data != null) {
            // this.loadUsers();
            setTimeout(() => {
              toastr.success('User Updated Successfully', 'Success');
              this.display = false;
              this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
              let save_count = this.userList.filter(x => x.saveFlag == true);
              if (save_count.length == 0) {
                this.getUsers();
              }
              // this.Notification = "User Updated Successfully";
              // this.display = true;
            }, 400);
          }
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
          setTimeout(() => {
            toastr.error('User Update Failed', 'Error');
            this.display = false;
            //this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
            // this.Notification = "User Update Failed";
            // this.display = true;
          }, 400);
        });
    }else{
     
      for (const key in this.checklistForm.controls) {
        if (this.checklistForm.controls.hasOwnProperty(key)) {
            const control = this.checklistForm.controls[key];
            if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        }
    }
    
    }
  }
}
