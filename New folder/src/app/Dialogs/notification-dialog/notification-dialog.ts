import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
@Component({
    selector: 'notification-dialog',
    templateUrl: './notification-dialog.html',
})
export class NotificationDialog implements OnInit {

    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    message: string;

    constructor(
        public dialogRef: MdDialogRef<NotificationDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
    ) {


    }
    ngOnInit() {
        if (this.data) {
            this.message = this.data;
        }

    }
    closeDialog(){
        this.dialogRef.close(true);
    }
    accept() 
    {
        this.dialogRef.close(true);
    }
    reject() {
        this.notify.emit("failed");
    }
}
