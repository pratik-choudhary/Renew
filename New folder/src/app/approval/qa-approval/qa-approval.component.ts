import { Component, OnInit } from '@angular/core';
import { ViewChild, Inject, Input } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ChecklistFormDialog } from 'app/Dialogs/checklist_form.component';
import { SectionFormDialog } from 'app/Dialogs/section_form.component';
import { ItemFormDialog } from 'app/Dialogs/item_form.component';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import { FieldConfig } from 'app/models/field-config.interface';
import { EditQuestionDialog } from 'app/Dialogs/edit-question.component';
import { Router } from '@angular/router';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import { MilestoneImportDialog } from 'app/Dialogs/milestone-import/milestone-import-dialog';
import { NewChecklistVersionDialog } from 'app/Dialogs/new-checklist-version-dialog/new-checklist-version-dialog';
import { UploadExcelDialog } from 'app/Dialogs/upload_excel/upload_excel.component';
import { ConfirmDialog } from 'app/Dialogs/confirm-dialog/confirm-dialog';
import { MilestoneDeleteDialog } from 'app/Dialogs/confirm-milestone-delete-dialog/milestone-delete';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DialogModule, DataTable } from 'primeng/primeng';
import { NotificationDialog } from 'app/Dialogs/notification-dialog/notification-dialog';
import { AuthGuard } from 'app/services/auth-guard';
import * as toastr from 'toastr';

@Component({
  selector: 'app-qa-approval',
  templateUrl: './qa-approval.component.html',
  styleUrls: ['./qa-approval.component.scss']
})
export class QAApprovalComponent implements OnInit {
  @ViewChild('dt') dataTable: DataTable;
  Form: FormGroup
  checklists: any[];
  sites: any[];
  searchTerm: any;
  selectedsite = 'All';
  pmScheduleData = [];
  pmScheduleDataApprove = [];
  models = [];
  maintenanceTypes = [];
  selectedModel = 'All';
  selectedMaintenanceType: any;
  selectdtab = 'QA Review';
  jobId: any;
  Notification: string;
  display = false;
  QAApprovalData:any
  isSeeHistoryDiv = true;
  selectedRowChecklistName:any;
  selectedRowlocation:any;
  selectedRowManintenanceType:any;
  selectedRowsite:any;
  selectedRowQuestionName:any;
  selectedQuestionType:any;
  selectImages:any;
  QuestionData:any;
  QuestionIndex:any;
  headerName="Check Point"
  selectedSubmittedValue:any;
  selectedQuestionInstanceId:any;
  HistoryData:any;
  

