import {Component, Output, EventEmitter, OnInit, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdIconRegistry} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { ChecklistComponent } from 'app/checklist/checklist.component';
import { MilestoneInsForm } from 'app/custom_components/milestone-ins/milestone-ins.component';

@Component({
  selector: 'app-start-Feeder',
  templateUrl: './start-Feeder.html',
  styleUrls:['/start-feeder.scss']
})

export class StartFeederDialog implements OnInit {
  project_checklists:  any;
  results: any;
  Notification: any;
  _selected_site: any;
  checklists = [];
  filteredCountriesMultiple: any;
  display = false;
  emptyFlag = true;
  sites = [];
  constructor(public dialogRef: MdDialogRef<StartFeederDialog>, 
    @Inject(MD_DIALOG_DATA) public data: any,
     private api_service: ApiService,
      private fb: FormBuilder) {
  this.results = [];
  }
  ngOnInit() {
    this.api_service.getAllFeeder().subscribe(
    data => {
      this.results = data;
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });
  }
  changeChecklists(project_checklists) {
     this.checklists = project_checklists;
     if(this.checklists != undefined && this.checklists.length > 0)
     {
       this.emptyFlag = false;
     }
     else
     {
       this.emptyFlag = true;
     }
  }
  filterCountryMultiple(event) {
    let query = event.query;
    this.filteredCountriesMultiple = this.filterCountry(query, this.results);
  }
  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let checklist = countries[i];
      if (checklist.NAME.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        filtered.push(checklist);
      }
    }
    return filtered;
  }
  closeDialog() {
      this.dialogRef.close(false);
  }
  onNotification() {
    if(this.Notification == 'Please Add Checklists')
    {
      this.display = false;
    }
    if (this.Notification.indexOf('Feeder started successfully.') !== -1) {
      this.display = false;
      this.dialogRef.close(true);
    } 
  }
  startFeeder() {
    if(this.checklists)
    {
        if (this.data && this.checklists.length > 0) {
            var obj: { [k: string]: any } = {};
            obj.checklists = this.checklists;
            obj.site_id = this.data.site_id;
            obj.feeder_id = this.data.feeder_id;
            obj.feeder_name = this.data.feeder_name;
            obj.stage_id = this.checklists[0].STAGE_ID;
            obj.model_id = this.checklists[0].MODEL_ID;
              this.api_service.startFeeder(obj).subscribe(
              data => {
                if (data.indexOf('Feeder started successfully.') !== -1) {
                  setTimeout(()=>{
                   this.display = true;
                   this.Notification = 'Feeder started successfully.';
                  }, 400);
               }else {
                setTimeout(()=>{
                   this.display = true;
                   this.Notification = data;
                  }, 400);
                }
              },
              err => {
                console.log(err);
              if(err.status == 401)
              {
                this.closeDialog();
                setTimeout(()=>{
                this.api_service.checkStatus(err);
                }, 1000);
              }
              else
              {
                setTimeout(()=>{
                  this.display = true;
                  this.Notification = "Failed to start Feeder";
                }, 400);
              } 
              }); 
    }
    else{
        this.Notification = 'Please Add Checklists';
        this.display = true;
    }
    
    }
  }
}


