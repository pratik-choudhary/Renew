import {Component, Inject, ViewChild, ChangeDetectorRef} from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdIconRegistry} from '@angular/material';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { ChecklistComponent } from 'app/checklist/checklist.component';
import { ItemFormDialog } from 'app/Dialogs/item_form.component';
import { GroupQuestionComponent } from 'app/custom_components/group-question/group-question.component';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import * as toastr from 'toastr';


@Component({
  selector: 'edit-question',
  templateUrl: './edit-question.html',
  styleUrls: ['../checklist/checklist.component.scss']
})

export class EditQuestionDialog {
  config :MdSnackBarConfig;   
  model:string;
  questions: Array<any> = [];
  group_question: Array<any> = [];
  patch_value: any;
  public form: FormGroup;
  public groupform: FormGroup;
  current_options: any;
  current_active_template: number;
  selected_tab: string;
  tabs: string;
  milestone_id: any;
  checklist_status= 'draft';
  MIN_RANGE: any;
  MAX_RANGE: any;
  Unit: any;
  SPECIFICATION_OPTIONS: any = [];
  originalSpecification_options: any;
  originalActual_options: any;
  ACTUAL_OPTIONS: any = [];
  display=false;
  Notification:any; 
  Specifications: any = [];
  formSubmitted: boolean = false;
 
