import {Component, Inject, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ApiService } from "app/services/api.service";
import { ChecklistHistoryDialog } from 'app/Dialogs/history-checklist-dashboard/history-dialog.component';
@Component({
	selector: 'history-table',
	templateUrl: './history-table.html',
	styleUrls:['./history-table.scss']
})
export class HistoryTableComponent implements OnInit {
  checklist_items: any;
  history:any;
  @Input() id: any;
  constructor(private api_service: ApiService,public dialogRef: MdDialogRef<ChecklistHistoryDialog>) {
    
  }
  ngOnInit() {
    this.getHistory(this.id);
  }
  getHistory(id)
  {
      this.api_service.getChecklistHistory(id).subscribe(data => {
      this.history = data;
       },
       err => { 
        console.log(err);
        if(err.status == 401)
        {
          this.dialogRef.close(false);
          setTimeout(()=>{
          this.api_service.checkStatus(err);
          }, 1000);
        }
        else
        {
          console.log(err); 
        }
        });
  }
}