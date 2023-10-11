import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import {WtgTraceabilityUploadComponent} from 'app/Dialogs/wtg-traceability-upload/wtg-traceability-upload.component';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { DialogModule} from  'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'create-model-list',
  templateUrl: './create-model-list.html',
  providers: [ConfirmationService],
  styleUrls: ['./create-model.scss']
  // styleUrls: ['../checklist/checklist.component.scss']
})

export class CreateModelListComponent {
  _value: string;
  Notification:string;
  display=false;
  config :MdSnackBarConfig; 
  modelList: any;
  modelList_active: any;
  modelList_inactive: any;
  value1 : number = 1;
  currentUser:any;
  constructor(public dialog: MdDialog, private api_service: ApiService, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef, private auth_service: AuthGuard,private confirmationService: ConfirmationService) {
    this.modelList_active = [];
    this.modelList_inactive = [];
    }
  @Input()
  
  public set value(val: string) {
    this._value = val;
    this.getModules();
  }
  ngOnInit() {
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    this.getModules();
  }
  getModules() {
    this.api_service.getModules().subscribe(
      data => {
        data.reverse();
        this.modelList = data.filter(x => x.status !== 'hidden');
     },
     err => { console.log(err);
      this.api_service.checkStatus(err);
    });
    }
    onNotification()
    {
      if(this.Notification=='Model deleted Successfully'|| this.Notification=='WTG Traceability Questions Published Successfully')
      {
        this.display = false;
        this.getModules();
      }
      if(this.Notification == 'Model delete Failed')
      {
        this.display = false;
      }
    }

  deleteModel(row) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Model?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.api_service.deleteModulesById(row.id).subscribe(
      data => {
        if(data !=0)
        {
          setTimeout(()=>{
          this.Notification = 'Model deleted Successfully';
          this.display = true;
          }, 400);
        }
        else
        {
          setTimeout(()=>{
          this.Notification = 'Model delete Failed';
          this.display = true;
        }, 400);
        }
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(()=>{
        this.Notification = 'Model delete Failed';
        this.display = true;
      }, 400);
      }); 

      }});
  }
  
  openDialog() {
    let dialogRef = this.dialog.open(ModelDialog, {
      width: '70vw',
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getModules();
      }
    });
  }

  openWTGDialog(model_data:any) {
    let dialogRef = this.dialog.open(WtgTraceabilityUploadComponent, {
      width: '40vw',
      disableClose:true,
      data:model_data
    });
    dialogRef.afterClosed().subscribe(result => {
      
        this.getModules();
      
    });

    
  }

  // updateCivilWTGStatus(model:any)
  //   {
  //     var obj: { [k: string]: any } = {};
  //     this.api_service.updateWTGStatus(obj,model.id).subscribe(
  //       data => {
  //         setTimeout(()=>{
  //           this.Notification = 'Civil WTG Traceability Questions Published Successfully';
  //           this.display = true;
  //         }, 400);
  //       },err=>{
  //         console.log(err);
  //         this.api_service.checkStatus(err);
  //         setTimeout(()=>{
  //         this.Notification = 'Civil WTG Traceability Questions Publish Failed';
  //         this.display = true;
  //       }, 400);

  //       });

  //   }

  openQuestionEditPopup(model) {
    let dialogRef = this.dialog.open(ModelDialog, {
      width: '70vw',
      data: {
        model: model
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getModules();
      }
    });
  }



}
