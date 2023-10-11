import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'customer',
  templateUrl: './customer.html',
})

export class CustomerDialog {
  public form: FormGroup;
  title:string;
  parentInput:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<CustomerDialog>) {
    }

    onNotify(message: string) {
       if (message === 'success') {
          this.dialogRef.close(true);
        }else {
          this.dialogRef.close(false);
        }
    }

    getTitle(message:string)
    {
      this.title=message;
    }
    closeDialog(){
      this.dialogRef.close(false);
    }
    ngOnInit() {
      if (this.data && this.data.customer){
        this.parentInput = this.data.customer;
      }
    }
   
}
