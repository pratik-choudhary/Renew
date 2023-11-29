import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { LocationDialog } from 'app/Dialogs/location/location.component';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'location-list',
  templateUrl: './location-list.html',
  providers: [ConfirmationService]
})

export class LocationModelListComponent {
  display = false;
  Notification: string;
  selected_site: any;
  _value: string;
  config: MdSnackBarConfig;
  @Input()
  public set value(val: string) {
    this._value = val;
    //this.getLocations();
  }
  status_arr = [
    {
      'label': 'Draft',
      'value': 'Draft'
    },
    {
      'label': 'Published',
      'value': 'Published'
    },
    {
      'label': 'Abandon',
      'value': 'Abandon'
    }
  ];
  first: number = 0;
  locationList: any;
  customers = [];
  models = [];
  List = [];
  sites = [];
  feeders=[];
  projects = [];
  dateAdd: Date;
  _selectedSite: any;
  Copy: any;
  tableFlag = false;
  currentUser: any;
  firstIndexCopyFlag = false;
  constructor(public dialog: MdDialog, private api_service: ApiService, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef, private auth_service: AuthGuard, private confirmationService: ConfirmationService) {
  }
  ngOnInit() {
    this.locationList = [];
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    this.getSites();
    this.loadModels();
    this.loadCustomers();
  }
  getSites() {
    this.api_service.getUserSpecificSites(this.currentUser.user_id).subscribe(
      data => {
        if (data != null) {
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

  
  findLocationById(selectedSite) {
    this.selected_site = selectedSite;
    this.List = [];
    this._selectedSite = selectedSite.id;
    this.locationList = [];
    this.getFeedersBySiteId();
    this.api_service.getLocationById(selectedSite.id).subscribe(
      data => {
        data.reverse();
        this.List = [];
        if (data != null) {
          for (var i of data) {
            var obj: { [k: string]: any } = {};
            obj.id = i.id;
            obj.customer = i.customer;
            obj.customer_id = i.customer_id;
            obj.external_id = i.external_id;
            obj.model = i.model;
            obj.name = i.name;
            obj.feeder= i.feeder;
            obj.project = i.project;
            obj.model_id = i.model_id;
            obj.site = i.site;
            obj.site_id = i.site_id;
            obj.status = i.status;
            if (i.status == 'complete') {
              obj.status = 'Complete';
            }
            if (i.status == 'in-progress') {
              obj.status = 'In Progress';
            }
            obj.latitude = i.latitude;
            obj.longitude = i.longitude;
            obj.village = i.village;
            obj.taluka = i.taluka;
            obj.feeder_id = i.feeder_id;
            obj.district = i.district;
            obj.survey_number = i.survey_number;
            obj.wtg_capacity = i.wtg_capacity;
            obj.saveFlag = false;
            obj.copyFlag = false;
            obj.planned_start_date = new Date(i.planned_start_date);
            obj.planned_end_date = new Date(i.planned_end_date);
            if ((i.latitude == null || i.longitude == null) && (i.latitude == "" || i.longitude == "")) {
              obj.latlong_flag = false;
            }
            else {
              obj.latlong_flag = true;
            }
            this.locationList.push(obj);
          }
        }

        this.loadProjects(selectedSite);
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }


  getFeedersBySiteId()
  {
    this.feeders=[];
    this.api_service.getFeederById(this.selected_site.id).subscribe(data=>{
      if (data != null) {
        for (var i of data) {
          this.feeders.push({
            'label': i.name,
            'value': i
          });
        }
        if(this.feeders.length == 0)
        {
          this.Notification = 'Please add feeders for this site from DIGIROM Configuration';
          this.display = true;
        }
      }

    },err=>{});

  }
  loadModels() {
    this.api_service.getModules().subscribe(
      data => {
        if (data != null) {
          for (var i of data) {
            this.models.push({
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
  getProjectSpecificModels(row) {
    this.models = [];
    var project_id = 0;
    if (row.project.Id) {
      project_id = row.project.Id;
    } else {
      project_id = row.project.id;
    }
    this.api_service.getProjectSpecificModels(project_id).subscribe(
      data => {
        this.models = [];
        if (data != null) {
          for (var i of data) {
            data = data.filter(x => x.id != 30052);
            this.models.push({
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
  loadCustomers() {
    this.api_service.getCustomers().subscribe(
      data => {
        if (data != null) {
          for (var i of data) {
            this.customers.push({
              'label': i.name,
              'value': i
            });
          }
        }
      },
      err => { console.log(err) });
  }
  loadProjects(selectedSite) {
    this.api_service.getProjectList(selectedSite.id).subscribe(
      data => {
        this.projects = [];
        if (data != null) {
          for (var i of data) {
            this.projects.push({
              'label': i.name,
              'value': i
            });
          }
        }
      },
      err => { console.log(err) });
  }
  showSaveButton(row: any, i: number) {
    if (row.planned_end_date == null || row.planned_start_date == null) {
      row.saveFlag = false;
    } else {
      if (row.id == 0) {
        if (row.name != null && row.name != ''
          && row.project != null && row.model != null
          && row.planned_start_date != null && row.planned_end_date != null) {
          row.saveFlag = true;
        }
      } else {
        this.locationList.filter(x => x.id == row.id)[0].saveFlag = true;
      }
    }
  }

  onSelectFeeder(row:any,i:number){
    
    this.locationList.filter(x => x.id == row.id)[0].saveFlag = true;
    row.feeder = this.feeders.filter(x=>x.id == row.feeder_id);
  }
  createLocation(id: number) {
    if (id == 0 && this.firstIndexCopyFlag == false) {
      var obj: { [k: string]: any } = {};
      obj.id = 0;
      obj.project = {};
      obj.customer = {};
      obj.feeder = {};
      obj.customer_id = 0;
      obj.external_id = 0;
      obj.model = {};
      obj.name = '';
      obj.model_id = 0;
      obj.site = null;
      obj.site_id = 0;
      obj.status = 'Draft';
      obj.planned_start_date = null;
      obj.planned_end_date = null;
      obj.saveFlag = false;
      obj.copyFlag = false;
      obj.latitude = '';
      obj.longitude = '';
      obj.village = '';
      obj.taluka = '';
      obj.district = '';
      obj.survey_number = '';
      obj.wtg_capacity = '';
      obj.feeder_id = 0;

      this.locationList.unshift(obj);
    }
    else {
      if (this.Copy) {
        var obj: { [k: string]: any } = {};
        obj.id = 0;
        obj.project = this.Copy.project;
        obj.customer = this.Copy.customer;
        obj.feeder = this.Copy.feeder;
        obj.customer_id = this.Copy.customer_id;
        obj.external_id = this.Copy.external_id;
        obj.model = this.Copy.model;
        obj.name = '';
        obj.model_id = this.Copy.model_id;
        obj.site = this.Copy.site;
        obj.site_id = this.Copy.site_id;
        obj.status = 'Draft';
        obj.planned_start_date = this.Copy.planned_start_date;
        obj.planned_end_date = this.Copy.planned_end_date;
        obj.latitude = this.Copy.latitude;
        obj.longitude = this.Copy.longitude;
        obj.saveFlag = false;
        obj.copyFlag = false;
        obj.village = this.Copy.village;
        obj.taluka = this.Copy.taluka;
        obj.feeder_id = this.Copy.feeder_id;
        obj.district = this.Copy.district;
        obj.survey_number = this.Copy.survey_number;
        obj.wtg_capacity = this.Copy.wtg_capacity;
        this.locationList.unshift(obj);
      }
    }

  }

  copyLocation(index) {
    if (index == 0) {
      this.Copy = this.locationList[0];
      this.firstIndexCopyFlag = true;
      this.createLocation(0);
    }
    else {
      this.Copy = this.locationList[index];
      this.createLocation(index);
    }

    //this.createLocation(index);
    this.first = 0;
    this.tableFlag = true;

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
    if (this.Notification == 'Location Added Successfully'
      || this.Notification == 'Location Edited Successfully' || this.Notification == 'Location Add Failed') {
      this.display = false;
      this.findLocationById(this.selected_site);
    }
    else {
      this.display = false;
    }
  }

  getColor(x, data) {
    var color: string;
    if (data.status == "Published" || data.status == "Complete" || data.status == "In Progress") {
      color = 'lightgreen';
    }
    x.parentNode.parentNode.style.background = color; // x.parentNode.parentNode accesses the <td> element of table :)
  }

  validateDates(startDate: Date, endDate: Date) {
    if (startDate > endDate) {
      return true;
    }
    else {
      return false;
    }
  }

  validateLocationName(name: String, id: number) {
    var i;
    if (id == 0) {
      for (i = 1; i < this.locationList.length; i++) {
        if (this.locationList[i].name.toLowerCase().replace(/\s/g, '') == name.toLowerCase().replace(/\s/g, '')) {
          return true;
        }
      }
      return false;
    }
    else {
      for (i = 0; i < this.locationList.length; i++) {
        if (this.locationList[i].name.toLowerCase().replace(/\s/g, '') == name.toLowerCase().replace(/\s/g, '') && id != this.locationList[i].id) {
          return true;
        }
      }
      return false;
    }

  }




  saveEditLocation(row, index) {
    if (this.validateDates(row.planned_start_date, row.planned_end_date) == true) {
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else if (this.validateLocationName(row.name, row.id)) {
      this.Notification = "Location name already exists";
      this.display = true;
    }
    else {

      this.tableFlag = false;
      var obj: { [k: string]: any } = {};
      obj.customer_id = 0;
      obj.external_id = 0;
      obj.name = row.name;
      obj.model_id = row.model.id;
      obj.site_id = this._selectedSite;
      obj.status = row.status;
      obj.latitude = row.latitude;
      obj.longitude = row.longitude;
      obj.village = row.village;
      obj.feeder_id= row.feeder.id;
      obj.taluka = row.taluka;
      obj.district = row.district;
      obj.survey_number = row.survey_number;
      obj.wtg_capacity = row.wtg_capacity;
      this.dateAdd = row.planned_start_date;
      obj.planned_start_date = new Date(this.dateIncrease(this.dateAdd));
      this.dateAdd = row.planned_end_date;
      obj.planned_end_date = new Date(this.dateIncrease(this.dateAdd));
      if (row.project.id) {
        obj.project_id = row.project.id;
      } else {
        obj.project_id = row.project.Id;
      }
      if (row.id === 0 || row.id === null) {
        this.api_service.addLocation(obj).subscribe(
          data => {

            if (data != null) {
              if (data.id == 0) {
                setTimeout(() => {
                  this.Notification = 'Location Add Failed';
                  this.display = true;
                }, 400);

              }
              else {
                this.locationList[index].id = data.id;
                this.locationList[index].saveFlag = false;
                setTimeout(() => {
                  this.Notification = 'Location Added Successfully';
                  this.display = true;
                }, 400);
              }

            }
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              this.Notification = 'Location Add Failed';
              this.display = true;
            }, 400);
          });
      } else {
        this.api_service.updateLocation(obj, row.id).subscribe(
          data => {
            this.locationList[index].saveFlag = false;
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

  }

  removeLocation(row) {
    /* this.confirmationService.confirm({
   message: 'Are you sure that you want to delete this Location?',
   header: 'Delete Confirmation',
   icon: 'fa fa-trash',
   accept: () => {
     //api call for delete of location
      this.Notification = 'Location deleted successfully';
     this.display = true; 
   }});   
        */
  }
  /* deleteLocation(row, rowIndex) {
    this.api_service.deleteLocationById(row.id).subscribe(
      data => {
        if(data != null){
          this.findLocationById(this._selectedSite);
        }
      },
      err => { console.log(err);
    });
 
  } */

  openLocationEditPopup(location) {
    let dialogRef = this.dialog.open(LocationDialog, {
      width: '70vw',
      data: {
        location: location
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.findLocationById(this._selectedSite);
      }
    });
  }

  deleteEmptyRow(index) {
    this.tableFlag = false;
    this.locationList.splice(index, 1);
  }
}