  constructor(public dialog: MdDialog,
    private api_service: ApiService,
    private auth_service: AuthGuard,
    @Inject(DOCUMENT) private document: Document,
    private componentService: CustomComponentsService,
    private router: Router,
    private fb: FormBuilder,
    private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {
    this.GetQADashboardChecklists();

    this.Form = this.fb.group({
      name: ['', Validators.required],
      Location: ['', Validators.required],
      pmType: ['', Validators.required],
      milestone: ['', Validators.required],
      checklistName:['', Validators.required],
      selectedRowSubmitedValu:['', Validators.required],
      mixValue:[],
      minValue:[],
      date:[Date],
      submittedBy:['MindNerves'],
      submittedDate:['06-11-2023'],
      remark:['', Validators.required],
    })
    this.Form.get('mixValue').disable();
    this.Form.get('minValue').disable();
    
  }

  GetQADashboardChecklists() {
    this.api_service.getQADashboardChecklists().subscribe(result => {
      if (result) {
        this.QAApprovalData = result.data;
      }
    });
  }
  openSections(rowData){
    this.headerName="Check Point"
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    this.selectedRowChecklistName=rowData.ChecklistName;
    this.selectedRowlocation=rowData.FunctionalLocation;
    this.selectedRowManintenanceType=rowData.ChecklistMaintenanceType;
    this.selectedRowsite=rowData.SiteName;
    this.api_service.QuestionInsListByChecklistInsIdAndSiteAndLocationAndPMType(rowData.ChecklistInstanceId,rowData.SiteName,rowData.FunctionalLocation,rowData.ChecklistMaintenanceType).subscribe(result => {
      debugger;
      console.log(result);
      this.QuestionIndex=0;
      this.QuestionData=result.data;
      this.selectedRowQuestionName=result.data[this.QuestionIndex].Question;
      this.selectedQuestionType=result.data[this.QuestionIndex].OptionType;
      this.selectedSubmittedValue=result.data[this.QuestionIndex].SubmittedValue;
      this.selectedQuestionInstanceId=result.data[this.QuestionIndex].QuestionInstanceId
      this.selectImages=result.data[this.QuestionIndex].images;
      this.Form.patchValue({
        name: this.selectedRowsite,
        Location:this.selectedRowlocation,
        pmType:this.selectedRowManintenanceType,
        checklistName:this.selectedRowChecklistName,
      });
    })

  }
  toggleDisplaySeeHistory() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
 


  search(): void {
    let term = this.searchTerm;
  }
  onTabChange(event) {
    debugger
    const isApproveButtonClicked = event.target instanceof Element && event.target.closest('.suzlon-button');
    if (event.target.innerText == "QA Review" || event.target.innerText == "Approvals") {
      this.selectdtab = event.target.innerText;
      console.log('Selected Tab:', event.target.innerText);
    }
  }
  nextQuestion(){
    debugger;
    this.QuestionIndex=this.QuestionIndex + 1;
    this.selectedRowQuestionName=this.QuestionData[this.QuestionIndex].Question;
    this.selectedQuestionType=this.QuestionData[this.QuestionIndex].OptionType;
    this.selectedSubmittedValue=this.QuestionData[this.QuestionIndex].SubmittedValue;
    this.selectedQuestionInstanceId=this.QuestionData[this.QuestionIndex].QuestionInstanceId
    this.selectImages=this.QuestionData[this.QuestionIndex].images;
    this.Form.patchValue({
      name: this.selectedRowsite,
      Location:this.selectedRowlocation,
      pmType:this.selectedRowManintenanceType,
      checklistName:this.selectedRowChecklistName,
    });
  }
  previousQuestion(){
    debugger;
    this.QuestionIndex=this.QuestionIndex - 1;
    this.selectedRowQuestionName=this.QuestionData[this.QuestionIndex].Question;
    this.selectedQuestionType=this.QuestionData[this.QuestionIndex].OptionType;
    this.selectedSubmittedValue=this.QuestionData[this.QuestionIndex].SubmittedValue;
    this.selectedQuestionInstanceId=this.QuestionData[this.QuestionIndex].QuestionInstanceId
    this.selectImages=this.QuestionData[this.QuestionIndex].images;
    this.Form.patchValue({
      name: this.selectedRowsite,
      Location:this.selectedRowlocation,
      pmType:this.selectedRowManintenanceType,
      checklistName:this.selectedRowChecklistName,
    });
  }
  SeeHistory(){
   this.headerName="Check Point History"
   this.api_service.getQuestionHistoryByQuestionInsIdAndSiteAndLocationAndPMType(this.selectedQuestionInstanceId,this.selectedRowsite,this.selectedRowlocation,this.selectedRowManintenanceType).subscribe(result => {
    if (result) {
      this.HistoryData=result.data;
    }
  });
  }
  BackCheckPoint(){
    this.headerName="Check Point"
   }
   SendForCorrection(){
      debugger;
    this.confirmationService.confirm({
      message: 'Are you sure you want to send for correction ?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        //  var obj: { [k: string]: any } = {};
        //  obj.ExecutionSelectedList = this.ExecutionSelectedList;
        var obj: { [k: string]: any } = {};
        obj.QuestionInsId=this.selectedQuestionInstanceId;
        obj.Result="NOT OK";
        obj.Actual="NOT OK";
        obj.Remarks=this.Form.value.remark ;
        this.api_service.SendForCorrectionQA(obj).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Successfully Send For Correction', 'Success');
              // this.Notification = 'Successfully Send For Correction';
              // this.display = true;
              this.GetQADashboardChecklists();
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Failed Send For Correction', 'Error');
              // this.Notification = 'Failed Send For Correction';
              // this.display = true;
            }, 400);
          });
      }
    });

   }
   ConfirmOk(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to confirm ok ?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        //  var obj: { [k: string]: any } = {};
        //  obj.ExecutionSelectedList = this.ExecutionSelectedList;
        var obj: { [k: string]: any } = {};
        obj.QuestionInsId=this.selectedQuestionInstanceId;
        obj.Result="OK";
        obj.Actual="OK";
        obj.Remarks=this.Form.value.remark ;
        this.api_service.SendForCorrectionQA(obj).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Successfully confirm ok', 'Success');
              // this.Notification = 'Successfully Send For Correction';
              // this.display = true;
              this.GetQADashboardChecklists();
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Failed confirm ok', 'Error');
              // this.Notification = 'Failed Send For Correction';
              // this.display = true;
            }, 400);
          });
      }
    });

   }


}

