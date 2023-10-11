import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-stage4_commissioning',
    templateUrl: './stage4_commissioning.html',
    providers: [ConfirmationService]
})

export class Stage4CommissioningDialog {
    commissioningDate: Date;
    pre_commissioningDate: Date;
    dateFlag = true;
    display = false;
    Notification: any;
    result: string;
    maxDate:Date;
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage4CommissioningDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    onCommissioningDateSelect() {
        if (this.commissioningDate && this.pre_commissioningDate) {
            this.dateFlag = false;
        }
    }

    onPreCommissioningDateSelect() {
        if (this.commissioningDate && this.pre_commissioningDate) {
            this.dateFlag = false;
        }
    }
    ngOnInit() {
        this.maxDate = new Date();
    }

    onNotification() {
        if (this.Notification == "Please enter pre-commissioning Date and commissioning Date"
            || this.Notification == "Please enter pre-commissioning Date"
            || this.Notification == "Please enter commissioning Date"
            || this.Notification == "Commissioning date should be greater than or equal to Pre-Commissioning date") {
            this.display = false;
        }
        else
            if (this.Notification == "Stage approved Successfully") {
                this.display = false;
                this.result = "saved successfully";
                this.dialogRef.close(this.result);
            }
            else {
                this.display = false;
                this.dialogRef.close(false);
            }
    }
    submitDetails() {

        if (this.pre_commissioningDate == null && this.commissioningDate == null) {
            this.Notification = "Please enter pre-commissioning Date and commissioning Date";
            this.display = true;
        }
        if (this.pre_commissioningDate == null) {
            this.Notification = "Please enter pre-commissioning Date";
            this.display = true;
        }
        else
            if (this.commissioningDate == null) {
                this.Notification = "Please enter commissioning Date";
                this.display = true;
            }
            else
                if (this.pre_commissioningDate > this.commissioningDate) {
                    this.Notification = "Commissioning date should be greater than or equal to Pre-Commissioning date";
                    this.display = true;
                }
                else {
                    var obj: { [k: string]: any } = {};
                    obj.commissioning_date = this.commissioningDate;
                    obj.pre_commissioning_date = this.pre_commissioningDate;
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
