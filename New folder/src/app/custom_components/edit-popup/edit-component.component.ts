import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'edit-component-form',
  templateUrl: './edit-component.html',
})

export class EditComponent {
 public form: FormGroup;
  constructor(public dialogRef: MdDialogRef<EditComponent>, private fb: FormBuilder) {}
   ngOnInit() {
        this.form = this.fb.group({
            label: [null, Validators.required],
            name: [null, Validators.required],
            placeholder: [null],
            OPTIONS: this.fb.array([
                this.initLink()
              ])
        });
    }
    initLink() {
        return this.fb.group({
            OPTION_DESCRIPTION: [null, Validators.required]
        });
    }
    addLink() {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.push(this.initLink());
    }
    removeLink(i: number) {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.removeAt(i);
    }
    updateQuestion() { 
        var obj: {[k: string]: any} = {};
        obj.label = this.form.value.label;
        obj.name = this.form.value.name;
        obj.placeholder = this.form.value.placeholder;
        obj.options = [];
        for (let i of this.form.value.OPTIONS){
            obj.options.push(i. OPTION_DESCRIPTION);
        }
        this.dialogRef.close(obj);
     }
}