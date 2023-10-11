import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'input-component-form',
  templateUrl: './edit-popup.html',
})

export class EditTextComponent {
 public form: FormGroup;
  constructor(public dialogRef: MdDialogRef<EditTextComponent>, private fb: FormBuilder) {}
   ngOnInit() {
        this.form = this.fb.group({
            label: [null, Validators.required]
        });
    }
    updateQuestion() {
        var obj: {[k: string]: any} = {};
        obj.label = this.form.value.label;
        this.dialogRef.close(obj);
     }
}