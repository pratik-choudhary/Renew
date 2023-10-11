import { Component , OnInit, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { MilestoneTableDialog } from 'app/Dialogs/milestone-table/milestone-table.component';
@Component({
  selector: 'app-checklist-ins',
  templateUrl: './checklistins.html',
  styleUrls:['./checklist-ins.scss']
})
export class ChecklistInsForm implements OnInit {
public form: FormGroup;
@Output() afterdelete: EventEmitter<string> = new EventEmitter<string>();
userList = [
    'User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6'
  ];

  checkList = [
    'Checklist 1', 'Checklist 2', 'Checklist 3', 'Checklist 4', 'Checklist 5', 'Checklist 6'
  ];
  HOD = false;
constructor(public fb: FormBuilder, public dialog: MdDialog) {}
 ngOnInit(){
    this.form = this.fb.group({
      name: [null],
      checklist: [null],
      startDate : [null],
      endDate : [null],
      projectManager : [null]
    });
  }
deleteChecklistIns(){
    this.afterdelete.emit();
}
showHOD() {
  this.HOD = true;
}
assignMilestones() {
  let dialogRef = this.dialog.open(MilestoneTableDialog, {
        width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
}

}
