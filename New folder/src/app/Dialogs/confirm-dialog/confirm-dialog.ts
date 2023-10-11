import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.html',
})

export class ConfirmDialog {
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    public form: FormGroup;
    parentInput: any;
    constructor(
        public dialogRef: MdDialogRef<ConfirmDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService
    ) {
    }

    confirm() {
        if (this.data) {
            this.api_service.deleteChecklistById(this.data.checklist.CHECKLIST.CHECKLIST_ID).subscribe(
                data => {
                    this.dialogRef.close(false);
                },
                err => { console.log(err) });
        }

    }

    closeDialog() {
        this.dialogRef.close(false);
    }
    ngOnInit() {
    }

}
