import { Component, ViewChild, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { DialogModule} from  'primeng/primeng';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'app-site-team',
  templateUrl: './site-team.component.html'
})
export class SiteTeamComponent implements OnInit {
  sites = [];
  selectedSite: any;
  departments: any;
  departmentList: any;
  user_info: any;
  text: string;
  HODs: any;
  countries: any[];
  users: any;
  display=false;
  Notification:string;
  filteredCountriesMultiple: any[];
  selected_site_id: any;
  current_site: number;
  usersList: any[];
constructor(public dialog: MdDialog,
              private api_service: ApiService,
              private router: Router,
              private auth_service: AuthGuard,
              @Inject(DOCUMENT) private document: Document
            ) {
        //role management      
        this.user_info = this.auth_service.getUserInfo();
        if (this.user_info) {
          if (this.user_info.role.toUpperCase() !== 'ADMIN'
            && this.user_info.role.toUpperCase() !== 'PM'
            && this.user_info.role.toUpperCase() !== 'SITE_MIS'
          ) {
            this.router.navigate(['/site-dashboard']);
          }
        }
  }
  ngOnInit() {
   this.getSites();
   this.getUsers();
  }
   getSites() {
    this.api_service.getUserSpecificSites(this.user_info.user_id).subscribe(
      data => {
        if (data != null){
           for (var  i of data){
           this.sites.push({
             'label': i.site,
             'value': i
           });
        }
        }
      },
      err => { console.log(err); 
      this.api_service.checkStatus(err);
      });
  }
 getTeam(id: number) {
   this.current_site = id;
   this.departmentList = [];
    this.api_service.getTeam(id).subscribe(
      data => {
        this.departmentList =[];
        if (data != null) {
          for (var i in data) {
            var obj: { [k: string]: any } = {};
            obj.HOD = data[i].HOD;
            obj.department = data[i].department;
            obj.team = data[i].team;
            obj.saveFlag = false;
            this.departmentList.push(obj);
          }
          this.departments = this.departmentList;
        }
     },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
 }
search(event) {
    this.api_service.getUsers().subscribe(data => {
      this.HODs = [];
      this.users = data;
       if (data != null){
          for (var i of data){
            this.HODs.push({
                  'label': i.name,
                  'value': i
            });
          }
      }
    },err=>{
      console.log(err);
      this.api_service.checkStatus(err);
    }
  
  );
}
getUsers() {
  this.api_service.getUsers().subscribe(data => {
      this.usersList = data;
    },
    err=>{
      console.log(err);
      this.api_service.checkStatus(err);
    }
  );
}
loadHOD(row) {
      this.HODs = [];
      let data = this.usersList.filter(x => x.department_id == row.department.id && x.role.toLowerCase() == 'hod');
      if (data != null) {
          for (var i of data){
            this.HODs.push({
                  'label': i.name,
                  'value': i
            });
          }
      }
}
getDepartmentUsers(row) {
  this.users = [];
  let data = this.usersList.filter(x => x.department_id === row.department.id && x.role.toLowerCase() !== 'hod');
  let data2 = [];
  for(var i in data) {
    if (!row.team.some(y => y.user_id === data[i].user_id)) {
      data2.push(data[i]);
    }
  }
  this.users = data2;
}
changeSite(selectedSite) {
  this.getTeam(selectedSite.id);
  this.selected_site_id = selectedSite.id;
}
 filterCountryMultiple(event, model) {
         let query = event.query;
         this.filteredCountriesMultiple = this.filterCountry(query, this.users, model);
}
filterCountry(query, countries: any[], model: any): any[] {
      let filtered : any[] = [];
      for (let i = 0; i < countries.length; i++) {
          let team_mem = countries[i];
          if (team_mem.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
            filtered.push(team_mem);
          }
      }
      return filtered;
}

onNotification()
{
  if(this.Notification == "Site Team Update Failed")
  {
    this.display = false;
  }
  if(this.Notification == "HOD Updated Successfully")
  {
    this.display = false;
  }
  if (this.Notification === 'Site Team Updated Successfully') {
    this.display = false;
    let count_save = this.departments.filter(x => x.saveFlag === true);
    if (count_save.length == 0) {
      this.getTeam(this.current_site);
    }
  }
}
  changeHOD(row) {
    var obj: {[k: string]: any} = {};
    obj.site_id = this.selected_site_id;
    obj.department_id = row.department.id;
    obj.user_id = row.HOD.user_id;
    obj.role = 'HOD';
    this.api_service.updateSiteHod(obj).subscribe(
      data => {
        this.Notification = "HOD Updated Successfully";
        this.display = true;
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
        this.Notification = "HOD Update Failed";
        this.display= true;
      });
  }
  enableSaveFlag(index) {
    this.departments[index].saveFlag = true;
  }
  changeTeam(row) {
    var obj: {[k: string]: any} = {};
    if (row.team) {
      obj.team = row.team;
      obj.site_id = this.selected_site_id;
      obj.department_id = row.department.id;
    }
    if (row.HOD.user_id != 0){
      obj.user_id = row.HOD.user_id;
      obj.role = 'HOD';
      obj.site_id = this.selected_site_id;
      obj.department_id = row.department.id;
    }
    this.api_service.updateSiteTeam(obj).subscribe(
      data => {
        if (data !== 0) {
          this.departments.filter(x => x.department.id == row.department.id)[0].saveFlag = false;
          setTimeout(() => {
          this.Notification = 'Site Team Updated Successfully';
          this.display = true;
        }, 400);
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(()=>{
        this.Notification = "Site Team Update Failed";
        this.display = true;
      }, 400);

      });
  }
}
