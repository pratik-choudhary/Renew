import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Conditional } from '@angular/compiler';
@Component({
    selector: 'app-location_status_dialog',
    templateUrl: './location_status_dialog.html',
    providers: [ConfirmationService]
})

export class LocationStatusDetails {
    status_labels=[{
        id:2,
        name:"Location Complete"
    },
    {
        id:1,
        name:"Location In Progress"
    }];
    status_type:any;
    display = false;
    Notification: any;
    emptyFlag = true;
    result:string;
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<LocationStatusDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    
    ngOnInit() {
    }
    onStatusChange(event)
    {
        this.status_type = event.value;
        this.emptyFlag = false;
    }
    onNotification() {
        if(this.Notification == "Status changed Successfully")
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
            if(this.status_type == 2)
            {
                obj.status = 'complete';
            }
            else
            {
                obj.status = 'in-progress';
            }
            this.confirmationService.confirm({
                message: 'Are you sure that you want to change this status ?',
                header: 'Confirmation',
                icon: 'fa fa-info',
                accept: () => {
                    this.api_service.updateLocation(obj,this.data.location_id).subscribe(data => {
                        if (data != null) {
                            setTimeout(() => {
                                this.Notification = "Status changed Successfully";
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
                                    this.Notification = "Status change Failed";
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
