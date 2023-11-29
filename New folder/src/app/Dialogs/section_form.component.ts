import { Component, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as toastr from 'toastr';

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
	category1s = [];
	category2s = [];
	category3s = [];
	constructor(public dialogRef: MdDialogRef<SectionFormDialog>, private api_service: ApiService, private fb: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar,
		public viewContainerRef: ViewContainerRef,private auth_service: AuthGuard,private location: Location, private router: Router) {
		this.checklist_id = data.checklist_id;
	//	this.milestone_No = data.sectionsLength + 1;
	//	this.currentUser = this.auth_service.getUserInfo();
  }
	closeDialog() {
		this.dialogRef.close(false);
	}
	ngOnInit() {

		this.modelName = "Add New Milestone";
		this.form = this.fb.group({
			// MILESTONE_NO: [null, Validators.required],
			// NAME: [null, Validators.required],
			category1:['', Validators.required],
			category2:['', Validators.required],
			category3:['', Validators.required],
		});
        this.getCategory1s();
		this.getAllCategory2s(this.data.parentInput.Category1);
		this.getAllCategory2s(this.data.parentInput.Category2);
		if (this.data.parentInput) {
			this.modelName = "Edit Milestone";
			debugger;
			this.form.patchValue({
				category1: this.data.parentInput.Category1,
				category2: this.data.parentInput.Category2,
				category3: this.data.parentInput.Category3,
			  });
			this.milestone_No = this.data.parentInput.ChecklistChecklistId;
			this.form.patchValue(this.data.parentInput);

		}

	}
	getCategory1s() {
		this.api_service.getAllCategory1s().subscribe(result => {
		  debugger;
		  if (result) {
			this.category1s = result.data;
		  }
		});
	  }
	  getAllCategory2s(event) {
		debugger;
		this.api_service.getAllCategory2s(event.target.value).subscribe(result => {
		  if (result) {
			this.category2s = result.data;
		  }
		});
	  }
	  getAllCategory3s(event) {
		// this.category3s=[];
		var categroy1 = this.form.value.category1
		var categroy2 = event.target.value
		if (categroy1.length > 0 && categroy2.length) {
		  this.api_service.getAllCategory3s(categroy1, categroy2).subscribe(result => {
			if (result) {
			  debugger;
			  this.category3s = result.data;
			}
		  });
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
		// obj.MILESTONE_NO = this.form['_value'].MILESTONE_NO;
		// obj.NAME = this.form['_value'].NAME;
		// obj["CREATED_BY"] =  this.currentUser.user_id;
		// obj.CHECKLIST_ID = this.checklist_id;
		// obj.SORTLEVEL = 1;

		obj.Id= 0;
		obj.Category1=this.form.value.category1;
		obj.Category2=this.form.value.category2;
		obj.Category3=this.form.value.category3;
		obj.ChecklistChecklistId=this.checklist_id;
		

		this.api_service.createMilestone(obj).subscribe(
					data => {
						setTimeout(()=>{
							toastr.success('Milestone Added Successfully', 'Success');
							this.dialogRef.close(true);
						//this.Notification = 'Milestone Added Successfully';
						//this.display = true;
						
						//window.location.reload();
						this.router.navigate ( ['/checklist'] );
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
								toastr.error('Milestone Add Failed', 'Error');
								this.dialogRef.close(false);
								//this.Notification = 'Milestone Add Failed';
								//this.display = true;
							}, 400);
						}
						
					});


		// if(obj.MILESTONE_NO < 1)
		// {
		// 	this.Notification = "Minimum value of number is 1";
		// 	this.display = true;
		// }
		// else
		// if (this.data.parentInput) {
		// 	this.api_service.updateSection(obj, this.data.parentInput.SECTION_ID).subscribe(
		// 		data => {
		// 			setTimeout(()=>{
		// 			this.Notification = 'Milestone Updated Successfully';
		// 			this.display = true;
		// 			}, 400);
		// 		},
		// 		err => {
		// 			console.log(err);
		//             if(err.status == 401)
        // 		    {
        //       			this.closeDialog();
        //       			setTimeout(()=>{
        //       			this.api_service.checkStatus(err);
        //      		 }, 1000);
        //     		}
		// 			else
		// 			{					
		// 				console.log(err);
		// 				this.api_service.checkStatus(err);
		// 				setTimeout(()=>{
		// 				this.Notification = 'Milestone Update Failed';
		// 				this.display = true;
		// 			}, 400);
		// 		 }
		// 		}
		// 	);
		// } else {
		// 	this.api_service.createSection(obj).subscribe(
		// 		data => {
		// 			setTimeout(()=>{
		// 			this.Notification = 'Milestone Added Successfully';
		// 			this.display = true;
		// 		}, 400);
		// 		},
		// 		err => {
		// 			console.log(err);
		//             if(err.status == 401)
        // 		    {
        //       			this.closeDialog();
        //       			setTimeout(()=>{
        //       			this.api_service.checkStatus(err);
        //      		 }, 1000);
        //     		}
		// 			else
		// 			{
		// 				setTimeout(()=>{
		// 					this.Notification = 'Milestone Add Failed';
		// 					this.display = true;
		// 				}, 400);
		// 			}
					
		// 		}
		// 	);
		// }
	}
}