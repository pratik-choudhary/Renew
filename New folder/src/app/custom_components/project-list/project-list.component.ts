import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { SiteDialog } from 'app/Dialogs/site/site.component';
import {ApiService} from 'app/services/api.service';
import { AddProjectDialog } from 'app/Dialogs/Project/project-dialog.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { DialogModule} from  'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';


@Component({
  selector: 'project-list',
  templateUrl: './project-list.html',
  providers: [ConfirmationService]
})

export class ProjectListComponent {
  display=false;
  Notification:string; 
   _value: string;
   _selectedSite: any;
  @Input()
    public set value(val: string) {
      this._value = val;
      if (this._selectedSite) {
         this.getProjects(this._selectedSite);
      }
    }
  config :MdSnackBarConfig;  
  cars: any;
  siteList: any;
  models = [];
  results = [];
  val = [];
  countries: any[];
  filteredCountriesMultiple: any[];
  projects = [];
  customers = [];
  sites = [];
  selectedSite: any;
  projectsList:any;
  currentUser:any;
 constructor(public dialog: MdDialog,private confirmationService: ConfirmationService,private snackbar: MdSnackBar, private api_service: ApiService, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer,private auth_service: AuthGuard) {
      this.countries = [];
      this.projects = [];
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    this.loadChecklists();
    this.loadCustomers();
    this.getSites();
     this.iconRegistry.addSvgIcon( 
        'plus-circle',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
        this.iconRegistry.addSvgIcon(
        'arrow_back',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_arrow_back_black_24px.svg'));
        this.iconRegistry.addSvgIcon(
        'location',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_place_black_24px.svg'));
        this.iconRegistry.addSvgIcon(
        'pencil',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/pencil.svg'));
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};
    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}
  getProjects(selectedSite) {
    this.selectedSite = selectedSite;
    this.api_service.getAllProjects(selectedSite.id).subscribe(
      data => {
        if (data != null) {
          data.reverse(); 
          this.projects = data;
          var projectData = this.projects;
          this.projectsList = this.removeDuplicates(projectData,'Id');
        }
      },
      err => { console.log(err);
      
      this.api_service.checkStatus(err);
    });
  }

  getSites() {
    this.sites= [];
    this.api_service.getUserSpecificSites(this.currentUser.user_id).subscribe(
      data => {
        if (data != null) {
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
  };
  findProjectById(selectedSite) {
    this.getProjects(selectedSite);
  }
addNewProject(){
 var obj: {[k: string]: any} = {};
  obj.Id = 0;
  obj.name = '';
  obj.customer = {};
  obj.model = {};
  obj.checklist = [];
  this.projects.push(obj);
}

addModel(row, e) {
  e.stopPropagation();
  var obj: {[k: string]: any} = {};
  obj.Id = row.Id;
  obj.name = row.name;
  obj.customer = row.customer;
  obj.model = {};
  obj.checklist = [];
  this.projects.unshift(obj);
}
loadCustomers() {
    this.customers = [];
    this.api_service.getCustomers().subscribe(
    data => {
      if (data != null) {
        for (var  i of data){
           this.customers.push({
             'label': i.name,
             'value': i
           });
        }
      }
    },
    err => { console.log(err);
    this.api_service.checkStatus(err);
    });
  }

  filterCountryMultiple(event) {
         let query = event.query;
         this.filteredCountriesMultiple = this.filterCountry(query, this.results);
    }
  filterCountry(query, countries: any[]): any[] {
        let filtered : any[] = [];
        for (let i = 0; i < countries.length; i++) {
            let checklist = countries[i];
            if (checklist.NAME.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(checklist);
            }
        }
        return filtered;
    }
  loadChecklists() {
    this.api_service.getChecklistByModel(1).subscribe(
      data => {
        this.results = data;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }  
  ngOnInit() {
    this.loadModels();
  }
  loadModels() {
    this.api_service.getModules().subscribe(
    data => {
      if (data != null) {
        for (var  i of data){
           this.models.push({
             'label': i.name,
             'value': i
           });
        }
      }
    },
    err => { console.log(err);
    this.api_service.checkStatus(err);
  });
  }
  openEditProject(row){
    var models =[];
    for(var i in this.projects) {
      if (this.projects[i].Id === row.Id) {
        models.push(this.projects[i]);
      }
    }

    let dialogRef = this.dialog.open(AddProjectDialog, {
      width: '70vw',
      height: '100vh',
      data: {
        siteId: this.selectedSite,
        project: row,
        Models: models
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getProjects(this.selectedSite);
      }
    });
  }
  addModelOnly(row) {
    let dialogRef = this.dialog.open(AddProjectDialog, {
      width: '70vw',
      data: {
        siteId: this.selectedSite,
        project: row,
        onlyModel: true
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getProjects(this.selectedSite);
      }
    });
  }
  addProjectDialog() {
    let dialogRef = this.dialog.open(AddProjectDialog, {
      width: '60vw',
      height: '100vh',
      data: {
        siteId: this.selectedSite
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProjects(this.selectedSite);
      }
    });
  }
  onNotification()
  {
    
    this.display = false;
    this.getProjects(this.selectedSite);
  }

  deleteProject(row) {
    this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this project?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.api_service.deleteProject(row.Id).subscribe(
                data => {
                  setTimeout(()=>{
                  this.display = true;
                  this.Notification="Project Deleted Successfully";
                }, 400);
                },
                err => { console.log(err);
                this.api_service.checkStatus(err);
                });
            }
    });
  }

  saveEditProject(row, index) {
  var obj: {[k: string]: any} = {};
      obj.name = row.name;
      obj.customer_id = row.customer.id;
      obj.site_id = 30022;
      obj.model_ids = [];

      var obj2: {[k: string]: any} = {};
      obj2.model_id = row.model.id;
      obj2.checklist_ids = [];

     for(var i in row.checklists){
         var obj3: {[k: string]: any} = {};
          obj3.id =  row.checklists[i].CHECKLIST_ID;
          obj2.checklist_ids.push(obj3);
      }

      obj.model_ids.push(obj2);
    
      if (row.Id === 0 || row.Id === null) {
         this.api_service.addProject(obj).subscribe(
          data => {
            this.getProjects(this.selectedSite);
          },
          err => { console.log(err);
          this.api_service.checkStatus(err);
          });
      }
  }
}
