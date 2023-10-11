import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { SiteDialog } from 'app/Dialogs/site/site.component';
import {ApiService} from 'app/services/api.service';
import {MapDialog } from  'app/Dialogs/map_dialog/map_dialog';
import {SiteLevelHeaderFooterComponent} from 'app/Dialogs/site-level-header-footer/site-level-header-footer.component';

@Component({
  selector: 'site-list',
  templateUrl: './site-list.html',
})

export class SiteModelListComponent {
   _value: string;
  @Input()
    public set value(val: string) {
      this._value = val;
       this.getSites();
    }
    value2:number=1;
    siteList: any;
  statusList:[{'value':'Active'},{'value':'Inactive'}];
  area_arr:[
    {'label': 'Pune',
     'value': 'Pune' },
    {'label': 'Mumbai',
     'value': 'Mumbai'}
  ];
  constructor(public dialog: MdDialog, private api_service: ApiService) {
  }
  ngOnInit() {
    this.getSites();
  }
  getSites() {
     this.api_service.getSites().subscribe(
      data => {
        data.reverse();
        this.siteList = data;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
 
  deleteSite(row,index){
    this.api_service.deleteSiteById(row.id).subscribe(
      data => { 
        this.getSites();
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
 
  openDialog() {
    let dialogRef = this.dialog.open(SiteDialog, {
      width: '70vw',
      height:'60vh',
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.getSites();
      }
    });
  }
 
  openSiteEditPopup(site) {
    let dialogRef = this.dialog.open(SiteDialog, {
      width: '70vw',
      height:'80vh',
      data: {
        site: site
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSites();
      }
    });
  }

  openSiteLevelHeaderFooter(rowData)
  {
    let dialogRef = this.dialog.open(SiteLevelHeaderFooterComponent, {
      width: '40vw',  
      data: {
        site: rowData.id
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSites();
      }
    });

  }
  
}
