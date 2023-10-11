import {Component,Output,EventEmitter} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { ChecklistComponent } from 'app/checklist/checklist.component';
import { MilestoneInsForm } from 'app/custom_components/milestone-ins/milestone-ins.component';

@Component({
  selector: 'checklist_form',
  templateUrl: './checklist_form.component.html',
})

export class ChecklistFormDialog {
  title:string;
  constructor(public dialogRef: MdDialogRef<ChecklistFormDialog>, private api_service: ApiService, private fb: FormBuilder) {
    
    
  }
  ngOnInit() {
    }

    onNotify(message: any){
      if(message === 'success'){
        this.dialogRef.close(true);
      }else{
        this.dialogRef.close(false);
      }
      
    }

    closeDialog(){
      this.dialogRef.close(false);
    }
    getTitle(message:any)
    {
      this.title = message;
    }
}


