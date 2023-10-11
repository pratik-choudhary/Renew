import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-issue-register',
  templateUrl: './issue-register.component.html',
  styleUrls: ['./issue-register.component.scss']
})
export class IssueRegisterComponent implements OnInit {
  checklists=[];
  site_id:any;
  selecedChecklist:any;
  constructor(public dialogRef: MdDialogRef<IssueRegisterComponent>,
     @Inject(MD_DIALOG_DATA) public data: any,
     private api_service: ApiService ) { 
       console.log(data);
       this.site_id = data;
     }

  ngOnInit() {
    this.getChecklists();
  }
  getChecklists()
  {
    this.api_service.getChecklistsForIssueRegister(this.site_id).subscribe(data=>{
      for(var i of data)
      {
        this.checklists.push({
          'label': i.NAME,
          'value': i.CHECKLIST_ID
        });  
      }
    },err=>{});
    
    
  }
 
  closeDialog() {
    this.dialogRef.close(false);
  }
  downloadExcel()
  {
  //   this.api_service.downloadIssueRegister(this.site_id,this.selecedChecklist).subscribe(data=>{
  //     const urlCreator = window.URL;
  //     if (urlCreator) {
  //       const url = urlCreator.createObjectURL(data);
  //       const a = document.createElement('a');
  //       document.body.appendChild(a);
  //       a.href = url;
  //       a.download = "IssueRegister" + '.xlsx';
  //       a.click();
  //       a.remove();
  //       window.URL.revokeObjectURL(url);
  //   }
  // },
  //   err=>{});
  }

}
