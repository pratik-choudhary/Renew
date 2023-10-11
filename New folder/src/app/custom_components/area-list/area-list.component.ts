import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { AreaDialog } from 'app/Dialogs/area/area.component';
import { ApiService } from 'app/services/api.service';
import {DataTableModule,SharedModule} from 'primeng/primeng';
@Component({
  selector: 'area-list',
  templateUrl: './area-list.html',
  styleUrls:['./area-list.scss']
})

export class AreaModelListComponent {
  _value:string;
  @Input() 
    public set value(val: string) {
      this._value = val;
      this.getAreas();
    }
  areaList:any;
  active_areaList:any;
  inactive_areaList:any;
  constructor(public dialog: MdDialog, public api_service: ApiService) {
    this.active_areaList=[];
    this.inactive_areaList=[];
  }

  getAreas() {
    this.api_service.getAreaList().subscribe(
      data => {
        data.reverse();
        this.areaList = data; 
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }

  deleteArea(row,index){
    this.api_service.deleteAreaById(row.id).subscribe(
      data => {
        this.getAreas();
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }


  ngOnInit() {
    this.getAreas();
  }

  openDialog() {
    let dialogRef = this.dialog.open(AreaDialog, {
      data:{
        areaList:this.areaList
      },
      width: '70vw',
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAreas();
      }
    });
  }


  openAreaEditPopup(site) {
    let dialogRef = this.dialog.open(AreaDialog, {
      width: '70vw',
      data: {
        site: site
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'submit') {
          this.getAreas();
        }
      }
    });
  }
}
