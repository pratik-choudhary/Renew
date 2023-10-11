import { Component, Input, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
@Component({
  selector: 'group-question',
  templateUrl: './group-question.html',
  styleUrls: ['../../checklist/checklist.component.scss']
})
export class GroupQuestionComponent {
 public form: FormGroup;
 @Input() parentInput: any;
 @Input() checklistStatus: any;
 @Output('childData') outgoingData = new EventEmitter<string>();
 @Output() onDuplicate: EventEmitter<any> = new EventEmitter<any>();
 constructor(private fb: FormBuilder) {
  }
   ngOnInit() {
        this.form = this.fb.group({
          QUESTION: [null, Validators.required],
          QUESTION_NO: [null, Validators.required],
          SPECIFICATION_TYPE: ['text', Validators.required],
          SPECIFICATION: [null, Validators.required],
          SPECIFICATION_OPTIONS: this.fb.array([
                  this.initLink()
              ]),
          MIN_RANGE: [null],
          MAX_RANGE: [null],
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
        this.form.valueChanges.subscribe(
           data => {
                this.outgoingData.emit(data);
        });
       if (this.parentInput != null) {
            this.form.patchValue(this.parentInput);
        }
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
    saveTemplate() {
        
    }
    public getData(): any {
      return this.form['_value'];
    }
    duplicateQuestion() {
        this.onDuplicate.emit(this.form.value);
    }
}
