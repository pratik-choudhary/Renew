import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
@Component({
  selector: 'form-checkbox',
  template: `
    <div 
      class="dynamic-field form-input" 
      [formGroup]="group"
      style="padding: 15px;">
      <input type="text" placeholder="write here" readonly="true">
    </div>
  `
})
export class FormCheckboxComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
  constructor(){}
}

