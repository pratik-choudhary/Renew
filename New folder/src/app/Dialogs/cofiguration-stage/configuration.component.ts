import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DialogModule } from 'primeng/primeng';
@Component({
    selector: 'app-configuration',
    templateUrl: './configuration-popup.html',
})

export class ConfigPopupDialog {
    title:string;
    remark:string;
    Notification:string;
    display = false;
    result:string;
constructor(
        public dialogRef: MdDialogRef<ConfigPopupDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService
    ) {
    }
    ngOnInit() {
        this.title = "Remark";
    }
   
    onNotification()
     {
        if(this.Notification ==  "Remark submitted Successfully")
        {
            this.display = false;
            this.result = "saved successfully";
            this.dialogRef.close(this.result);
        }
        else
        {
            this.display = false;
            this.dialogRef.close(false);
        }
    }
    submitRemark()
    {
        var obj: {[k: string]: any} = {};
        obj.remark = this.remark;
        obj.question_id = this.data.question.question_id;
        obj.isFilled = true;
        obj.filled_by = this.data.user.user_id;
        obj.filled_date = new Date();
        this.api_service.updateConfigurationQuestions(this.data.stage_instance_id,obj).subscribe(
            data => {
                this.Notification = "Remark submitted Successfully";
                this.display = true;                
            },
            err =>{
                console.log(err);
                this.api_service.checkStatus(err);
                this.Notification = "Remark submit Failed";
                this.display = true;
            });
    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
