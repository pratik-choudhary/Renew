import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
@Component({
    selector: 'notification-message',
    templateUrl: './notification-message.html',
})
export class NotificationMessage implements OnInit {

    @Input() notificationMessage:any;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    message: string;
    constructor(
        
    ) {

    }
    ngOnInit() {
        if (this.notificationMessage) {
            this.message = this.notificationMessage;
        }

    }
    accept() {
        this.notify.emit('success');
    }
   
}
