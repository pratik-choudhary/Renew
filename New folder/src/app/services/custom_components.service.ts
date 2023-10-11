import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
@Injectable()
export class CustomComponentsService {
  textbox(index: number): any {
      return {
               type: 'input',
               label: 'question' + index,
               name: 'name',
               placeholder: ''
            };
  }
  checkbox(index: number): any {
      return {
            type: 'checkbox',
            label:  'question' + index,
            name: 'checkbox_question',
            options: ['Option1', 'Option2', 'Option3', 'Option4']
       };
  }
  radiobutton(index: number): any {
      return {
           type: 'radio',
           label:  'question' + index,
           name: 'radiogroup_question',
           options: ['Option1', 'Option2', 'Option3', 'Option4']
        };
  }
  select(index: number): any {
      return {
           type: 'select',
           label:  'question' + index,
           name: 'dropdown_question',
           options: ['Option1', 'Option2', 'Option3', 'Option4'],
           placeholder: 'Select an option'
        };
  }
    text(index: number): any {
         return {
           type: 'text',
           label:  'question' + index
         };
    }
    templateTextbox(index: number): any {
        return {
            type : 'template_input'
        };
    }
}