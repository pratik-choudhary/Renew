import { Component, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { DialogModule } from 'primeng/primeng';

@Component({
	selector: 'history-dialog',
	templateUrl: './history-dialog.html',
	
})

export class ChecklistHistoryDialog {
	modelName:string;
	history:any;
	checklist_id:number;
	constructor(public dialogRef: MdDialogRef<ChecklistHistoryDialog>, private api_service: ApiService, private fb: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar,
		public viewContainerRef: ViewContainerRef) {
      }
	closeDialog() {
		this.dialogRef.close(false);
	}
	ngOnInit() {
		this.modelName = "History";	
		this.checklist_id=this.data.id;
	}
}