import { Component, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl,AbstractControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import {ValidationService} from 'app/services/validation.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
    selector: 'new-checklist-version',
    templateUrl: './new-checklist-version.html',
})

export class NewChecklistVersion implements OnInit {
    public form: FormGroup;
    versionTypes:any;
    config :MdSnackBarConfig; 
    currentUser:any;
    @Input() selectedChecklistId: number;
    @Input() departmentId: number;
    @Input() modelId: number;
    @Input() current_version: number;
    @Input() stageId: number;
    @Input() selectedChecklistVersion: number;
    @Input() createdby: any;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    Notification:string;
    display=false;
    constructor(private fb: FormBuilder, private api_service: ApiService,private validation_service:ValidationService,private snackbar: MdSnackBar,
        public viewContainerRef: ViewContainerRef,private auth_service: AuthGuard) {
        this.versionTypes=[
            {
                "type":"Minor Version"
                
            },
            {
                "type":"Major Version"
            }

        ]
        this.currentUser = this.auth_service.getUserInfo();
        
    }

    
    closeDialog() {
        this.notify.emit('failed');
    }
    
    onNotification(){
        this.display=false;
        if(this.Notification == 'Revision Added Successfully'){
          
            this.notify.emit('success');
        }
        if(this.Notification == 'Revision Add Failed')
        {
          this.notify.emit('failed');
        }
    }

    submitNewChecklistVersion() {
        var obj: { [k: string]: any } = {};
        obj.checklist_id = this.selectedChecklistId;
        obj.DEPARTMENT_ID = this.departmentId;
        obj.MODEL_ID = this.modelId;
        obj.VERSION = this.form.value.VERSION;
        obj.CREATED_BY = this.currentUser.user_id;
        obj.STAGE_ID = this.stageId;
        this.api_service.createNewChecklistVersion(this.selectedChecklistId, obj).subscribe(
            data => {
              setTimeout(()=>{
              this.Notification="Revision Added Successfully";
              this.display=true;
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
                    this.Notification="Revision Add Failed";
                    this.display=true;
                }, 400);
            }
            
        });
    }

    onVersionTypechange(){
        if (this.form.value.VERSION_TYPE == 'Major Version')
        {
            this.selectedChecklistVersion = this.selectedChecklistVersion + 1;
        }
        if (this.form.value.VERSION_TYPE == 'Minor Version')
        {
            this.selectedChecklistVersion = this.selectedChecklistVersion + 0.1;
        }
    }
  ngOnInit() {
        this.form = this.fb.group({
            VERSION_TYPE: [null],
            VERSION: [this.selectedChecklistVersion+1,ValidationService.min(this.selectedChecklistVersion+1)]
        });


    }
}





