import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-stage8_approve_details',
    templateUrl: './stage8_approve_details.html',
    providers: [ConfirmationService]
})

export class Stage8ApproveDetails {
    cod_Date: Date;
    display = false;
    Notification: any;
    result: string;
    stageForm = [];
    stageFormData = [];
    ma1: any;
    ma2: any;
    comments: any;
    max_availability_flag = false;
    duplicate_date_flag = false;
    maxDate = new Date();
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage8ApproveDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) {
    }


    addForm() {
        this.stageForm.push({});
        this.stageFormData.push({});
    }

    addDate(i: number, event) {

        if (event === "empty") {
            this.stageFormData[i].stpt_date = undefined;
        }
        else {
            this.stageFormData[i].stpt_date = new Date(event);
        }
    }
    addFieldA(i, event) {
        this.stageFormData[i].field1 = event;
    }
    addFieldB(i, event) {
        this.stageFormData[i].field2 = event;
    }
    addFieldC(i, event) {
        this.stageFormData[i].field3 = event;
    }

    ngOnInit() {


        for (var i = 0; i < 10; i++) {
            var obj: { [k: string]: any } = {
                stpt_date: null,
                field1: null,
                field2: null,
                field3: null,
                complete_flag: false
            };
            this.stageFormData.push(obj);
        }

    }

    get_ma97() {
        var completed_rows = this.stageFormData.filter(x => x.complete_flag == true);

        var sum = 0;
        for (var i of completed_rows) {
            sum = sum + i.field1;
        }
        this.ma1 = (sum / completed_rows.length);

    }

    get_sum_max_for_three(arr, arr_size) {

        var third = 0;
        var first = 0;
        var second = 0;

        for (var i = 0; i < arr_size; i++) {
            /* If current element is smaller than first*/
            if (arr[i] > first) {
                third = second;
                second = first;
                first = arr[i];
            }

            /* If arr[i] is in between first and second then update second  */
            else if (arr[i] > second) {
                third = second;
                second = arr[i];
            }

            else if (arr[i] > third)
                third = arr[i];
        }
        return first + second + third;
    }

    getMax(numbers) {
        var maximum = numbers[0];
        for (var c = 1; c < numbers.length; c++) {
            if (numbers[c] > maximum) {
                maximum = numbers[c];
            }
        }

        return maximum;
    }
    get_ma99() {
        var completed_rows = this.stageFormData.filter(x => x.complete_flag == true);
        var numbers = [];
        var j = 0;
        if (completed_rows.length > 0) {
            if (completed_rows.length > 3 || completed_rows.length == 3) {
                numbers = [];
                j = 0;
                for (var i of completed_rows) {
                    numbers[j] = i.field1;
                    j++;
                }
                var sum = this.get_sum_max_for_three(numbers, numbers.length);
                this.ma2 = (sum / 3);
            }
            if (completed_rows.length < 3) {
                numbers = [];
                j = 0;
                var sum = 0;
                for (var i of completed_rows) {
                    sum = sum + i.field1;
                    j++;
                }
                this.ma2 = sum / completed_rows.length;
            }
        }


    }
    changeFlag(row, i) {

        row.complete_flag = true;
        if (row.field1 != null && row.field1 != "") {
            this.get_ma97();
            this.get_ma99();
        }
    }

    onNotification() {
        if (this.Notification == "Please enter all mandatory Details for a row with no negative values" ||
            this.Notification == "Please enter comments" ||
            this.Notification == "The max value for % Machine availability is 100" ||
            this.Notification == "Duplicate dates are not allowed"
        ) {
            this.display = false;
            this.duplicate_date_flag = false;
            this.max_availability_flag = false;
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

    validateForm() {
        var incomplete_count = 0;
        var date_count = 0;
        for (var i of this.stageFormData) {
            if (i.complete_flag == true) {
                if (i.stpt_date != null) {
                    if (i.field1 == null || i.field2 == null || i.field1 == "" || i.field2 == "" || i.field1 < 0 || i.field2 < 0) {
                        if (i.field1 == 0 || i.field2 == 0) { }
                        else {
                            incomplete_count++;
                        }
                    }
                }
                if (i.field1 != null) {
                    if (i.stpt_date == null || i.field2 == null || i.stpt_date == "" || i.field2 == "" || i.field2 < 0) {
                        if (i.field2 == 0) { }
                        else {
                            incomplete_count++;
                        }

                    }
                }
                if (i.field1 > 100) {
                    this.max_availability_flag = true;
                    return false;
                }
                if (i.field2 != null) {
                    if (i.stpt_date == null || i.field1 == null || i.stpt_date == "" || i.field1 == "" || i.field1 < 0) {
                        if (i.field1 == 0) { }
                        else {
                            incomplete_count++;
                        }

                    }
                }

            }

        }
        if (incomplete_count == 0) {
            return true;
        }
        else {
            return false;
        }


    }

    sort(arr) {
        var temp;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < (arr.length - i - 1); j++) {
                if (arr[j].stpt_date > arr[j + 1].stpt_date) {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    submitDetails() {
        if (this.validateForm() == false && this.max_availability_flag == true) {
            this.Notification = "The max value for % Machine availability is 100";
            this.display = true;
        }
        else
            if (this.validateForm() == false) {
                this.Notification = "Please enter all mandatory Details for a row with no negative values";
                this.display = true;
            }
            else
                if (this.comments == null || this.comments == "") {
                    this.Notification = "Please enter comments";
                    this.display = true;
                }
                else {
                    for (var i of this.stageFormData) {
                        i.machine_availability_1 = this.ma1;
                        i.machine_availability_2 = this.ma2;
                        if (this.comments) {
                            i.comments = this.comments;
                        }
                    }
                    var obj: { [k: string]: any } = {};
                    obj.stage8_list = [];
                    var completed_rows = this.stageFormData.filter(x => x.complete_flag == true);
                    for (var i of completed_rows) {
                        var obj3: { [k: string]: any } = {};
                        obj3.stpt_date = i.stpt_date;
                        obj3.field1 = i.field1;
                        obj3.field2 = i.field2;
                        obj3.field3 = i.field3;
                        obj3.machine_availability_1 = i.machine_availability_1;
                        obj3.machine_availability_2 = i.machine_availability_2;
                        obj3.comments = i.comments;
                        obj.stage8_list.push(obj3);
                    }
                    obj.stage8_list = this.sort(obj.stage8_list);
                    var list = obj.stage8_list;
                    for (var k = 0; k < list.length; k++) {
                        for (var x = 0; x < list.length; x++) {
                            if (x != k) {
                                if (list[k].stpt_date.toDateString() == list[x].stpt_date.toDateString())
                                 {
                                    this.Notification = "Duplicate dates are not allowed";
                                    this.display = true;
                                    this.duplicate_date_flag = true;
                                    break;
                                }
                            }

                        }
                    }
                    if(this.duplicate_date_flag == false)
                    {
                    this.confirmationService.confirm({
                            message: 'Are you sure that you want to Approve this Stage ?',
                            header: 'Approve Confirmation',
                            icon: 'fa fa-info',
                            accept: () => {
                            this.api_service.addStageEightDetails(this.data.stage_instance_id,obj).subscribe(data => {
                                var obj2: { [k: string]: any } = {};
                                obj2.reviewed_by = this.data.reviewed_by;
                                this.api_service.approveStageFour(this.data.location_id,this.data.stage_instance_id,obj2).subscribe(data => {
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
                            },err=>{
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
                                    this.Notification = "Stage details send Failed";
                                    this.display = true;
                                    }, 400);
                                }     

                            });            
                            } 
                        });

                    }
                    



                }
    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
