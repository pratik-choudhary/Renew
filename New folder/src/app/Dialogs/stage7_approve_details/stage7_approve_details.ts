import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Conditional } from '@angular/compiler';
@Component({
    selector: 'app-stage7_approve_details',
    templateUrl: './stage7_approve_details.html',
    providers: [ConfirmationService]
})

export class Stage7ApproveDetails {
    approve_labels=[{
        id:2,
        name:"STPT Optional"
    },
    {
        id:1,
        name:"STPT Mandatory"
    }];
    approve_type:any;
    display = false;
    Notification: any;
    emptyFlag = true;
    result:string;
    remark:string;
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage7ApproveDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    
    ngOnInit() {
    }
    onApproveChange(event)
    {
        this.approve_type = event.value;
        if(this.remark && this.approve_type == 2)
        {
            this.emptyFlag = false;
        }
        else
        {
            this.emptyFlag = true;
        }
        if(this.approve_type == 1)
        {
            this.remark = null;
            this.emptyFlag = false;
        }
        else
        {
            this.emptyFlag = true;
        }
    }
    remarkChange()
    {
        if(this.remark && this.approve_type == 2)
        {
            this.emptyFlag = false;
        }
        else
        {
            this.emptyFlag = true;
        }
    }
    onNotification() {
        if(this.Notification == "Stage approved Successfully")
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
    submitDetails() 
    {
            var obj: { [k: string]: any } = {};
            if(this.approve_type == 1)
            {
                obj.conditional_approve = 0;
            }
            else
            {
                obj.conditional_approve = 1;
                obj.remark = this.remark; 
            }
            obj.reviewed_by = this.data.reviewed_by;
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Approve this Stage ?',
                header: 'Approve Confirmation',
                icon: 'fa fa-info',
                accept: () => {
                    this.api_service.approveStageFour(this.data.location_id, this.data.stage_instance_id, obj).subscribe(data => {
                        if (data != null) {
                            setTimeout(() => {
                                this.Notification = "Stage approved Successfully";
                                this.display = true;
                                //this.getStagesInsByLocation();
           
                            }, 400);
                        }
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
                                setTimeout(() => {
                                    this.Notification = "Stage approve Failed";
                                    this.display = true;
                                }, 400);
                            }
                        }); 
                    //this.dialogRef.close(false);
                }
            });
    
        

    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
