import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA } from '@angular/material';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { EditInputComponent } from './edit-popup/edit-popup.component';

@Component({
  selector: 'form-input',
  styleUrls: ['form-input.component.scss'],
  template: `
    <div 
      class="dynamic-field form-input" 
      [formGroup]="group"
      style="padding: 15px;">
      <div fxLayout="row" fxLayoutAlign="space-between" style="padding-bottom: 6px;">  
          <div style="font-size:14px;padding-bottom: 8px;">
            {{ config.label }}
          </div>
          <div style="min-width: 100px;">
              <button (click)="EditComponent()">Edit</button>
              <button (click)="deleteComponent()">Delete</button>
          </div>
      </div>
      <input
        type="text"
        [attr.placeholder]="config.placeholder"
        [formControlName]="config.name">
    </div>
  `
})
export class FormInputComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  constructor(public dialog: MdDialog, private vcRef: ViewContainerRef){}
  EditComponent(){
    let dialogRef = this.dialog.open(EditInputComponent, {
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.config.label = result.label;
        this.config.name = result.name;
        this.config.placeholder = result.placeholder;
      }
    });
  }
  deleteComponent(){
    if (this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config) !== -1){
      this.vcRef['_view'].viewContainerParent.component.config.splice(this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config), 1);
    }
  }
}
