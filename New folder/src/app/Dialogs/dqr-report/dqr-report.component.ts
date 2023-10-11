import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dqr-report',
  templateUrl: './dqr-report.component.html',
  styleUrls: ['./dqr-report.component.scss']
})
export class DqrReportComponent implements OnInit {
  selectedSite:any;
  selectedLocation:any;
  locations=[];
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<DqrReportComponent>, private auth_service: AuthGuard, private api_service: ApiService, private fb: FormBuilder
  , private router: Router) { 

    this.selectedSite = this.data.site;
    console.log(this.selectedSite);
  }

  ngOnInit() {
    this.getLocationBySiteId();
  }
  generateDQRReports() {
    console.log(this.selectedLocation.id);
    this.api_service.generateDQRReports(this.selectedSite,this.selectedLocation.id).subscribe(
      data => {
        if (data === 'File created Successfully') {
          var vin = window.open("/hoto_be/data/DQR_Reports/" + this.selectedSite + ".xls", "_blank");
          vin.focus();
        }
      }
      , err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }


  getLocationBySiteId()
  {
    this.api_service.getLocationById(this.selectedSite).subscribe(
      data => {
        if (data != null) {
          this.locations = [];
          for (var i of data) 
          {
            this.locations.push({
              'label': i.name,
              'value': i
            });
          }

      }
    }
  
      , err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
    
  }
  

  closeDialog()
  {
    this.dialogRef.close();
  }

}
