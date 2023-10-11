import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FeederDialog } from 'app/Dialogs/feeder/feeder.component';
import {ApiService} from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { NotificationDialog} from 'app/Dialogs/notification-dialog/notification-dialog';
import { DialogModule} from  'primeng/primeng';
import { StartFeederDialog } from 'app/Dialogs/start-feeder/start-feeder.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'feeder-list',
  templateUrl: './feeder-list.html',
  styleUrls:['./feeder-list.scss'],
  providers: [ConfirmationService]
})

export class FeederModelListComponent {
  feederList:any;
  siteList: any;
  config :MdSnackBarConfig; 
  _value: string;
   dateAdd : Date; //this object is used to increase the day by 1 
  selectedSite:any;
  current_site: any;
  sites = [];
  substations = [];
  feeder_values: any;
  display=false;
  Notification:string;
  user_info: any;

  status_arr = [
    {'label': 'Active',
     'value': 'Active' },
    {'label': 'In Active',
     'value': 'In Active'} 
  ];
  @Input()
  public set value(val: string) {
    this._value = val;
    // this.getFeeders();
  }
 
  constructor(public dialog: MdDialog, private api_service: ApiService,private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef,private router: Router,private confirmationService: ConfirmationService,private auth_service: AuthGuard) {
      this.feeder_values =[];
  }
  ngOnInit() {
    this.user_info = this.auth_service.getUserInfo();
    this.getSites();
    this.loadSubstations();
    this.feeder_values = [];
    this.siteList =[];
  }
  getSites() {
    this.api_service.getUserSpecificSites(this.user_info.user_id).subscribe(
      data => {
         for (var  i of data){
           this.sites.push({
             'label': i.site,
             'value': i
           });
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  loadSubstations() {
    this.substations = [];
     this.api_service.getSubstations().subscribe(
      data => {
        if (data != null) {
          for (var  i of data){
            this.substations.push({
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
  findFeederById(selectedSite) {
    this.current_site = selectedSite;
    this.feeder_values = [];
    this.api_service.getFeederById(selectedSite.id).subscribe(
      data => {
        this.feeder_values = [];
        
        this.siteList = [];
        if(data != null){
          this.feederList = data;
          data.reverse();
          var index = 0;
          for (var i of data) {
              var obj: { [k: string]: any } = {};
              obj.index = index;
              obj.id = i.id;
              obj.name = i.name;
              obj.status = i.status;
              obj.substation = i.substation;
              if (i.planned_start_date != null) {
                obj.planned_start_date = new Date(i.planned_start_date);
              }else {
                obj.planned_start_date = new Date();
              }
              if ( i.planned_end_date != null) {
                obj.planned_end_date = new Date(i.planned_end_date);
              }else {
                obj.planned_end_date = new Date();
              }
              if (i.summary) {
                obj.summary = i.summary;
              }
              obj.saveFlag = false;
              obj.isUsed = i.isUsed;
              this.siteList.push(obj);
              index++;
            }
        }
        this.feeder_values = this.siteList;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });



  }

  generateFeederCertificate(row){
    this.api_service.generateFeederCertificate(row.id).subscribe(
      data => { 
          if(data == "File Created Successfully")
          {
              var vin = window.open("/hoto_be/data/Feeder/"+row.id+".pdf","_blank");
              vin.focus();
          }
      },err=>{
          console.log(err);
          this.api_service.checkStatus(err);
      });
  }


  showSaveButton(i) {
    if (this.feeder_values[i].substation != null
      && this.feeder_values[i].substation.id 
      && this.feeder_values[i].name != null 
      && this.feeder_values[i].name != '' 
      && this.feeder_values[i].planned_start_date != null 
      && this.feeder_values[i].planned_end_date != null)
      {
        this.feeder_values[i].saveFlag = true;
      }
  }
  validateFeederName(name:String,id:number)
  {
    var i;
    if(id==0)
    {
      for (i=0;i<this.feederList.length;i++) {
        if (this.feederList[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      return false;
    }
    else
    {
      for (i=0;i<this.feeder_values.length;i++) {
        if (this.feederList[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'') && id!=this.feederList[i].id) {
            return true;
        }
      }
      return false;
    }

  }
  createFeeder() {
    var obj: { [k: string]: any } = {};
    obj.id = 0;
    if(this.feeder_values.length > 0){
      for(var i of this.feeder_values)
      {
        i.index=i.index+1;
      }
      obj.index = this.feeder_values[0].index-1;  
    }
    else{
      obj.index = 0;
    } 
    obj.name = '';
    obj.status = 'Active';
    obj.substation = {};
    obj.planned_start_date = null;
    obj.planned_end_date = null;
    obj.saveFlag = false;
    this.feeder_values.unshift(obj);
  }
  
  approveFeeder(id:number)
  {
    var obj: { [k: string]: any } = {};
    obj.status = "Approved";
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this Feeder ?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        this.api_service.updateFeeder(obj,id).subscribe(
          data => {
            setTimeout(()=>{
            this.display=true;
            this.Notification = 'Feeder approved Successfully';
          }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.display=true;
            this.Notification = 'Feeder approve Failed';
          }, 400);
        });
      }});
  }

  dateIncrease(date:Date){
    var y = date.getFullYear(),
    m = date.getMonth() + 1, // january is month 0 in javascript
    d = date.getDate();
    var pad = function(val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str};
    var dateString = [y, pad(m), pad(d)].join("-");
    return dateString;
  }

 
  onNotification()
  {
    if(this.Notification == 'Feeder Added Successfully'
    || this.Notification == 'Feeder Edited Successfully'
    || this.Notification == 'Feeder approved Successfully')
    {
      this.display = false;
      this.findFeederById(this.selectedSite);
    }
    else{
      this.display = false;
    } 
  }

  openChecklists(location_id, id) {
    this.router.navigate(['/site-dashboard/checklists/' + location_id ], { queryParams: { stage: id } });
  }

  startFeeder(id: number, name: string) {
    let dialogRef = this.dialog.open(StartFeederDialog, {
        width: '60vw',
        height: '180px',
        disableClose: true,
        data: {
          feeder_id: id,
          feeder_name: name,
          site_id: this.selectedSite.id
        }
    });
  
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.findFeederById(this.selectedSite);
        }
    });
  }

  validateDates(startDate:Date,endDate:Date)
  {
    if(startDate > endDate)
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  saveEditFeeder(row,index) {
    if(this.validateDates(row.planned_start_date,row.planned_end_date)==true){
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else
    {
      var obj: {[k: string]: any} = {};
      obj.name = row.name;
      obj.status = row.status;
      obj.substation_id = row.substation.id;
      this.dateAdd = row.planned_start_date;
      if (row.planned_start_date != null) {
         obj.planned_start_date = new Date(this.dateIncrease(this.dateAdd));
      }
      this.dateAdd = row.planned_end_date;
      if (row.planned_end_date != null) {
         obj.planned_end_date = new Date(this.dateIncrease(this.dateAdd));
      }
      obj.site_id = this.current_site.id;
      if (row.id === 0 || row.id === null) {
        if(this.validateFeederName(obj.name,0)==false)
        {
          this.api_service.addFeeder(obj).subscribe(
            data => {
              if(data != null){
                  this.feeder_values[index].id = data.id;
                  this.feeder_values[index].saveFlag = false;
                  setTimeout(()=>{        
                  this.display=true;
                  this.Notification = 'Feeder Added Successfully';
                }, 400);
              }
            },
            err => { console.log(err);
              this.api_service.checkStatus(err);
              setTimeout(()=>{        
              this.display=true;
              this.Notification = 'Feeder Add Failed';
            }, 400);
          });
        }
        else
        {
          this.Notification = 'Feeder Name already exists';
          this.display=true;
        }
      }else {
  
        if(this.validateFeederName(obj.name,row.id)==false)
        {
          this.api_service.updateFeeder(obj, row.id).subscribe(
          data => {
             this.feeder_values[index].saveFlag = false;
             setTimeout(()=>{        
             this.display=true;
             this.Notification = 'Feeder Edited Successfully';
            }, 400);
          },
          err => { console.log(err); 
            this.api_service.checkStatus(err);
            setTimeout(()=>{        
            this.display=true;
            this.Notification = 'Feeder Edit Failed';
          }, 400);
          });
        }
        else
        {
          this.Notification = 'Feeder Name already exists';
          this.display=true;
        }
      }
    }

    
  }

  deleteEmptyRow(index) {
    this.feeder_values.splice(index,1);
    for(var i of this.feeder_values)
    {
      i.index=i.index-1;
    }
  }
}
