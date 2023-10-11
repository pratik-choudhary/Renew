import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'create-user',
  templateUrl: './user-model.html',
})

export class UserModalComponent {
  public form: FormGroup;
  roleList: any;
  deptList: any;
  modelname:string;
  isSiteHasData : boolean;
  @Input() parentInput:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer) {
  
  this.deptList = ['Department 1', 'Department 2', 'Department 3', 'Department 4', 'Department 5', 'Department 6'];
  this.roleList = ['Role 1', 'Role 2', 'Role 3', 'Role 4', 'Role 5'];
  }

  closeDialog(){
    this.notify.emit('Click from nested component');
  }

  ngOnInit() {
      this.modelname="Add User"
      this.form = this.fb.group({
        NAME : [null],
        EMAIL : [null,Validators.email],
        ROLE : [null],
        DEPARTMENT : [null],
        STATUS : [null,Validators.required]
      });

      if(this.parentInput){
        this.modelname = 'Edit User';
        this.form.patchValue(this.parentInput);
      }
  }
}
