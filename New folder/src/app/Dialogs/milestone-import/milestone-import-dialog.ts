import {Component, Inject,Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'milestone-import-dialog',
  templateUrl: './milestone-import-dialog.html',
})

export class MilestoneImportDialog {
  public form: FormGroup;
  departmentId: any;
  checklistId: any;
  milestoneId: any;
  parentInput: any;
  selectedChecklistId: number;
  constructor(
    private fb: FormBuilder,
     public dialogRef: MdDialogRef<MilestoneImportDialog>,

     @Inject(MD_DIALOG_DATA) public data: any) {
      this.selectedChecklistId = data.current_checklist_id;
    }
    onNotify(message: string) {
      if (message === 'success') {
          this.dialogRef.close(true);
      }else {
         this.dialogRef.close(false);
      }
    }

    closeDialog(){
      this.dialogRef.close(false);
    }


    ngOnInit() {
      if (this.data && this.data.model) {
        this.parentInput = this.data.model;
      }
    }

    getDepartmentId(id: string) {
      this.departmentId = id;
    }
    getChecklistId(id: string) {
      this.checklistId = id;
    }
    getMilestoneId(id: string) {
      this.milestoneId = id;
    }
}
