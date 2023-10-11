import { ElementRef, ViewChild,Component, Inject, EventEmitter, Output,OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthGuard } from 'app/services/auth-guard';
import { ConfigPopupDialog } from 'app/Dialogs/cofiguration-stage/configuration.component';
@Component({
    selector: 'app-configuration_question',
    templateUrl: './configuration_question.component.html',
    providers: [ConfirmationService]
})

export class Configuration_question implements OnInit {
    currentUser:any;
    configurationQuestions=[];
    stage_ins:any;
    sub:any;
    location:any;
    constructor(public dialog: MdDialog, private confirmationService: ConfirmationService,private auth_service: AuthGuard, private route: ActivatedRoute, private api_service: ApiService,private router: Router) 
    {}
  
    ngOnInit()
    {
        this.currentUser = this.auth_service.getUserInfo();
        this.currentUser.role = this.currentUser.role.toString().toLowerCase();    
        this.stage_ins = this.route.params['_value'].stage;
        this.location = this.route.params['_value'].location;
        this.getConfigurationQuestions(this.stage_ins);
    }
    getConfigurationQuestions(id)
  {
    this.configurationQuestions = [];
    this.api_service.getConfigurationQuestions(id).subscribe(data => { 
      this.configurationQuestions = [];
      for(var i of data)
      {
       var obj: {[k: string]: any} = {};
       obj.remark = i.remark;
       obj.question = i.question;
       obj.question_id = i.question_id;
       obj.isFilled = i.isFilled;
       var date  =  new Date(i.filled_date);
       obj.filled_date = date;
       obj.filled_time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();;
       obj.filled_by_name = i.filled_by_name;
       this.configurationQuestions.push(obj);
      }
   },err => {
      console.log(err);
      this.api_service.checkStatus(err);
   });
 
  }

    openConfigurationPopup(index:number) {
        let dialogRef = this.dialog.open(ConfigPopupDialog, {
          width: '40vw',
          data:{
            stage_instance_id:this.stage_ins,
            question : this.configurationQuestions[index],
            user: this.currentUser
          },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            result == "saved successfully";
            this.getConfigurationQuestions(this.stage_ins);
          }
        });
      }
    
      uncheckQuestion(i)
      {
        var obj: {[k: string]: any} = {};
        obj.remark = "";
        obj.question_id = this.configurationQuestions[i].question_id;
        obj.isFilled = false;
        this.api_service.updateConfigurationQuestions(this.stage_ins,obj).subscribe(
        data => {
          this.getConfigurationQuestions(this.stage_ins);
        },
        err =>{
          console.log(err);
          this.api_service.checkStatus(err);
        });
      }
      goToDashboard()
      {
          this.router.navigate(['site-dashboard/location', this.location]);
      }
}