  constructor(
      public dialog: MdDialog,
      public dialogRef: MdDialogRef<EditQuestionDialog>,
      private api_service: ApiService,
      private iconRegistry: MdIconRegistry,
      private sanitizer: DomSanitizer,
      @Inject(MD_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef,
      private snackbar: MdSnackBar,
      public viewContainerRef: ViewContainerRef) {
         this.iconRegistry.addSvgIcon(
        'arrow_left',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_keyboard_arrow_left.svg'));
         this.iconRegistry.addSvgIcon(
        'arrow_right',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_keyboard_arrow_right.svg'));
        this.iconRegistry.addSvgIcon(
        'icon_delete',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_delete.svg'));
        this.tabs = data.tabs;
        if (this.data.tabs == 'both') {
          this.tabs = 'both';
          this.selected_tab = 'individual';
        }else if (this.data.tabs == 'individual') {
          this.tabs = 'individual';
          this.selected_tab = 'individual';
        }else if (this.data.tabs == 'group') {
          this.tabs = 'group';
          this.selected_tab = 'group';
        }
        if (this.data.checklist_status) {
          this.checklist_status = this.data.checklist_status;
        }
        debugger
        this.milestone_id = this.data.milestone_id;
        this.patch_value = null;
  }
  ngOnInit() {
    this.getAllSpecifications();
      this.model="Add Question";
      this.form = this.fb.group({
        QUESTION: [null, Validators.required],
        QUESTION_NO: [null, Validators.required],
        SPECIFICATION_TYPE: ['text', Validators.required],
        SPECIFICATION: [''],
        SPECIFICATION_OPTIONS: this.fb.array([
          this.initLink()
        ]),
        MIN_RANGE: [''],
        MAX_RANGE: [''],
        Unit: [''],
        ACTUAL_TYPE: ['text'],
        ACTUAL: [''],
        ACTUAL_OPTIONS: this.fb.array([
          this.initLink()
        ]),
        PHOTO: [false],
        DOCUMENT: [false],
        OPTION_TYPE: ['radio'],
        CRITICALITY: ['yellow'],
        OPTIONS: this.fb.array([
          this.fb.group({
              OPTION_DESCRIPTION: ['OK']
          }),
          this.fb.group({
              OPTION_DESCRIPTION: ['NOT OK']
          })
        ])
      });
      this.questions.push({});
      this.group_question.push({});
      this.current_active_template = 0;
      if (this.data.question) {
        debugger;
        let question = Object.assign({},this.data.question);
        this.model="Edit Question";
        if (question.OptionType === 'Value') {
          this.MIN_RANGE = question.MinRange;
          this.MAX_RANGE = question.MaxRange;
          this.Unit = question.RangeUnit;
        } else if (question.OptionType === 'Dropdown') {
          if ( question.OptionType != undefined && question.Options != null && question.Options !== '' && question.Options != 'null') {
            this.originalSpecification_options = question.Options;
            this.SPECIFICATION_OPTIONS = question.Options.split(',');
            var obj = [];
            for (let index = 0 ; index < this.SPECIFICATION_OPTIONS.length; index++ ) {
              obj.push({OPTION_DESCRIPTION: this.SPECIFICATION_OPTIONS[index]});
              if (index > 0) {
                this.addSpecification();
              }
            }
            question.Options = obj;
            this.form.controls.SPECIFICATION_OPTIONS.setValue(question.Options);
      }
        }
        if (question.ACTUAL_TYPE === 'select') {
          if(question.ACTUAL_OPTIONS != undefined && question.ACTUAL_OPTIONS != null && question.ACTUAL_OPTIONS !== '' && question.ACTUAL_OPTIONS !== 'null') {
            this.originalActual_options = question.ACTUAL_OPTIONS;
            this.ACTUAL_OPTIONS = question.ACTUAL_OPTIONS.split(',');
            obj = [];
            for (let index = 0 ; index < this.ACTUAL_OPTIONS.length; index++ ) {
              obj.push({OPTION_DESCRIPTION: this.ACTUAL_OPTIONS[index]});
              if (index > 0) {
                this.addActual();
              }
            }
            question.ACTUAL_OPTIONS = obj;
            this.form.controls.ACTUAL_OPTIONS.setValue(question.ACTUAL_OPTIONS);
          }
        }
        // this.form.controls.ACTUAL_TYPE.setValue(question.ACTUAL_TYPE);
        // this.form.controls.ACTUAL.setValue(question.ACTUAL);
        this.form.controls.QUESTION.setValue(question.Question);
        this.form.controls.QUESTION_NO.setValue(question.QuestionNo );
        this.form.controls.SPECIFICATION.setValue(question.Specification);
        this.form.controls.SPECIFICATION_TYPE.setValue(question.OptionType);
        this.form.controls.MIN_RANGE.setValue(question.MinRange);
        this.form.controls.MAX_RANGE.setValue(question.MaxRange);
        this.form.controls.Unit.setValue(question.RangeUnit);
        this.form.controls.PHOTO.setValue(question.NeedPhoto);
        // this.form.controls.DOCUMENT.setValue(question.DOCUMENT);
        this.form.controls.OPTION_TYPE.setValue(question.OptionType);
        this.form.controls.CRITICALITY.setValue(question.Criticality);
        this.form.controls.OPTIONS.setValue(question.Options);
        this.cdr.detectChanges();
      }
  }
   addQuestions() {
       this.patch_value = null;
       this.questions.push({});
       this.group_question.push({});
       this.current_active_template = this.current_active_template + 1;
   }
   initLink() {
        return this.fb.group({
            OPTION_DESCRIPTION: [null]
        });
    }
    addLink() {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.push(this.initLink());
    }
    removeLink(i: number) {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.removeAt(i);
    }
    addSpecification() {
        const control = < FormArray > this.form.controls['SPECIFICATION_OPTIONS'];
        control.push(this.initLink());
    }
    removeSpecification(i: number) {
        const control = < FormArray > this.form.controls['SPECIFICATION_OPTIONS'];
        control.removeAt(i);
    }
    addActual() {
        const control = < FormArray > this.form.controls['ACTUAL_OPTIONS'];
        control.push(this.initLink());
    }
    removeActual(i: number) {
        const control = < FormArray > this.form.controls['ACTUAL_OPTIONS'];
        control.removeAt(i);
    }
    selectCurrentActiveTemplate(index) {
      if (index >= 0) {
        this.current_active_template = index;
      }
    }
    saveQuestion() {
      this.formSubmitted = true 
      if (this.form['_status'] == 'VALID') {
      var obj: { [k: string]: any } = {};
      // obj.ACTUAL = this.form.value.ACTUAL;
      // obj.ACTUAL_OPTIONS = this.form.value.ACTUAL_OPTIONS;
      var actual_option_string = '';

      // for (var i = 0; i < obj.ACTUAL_OPTIONS.length; i++) {
      //   actual_option_string = actual_option_string + obj.ACTUAL_OPTIONS[i].OPTION_DESCRIPTION + ',';
      // }
      actual_option_string = actual_option_string.substr(0, actual_option_string.length - 1);
      
      obj.CRITICALITY = this.form.value.CRITICALITY;
      obj.DOCUMENT = false;
      obj.MAX_RANGE = this.form.value.MAX_RANGE;
      obj.Unit = this.form.value.Unit;
      obj.MIN_RANGE = this.form.value.MIN_RANGE;
      obj.OPTION_TYPE = this.form.value.OPTION_TYPE;
      obj.PHOTO = this.form.value.PHOTO;
      obj.QUESTION = this.form.value.QUESTION;
      obj.QUESTION_NO = this.form.value.QUESTION_NO;
      obj.SPECIFICATION = this.form.value.SPECIFICATION;
      obj.OPTIONS = this.form.value.SPECIFICATION_OPTIONS;
      var specification_option_string = '';
      for (var i = 0; i < obj.OPTIONS.length; i++) {
        specification_option_string = specification_option_string + obj.OPTIONS[i].OPTION_DESCRIPTION + ',';

      }
      specification_option_string = specification_option_string.substr(0, specification_option_string.length - 1);
       obj.OPTIONS = specification_option_string;
      obj.OPTION_TYPE = this.form.value.SPECIFICATION_TYPE;
      if (this.data.question) {
        debugger;
            this.api_service.updateQuestion(this.data.question.Id, obj).subscribe(
            data => {
              this.formSubmitted = false
              setTimeout(()=>{
                toastr.success('Question Edited Successfully', 'Success');
                this.dialogRef.close(true);
                //this.Notification = 'Question Edited Successfully';
                //this.display = true; 
              }, 400);
            },
            err => {
              console.log(err);
              if(err.status == 401)
                {
                  this.closeDialog();
                  setTimeout(()=>{
                    this.api_service.checkStatus(err);
                  }, 1000);
                }
                else
                {
                  setTimeout(()=>{
                    toastr.error('Question Edit Failed', 'Error');
                    this.dialogRef.close(false);
                   // this.Notification = 'Question Edit Failed';
                   // this.display = true;
                  }, 400);
                }
            });
          } else {
            this.api_service.saveQuestion(obj, this.milestone_id).subscribe(
            data => {
              //this.snackbar.open('Question Added Successfully', 'Ok', this.config);  
              setTimeout(()=>{
                toastr.success('Question Added Successfully', 'Success');
                this.dialogRef.close(true);
              //this.Notification = 'Question Added Successfully';
              //this.display = true; 
            }, 400);
            },
            err => {
              console.log(err);
              if(err.status == 401)
                {
                  this.closeDialog();
                  setTimeout(()=>{
                    this.api_service.checkStatus(err);
                  }, 1000);
                }
                else
                {
                  setTimeout(()=>{
                    toastr.error('Question Add Failed', 'Error');
                    this.dialogRef.close(false);
                    //this.Notification = 'Question Add Failed';
                    //this.display = true; 
                  }, 400);
                }
            });
          }
        }
    }
    openCreateItemDialog() {
    let dialogRef = this.dialog.open(ItemFormDialog, {
      width: '70vw',
      data: {
          section_id: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.current_options = result.OPTIONS;
      }else {
        
      }
    });
  }
  changeTab(tab) {
    this.selected_tab = tab;
  }
  public handleEvent(childData: any, index: number) {
      this.group_question[index] = childData;
  }
  formatePayload(){
    let arr: any = [];
    for(var i in this.group_question){
      var obj: { [k: string]: any } = {};
      obj.ACTUAL = this.group_question[i].ACTUAL;
      obj.ACTUAL_OPTIONS = this.group_question[i].ACTUAL_OPTIONS;
      var actual_option_string = '';

      for (var j = 0; j < obj.ACTUAL_OPTIONS.length; j++) {
        actual_option_string = actual_option_string + obj.ACTUAL_OPTIONS[j].OPTION_DESCRIPTION + ',';
      }
      actual_option_string = actual_option_string.substr(0, actual_option_string.length - 1);
      obj.ACTUAL_OPTIONS = actual_option_string;
      obj.ACTUAL_TYPE = this.group_question[i].ACTUAL_TYPE;
      obj.CRITICALITY = this.group_question[i].CRITICALITY;
      obj.DOCUMENT = this.group_question[i].DOCUMENT;
      obj.MAX_RANGE = this.group_question[i].MAX_RANGE;
      obj.MIN_RANGE = this.group_question[i].MIN_RANGE;
      obj.OPTIONS = "OK,NOT OK";
      obj.OPTION_TYPE = this.group_question[i].OPTION_TYPE;
      obj.PHOTO = this.group_question[i].PHOTO;
      obj.QUESTION = this.group_question[i].QUESTION;
      obj.QUESTION_NO = this.group_question[i].QUESTION_NO;
      obj.SPECIFICATION = this.group_question[i].SPECIFICATION;
      obj.SPECIFICATION_OPTIONS = this.group_question[i].SPECIFICATION_OPTIONS;
      var specification_option_string = '';
      for (var k = 0; k < obj.SPECIFICATION_OPTIONS.length; k++) {
        specification_option_string = specification_option_string + obj.SPECIFICATION_OPTIONS[k].OPTION_DESCRIPTION + ',';

      }
      specification_option_string = specification_option_string.substr(0, specification_option_string.length - 1);
       obj.SPECIFICATION_OPTIONS = specification_option_string;
      obj.SPECIFICATION_TYPE = this.group_question[i].SPECIFICATION_TYPE;
      arr.push(obj);
    }
    return arr;
  } 
  
  

  onNotification(){
    this.display = false;
    if(this.Notification == 'Group Question Added Successfully'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Group Question Edited Successfully'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Group Question Edit Failed'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Group Question Add Failed'){ 
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Question Added Successfully'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Question Edited Successfully'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Question Edit Failed'){
      this.dialogRef.close(true);
    }
    if(this.Notification == 'Question Add Failed'){
      this.dialogRef.close(true);
    }
  }
  saveGroupTemplate(group_activity) {
     var obj: {[k: string]: any} = {};
     obj.ACTIVITY = group_activity;
     obj.QUESTION_ARRAY = this.formatePayload();
     if (this.data.activity_id) {
        this.api_service.saveActivityQuestions(obj, this.data.activity_id).subscribe(
        data => {
          setTimeout(()=>{
          this.Notification = 'Group Question Edited Successfully';
          this.display = true; 
          }, 400);
        },
        err => {
          console.log(err);
            if(err.status == 401)
            {
              this.closeDialog();
              setTimeout(()=>{
              this.api_service.checkStatus(err);
              }, 1000);
            }
          else
          {
            setTimeout(()=>{
              this.Notification = 'Group Question Edit Failed';
              this.display = true; 
            }, 400);
          }
        });
     }else {
      this.api_service.saveQuestions(obj, this.milestone_id).subscribe(
      data => {
        setTimeout(()=>{
        this.Notification = 'Group Question Added Successfully';
        this.display = true; 
      }, 400);
      },
      err => {
        console.log(err);
            if(err.status == 401)
            {
              this.closeDialog();
              setTimeout(()=>{
              this.api_service.checkStatus(err);
              }, 1000);
            }
        else
        {
          setTimeout(()=>{
            this.Notification = 'Group Question Add Failed';
            this.display = true; 
          }, 400);
        }
        
      });
     }
  }
  removeTemplate() {
      var index = this.current_active_template;
      if (index == this.questions.length - 1) {
        this.questions.splice(index, 1);
        this.group_question.splice(index, 1);
        this.current_active_template = 0;
      }else {
        this.questions.splice(index, 1);
        this.group_question.splice(index, 1);
      }
  }
  duplicateQuestion(form_value: any) {
    form_value.QUESTION_NO = null;
    this.patch_value = form_value;
    this.questions.push({});
    this.group_question.push({});
    this.current_active_template = this.current_active_template + 1;
  }

  closeDialog() {
    this.data.question.SPECIFICATION_OPTIONS = this.originalSpecification_options;
    if (this.data.question.ACTUAL_TYPE == 'select') {
      this.data.question.ACTUAL_OPTIONS = this.originalActual_options;
    }
    this.dialogRef.close(true);
  }
  close()
  {
    this.dialogRef.close(false);
  }

  changeSpecificationType() {
    if (this.form.value.SPECIFICATION_TYPE == 'select') {
      const arrayControl = <FormArray>this.form.controls['ACTUAL_OPTIONS'];
      arrayControl.removeAt(0);
      this.form.controls.ACTUAL_TYPE.setValue('text');
    }
  }

  getAllSpecifications(){
    this.api_service.getAllSpecifications().subscribe(
      data => {
        this.Specifications=data.data;
      })
  }
}
