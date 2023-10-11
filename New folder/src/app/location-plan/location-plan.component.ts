import { Component, ViewChild, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-location-plan',
  templateUrl: './location-plan.component.html',
  providers: [ConfirmationService]
})
export class LocationPlanComponent implements OnInit {
  locations = [];
  sites: any;
  Projects: any;
  checklists: any;
  list: any;
  user_info: any;
  current_location: any;
  config: MdSnackBarConfig;
  location_start_date: any;
  location_start_date_min_limit: any;
  location_end_date_min_limit: any;
  location_end_date: any;
  location_id: any;
  locationDateFlag = false;
  currentDate: Date;
  updateLocationFlag = false;
  dateAdd: Date;
  Notification: string;
  display = false;
  constructor(public dialog: MdDialog,
    private api_service: ApiService,
    private confirmationService: ConfirmationService,
    private snackbar: MdSnackBar,
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
        && this.user_info.role.toUpperCase() !== 'HOD') {
        this.router.navigate(['/site-dashboard']);
      }
    }
    this.currentDate = new Date();
    this.sites = [];
    this.Projects = [];
    this.locations = [];
    this.checklists = [];
    this.current_location = {};
  }
  ngOnInit() {
    this.getSites();
  }
  changeLocationDate() {
    this.updateLocationFlag = true;
  }
  dateIncrease(date: Date) {
    var y = date.getFullYear(),
      m = date.getMonth() + 1, // january is month 0 in javascript
      d = date.getDate();
    var pad = function (val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str };
    var dateString = [y, pad(m), pad(d)].join("-");
    return dateString;
  }
  onNotification() {
    if(this.Notification =='Please Insert WTG Traceability Questions for the Model' ||this.Notification == 'Please Publish WTG Traceability Questions for the Model')
    {      
      this.current_location.status = "Draft";
      this.display = false;
      this.loadChecklistInstances(this.current_location);
    }
    if (this.Notification == 'Location Date Edited Successfully') {
      this.display = false;
    }
    else {
      this.display = false;
    }
  }
  validateDates(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      return true;
    }
    else {
      return false;
    }
  }

  updateLocationDate() {
    var obj: { [k: string]: any } = {};
    this.dateAdd = this.location_start_date;
    obj.planned_start_date = new Date(this.dateIncrease(this.dateAdd));
    this.dateAdd = this.location_end_date;
    obj.planned_end_date = new Date(this.dateIncrease(this.dateAdd));
    if (this.validateDates(obj.planned_start_date, obj.planned_end_date) == true) {
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update location date?',
        header: 'Confirmation',
        icon: 'fa fa-info',
        accept: () => {
          this.updateLocationFlag = false;
          this.api_service.updateLocation(obj, this.location_id).subscribe(
            data => {
              setTimeout(() => {
                this.Notification = 'Location Date Edited Successfully';
                this.display = true;
                this.locationDateFlag = true;
              }, 400);
            },
            err => {
              console.log(err);
              this.api_service.checkStatus(err);
              setTimeout(() => {
                this.Notification = 'Location Date Edit Failed';
                this.display = true;
              }, 400);
            });
        }
      });
    }

  }
  getSites() {
    this.sites = [];
    this.api_service.getUserSpecificSites(this.user_info.user_id).subscribe(
      data => {
        if (data != null) {
          this.sites = [];
          for (var i of data) {
            this.sites.push({
              'label': i.site,
              'value': i
            });
          }
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  loadProjects(selectedSite: any) {
    this.Projects = [];
    this.locations = [];
    this.api_service.getProjectsBySiteId(selectedSite.id).subscribe(
      data => {
        if (data != null) {
          this.Projects = [];
          for (var i of data) {
            this.Projects.push({
              'label': i.name,
              'value': i
            });
          }
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  loadLocations(selectedProject: any) {
    this.locations = [];
    this.api_service.getLocationsByProjectId(selectedProject.id).subscribe(
      data => {
        if (data != null) {
          this.locations = [];
          for (var i of data) {
            this.locations.push({
              'label': i.name,
              'value': i
            });

          }
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  loadChecklistInstances(location: any) {    
    this.current_location = location;
    this.location_start_date = new Date(location.planned_start_date);
    this.location_end_date = new Date(location.planned_end_date);
    this.location_id = location.id;
    this.checklists = [];
    /* if(this.location_start_date < this.currentDate && this.location_end_date < this.currentDate)
    {
      this.Notification  = 'Please update Location dates';
      this.location_start_date_min_limit = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1)); 
      this.location_end_date_min_limit = new Date(this.currentDate.setDate(this.currentDate.getDate() + 1)); 
      this.display = true;
      this.locationDateFlag = false
    }
    else
    { */
    this.locationDateFlag = true;
    /* } */
    this.api_service.getChecklistInstanceByLocationId(location.id).subscribe(
      data => {
        if (data != null) {
          this.list = [];
          for (var i of data) {
            var obj: { [k: string]: any } = {};
            var date;
            var stage_obj: { [k: string]: any } = {};
            obj.id = i.id;
            obj.name = i.checklist.NAME;
            obj.initial_stage_id = i.initial_stage_id;
            if (i.planned_start_date != null) {
              obj.planned_start_date = new Date(i.planned_start_date);
              date = new Date(i.planned_start_date);
              obj.planned_end_date_min = new Date(date.setDate(date.getDate() + 1));
            } else {
              obj.planned_start_date = new Date(location.planned_start_date);
              date = new Date(location.planned_start_date);
              obj.planned_end_date_min = new Date(date.setDate(date.getDate() + 1));
            }
            if (i.planned_end_date != null) {
              obj.planned_end_date = new Date(i.planned_end_date);
            } else {
              date = new Date(obj.planned_start_date);
              obj.planned_end_date = new Date(date.setDate(date.getDate() + 1));
            }
            obj.saveFlag = false;
            if (i.stage != null) {
              stage_obj.id = i.stage.id;
              stage_obj.name = i.stage.stage.name;
              if (i.stage.planned_start_date != null) {
                stage_obj.planned_start_date = new Date(i.stage.planned_start_date);
                date = new Date(i.stage.planned_start_date);
                stage_obj.planned_end_date_min = new Date(date.setDate(date.getDate() + 1));
              } else {
                stage_obj.planned_start_date = new Date(location.planned_start_date);
                date = new Date(location.planned_start_date);
                stage_obj.planned_end_date_min = new Date(date.setDate(date.getDate() + 1));
              }
              if (i.stage.planned_end_date != null) {
                stage_obj.planned_end_date = new Date(i.stage.planned_end_date);
              } else {
                date = new Date(stage_obj.planned_start_date);
                stage_obj.planned_end_date = new Date(date.setDate(date.getDate() + 1));
              }
              stage_obj.status = i.stage.status;
              stage_obj.saveFlag = false;
            }
            obj.stage = stage_obj;
            this.list.push(obj);
          }
          this.checklists = this.list;
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  showSaveButton(i) {
    this.checklists[i].saveFlag = true;
    var date = new Date(this.checklists[i].planned_start_date);
    this.checklists[i].planned_end_date = new Date(date.setDate(date.getDate() + 1));
    this.checklists[i].planned_end_date_min = new Date(date.setDate(date.getDate()));
  }
  showSaveButton_endDate(i) {
    this.checklists[i].saveFlag = true;
  }
  showStageSaveButton(rowData) {
    this.checklists.filter(x => x.stage.id === rowData.stage.id)[0].stage.saveFlag = true;
    var date = new Date();
    date = new Date(this.checklists.filter(x => x.stage.id === rowData.stage.id)[0].stage.planned_start_date);
    this.checklists.filter(x => x.stage.id === rowData.stage.id)[0].stage.planned_end_date = new Date(date.setDate(date.getDate() + 1));
    this.checklists.filter(x => x.stage.id === rowData.stage.id)[0].stage.planned_end_date_min = new Date(date.setDate(date.getDate()));
  }
  showStageSaveButton_endDate(rowData) {
    this.checklists.filter(x => x.stage.id === rowData.stage.id)[0].stage.saveFlag = true;
  }
  saveEditLocationPlan(row, index) {
    var obj: { [k: string]: any } = {};
    obj.planned_start_date = row.planned_start_date;
    obj.planned_end_date = row.planned_end_date;
    if (this.validateDates(obj.planned_start_date, obj.planned_end_date) == true) {
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else {
      this.api_service.updateChecklistInstance(obj, row.id).subscribe(
        data => {
          if (data != null) {
            this.checklists[index].saveFlag = false;
            //this.snackbar.open('Updated Successfully', 'Ok', this.config);
            setTimeout(() => {
              this.Notification = 'Updated Successfully';
              this.display = true;
            }, 400);
          }
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });
    }
  }
  updateStageIns(row: any) {
    if (this.validateDates(row.stage.planned_start_date, row.stage.planned_end_date) == true) {
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else {
      var obj: { [k: string]: any } = {};
      obj.planned_start_date = row.stage.planned_start_date;
      obj.planned_end_date = row.stage.planned_end_date;
      this.api_service.updateStageInstance(obj, row.stage.id).subscribe(
        data => {
          if (data != null) {
            this.checklists.filter(x => x.stage.id === row.stage.id)[0].stage.saveFlag = false;
            //this.snackbar.open('Updated Successfully', 'Ok', this.config);
            setTimeout(() => {
              this.Notification = 'Updated Successfully';
              this.display = true;
            }, 400);
          }
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });
    }

  }
  startStage(row: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Start?',
      header: 'Start Confirmation',
      icon: 'fa fa-warning',
      accept: () => {
        var obj: { [k: string]: any } = {};
        obj.status = "started";
        obj.planned_start_date = row.stage.planned_start_date;
        obj.planned_end_date = row.stage.planned_end_date;
        this.api_service.updateStageInstance(obj, row.stage.id).subscribe(
          data => {
            if (data != null) {
              this.api_service.makeChecklistInstanceInprogress(this.current_location.id, row.stage.id).subscribe(
                data => {
                  if (data == 2000) {
                    setTimeout(() => {
                      this.Notification = 'Please Insert WTG Traceability Questions for the Model';
                      this.display = true;
                    }, 800);
                  }
                  if(data == 3000)
                  {
                    setTimeout(() => {
                      this.Notification = 'Please Publish WTG Traceability Questions for the Model';
                      this.display = true;
                    }, 800);
                  }
                  // this.api_service.createWTGChecklistInstances(this.current_location.id).subscribe(
                  //   data => {},err=>{
                  //     console.log(err); 
                  //     this.api_service.checkStatus(err);
                  //   });
                },
                err => {
                  console.log(err);
                  this.api_service.checkStatus(err);
                });
              this.loadChecklistInstances(this.current_location);
              //this.snackbar.open('Started Stage Successfully', 'Ok', this.config);
              if(this.Notification!='Please Insert WTG Traceability Questions for the Model' &&  this.Notification!='Please Publish WTG Traceability Questions for the Model')
              {
                setTimeout(() => {
                  this.Notification = 'Started Stage Successfully';
                  this.display = true;
                }, 800);
              }
            
            }
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
          });
      }
    });
  }


  publishLocation() {
    var obj: { [k: string]: any } = {};
    obj.status = "Published";
    this.api_service.updateLocation(obj, this.current_location.id).subscribe(
      data => {
        this.current_location.status = "Published";
        setTimeout(() => {
          this.Notification = 'Location Edited Successfully';
          this.display = true;
        }, 400);
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          this.Notification = 'Location Edit Failed';
          this.display = true;
        }, 400);
      });
  }
}

