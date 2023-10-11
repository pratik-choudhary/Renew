import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UploadExcelDialog } from 'app/Dialogs/upload_excel/upload_excel.component';
@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.html'
})
export class ExcelUploadComponent implements OnInit {
  @Input() createdBy: any;
  @Input() checklistId: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  display=false;
  Notification:any;
  disable_button = true;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  fileToUpload: Array<File>;
  fileDetails: any;
  invalidFile = false;
  SendingStatus = false;
  config: MdSnackBarConfig;
  sections: any;
  user_info: any;
  sectionFlag = false;
  constructor(private api_service: ApiService, private snackbar: MdSnackBar,public dialogRef: MdDialogRef<UploadExcelDialog>,
    public viewContainerRef: ViewContainerRef, private auth_service: AuthGuard,private router:Router) {
       this.user_info = this.auth_service.getUserInfo();
     }
  ngOnInit() { }
  changeFile(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    this.fileDetails = this.fileToUpload[0];
     if (this.fileDetails.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    {
      this.disable_button = true;
      this.invalidFile = true;
    }
    else {
      this.disable_button = false;
      this.invalidFile = false;
    }
  }

  onNotification(){
    this.display = false;
    if (this.Notification.indexOf('Checklist imported successfully.') != -1) {
      this.notify.emit('success');
    }else {
      this.notify.emit('failed');
    }
  }
  uploadFile() {
    this.disable_button = true;
     this.api_service.upload(this.fileToUpload, this.checklistId,  this.user_info.user_id).then((res: string) => {
        this.disable_button = false;
        setTimeout(()=>{
          this.Notification = res;
          this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if(err.Message.replace(/\s/g,'') == error.replace(/\s/g,''))
        {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout',{queryParams: {error:"timeout"}});
        }
        else
        {
          this.SendingStatus = true;
          setTimeout(()=>{
          this.Notification = 'An error occurred during checklist import.';
          this.display = true;
          }, 400);
        }
        
      });
  }
}