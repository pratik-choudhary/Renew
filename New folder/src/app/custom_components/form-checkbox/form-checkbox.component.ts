import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA } from '@angular/material';
import { EditComponent } from 'app/custom_components/edit-popup/edit-component.component';

@Component({
  selector: 'form-checkbox',
  template: `
    <div class="mb-1" [formGroup]="group" 
    style="padding: 15px;">
    <div fxLayout="row" fxLayoutAlign="space-between">  
          <div style="font-size:14px;padding-bottom: 8px;">
          {{ config.label }}
          </div>
          <div style="min-width: 100px;">
            <button (click)="editComponent()">Edit</button>
            <button (click)="deleteComponent()">Delete</button>
          </div>
    </div>      
          <div fxLayout="row" fxLayoutWrap="wrap">
            <md-checkbox *ngFor="let option of config.options" fxFlex="25"
              [formControlName]="config.name">{{option}}</md-checkbox>
          </div>
    </div>
  `
})
export class FormCheckboxComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
    constructor(public dialog: MdDialog, private vcRef: ViewContainerRef){}
   editComponent(){
    let dialogRef = this.dialog.open(EditComponent, {
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.config.label = result.label;
        this.config.name = result.name;
        this.config.placeholder = result.placeholder;
        this.config.options = result.options;
      }
    });
  }
  deleteComponent(){
    if (this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config) !== -1){
      this.vcRef['_view'].viewContainerParent.component.config.splice(this.vcRef['_view'].viewContainerParent.component.config.indexOf(this.config), 1);
    }
  }
}
