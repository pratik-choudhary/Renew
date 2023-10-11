import { ElementRef, ViewChild,Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-stage8_details_dialog',
    templateUrl: './stage8_details_dialog.html',
    styleUrls:['./stage8-details-dialog.scss'],
    providers: [ConfirmationService]
})

export class Stage8Details {
    display = false;
    Notification:any;
    stpt_details = [];
    @ViewChild('date') el:ElementRef;
    constructor(
        public dialogRef: MdDialogRef<Stage8Details>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService,
        private confirmationService: ConfirmationService
    ) { 
    }

    sort(arr)
    {
        var temp;
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = 0; j < (arr.length - i - 1); j++)
            {
                if (arr[j].stpt_date > arr[j + 1].stpt_date)
                {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }
    getSTPTDetails()
    {
        this.api_service.getStageEightDetails(this.data.stage_instance_id).subscribe(data => {
            this.stpt_details = data;
            this.stpt_details = this.sort(this.stpt_details);
        },err =>{
            console.log(err);
            if(err.status == 401)
            {
                this.closeDialog();
                setTimeout(()=>{
                    this.api_service.checkStatus(err);
                    }, 1000);
            }
        });
    }

    ngOnInit() {
    this.getSTPTDetails();    
    }

    onNotification() {
    }

    closeDialog() {
        this.dialogRef.close(false);
    }
}
