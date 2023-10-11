import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'create-area',
  templateUrl: './area-model.html',
})

export class AreaComponent {
  public form: FormGroup;
  reactiveSites: any;
  modelname:string;
  areaSection:boolean;
  isSiteHasData : boolean;
  @Input() parentInput:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer) {
    this.areaSection = false;
  }

  closeDialog(){
    this.notify.emit('Click from nested component');
  }

  ngOnInit() {
      this.modelname="Add Area"
      this.form = this.fb.group({
        NAME : [null],
        STATUS : [null]
      });

      if(this.parentInput){
        this.modelname = 'Edit Area';
        this.form.patchValue(this.parentInput);
      }
  }
}
