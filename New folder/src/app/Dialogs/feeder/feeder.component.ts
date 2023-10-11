import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'feeder',
  templateUrl: './feeder.html',
})

export class FeederDialog {
  public form: FormGroup;
  parentInput:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<FeederDialog>) {
    
    }

    onNotify(message: string) {
       if (message === 'success') {
          this.dialogRef.close(true);
        }else {
          this.dialogRef.close(false);
        }
    }

    ngOnInit() {
      if (this.data && this.data.site){
        this.parentInput = this.data.site;
      }
    }
   
}
