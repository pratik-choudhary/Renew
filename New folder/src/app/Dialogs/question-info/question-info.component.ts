import {Component, Inject, OnInit} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import  { ApiService } from 'app/services/api.service';
import { Router } from '@angular/router';
import { DialogModule, DataTable } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
@Component({
  selector: 'app-question-info',
  templateUrl: './question-info.html',
  styleUrls: ['./question-info.scss']
})

export class QuestionInfoDialog implements OnInit {
  selected_question: any;
  active_tab: any;
  milestone: any;
  milestone_name: string;
  milestone_id: any;
  milestone_no:any;
  modelName="Question Details";
  history: any;
  Notification:string;
  display = false;
  is_wtg = false;
  department_id:any;
  constructor(
    public dialogRef: MdDialogRef<QuestionInfoDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private api_service: ApiService,
    private router:Router,
    private auth_service:AuthGuard
  )
  {
      this.history = [];
      this.active_tab = 0;
      this.selected_question = undefined;
      console.log(this.data.department_id);
      if(this.data.department_id)
      {
        this.department_id = this.data.department_id;
      }
      if(this.data.wtg)
      {
        this.is_wtg = this.data.wtg;
      }
      if (this.data.milestone) {
        if (this.data.milestone.milestone) {
          
           this.milestone_no = this.data.milestone.milestone.MILESTONE_NO;
           this.milestone_name = this.data.milestone.milestone.NAME;
           this.milestone_id = this.data.milestone.id;
        }
       }
  }
  ngOnInit(): void {
  }

  onNotification()
  {
      this.display = false;
      localStorage.clear();
      this.auth_service.setUserInfo(undefined);
      this.router.navigate([ '/session/signin' ]); 
  }


  selectQuestion(row) {
     this.api_service.getQuestionHistory(row.QUESTION_ID).subscribe(
        data => {
           this.selected_question = row;
           this.active_tab = 1;
           this.history = data;
        },
        err => {
          console.log(err);
          if(err.status == 401)
          {
            this.closeDialog();
            setTimeout(()=>{
            this.api_service.checkStatus(err);
            }, 1000);
          }
      });
  }
  closeDialog() {
    this.dialogRef.close(true);
  }
}
