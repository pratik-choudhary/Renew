import { Component, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
	selector: 'section_form',
	templateUrl: './section_form.component.html',
	styleUrls: ['./notification-button.scss']
})

export class SectionFormDialog {
	currentUser:any;
	display = false;
	milestone_No:number;
	checklists:any;
	currentChecklist:any;
	Notification: any;
	config: MdSnackBarConfig;
	modelName: string;
	public form: FormGroup;
	checklist_id: number;
	constructor(public dialogRef: MdDialogRef<SectionFormDialog>, private api_service: ApiService, private fb: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar,
		public viewContainerRef: ViewContainerRef,private auth_service: AuthGuard) {
		this.checklist_id = data.checklist_id;
		this.milestone_No = data.sectionsLength + 1;
		this.currentUser = this.auth_service.getUserInfo();
  }
	closeDialog() {
		this.dialogRef.close(false);
	}
	ngOnInit() {

		this.modelName = "Add New Milestone";
		this.form = this.fb.group({
			MILESTONE_NO: [null, Validators.required],
			NAME: [null, Validators.required]
		});

		if (this.data.parentInput) {
			this.modelName = "Edit Milestone";
			this.milestone_No = this.data.parentInput.MILESTONE_NO;
			this.form.patchValue(this.data.parentInput);

		}

	}

	onNotification(msg: string) {
		this.display = false;
		if (this.Notification == 'Milestone Updated Successfully') {
			this.dialogRef.close(true);
		}
		if (this.Notification == 'Milestone Added Successfully') {
			this.dialogRef.close(true);
		}
		if (this.Notification == 'Milestone Update Failed') {
			this.dialogRef.close(false);
		}
		if (this.Notification == 'Milestone Add Failed') {
			this.dialogRef.close(false);
		}

	}



	createSection() {
		var obj: { [k: string]: any } = {};
		obj.MILESTONE_NO = this.form['_value'].MILESTONE_NO;
		obj.NAME = this.form['_value'].NAME;
		obj["CREATED_BY"] =  this.currentUser.user_id;
		obj.CHECKLIST_ID = this.checklist_id;
		obj.SORTLEVEL = 1;
		if(obj.MILESTONE_NO < 1)
		{
			this.Notification = "Minimum value of number is 1";
			this.display = true;
		}
		else
		if (this.data.parentInput) {
			this.api_service.updateSection(obj, this.data.parentInput.SECTION_ID).subscribe(
				data => {
					setTimeout(()=>{
					this.Notification = 'Milestone Updated Successfully';
					this.display = true;
					}, 400);
				},
				err => {
					console.log(err);
		            if(err.status == 401)
        		    {
              			this.closeDialog();
              			setTimeout(()=>{
              			this.api_service.checkStatus(err);
             		 }, 1000);
            		}
					else
					{					
						console.log(err);
						this.api_service.checkStatus(err);
						setTimeout(()=>{
						this.Notification = 'Milestone Update Failed';
						this.display = true;
					}, 400);
				 }
				}
			);
		} else {
			this.api_service.createSection(obj).subscribe(
				data => {
					setTimeout(()=>{
					this.Notification = 'Milestone Added Successfully';
					this.display = true;
				}, 400);
				},
				err => {
					console.log(err);
		            if(err.status == 401)
        		    {
              			this.closeDialog();
              			setTimeout(()=>{
              			this.api_service.checkStatus(err);
             		 }, 1000);
            		}
					else
					{
						setTimeout(()=>{
							this.Notification = 'Milestone Add Failed';
							this.display = true;
						}, 400);
					}
					
				}
			);
		}
	}
}