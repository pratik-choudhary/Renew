import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { QuestionInfoDialog } from 'app/Dialogs/question-info/question-info.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ConfigPopupDialog } from 'app/Dialogs/cofiguration-stage/configuration.component';
import { Stage4CommissioningDialog } from 'app/Dialogs/stage4_commissioning/stage4_commissioning';
import { Stage3ApproveDetails } from 'app/Dialogs/stage3_approve_details/stage3_approve_details';
import { Stage2ApproveDetails } from 'app/Dialogs/stage2_approve_details/stage2_approve_details';
import { Stage7ApproveDetails } from 'app/Dialogs/stage7_approve_details/stage7_approve_details';
import { Stage8ApproveDetails } from 'app/Dialogs/stage8_approve_details/stage8_approve_details';
import { Stage9ApproveDetails } from 'app/Dialogs/stage9_approve_details/stage9_approve_details';
import { Stage6ApproveDetails } from 'app/Dialogs/stage6_approve_details/stage6_approve_details';
import { Stage8Details } from 'app/Dialogs/stage8_details_dialog/stage8_details_dialog';
import { AuthGuard } from 'app/services/auth-guard';
import { LocationStatusDetails } from 'app/Dialogs/location_status_dialog/location_status_dialog.component';
@Component({
  selector: 'app-assign',
  templateUrl: './assignment.component.html',
  styleUrls: ['../assignment.component.scss'],
  providers: [ConfirmationService]
})
export class AssignmentComponent implements OnInit {
  display = false;
  Notification: string;
  cars: any;
  selectedMessage: any;
  message: any;
  milestones: any;
  simplePieData: any;
  simplePieOptions: any;
  single: any;
  schemeType = 'ordinal';
  gradient = false;
  selectedColorScheme: string;
  colorScheme: any;
  colorSets: any;
  view: any;
  multi: any;
  paiChartColor: Array<any>;
  showXAxis: false;
  showYAxis: true;
  location_id: any;
  title_stages: any;
  location_summary: any;
  currentUser: any;
  select_milestone = 0;
  expanded_header = true;
  legendTitle = 'Legend';
  yAxisLabel = 'Department';
  pieChartLabels = ['Ok', 'Not Ok', 'Todo'];
  pieChartData = [];
  pieChartType = 'pie';
  location_notifications: any;
  notifications = [];
  hiddenFlag = [];
  expandFlag: boolean;
  dashboard_view = true;
  //  hideNotifications=[];
  viewNotifications = "Show More";
  commissioningDateFlag = true;
  commissioningDate: Date;
  display_commisioningDate: false;
  configurationQuestions = [];
  forced_cod_flag = false;
  conditional_approve_flag = false;
  stage_instance_id_configuration: any;
  cod_certificate_id: any;
  stage9_complete_flag = false;
  master_checklists: any;
  commissioning_date: any;
  max_stpt_date: any;
  stpt_details = [];
  wtg_checklist_flag = false;
  stageFlag = false;
  selected_checklist: any;
  checklists = [];
  public chartColors: Array<any> = [{ backgroundColor: ['#6e9c6e', '#f57777', '#f9c214'] }];
  constructor(public dialog: MdDialog, private confirmationService: ConfirmationService, private auth_service: AuthGuard, private route: ActivatedRoute, private api_service: ApiService, private router: Router) {
    this.showXAxis = false;
    this.showYAxis = true;
    this.view = [350, 195];
    this.single = [
      {
        name: 'Ok',
        value: 40
      },
      {
        name: 'Not ok',
        value: 30
      },
      {
        name: 'To do',
        value: 20
      }
    ];
    this.message = {
      from: 'P-1',
      date: 1427207139000,
      subject: 'Check out this weeks most popular website designs in the Milkyway!',
      tag: 'Personal',
      type: 'danger',
      important: true,
      id: 1
    };
    this.paiChartColor =
      [
        { // green
          backgroundColor: '#6e9c6e',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: '#6e9c6e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#6e9c6e',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // red
          backgroundColor: '#f57777',
          borderColor: 'rgba(77,83,96,1)',
          pointBackgroundColor: '#f57777',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#f57777',
          pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // amber
          backgroundColor: '#f9c214',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: '#f9c214',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#f9c214',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
      ];
    this.colorSets = [
      {
        name: 'cool',
        selectable: true,
        group: 'Ordinal',
        domain: [
          '#f57777', '#f9c214', '#a27ea8'
        ]
      }
    ];
    this.setColorScheme('cool');
    // multi
    this.multi = [
      {
        name: 'Civil',
        series: [
          {
            name: 'Not Ok',
            value: 40
          },
          {
            name: 'Pending',
            value: 36
          }
        ]
      },
      {
        name: 'Mechanical',
        series: [
          {
            name: 'Not Ok',
            value: 20
          },
          {
            name: 'Pending',
            value: 40
          }
        ]
      },
      {
        name: 'Electrical',
        series: [
          {
            name: 'Not Ok',
            value: 31
          },
          {
            name: 'Pending',
            value: 10
          }
        ]
      }
    ];
    //   this.multi = [...this.multi, multiEntry];

    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
  }
  ngOnInit() {
    this.location_id = this.route.params['_value'].id;
    this.getStagesInsByLocation();
    this.getNotificationsByLocation();
    this.getChecklistsofCurrentStageforChange();
  }

  deleteChecklistInstance(checklist_ins_id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Remove this Checklist ?',
      header: 'Approve Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        this.api_service.deleteChecklistInstance(checklist_ins_id).subscribe(data => {
          if (data == 1) {
            this.Notification = "Checklist removed successfully";
            this.display = true;
          }
          else {
            this.Notification = "The Checklist has filled questions it cannot be removed";
            this.display = true;
          }
        }, err => { });
      }
    });

  }

  add_WTG_checklists() {
    this.api_service.createWTGChecklistInstances(this.location_id).subscribe(data => {
      if (data == 1) {
        this.Notification = "WTG Checklists added successfully";
        this.display = true;
      }
      else {
        this.Notification = "WTG Checklists add failed";
        this.display = true;
      }
      this.refresh();
    }, err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });
  }
  remove_WTG_checklists() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Remove these Questions ?',
      header: 'Approve Confirmation',
      icon: 'fa fa-info',
      accept: () => {


        this.api_service.deleteWTGChecklistInstances(this.location_id).subscribe(data => {
          if (data > 0) {
            this.Notification = "WTG Checklists removed successfully";
            this.display = true;
          }
          else {
            this.Notification = "WTG Checklists remove failed";
            this.display = true;
          }          
          this.refresh();
        }, err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });


      }
    });

  }
  getChecklistsofCurrentStageforChange() {
    this.checklists = [];
    this.api_service.getChecklistForUpdate(this.location_id).subscribe(data => {
      console.log(data);
      for (var item of data) {
        var obj: { [k: string]: any } = {};
        obj.id = item.CHECKLIST_ID;
        obj.name = item.NAME;
        this.checklists.push(obj);
      }
    },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  getNotificationsByLocation() {
    this.api_service.getNotificationByLocation(this.location_id).subscribe(data => {
      this.location_notifications = data;
      if (this.location_notifications.length < 10 || this.location_notifications.length == 10) {
        this.notifications = this.location_notifications;
      }
      if (this.location_notifications.length > 10) {
        this.expandFlag = false;
        for (var i = 0; i < 10; i++) {
          this.notifications[i] = this.location_notifications[i];
        }
      }


    },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }
  getSTPTDetails(stage_ins_id) {
    this.api_service.getStageEightDetails(stage_ins_id).subscribe(data => {
      this.stpt_details = data;
    }, err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });
  }
  getStagesInsByLocation() {
    this.api_service.getStagesInsByLocation(this.location_id).subscribe(data => {
      if (data != null) {
        this.title_stages = data.stages;
        this.location_summary = data.summary;
        for (var i of this.title_stages) {
          this.hiddenFlag.push(false);
        }
        for (var j = 0; j < this.title_stages.length; j++) {
          if (this.title_stages[j].stage.id == 1 && this.title_stages[j].status == 'started') {
            this.wtg_checklist_flag = true;
          }
          if (this.title_stages[j].status == 'completed') {
            this.stageFlag = true;
          }
          if (this.title_stages[j].isConditionalApprove == true && this.title_stages[j].stage.id == 8) {
            this.conditional_approve_flag = true;
            this.forced_cod_flag = true;
          }
          if (this.title_stages[j].stage.id == 9) {
            this.cod_certificate_id = this.title_stages[j].id;
            if (this.title_stages[j].status == 'completed' && this.conditional_approve_flag == false) {
              this.getSTPTDetails(this.title_stages[j].id);
            }
          }
          if (this.title_stages[j].commissioning_date !== null) {
            this.commissioning_date = new Date(this.title_stages[j].commissioning_date);
          }
          //  if(this.title_stages[j].isConditionalApprove == true)
          //  {
          //     this.forced_cod_flag = true;
          //  }
          if (this.title_stages[j].stage.id == 10 && this.title_stages[j].status == 'completed') {
            this.stage9_complete_flag = true;
          }
          if (this.title_stages[j].dept.length > 0) {
            for (var x = 0; x < this.title_stages[j].dept.length; x++) {
              if (this.title_stages[j].dept[x].cheklist_name && this.title_stages[j].dept[x].cheklist_status) {
                //this.title_stages[j].dept[x].cheklist_name = this.title_stages[j].dept[x].cheklist_name.substring(this.title_stages[j].dept[x].cheklist_name.lastIndexOf('_')+1,this.title_stages[j].dept[x].cheklist_name.length);
                if (this.title_stages[j].dept[x].cheklist_status == "inprogress") {
                  this.title_stages[j].dept[x].cheklist_status = "In Progress";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage1-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 1 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage2-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 2 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage3-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 3 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage4-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 4 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage5-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 5 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage6-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 6 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage7-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 7 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage8-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 8 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "stage9-approved") {
                  this.title_stages[j].dept[x].cheklist_status = "Stage 9 Approved";
                }
                if (this.title_stages[j].dept[x].cheklist_status == "not started") {
                  this.title_stages[j].dept[x].cheklist_status = "Not Started";
                }
              }
            }
          }
          if (this.title_stages[j].dept != undefined && this.title_stages[j].dept != null && this.title_stages[j].dept.length == 1) {
            this.pieChartData[j] = [this.title_stages[j].dept[0].oks, this.title_stages[j].dept[0].not_oks, this.title_stages[j].dept[0].todos];
          }
          else
            if (this.title_stages[j].dept == null) {
              this.hiddenFlag[j] = true;
            }
            else
              if (this.title_stages[j].dept.length == 0) {
                this.hiddenFlag[j] = true;
              }
        }
      }
    }, err => {

      console.log(err);
      this.api_service.checkStatus(err);
    });
  }

  toggleNotifications() {
    if (this.location_notifications) {
      if (this.expandFlag == false) {
        this.expandFlag = true;
      }
      else {
        this.expandFlag = false;
      }
      if (this.expandFlag == true) {
        for (var i = 10; i < this.location_notifications.length; i++) {
          this.notifications.push(this.location_notifications[i]);
        }
      }
      else {
        for (var j = this.location_notifications.length - 1; j >= 10; j--) {
          this.notifications.splice(j, 1);
        }
      }
    }
  }

  onSelect(message: any): void {
    this.selectedMessage = message;
  }
  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }
  openQuestionInfo() {
    let dialogRef = this.dialog.open(QuestionInfoDialog, {
      width: '90vw',
      height: '85vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  selectLegend(data) {
    let dialogRef = this.dialog.open(QuestionInfoDialog, {
      width: '90vw',
      height: '85vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  showSelectedMilestones(index) {
    if (this.select_milestone === index) {
      this.select_milestone = 0;
    } else {
      this.select_milestone = index;
    }
  }
  expandeCollapseHeader() {
    this.expanded_header = !this.expanded_header;
  }

  onNotification() {
    if (this.Notification === "Checklist removed successfully") {
      this.display = false;
      this.getStagesInsByLocation();
    }
    if (this.Notification == "The Checklist has filled questions it cannot be removed") {
      this.display = false;
    }
    if (this.Notification == "WTG Checklists removed successfully" || this.Notification == "WTG Checklists remove failed") {
      this.display = false;
    }
    if (this.Notification == 'Stage approved Successfully' || this.Notification == 'Checklist changed successfully' || this.Notification == 'Checklist changed failed') {
      this.display = false;
      this.getStagesInsByLocation();
    }
    if (this.Notification == 'Stage approve Failed' || this.Notification == 'WTG Checklists added successfully' || this.Notification == '') {
      this.display = false;
    }
    if (this.Notification == "Session timed out" || this.Notification == "Internal Server error") {
      this.display = false;
      localStorage.clear();
      this.auth_service.setUserInfo(undefined);
      this.router.navigate(['/session/signin']);
    }

  }

  approveStageTwo(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage2ApproveDetails, {
      width: '60vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  openStage8Details(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage8Details, {
      width: '60vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  getMaxSTPT_date() {
    var max;
    var date;
    max = new Date(this.stpt_details[0].stpt_date);
    for (var i = 1; i < this.stpt_details.length; i++) {
      date = new Date(this.stpt_details[i].stpt_date);
      if (date > max) {
        max = date;
      }
    }
    return max;
  }

  approveStageNine(ev, s) {
    var date_limit;
    ev.stopPropagation();
    if (this.conditional_approve_flag == true && this.commissioning_date != null) {
      date_limit = this.commissioning_date;
    }
    if (this.conditional_approve_flag == false) {
      date_limit = this.getMaxSTPT_date();
    }
    let dialogRef = this.dialog.open(Stage9ApproveDetails, {
      width: '16vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id,
        forced_cod_flag: this.forced_cod_flag,
        min_date: date_limit
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  approveStageThree(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage3ApproveDetails, {
      width: '60vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }

  getSTPTCertificate(ev, s) {
    ev.stopPropagation();
    var vin = window.open("/hoto_be/data/STPT/" + this.cod_certificate_id + ".pdf", "_blank");
    vin.focus();
  }

  approveStageFour(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage4CommissioningDialog, {
      width: '16vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  approveStageEight(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage8ApproveDetails, {
      width: '70vw',
      height: '100vh',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  openLocationStatusDialog(ev) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(LocationStatusDetails, {
      width: '25vw',
      data: {
        location_id: this.location_id,
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  approveStageSeven(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage7ApproveDetails, {
      width: '25vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  approveStageSix(ev, s) {
    ev.stopPropagation();
    let dialogRef = this.dialog.open(Stage6ApproveDetails, {
      width: '50vw',
      data: {
        location_id: this.location_id,
        stage_instance_id: s.id,
        reviewed_by: this.currentUser.user_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "saved successfully") {
        this.getStagesInsByLocation();
      }
    });
  }
  approveStageIns(ev, s) {
    var obj: { [k: string]: any } = {};
    obj.reviewed_by = this.currentUser.user_id;
    if (s.stage.id == 3) {
      this.api_service.getChecklistForStage2().subscribe(
        data => {
          this.master_checklists = data;
          obj.master_checklist_id = this.master_checklists[0].CHECKLIST_ID;
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });
    }
    ev.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Approve this Stage ?',
      header: 'Approve Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        this.api_service.approveStage(this.location_id, s.id, obj).subscribe(data => {
          if (data != null) {
            if (data == "") {
              this.Notification = "Stage approve Failed";
              this.display = true;
            }
            else {
              setTimeout(() => {
                this.Notification = "Stage approved Successfully";
                this.display = true;
                //this.getStagesInsByLocation();
              }, 400);
            }

          }
        },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              this.Notification = "Stage approve Failed";
              this.display = true;
            }, 400);
          });
      }
    });
  }

  //refresh dashboard
  refreshDashboard(ev) {
    ev.stopPropagation();
    this.getStagesInsByLocation();
    this.getNotificationsByLocation();
    this.getChecklistsofCurrentStageforChange();
  }
  refresh() {
    this.getStagesInsByLocation();
    this.getNotificationsByLocation();
    this.getChecklistsofCurrentStageforChange();
  }
  getConfigurationQuestions(s) {
    this.configurationQuestions = [];
    this.api_service.getConfigurationQuestions(s.id).subscribe(data => {
      this.configurationQuestions = [];
      for (var i of data) {
        var obj: { [k: string]: any } = {};
        obj.remark = i.remark;
        obj.question = i.question;
        obj.question_id = i.question_id;
        obj.isFilled = i.isFilled;
        var date = new Date(i.filled_date);
        obj.filled_date = date;
        obj.filled_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();;
        obj.filled_by_name = i.filled_by_name;
        this.configurationQuestions.push(obj);
      }
      var length = this.configurationQuestions.filter(x => x.isFilled == true).length;
      if (length == 3) {
        this.dashboard_view = true;
        this.getStagesInsByLocation();
      }
    }, err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });

  }
  openStageFive(ev, s) {
    this.stage_instance_id_configuration = s;
    this.router.navigate(['configuration', s.id, this.location_id]);
  }
  openConfigurationPopup(index: number) {
    let dialogRef = this.dialog.open(ConfigPopupDialog, {
      width: '40vw',
      data: {
        stage_instance_id: this.stage_instance_id_configuration.id,
        question: this.configurationQuestions[index],
        user: this.currentUser
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result == "saved successfully";
        this.getConfigurationQuestions(this.stage_instance_id_configuration);
      }
    });
  }

  uncheckQuestion(i) {
    var obj: { [k: string]: any } = {};
    obj.remark = "";
    obj.question_id = this.configurationQuestions[i].question_id;
    obj.isFilled = false;
    this.api_service.updateConfigurationQuestions(this.stage_instance_id_configuration.id, obj).subscribe(
      data => {
        this.getConfigurationQuestions(this.stage_instance_id_configuration);
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  changeChecklist() {
    console.log("select checklist is -->" + this.selected_checklist);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to change checklist ?',
      header: 'Approve Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        this.api_service.updateExistingChecklist(this.selected_checklist, this.location_id).subscribe(data => {
          console.log(data);
          if (data == 1) {
            this.Notification = "Checklist changed successfully";
            this.display = true;
          }
          else {
            this.Notification = "Checklist changed failed";
            this.display = true;
          }
        },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
          });
      }
    });
  }
}
