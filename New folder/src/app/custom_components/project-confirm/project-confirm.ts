import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
@Component({
    selector: 'project-confirm',
    templateUrl: './project-confirm.html',
})
export class ProjectConfirm implements OnInit {
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    constructor() { }
    ngOnInit() {
    }
    accept() {
        this.notify.emit("success");
    }
    reject() {
        this.notify.emit("failed");
    }
}
