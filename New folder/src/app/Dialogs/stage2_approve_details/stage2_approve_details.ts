import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-stage2_approve_details',
    templateUrl: './stage2_approve_details.html',
    providers: [ConfirmationService]
})

export class Stage2ApproveDetails {
    checklists: any;
    checklist:any;
    display = false;
    Notification: any;
    emptyFlag = true;
    result:string;
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage2ApproveDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    getChecklists() {
        this.api_service.getChecklistForStage2().subscribe(
            data => {
                this.checklists = data;
            },
            err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }
    
    
    checklistChange() {
        this.emptyFlag = false;
    }
    ngOnInit() {
        this.getChecklists();
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
            if(this.checklists)
            {
                obj.master_checklist_id = this.checklist;
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
