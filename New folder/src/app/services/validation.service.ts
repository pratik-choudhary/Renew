import { Injectable, Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators,ValidatorFn, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './api.service';


@Injectable()
export class ValidationService {
    
    
    constructor(public api_service: ApiService) {        
    }
    //customer validations
        static min(min: number): ValidatorFn {
        return (control: FormControl): { [key: string]: boolean } | null => {

            let val: number = control.value;

            if (control.pristine || control.pristine) {
                return null;
            }
            if (val >= min) {
                return null;
            }
            return { 'min': true };
        }
    }

}