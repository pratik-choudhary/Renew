import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'new-checklist-version-dialog',
  templateUrl: './new-checklist-version-dialog.html',
})

export class NewChecklistVersionDialog {

  public form: FormGroup;
  parentInput: any;
  selectedChecklistVersion: any;
  selectedChecklistId: number;
  created_by: any;
  dept_id: number;
  model_id: number;
  stage_id: number;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MdDialogRef<NewChecklistVersionDialog>,

    @Inject(MD_DIALOG_DATA) public data: any) {
    this.selectedChecklistId = data.current_checklist_id;
    this.selectedChecklistVersion = +(data.current_checklist_version);
    this.dept_id = data.dept_id;
    this.model_id = data.model_id;
    this.stage_id = data.stage_id;
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
    if (this.data && this.data.created_by) {
      this.created_by = this.data.created_by;
    }
  }


}
