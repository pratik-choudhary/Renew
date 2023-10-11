import { ElementRef, ViewChild,Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-stage9_approve_details',
    templateUrl: './stage9_approve_details.html',
    providers: [ConfirmationService]
})

export class Stage9ApproveDetails {
    cod_Date: Date;
    dateFlag = true;
    display = false;
    Notification:any;
    result:string;
    cod_type:string;
    min_date:any;
    @ViewChild('date') el:ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage9ApproveDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    on_CoD_DateSelect()
    {
        if(this.cod_Date)
        {
            this.dateFlag  = false;
        }
    }

    
    
    
    ngOnInit() {
        var date = new Date(this.data.min_date);
        this.min_date = new Date(date.setDate(date.getDate()+1));
        if(this.data.forced_cod_flag == true)
        {
            this.cod_type = "Enter Forced CoD Date";
        }
        else
        {
            this.cod_type = "Enter CoD Date";
        }
        
    }

    onNotification() {
        if(this.Notification == "Please enter CoD Date" )
        {
           this.display  = false; 
        }
        else
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
        if(this.cod_Date == null)
        {
            this.Notification = "Please enter CoD Date";
            this.display = true;
        }
        else
        {
            var obj: { [k: string]: any } = {};
            obj.cod_date = this.cod_Date;
            obj.reviewed_by = this.data.reviewed_by;
            this.confirmationService.confirm({
                message: 'Are you sure that you want to Approve this Stage ?',
                header: 'Approve Confirmation',
                icon: 'fa fa-info',
                accept: () => {
                this.api_service.approveStageFour(this.data.location_id,this.data.stage_instance_id,obj).subscribe(data => {
                    if (data != null) {
                      setTimeout(()=>{
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
                        setTimeout(()=>{
                            this.Notification = "Stage approve Failed";
                            this.display = true;
                          }, 400);
                    }
                  });
                } 
            }); 
            
        }
    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
