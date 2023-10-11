import {Component, Inject,Output,EventEmitter} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-upload-excel-popup',
  templateUrl: './upload_excel.html',
})

export class UploadExcelDialog {
  checklist_id: any;
  created_by_id: any;
  currentUser:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<UploadExcelDialog>, private api_service: ApiService, private fb: FormBuilder, private auth_service: AuthGuard) {
    this.currentUser = this.auth_service.getUserInfo();
    this.checklist_id = data.checklistId;
    this.created_by_id = this.currentUser.user_id;
  }
  ngOnInit() {
 }
  closeDialog() {
     this.dialogRef.close(false);
  }

  onNotify(message: string) {
    if (message === 'success') {
     this.dialogRef.close(true);
    }else {
      this.dialogRef.close(false);
    }
 }

}


