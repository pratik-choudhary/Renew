import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserDialog } from 'app/Dialogs/user/user.component';
import { FieldConfig } from 'app/models/field-config.interface';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import * as toastr from 'toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ConfirmationService]
})
export class UserComponent implements OnInit {
  checklistForm: FormGroup
  public form: FormGroup;
  filteredUsersSingle: any[];
  user: any;
  error_msg_flag: any;
  departments: any;
  display = false;
  Notification: string;
  refresh: string;
  user_info: any;
  alreadyExists = false;
  isSeeHistoryDiv = true;
  selectedSite:any;
  formSubmitted: boolean = false;
  
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
      'role':'ADMIN'
    },
    {
      'role':'SITE INCHARGE'
    }
  ];
  rolesCopy=[];
  dashboard_user = false;
  selectedDepartment: any;
  selectedRole: any;
  selectedUser = false;
  buttonLabel = "Add";
  userList: any;
  sites:any;
  // Declare a mapping between action ids and their event listener
  myActions = {
    'alert': (property) => { alert(JSON.stringify(property.value)) },
    'reset': (property) => { property.reset(); }
  };
  config: FieldConfig[] = [
  ];

  constructor(public dialog: MdDialog,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private fb: FormBuilder,
    private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private api_service: ApiService,
    private confirmationService: ConfirmationService,
    private auth_service: AuthGuard
  ) {
      this.user_info = this.auth_service.getUserInfo();
      // if (this.user_info) {
      //   if (this.user_info.role.toUpperCase() !== 'ADMIN' 
      //   && this.user_info.role.toUpperCase() !== 'SITE_MIS'
      //     && this.user_info.role.toUpperCase() !== 'PM'
      //       && this.user_info.role.toUpperCase() !== 'HOD') {
      //     this.router.navigate(['/site-dashboard']);
      //   }
      // }
    this.iconRegistry.addSvgIcon(
      'plus-circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
    this.iconRegistry.addSvgIcon(
      'pencil',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/pencil.svg'));
    this.filteredUsersSingle = [];
  }
  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  openDialog() {
    let dialogRef = this.dialog.open(UserDialog, {
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.loadChecklists();
      }
    });
  }
  setDashboardUser(){
    if(this.dashboard_user == false)
    {
      this.dashboard_user = true;
    }
    else
    {
      this.dashboard_user = false;  
    }
  }

   getDepartmentSpecificRoles(){

     if(this.selectedDepartment==3||this.selectedDepartment==5||this.selectedDepartment==4||this.selectedDepartment==7||this.selectedDepartment==10013||this.selectedDepartment==10014)
     {  
      this.roles = this.rolesCopy.filter(x=>x.role=="HoD"||x.role=="Engineer");
     }
     if(this.selectedDepartment == 12)
     {
      this.roles = this.rolesCopy.filter(x=>x.role=="QA" ||x.role=="HoD" );
     }
     if(this.selectedDepartment==13)
     {
      this.roles = this.rolesCopy.filter(x=>x.role=="PM"||x.role=="ADMIN" || x.role == "Site_MIS");
     }
  } 
    ngOnInit() {
      debugger;
   this.getAllSite();
      this.checklistForm = this.fb.group({
        name: ['', Validators.required],
        emailId: ['',[Validators.required, Validators.email]],
        password: ['', Validators.required],
        department: ['', Validators.required],
        role: ['', Validators.required],
        Status: ['Active', Validators.required],
        site: ['', Validators.required],
      })
    this.rolesCopy = this.roles;
    this.api_service.getAllDepartments().subscribe(
      data => {
        this.departments = data.data;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
    this.form = this.fb.group({
      DEPARTMENT: [null, Validators.required],
      ROLE: [null, Validators.required],
      STATUS: ['Active', Validators.required],
    });
    this.api_service.getUsers().subscribe(
      data => {
            this.userList = data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });




  }
  loadUsers() {
    this.api_service.getUsers().subscribe(
      data => {
            this.userList = data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  getAllSite(){
    this.api_service.getAllSite().subscribe(
      data => {
            this.sites = data.data;
      }, err => {
        console.log(err);
      });
  }

  filterUsersSingle(event) {
    this.error_msg_flag = undefined;
    let query = event.query;
    this.api_service.getUsersByLDAP(query).subscribe(user => {
      this.filteredUsersSingle = user;
      if (this.filteredUsersSingle.length == 0) {
        this.error_msg_flag = "No result found.";
      }
    },
    err => {
      this.error_msg_flag = "Server Error.";
      this.api_service.checkStatus(err);
    });
  }
  selectedUserFn(ev) {
     this.selectedUser = true; 
     let lst = this.userList.filter(x => x.employee_id === this.user.employeeId[0]); 
     if(lst.length>0)
     {
       this.buttonLabel="Update";
     }
  }
  clearUser() {
    this.selectedUser = false;
    this.buttonLabel="Add";
  }

  onNotification() {
        if (this.Notification == "User Added Successfully") {
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
      this.refresh = "refreshList";
    }
    if (this.Notification == "User Add Failed") {
      this.display = false;
      this.refresh = "";
    }
    if (this.Notification == "User Updated Successfully") {
      this.display = false;
      this.refresh = "refreshList";
    }
    if (this.Notification == "Failed to update") {
      this.display = false;
      this.refresh = "";
    }
    if(this.Notification == "Session timed out" || this.Notification == "Internal Server Error")
    {
      this.display = false;
      localStorage.clear();
      this.auth_service.setUserInfo(undefined);
      this.router.navigate([ '/session/signin' ]);
    }

  }


  addUser() {
    this.refresh = "";
    var obj: { [k: string]: any } = {};
    obj.employee_id = this.user.employeeId[0];
    obj.is_dashboard_user = this.dashboard_user;
    obj.name = this.user.fullNameValue[0];
    obj.employeeEmail = this.user.email[0];
    obj.role = this.form.value.ROLE;
    obj.department_id = this.form.value.DEPARTMENT;
    obj.status = this.form.value.STATUS;
    let lst = this.userList.filter(x => x.employee_id === this.user.employeeId[0]);
    if (lst.length == 0) {
       this.api_service.addUser(obj).subscribe(
        data => {
          if (data != null) {
            this.loadUsers();
            setTimeout(() => {
              toastr.success('User Added Successfully', 'Success');
              this.display = false;
              this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
              this.refresh = "refreshList";
            // this.Notification = "User Added Successfully";
            // this.display = true;
          }, 400);
          }
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
          setTimeout(()=>{
            toastr.error('User Add Failed', 'Error');
            this.display = false;
            this.refresh = "";
          // this.Notification = "User Add Failed";
          // this.display = true;
        }, 400);
        });
    }else {
      let id = lst[0].user_id;
      this.confirmationService.confirm({
        message: 'This user already exists in HOTO database. This will update user profile in the HOTO database. This may affect HOTO existing assignments.',
        header: 'Confirmation',
        icon: 'fa fa-info',
        accept: () => {
       this.api_service.updateUser(obj, id).subscribe(
        data => {
          if (data != null) {
            setTimeout(()=>{
              toastr.success('User Updated Successfully', 'Success');
              this.display = false;
              this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
              this.refresh = "refreshList";
            // this.Notification = "User Updated Successfully";
            // this.display = true;
          }, 400);
          }
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
          setTimeout(()=>{
            toastr.error('Failed To Update', 'Error');
            this.display = false;
            this.refresh = "";
          // this.Notification = "Failed to update";
          // this.display = true;
        }, 400);
        });
     }});
    }
   }

   addCustomer() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    // let dialogRef = this.dialog.open(ChecklistFormDialog, {
    //   width: '60vw',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadChecklists();
    //   }
    // });
  }

  toggleDisplaySeeHistory() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
  submitUserForm(){
    debugger;
    this.formSubmitted = true 
    if (this.checklistForm.status === "VALID") {
    var obj={
      name:this.checklistForm.value.name,
      password:this.checklistForm.value.password,
      employeeEmail:this.checklistForm.value.emailId ,
      department_id:this.checklistForm.value.department,
      role:this.checklistForm.value.role,
      status:this.checklistForm.value.Status,
      siteIdList:this.checklistForm.value.site,
      //siteIdList: [30083 ,30084,30085 ]
    }
     this.api_service.addUser(obj).subscribe(
      
      data => {
        this.formSubmitted = false
        if (data != null) { 
          this.loadUsers();
          setTimeout(() => {
            toastr.success('User Added Successfully', 'Success');
            this.display = false;
            this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
            this.refresh = "refreshList";
          // this.Notification = "User Added Successfully";
          // this.display = true;
        }, 400);
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(()=>{
          toastr.error('User Add Failed', 'Error');
          this.display = false;
          this.refresh = "";
        // this.Notification = "User Add Failed";
        // this.display = true;
      }, 400);
      });
    }
  }
  onLocationExpandChange(even){

  }
  
  // end
}
