import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'area',
  templateUrl: './area.html',
})

export class AreaDialog {
  public form: FormGroup;
  title:string;
  parentInput:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<AreaDialog>) {
    
    }

    onNotify(message:string) {
      setTimeout(() => {
         this.dialogRef.close(message);
    }, 500);
      
    }
    getTitle(message:string)
    {
      this.title=message;
    }

    closeDialog(){
      this.dialogRef.close(true);
    }
    ngOnInit() {
      if (this.data && this.data.site){
        this.parentInput = this.data.site;
      }
    }
   
}
