import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'user',
  templateUrl: './user.html',
})

export class UserDialog {
  public form: FormGroup;
  parentInput:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<UserDialog>) {
    
    }

    onNotify(message:string) {
       this.dialogRef.close(true);
    }

    ngOnInit() {
      if (this.data && this.data.site){
        this.parentInput = this.data.site;
      }
    }
   
}
