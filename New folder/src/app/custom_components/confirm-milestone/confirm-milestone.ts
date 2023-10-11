import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
@Component({
    selector: 'confirm-milestone',
    templateUrl: './confirm-milestone.html',
})
export class ConfirmMilestone implements OnInit {

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
