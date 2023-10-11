import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
@Component({
    selector: 'app-stage6_approve_details',
    templateUrl: './stage6_approve_details.html',
    providers: [ConfirmationService]
})

export class Stage6ApproveDetails {
    approve_labels=[
    {
        id:1,
        name:"Normal HOTO Sign off"
    },    
    {
        id:2,
        name:"Conditional HOTO Sign off"
    }
    ];
    approve_type:any;
    display = false;
    Notification: any;
    emptyFlag = true;
    result:string;
    observations=[];
    observation_list=[];
    serial_no_count = 1;
    selectedObservations = [];
    index_counter = 0;
    deleteObservationFlag = false;
    selection:any;
    
    @ViewChild('date') el: ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage6ApproveDetails>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { }

    
    ngOnInit() {
        var obj: { [k: string]: any } = {};
        obj.serial_no = '';
        obj.observation = " ";
        obj.deleteflag = false;
        obj.index = this.index_counter;
        this.observation_list.push(obj);
    }

    
    addObservation()
    {
        this.index_counter ++;
        this.serial_no_count++;
        var obj: { [k: string]: any } = {};
        obj.serial_no = "";
        obj.observation = " ";
        obj.deleteflag = false;
        obj.index = this.index_counter;
        this.observation_list.push(obj);
    }
    onApproveChange(event)
    {
        this.approve_type = event.value;
        this.emptyFlag = false;
    }
    
    setDeleteflag(i)
    {
        if(this.observation_list[i].deleteflag == false)
        {
            this.observation_list[i].deleteflag == true;
        }
        else
        {
            this.observation_list[i].deleteflag == false
        }
        if(this.observation_list.filter(x=>x.deleteflag == true).length == 0)
        {
            this.deleteObservationFlag = false;
        }
        else
        {
            this.deleteObservationFlag = true;
        }
    }
    deleteObservations()
    {
        this.observation_list = this.observation_list.filter(x=>x.deleteflag == false);
        this.deleteObservationFlag = false;
    }

    onNotification() {
        if(this.Notification == "Stage approved Successfully")
        {
            this.display = false;
            this.result = "saved successfully";
            this.dialogRef.close(this.result);
        }
        else
        if(this.Notification == "Empty serial no and observations are not allowed")
        {
            this.display = false;
        }
        else
        {
            this.display = false;
            this.dialogRef.close(false);
        }
    }

    validate()
    {
        if(this.approve_type == 2)
        {
            for(var i of this.observation_list)
            {        
                if(this.observation_list.length == 0)
                {
                    return false;
                }
                if(i.serial_no <= 0 ||  i.serial_no == null || i.serial_no == ""|| i.serial_no == undefined)
                {
                    return false;
                }
                if(i.observation == null || i.observation==""||i.observation ==undefined)
                {
                    return false;
                }
            }
            return true;
        }
    }

    sort(arr)
    {
        var temp;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < (arr.length - i - 1); j++)
            {
                if (arr[j].serial_no > arr[j + 1].serial_no)
                {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }
    submitDetails() 
    {
        if(this.approve_type == 2)
            {
                var obj: { [k: string]: any } = {};
                obj.conditional_approve = 1; //conditional
                var obj2: { [k: string]: any } = {};
                obj2.observations = [];
                this.observation_list =this.sort(this.observation_list);
                for(var i of this.observation_list)
                {
                    var obj3:{ [k: string]: any } = {};
                    obj3.location_id = this.data.location_id;
                    obj3.serial_no = i.serial_no;
                    obj3.observation = i.observation;
                    obj2.observations.push(obj3);
                }
                if(this.validate() == true)
                {
                        this.confirmationService.confirm({
                        message: 'Are you sure that you want to Approve this Stage ?',
                        header: 'Approve Confirmation',
                        icon: 'fa fa-info',
                        accept: () => {
                            this.api_service.sendHotoObservations(obj2).subscribe(data => {
                                if (data != null) {
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





                                }
                            },err => {
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
                            }
                        });          
                }
                else
                {
                    this.Notification = "Empty serial no and observations are not allowed";
                    this.display = true;
                }
            }
            else
            {
                var obj: { [k: string]: any } = {};
                if(this.approve_type == 1)
                {
                    obj.conditional_approve = 0; //normal
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
            

    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
