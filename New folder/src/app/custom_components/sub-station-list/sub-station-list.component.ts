import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { SubStationDialog } from 'app/Dialogs/sub-station/sub-station.component';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { NotificationDialog } from 'app/Dialogs/notification-dialog/notification-dialog';
import { DialogModule} from 'primeng/primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StartSubstationDialog } from 'app/Dialogs/start-substation/start-substation.component';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';

@Component({
  selector: 'sub-station-list',
  templateUrl: './sub-station-list.html',
  styleUrls: ['./substation-list.scss'],
  providers: [ConfirmationService]
})

export class SubStationModelListComponent {
  _value: string;
  config: MdSnackBarConfig;
  @Input()
  public set value(val: string) {
    this._value = val;
    // this.getSubstations();
  }
  dateAdd: Date;
  substationList = [];
  status_arr = [
    {'label': 'Active',
     'value': 'Active' },
    {'label': 'In Active',
     'value': 'In Active'}
  ];
  list = [];
  display= false;
  Notification: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  searchTerm: any;
  substationData = [];
  substationListCopy: any;
  constructor(public dialog: MdDialog, private route: ActivatedRoute, private api_service: ApiService,private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef, private router: Router,private confirmationService: ConfirmationService) {
  }
  search(): void {
    let term = this.searchTerm;
    this.substationList = this.substationListCopy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.name)) {
        return tag.name;
      }
    });
  }
  ngOnInit() {
     this.getSubstations();
  }
  getSubstations(){
    this.list = [];
    this.api_service.getSubstations().subscribe(
      data => {
        if (data != null) {
          data.reverse();
          this.list = [];
          var index = 0;
          this.substationData = data;
          for (var i of data) {
            var obj: { [k: string]: any } = {};
            obj.index = index;
            obj.id = i.id;
            obj.name = i.name;
            obj.status = i.status;
            obj.site_id = i.site_id;
            obj.already_existsFlag = false;
            if (i.summary) {
              obj.summary = i.summary;
            }
            if (i.planned_start_date) {
              obj.planned_start_date = new Date(i.planned_start_date);
            }
            if (i.planned_end_date) {
              obj.planned_end_date = new Date(i.planned_end_date);
            }
            obj.saveFlag = false;
            obj.isUsed = i.isUsed;
            this.list.push(obj);
            index++;
          }
        }
        this.substationList = this.list;
        this.substationListCopy = this.substationList;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
     });
  }
  showSaveButton(i) {
    this.substationList[i].saveFlag = true;
  }
  createSubstation() {
    var obj: { [k: string]: any } = {};
    if(this.substationList.length > 0)
    {
      for(var i of this.substationList){
        i.index = i.index+1;
      }
      obj.index = this.substationList[0].index-1;
    }
    else{
      obj.index = 0;
    }
    obj.id = 0;
    obj.name = '';
    obj.status = 'Active';
    obj.site_id = 0;
    obj.planned_start_date = null;
    obj.planned_end_date = null;
    obj.already_existsFlag = false;
    obj.saveFlag = false;
    this.substationList.unshift(obj);
  }
  openStationEditPopup(site) {
    let dialogRef = this.dialog.open(SubStationDialog, {
      width: '70vw',
      data: {
        site: site
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSubstations();
        
      }
    });
  }

  deleteSubstation(row, index) {
    this.api_service.deleteSubstationById(row.id).subscribe(
      data => {
        if (data != null) {
          this.getSubstations();
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  generateSubstationCertificate(row){
    this.api_service.generateSubstationCertificate(row.id).subscribe(
      data => { 
          if(data == "File Created Successfully")
          {
              var vin = window.open("/hoto_be/data/Substation/"+row.id+".pdf","_blank");
              vin.focus();
          }
      },err=>{
          console.log(err);
          this.api_service.checkStatus(err);
      });
  }


  dateIncrease(date: Date) {
    var y = date.getFullYear(),
      m = date.getMonth() + 1, // january is month 0 in javascript
      d = date.getDate();
    var pad = function (val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str };
    var dateString = [y, pad(m), pad(d)].join("-");
    return dateString;
  }



  onNotification()
  {
    if(this.Notification == 'Substation Added Successfully' ||
     this.Notification == 'Substation Edited Successfully' || 
     this.Notification == 'Substation approved Successfully')
    {
      this.display = false;
      this.getSubstations();
    }
    else{
      this.display = false;
    }
    
  }

  validateSubstationName(name:string,id:number)
  {
    var i;
    if(id==0)
    {
      for (i=0;i<this.substationData.length;i++) {
        if (this.substationData[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      return false;
    }
    else
    {
      for (i=0;i<this.substationData.length;i++) {
        if (this.substationData[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'') && id!=this.substationData[i].id) {
            return true;
        }
      }
      return false;
    }
 
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
  approveSubstation(id:number){
    var obj: { [k: string]: any } = {};
    obj.status = "Approved";
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this Substation ?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        this.api_service.updateSubstation(obj,id).subscribe(
          data => {
            setTimeout(()=>{
            this.display=true;
            this.Notification = 'Substation approved Successfully';
          }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.display=true;
            this.Notification = 'Substation approve Failed';
          }, 400);
        });
      }});
  }
  saveEditSubstation(row, index) {
    if(this.validateDates(row.planned_start_date,row.planned_end_date)==true){
      this.Notification = "Invalid Dates";
      this.display = true;
    }
    else if(row.name == ""||row.name == null)
    {
      this.Notification = "Please enter substation name";
      this.display = true;
    }
    else{
      var obj: { [k: string]: any } = {};
      obj.name = row.name;
      if (row.planned_start_date && row.already_existsFlag == false) {
        this.dateAdd = row.planned_start_date;
        obj.planned_start_date = new Date(this.dateIncrease(this.dateAdd));
      }
      if (row.planned_end_date && row.already_existsFlag == false) {
        this.dateAdd = row.planned_end_date;
        obj.planned_end_date = new Date(this.dateIncrease(this.dateAdd));
      }
      obj.status = row.status;
      
      if (row.id === 0 || row.id === null) {
        if(this.validateSubstationName(obj.name,0)==false)
        {
        this.api_service.addSubstation(obj).subscribe(
          data => {
            if (data != null) {
              this.substationList[index].id = data.id;
              this.substationList[index].saveFlag = false;
              setTimeout(()=>{
              this.display=true;
              this.Notification = 'Substation Added Successfully';
            }, 400);
            }
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.display = true;
            this.Notification = 'Substation Add Failed';
          }, 400);
          });
        }else
        {
          this.Notification = 'Substation Name  Already Exists';
          this.display=true;
        }
      } else {
        if (row.already_existsFlag == true) {
          var obj2: { [k: string]: any } = {};
          obj2.name = obj.name;
          obj2.status = obj.status;
        }
        if(row.already_existsFlag == true){
          if(this.validateSubstationName(obj.name, row.id)==false)
          {
          
          this.api_service.updateSubstation(obj2, row.id).subscribe(
            data => {
              
              this.substationList[index].saveFlag = false;
              this.substationList[index].already_existsFlag = false;
              setTimeout(()=>{
              this.display=true;
              this.Notification = 'Substation Edited Successfully';
            }, 400);
            },
            err => {
              console.log(err);
              this.api_service.checkStatus(err);
              setTimeout(()=>{
              this.display=true;
              this.Notification = 'Substation Edit Failed';
            }, 400);
            });
          }
          else
          {
            this.Notification = 'Substation Name  Already Exists';
            this.display=true;
          }
        }
        else
        {
          if(this.validateSubstationName(obj.name, row.id)==false)
          {
          
          this.api_service.updateSubstation(obj, row.id).subscribe(
            data => {
              this.substationList[index].saveFlag = false;
              this.substationList[index].already_existsFlag = false;
              setTimeout(()=>{
              this.display=true;
              this.Notification = 'Substation Edited Successfully';
            }, 400);
            },
            err => {
              console.log(err);
              this.api_service.checkStatus(err);
              setTimeout(()=>{
              this.display=true;
              this.Notification = 'Substation Edit Failed';
            }, 400);
            });
          }
          else
          {
            this.Notification = 'Substation Name Already Exists';
            this.display=true;
          }
        }
        
      }

    }
    
  }

  deleteEmptyRow(index) {
    this.substationList.splice(index, 1);
    for(var i of this.substationList)
    {
      i.index = i.index-1;
    }
  }
  openChecklists(location_id, id) {
    this.router.navigate(['/site-dashboard/checklists/' + location_id ], { queryParams: { stage: id } });
  }

startSubstation(id: number, name: string) {
  let dialogRef = this.dialog.open(StartSubstationDialog, {
      width: '60vw',
      height: '380px',
      disableClose: true,
      data: {
        substation_id: id,
        substation_name: name,
        site_id: 10003
      }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSubstations();
      }
  });
}
}
