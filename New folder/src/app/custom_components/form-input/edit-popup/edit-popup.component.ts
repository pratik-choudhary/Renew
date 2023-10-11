import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'input-component-form',
  templateUrl: './edit-popup.html',
})

export class EditInputComponent {
 public form: FormGroup;
  constructor(public dialogRef: MdDialogRef<EditInputComponent>, private fb: FormBuilder) {}
   ngOnInit() {
        this.form = this.fb.group({
            label: [null, Validators.required],
            name: [null, Validators.required],
            placeholder: [null, Validators.required]
        });
    }
    updateQuestion() { 
        var obj: {[k: string]: any} = {};
        obj. type = 'input';
        obj.label = this.form.value.label;
        obj.name = this.form.value.name;
        obj.placeholder = this.form.value.placeholder;
        this.dialogRef.close(obj);
     }
}