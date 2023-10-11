import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-upload-header-footer',
  templateUrl: './upload-header-footer.component.html',
  styleUrls: ['./upload-header-footer.component.scss'],
  providers: [ConfirmationService]
})
export class UploadHeaderFooterComponent implements OnInit {
  disable_header_button = true;
  dept_id: any;
  disable_firstpage_button = true;
  disable_footer_button = true;
  disable_cranepad_button = true;
  disable_guideline_button = true;
  Notification: string;
  display: boolean;
  header_file: Array<File>;
  firstpage_file: Array<File>;
  footer_file: Array<File>;
  cranepad: Array<File>;
  guideline: Array<File>;
  checklistId: any;
  constructor(private confirmationService: ConfirmationService,@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<UploadHeaderFooterComponent>, private api_service: ApiService, private fb: FormBuilder, private auth_service: AuthGuard, private router: Router) {
    this.checklistId = this.data.checklist_ins_id;
    this.dept_id = this.data.dept_id;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
  onNotification() {
    this.display = false;
  }

  changeHeaderFile(fileInput: any) {
    this.header_file = <Array<File>>fileInput.target.files;
    this.disable_header_button = false;
  }

  changeFirstPageFile(fileInput: any) {
    this.firstpage_file = <Array<File>>fileInput.target.files;
    this.disable_firstpage_button = false;
    let reader = new FileReader();
     if (fileInput.target.files && fileInput.target.files.length > 0) {
       let file = fileInput.target.files[0];

       const img = new Image();
       img.src = window.URL.createObjectURL( file );

       reader.readAsDataURL(file);
       reader.onload = () => {
        console.log(img.naturalHeight);
        console.log(img.naturalWidth);
        var ratio = img.naturalHeight/img.naturalWidth;
        console.log(ratio);
        if(ratio > 1)
        {
          this.confirmationService.confirm({
            message: 'The Width to Heigth ratio of this image is greater than  1 this would cause problems in the pdf are you sure you want to continue?',
            header: 'Warning',
            icon: 'fa fa-warning',
            accept: () => {
            },
            reject: () => {
            }
        });
        }
     };
    }
  }
    changeFooterFile(fileInput: any) {
      this.footer_file = <Array<File>>fileInput.target.files;
      this.disable_footer_button = false;
    }

    changeCranePadFile(fileInput: any) {
      this.cranepad = <Array<File>>fileInput.target.files;
      this.disable_cranepad_button = false;
    }

    changeGuidelineFile(fileInput: any) {
      this.guideline = <Array<File>>fileInput.target.files;
      this.disable_guideline_button = false;
    }


    uploadHeaderFile() {
      this.disable_header_button = true;
      this.api_service.uploadHeaderImage(this.header_file, this.checklistId).then((res: any) => {
        this.disable_header_button = true;
        console.log(res)
        this.header_file = null;
        if (res == "1") {
          this.Notification = "Header Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          // this.display = true;
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
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }

    uploadFirstPageFile() {
      this.disable_firstpage_button = true;
      this.api_service.uploadFirstPageImage(this.firstpage_file, this.checklistId).then((res: any) => {
        this.disable_firstpage_button = true;
        this.firstpage_file = null;
        if (res == 1) {
          this.Notification = "First Page Content Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          //this.display = true;
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
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }



    uploadFooterFile() {
      this.disable_footer_button = true;
      this.api_service.uploadFooterImage(this.footer_file, this.checklistId).then((res: any) => {
        this.disable_footer_button = true;
        this.footer_file = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "Footer Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
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
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }


    uploadCranepadFile() {
      this.disable_cranepad_button = true;
      this.api_service.uploadCranepadImage(this.cranepad, this.checklistId).then((res: any) => {
        this.disable_cranepad_button = true;
        this.cranepad = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "CranePad Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
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
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }


    uploadGuideline() {
      this.disable_guideline_button = true;
      this.api_service.uploadGuidelineImage(this.guideline, this.checklistId).then((res: any) => {
        this.disable_guideline_button = true;
        this.guideline = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "Guideline Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
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
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }






  }

