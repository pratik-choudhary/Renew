import { Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA } from '@angular/material';
import { EditTextComponent } from './edit-popup/edit-popup.component';
@Component({
  selector: 'form-text',
  template: `
    <div 
      class="dynamic-field form-select"
      [formGroup]="group"
      style="padding: 15px;">
      <div fxLayout="row" fxLayoutAlign="space-between" style="padding-bottom: 6px;">  
              <div style="font-size:15px;padding-bottom: 8px;font-weight: 600;">
                {{ config.label }}
              </div>
              <div style="min-width: 100px;">
                  <button (click)="editComponent()">Edit</button>
                  <button (click)="deleteComponent()">Delete</button>
              </div>
      </div>
    </div>
  `
})
export class FormTextComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  constructor(public dialog: MdDialog, private vcRef: ViewContainerRef){}
   editComponent(){
    let dialogRef = this.dialog.open(EditTextComponent, {
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.config.label = result.label;
      }
    });
  }
  deleteComponent(){
    if (this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config) !== -1){
      this.vcRef['_view'].viewContainerParent.component.config.splice(this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config), 1);
    }
  }
}
