import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wtg-traceability-upload',
  templateUrl: './wtg-traceability-upload.component.html',
  styleUrls: ['./wtg-traceability-upload.component.scss']
})
export class WtgTraceabilityUploadComponent implements OnInit {
  display = false;
  Notification: any;
  disable_mechanical_button = true;
  disable_civil_button = true;
  disable_electrical_button = true;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  fileToUpload: Array<File>;
  fileDetails: any;
  invalidFile = false;
  SendingStatus = false;
  sections: any;
  user_info: any;
  sectionFlag = false;

  publish_civil_wtg = false;
  publish_electrical_wtg = false;
  publish_mechanical_wtg = false;
  civil_exists = false;
  electrical_exists = false;
  mechanical_exists = false;
  model_id:any;

  civil_id = 3;
  electrical_id = 4;
  mechanical_id = 5;

  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<WtgTraceabilityUploadComponent>, private auth_service: AuthGuard, private api_service: ApiService, private fb: FormBuilder
    , private router: Router) {
    this.user_info = this.auth_service.getUserInfo();
    console.log(this.data);
    this.model_id = this.data.id;
    this.civil_exists = this.data.civil_wtg_exists;
    this.electrical_exists = this.data.electrical_wtg_exists;
    this.mechanical_exists = this.data.mechanical_wtg_exists;
    this.publish_civil_wtg = this.data.publish_civil_wtg;
    this.publish_electrical_wtg = this.data.publish_electrical_wtg;
    this.publish_mechanical_wtg = this.data.publish_mechanical_wtg;
    
  }

  ngOnInit() {
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  onNotification() {
    this.display = false;
    if (this.Notification.indexOf('Questions added successfully') != -1) {
      this.notify.emit('success');
      //this.dialogRef.close();
    } else {
      this.notify.emit('failed');
      this.dialogRef.close();
    }
  }


  changeCivilFile(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    this.fileDetails = this.fileToUpload[0];
    if (this.fileDetails.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.disable_civil_button = true;
      this.invalidFile = true;
    }
    else {
      this.disable_civil_button = false;
      this.invalidFile = false;
    }
  }

  changeElectricalFile(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    this.fileDetails = this.fileToUpload[0];
    if (this.fileDetails.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.disable_electrical_button = true;
      this.invalidFile = true;
    }
    else {
      this.disable_electrical_button = false;
      this.invalidFile = false;
    }
  }

  changeMechanicalFile(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    this.fileDetails = this.fileToUpload[0];
    if (this.fileDetails.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.disable_mechanical_button = true;
      this.invalidFile = true;
    }
    else {
      this.disable_mechanical_button = false;
      this.invalidFile = false;
    }
  }

  uploadCivilFile() {
    this.disable_civil_button = true;
    this.api_service.uploadWTGExcel(this.fileToUpload, this.model_id,this.civil_id).then((res: string) => {
      this.disable_civil_button = false;
      setTimeout(() => {
        this.Notification = res;
        this.display = true;
      }, 400);

    }, (err) => {
      err = JSON.parse(err);
      var error = "Authorization has been denied for this request.";
      if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
        this.dialogRef.close(false);
        localStorage.clear();
        this.auth_service.setUserInfo(undefined);
        this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
      }
      else {
        this.SendingStatus = true;
        setTimeout(() => {
          this.Notification = 'An error occurred during checklist import.';
          this.display = true;
        }, 400);
      }

    });
  }


  uploadElectricalFile() {
    this.disable_electrical_button = true;
    this.api_service.uploadWTGExcel(this.fileToUpload, this.model_id,this.electrical_id).then((res: string) => {
      this.disable_electrical_button = false;
      setTimeout(() => {
        this.Notification = res;
        this.display = true;
      }, 400);

    }, (err) => {
      err = JSON.parse(err);
      var error = "Authorization has been denied for this request.";
      if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
        this.dialogRef.close(false);
        localStorage.clear();
        this.auth_service.setUserInfo(undefined);
        this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
      }
      else {
        this.SendingStatus = true;
        setTimeout(() => {
          this.Notification = 'An error occurred during checklist import.';
          this.display = true;
        }, 400);
      }

    });
  }


  uploadMechanicalFile() {
    this.disable_mechanical_button = true;
    this.api_service.uploadWTGExcel(this.fileToUpload, this.model_id,this.mechanical_id).then((res: string) => {
      this.disable_mechanical_button = false;
      setTimeout(() => {
        this.Notification = res;
        this.display = true;
      }, 400);

    }, (err) => {
      err = JSON.parse(err);
      var error = "Authorization has been denied for this request.";
      if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
        this.dialogRef.close(false);
        localStorage.clear();
        this.auth_service.setUserInfo(undefined);
        this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
      }
      else {
        this.SendingStatus = true;
        setTimeout(() => {
          this.Notification = 'An error occurred during checklist import.';
          this.display = true;
        }, 400);
      }

    });
  }


  
  publishCivilChecklist() {
    var obj: { [k: string]: any } = {};
    this.api_service.updateWTGStatus(obj, this.model_id, this.civil_id).subscribe(
      data => {
        setTimeout(() => {
          this.Notification = data;
          this.display = true;
        }, 400);
      }, err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          this.Notification = 'Civil WTG Traceability Questions Publish Failed';
          this.display = true;
        }, 400);

      });

  }


  publishElectricalChecklist() {
    var obj: { [k: string]: any } = {};
    this.api_service.updateWTGStatus(obj, this.model_id, this.electrical_id).subscribe(
      data => {
        setTimeout(() => {
          this.Notification = data;
          this.display = true;
        }, 400);
      }, err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          this.Notification = 'Civil WTG Traceability Questions Publish Failed';
          this.display = true;
        }, 400);

      });
  }



  publishMechanicalChecklist() {
    var obj: { [k: string]: any } = {};
    this.api_service.updateWTGStatus(obj, this.model_id, this.mechanical_id).subscribe(
      data => {
        setTimeout(() => {
          this.Notification = data;
          this.display = true;
        }, 400);
      }, err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          this.Notification = 'Mechanical WTG Traceability Questions Publish Failed';
          this.display = true;
        }, 400);

      });
  }



}
