import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'milestone-ins',
  templateUrl: './milestone-ins.html',
  styleUrls: ['./milestone-ins.scss'],
  providers: [ConfirmationService]
})
export class MilestoneInsForm implements OnInit {

  @Output() afterdelete: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeMilestoneName: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeMilestone: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeMilestoneNo: EventEmitter<number> = new EventEmitter<number>();
  @Output() getMilestoneId:EventEmitter<number> = new EventEmitter<number>();
  milestone_no: any;
  milestone_name: any;
  @Input() edit_id: any;
  @Input() edit_milestone_no: any;
  @Input() edit_name: any;
  @Input() index: number;
  @Input() milestones: any;
  /*  @Input()
   public set milestoneInput(val: object) {
     this.milestones = val;
   } */

  constructor(public fb: FormBuilder, public dialog: MdDialog,private confirmationService: ConfirmationService) { }
  ngOnInit() {
    /*  this.form = this.fb.group({
       NO:[null],
       NAME: [null]
       }); */
    
    if (this.milestones != null && this.milestones != undefined && this.milestones.length > 0) {
      if (this.index < this.milestones.length) {
        this.milestone_no = this.milestones[this.index].MILESTONE_NO;
        this.changeMilestoneNo.emit(this.milestone_no);
        this.milestone_name = this.milestones[this.index].NAME;
        this.changeMilestoneName.emit(this.milestone_name);
        this.getMilestoneId.emit(this.milestones[this.index].SECTION_ID);

      }
    }
  }
  changeName() {
    this.changeMilestoneName.emit(this.milestone_name);
  }
  changeNo() {
    this.changeMilestoneNo.emit(this.milestone_no);
  }
  deleteMileStoneIns() {
    this.afterdelete.emit();
  }

  deleteMilestone()
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this milestone?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
    this.removeMilestone.emit('delete');
      }});
  }

}
