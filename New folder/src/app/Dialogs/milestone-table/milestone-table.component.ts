import {Component, Inject, OnInit} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-milestone-table',
  templateUrl: './milestone-table.html',
  styleUrls: ['./milestone-table.scss']
})

export class MilestoneTableDialog implements OnInit {
  constructor(public dialogRef: MdDialogRef<MilestoneTableDialog>)
    {
    }
  ngOnInit(): void {
  }
  closeDialog() {
    this.dialogRef.close(true);
  }
}
