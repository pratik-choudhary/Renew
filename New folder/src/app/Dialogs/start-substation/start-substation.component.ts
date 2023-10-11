import {Component, Output, EventEmitter, OnInit, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdIconRegistry} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { ChecklistComponent } from 'app/checklist/checklist.component';
import { MilestoneInsForm } from 'app/custom_components/milestone-ins/milestone-ins.component';

@Component({
  selector: 'app-start-substation',
  templateUrl: './start-substation.html',
  styleUrls: ['./start-substation.scss']
})

export class StartSubstationDialog implements OnInit {
  project_checklists:  any;
  results: any;
  Notification: any;
  _selected_site: any;
  checklists = [];
  filteredCountriesMultiple: any;
  display = false;
  sites = [];
  emptyFlag = true;
  constructor(public dialogRef: MdDialogRef<StartSubstationDialog>, 
    @Inject(MD_DIALOG_DATA) public data: any,
     private api_service: ApiService,
      private fb: FormBuilder) {
  this.results = [];
  }
  ngOnInit() {
    this.getSites();
    this.api_service.getAllSubstation().subscribe(
    data => {
      this.results = data;
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });
  }
  getSites() {
    this.sites = [];
    this.api_service.getSites().subscribe(
      data => {
        this.sites = [];
        if (data != null) {
          for (var  i of data){
            if (i.substations.some(y => y.id === this.data.substation_id)) {
                this.sites.push({
                  'label': i.site,
                  'value': i
                });
            }
          }
          if (this.sites.length === 0) {
            for (var i of data){
              this.sites.push({
                'label': i.site,
                'value': i
              });
            }
          }
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  };
  KeepSelectedSite(selectedSite: any) {
    this._selected_site = selectedSite;
    if(this._selected_site && this.checklists.length > 0)
    {
      this.emptyFlag = false;
    }
    else
    {
      this.emptyFlag = true;
    }
  }
  changeChecklists(project_checklists) {
     this.checklists = project_checklists;
     if(this.checklists)
     {
      if(this._selected_site && this.checklists.length > 0)
      {
        this.emptyFlag = false;
      }
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
    if(this.Notification == "Please add checklists")
    {
      this.display = false;
      return;
    }
    if (this.Notification.indexOf('Substation started successfully.') !== -1) {
      this.display = false;
      this.dialogRef.close(true);
    } else {
      this.display = false;
      this.dialogRef.close(false);
    }
  }
  startSubstation() {
    if(this.checklists.length == 0)
    {
      this.Notification = "Please add checklists";
      this.display = true;
    }
    if (this.data && this._selected_site && this.checklists.length > 0) {
       var obj: { [k: string]: any } = {};
       obj.checklists = this.checklists;
       obj.site_id = this._selected_site.id;
       obj.substation_id = this.data.substation_id;
       obj.substation_name = this.data.substation_name;
       obj.stage_id = this.checklists[0].STAGE_ID;
       obj.model_id = this.checklists[0].MODEL_ID;
       this.api_service.startSubstation(obj).subscribe(
        data => {
          if (data.indexOf('Substation started successfully.') !== -1) {
             this.display = true;
             this.Notification = 'Substation started successfully.';
          }else {
             this.display = true;
             this.Notification = data;
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
              this.Notification = "Failed to start Substation";
              },400);
            }
        });
    }
  }
}


