import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'model',
  templateUrl: './model.html',
})

export class ModelDialog {
  public form: FormGroup;
  parentInput:any;
  title:string;
  constructor(
    private fb: FormBuilder,
     public dialogRef: MdDialogRef<ModelDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) {
    
    }
    onNotify(message:string) {
      if(message == 'success'){
        this.dialogRef.close(true);
      }else{
        this.dialogRef.close(false);
      }
       
    }
    getTitle(message:string){
      this.title=message;
    }

    closeDialog(){
      this.dialogRef.close(false);
    }
    ngOnInit() {
      if (this.data && this.data.model){
        this.parentInput = this.data.model;
      }
    }
   
}
