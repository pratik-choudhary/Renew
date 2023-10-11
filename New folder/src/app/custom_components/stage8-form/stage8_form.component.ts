import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ApiService } from 'app/services/api.service';
import {MultiSelectModule} from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stage8-form',
  templateUrl: './stage8_form.component.html',
  providers: [ConfirmationService]
})

export class StageEightForm implements OnInit {
  @Output() addForm: EventEmitter<string> = new EventEmitter<string>();
  @Output() date_emitter:  EventEmitter<String> = new EventEmitter<String>();
  @Output() FieldA_emitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() FieldB_emitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() FieldC_emitter: EventEmitter<string> = new EventEmitter<string>();
  stage8_date:Date;
  fieldA:any;
  fieldB:any;
  fieldC:any;
  
    
  constructor(public fb: FormBuilder,public iconRegistry: MdIconRegistry, public sanitizer: DomSanitizer, public dialog: MdDialog, private api_service: ApiService, private confirmationService: ConfirmationService) { 
    this.iconRegistry.addSvgIcon(
      'plus-circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
  }
  
  ngOnInit(){}

  dateIncrease(date:Date){
    var y = date.getFullYear(),
    m = date.getMonth() + 1, // january is month 0 in javascript
    d = date.getDate();
    var pad = function(val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str};
    var dateString = [y, pad(m), pad(d)].join("-");
    return dateString;
  }

  onDateChange()
  {
    if(this.stage8_date != null)
    {
      this.stage8_date = new Date(this.dateIncrease(this.stage8_date));
      this.date_emitter.emit(this.stage8_date.toString());
    }
    else
    {
      this.date_emitter.emit("empty");
    }
  }
 
  onDateSelect()
  {
    if(this.stage8_date != null)
    {
      this.stage8_date = new Date(this.dateIncrease(this.stage8_date));
      this.date_emitter.emit(this.stage8_date.toString());
    }   
  }
  addNewForm()
  {
    this.addForm.emit("add");
  }

  on_FieldA_change()
  {
    var x = this.fieldA;
    this.FieldA_emitter.emit(x);
  }
  on_FieldB_change()
  {
    var x = this.fieldB;
    this.FieldB_emitter.emit(x);
  }
  on_FieldC_change()
  {
    var x = this.fieldC;
    this.FieldC_emitter.emit(x);
  }

}
