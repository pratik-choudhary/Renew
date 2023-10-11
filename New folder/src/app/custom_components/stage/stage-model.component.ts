import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import {ApiService} from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';

@Component({
  selector: 'create-stage',
  templateUrl: './stage-model.html',
})

export class StageModalComponent {
  public form: FormGroup;
  modelname:string;
  config :MdSnackBarConfig; 
  @Input() parentInput:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  statusList = [
    'Active', 'Inactive'
  ];
  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry, public sanitizer: DomSanitizer, private api_service: ApiService,private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef) {
  }

  closeDialog(){
    this.notify.emit('Click from nested component');
  }

  ngOnInit() {
      this.modelname = 'Add Stage';
      this.form = this.fb.group({
        NAME : [null],
        LEVEL : [null],
        STATUS : ['Active']
      });

      if (this.parentInput) {
        this.modelname = 'Edit Stage';
        var obj: {[k: string]: any} = {};
        obj.NAME = this.parentInput.name;
        obj.LEVEL = this.parentInput.level;
        obj.STATUS = this.parentInput.status;
        this.form.patchValue(obj);
      }
  }
  createStatus() {
    var obj: {[k: string]: any} = {};

    obj.name = this.form.value.NAME;
    obj.level = this.form.value.LEVEL;
    obj.status = this.form.value.STATUS;
    if (this.modelname === 'Add Stage') {
      this.api_service.addStage(obj).subscribe(
      data => {
        this.notify.emit('success');
        this.snackbar.open('Stage Added Successfully', 'Ok', this.config);  
      },
      err => { console.log(err);
      this.notify.emit('failed');
      this.snackbar.open('Stage Add Failed', 'Ok', this.config);  
    });
     }else {
      this.api_service.updateStage(obj, this.parentInput.id).subscribe(
      data => {
       this.notify.emit('success');
       this.snackbar.open('Stage Edited Successfully', 'Ok', this.config);  
      },
      err => { console.log(err);
      this.notify.emit('failed');
      this.snackbar.open('Stage Edit Failed', 'Ok', this.config);  
    });
    }
  }  
}
