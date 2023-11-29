import {  Component, ViewChild, OnInit, Inject, Input  } from '@angular/core';
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
import { AreaDialog } from 'app/Dialogs/area/area.component';
import { ImageDialogComponent } from 'app/Dialogs/image-dialog/image-dialog.component';
//import * as saveAs from 'file-saver';
import * as FileSaver from 'file-saver';
import * as toastr from 'toastr';

//import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-checklist-milestone',
  templateUrl: './checklist-milestone.component.html',
  styleUrls: ['./checklist-milestone.component.scss'],
  
  
  
})
export class ChecklistMilestoneComponent implements OnInit {

  @ViewChild('dt') dataTable: DataTable;
  Form: FormGroup
  checklists: any[];
  sites: any[];
  searchTerm: any;
  selectedsite='All';
  ExecutionOKData=[];
  ExecutionNotOKData=[];
  locations = [];
  maintenanceTypes = [];
  selectedLocation='All';
  selectedMaintenanceType:any;
  ExecutionSelectedList=[];
  selectdtab='Not Ok Points';
  Notification: string;
  display = false;
  isSeeHistoryDiv = true;
  selectedRowMilestoneName:any;
  selectedRowQuestionName:any;
  selectedQuestionType:any;
  selectedPMTypeName:any;
  selectedSiteName:any;
  selectedRowSubmitedValu:any;
  selectRowChecklistName:any;
  selectRowQuestionInsId:any;
  selectedrowMinValue:any;
  selectedrowMixValue:any;
  selectedRowDate:any;
  selectImages:any;
  apk_link = "https://mob.suzlon.com/hoto_be/data/Apk/Hoto.apk";
  
  
  

  constructor(public dialog: MdDialog,
    private api_service: ApiService,
    private auth_service: AuthGuard,
    @Inject(DOCUMENT) private document: Document,
    private componentService: CustomComponentsService,
    private router: Router,
    private fb: FormBuilder,
    private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    
   
  ) { }

  ngOnInit() {

    
    this.getAllSite();
   this.getAllMaintenanceTypes();
  

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
 
   // this.getAllModels();
   // this.getPmScheduleBySiteOrModelOrPMType();
  }
  // getPmScheduleBySiteOrModelOrPMType() {
  //   if(this.selectedMaintenanceType===undefined){
  //     this.api_service.getPmScheduleBySiteOrModelOrPMType(this.selectedsite,this.selectedModel,0).subscribe(result => {
  //       debugger;
  //       if (result) {
  //         this.pmScheduleData=result.data;
  //       }
  //     });

  //   }else{
  //   this.api_service.getPmScheduleBySiteOrModelOrPMType(this.selectedsite,this.selectedModel,this.selectedMaintenanceType).subscribe(result => {
  //     debugger;
  //     if (result) {
  //       this.pmScheduleData=result.data;
  //     }
  //   });
  // }
  // }
  getGetExecutionChecklist(){
    debugger;
    this.ExecutionOKData=[];
    this.ExecutionNotOKData=[];
    this.api_service.getGetExecutionChecklistBySiteIdAndLocationAndPMType(this.selectedsite,this.selectedLocation,this.selectedMaintenanceType).subscribe(result => {
      if (result.data) {
        this.ExecutionOKData=result.data[0];
        this.ExecutionNotOKData=result.data[1];
      }
     });
    }
  
  search(): void {
    let term = this.searchTerm;
  }
  getAllSite(): void {
    this.api_service.getAllSite().subscribe(result => {
      debugger;
      if (result) {
        this.sites=result.data;
      }
    });
  }
  getLocation() {
    debugger
    this.api_service.getLocationBySiteId(this.selectedsite).subscribe(result => {
      debugger;
      if (result) {
        this.locations = result.data;
      }
    });
  }

 
  getAllMaintenanceTypes() {
    this.api_service.getAllMaintenanceTypes().subscribe(result => {
      debugger;
      if (result) {
        this.maintenanceTypes = result.data 
      }
    });
  }
  executionSelected(row,$event) {
    debugger;
    if($event.target.checked){
     this.ExecutionSelectedList.push(row.QuestionInsId)
    }else{
      this.ExecutionSelectedList = this.ExecutionSelectedList.filter(number => number !== row.QuestionInsId);
    }
   // this.ExecutionSelectedList[i].saveFlag = true;
  }
  onTabChange(event) {
    debugger
    const isApproveButtonClicked = event.target instanceof Element && event.target.closest('.suzlon-button');
    if(event.target.innerText=="Not Ok Points" || event.target.innerText=="Ok Points"){
    this.selectdtab=event.target.innerText;
    console.log('Selected Tab:', event.target.innerText);
    }
  }
  onNotification(){
    if(this.Notification == "Successfully Send For Correction"){
      this.display = false;
    }
    if(this.Notification == "Failed Send For Correction"){
      this.display = false;
    }
    
    if(this.Notification == "Successfully Updated Question Instance"){
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    }
    if(this.Notification == "Failed Update Question Instance"){
      this.display =false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    }

  }
  SendForCorrection(){
   
   
    this.confirmationService.confirm({
      message: 'Are you sure you want to send for correction ?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        //  var obj: { [k: string]: any } = {};
        //  obj.ExecutionSelectedList = this.ExecutionSelectedList;
        this.api_service.SendForCorrection(this.ExecutionSelectedList).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Successfully Send For Correction', 'Success');
              // this.Notification = 'Successfully Send For Correction';
              // this.display = true;
              this.getGetExecutionChecklist();
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
  openDialogUpdate(rowData){
    debugger;
    this.Form.get('remark').setValue('');
    debugger;
    this.selectedRowMilestoneName=rowData.MilestoneName;
    this.selectedRowQuestionName=rowData.QuestionName;
    this.selectedQuestionType=rowData.OptionType;
    this.selectedRowSubmitedValu=rowData.Result;
    this.selectRowChecklistName=rowData.ChecklistName;
    this.selectRowQuestionInsId=rowData.QuestionInsId;
    this.selectImages=rowData.images;
    

    if(rowData.OptionType==='Value' || rowData.OptionType==='Value/NA'){
      var numbers = rowData.Range.split("-");
      this.selectedrowMinValue = parseInt(numbers[0]);
      this.selectedrowMixValue = parseInt(numbers[1]);
    }
    if(rowData.OptionType==='Date'){
      debugger;
      this.selectedRowDate= this.formatDate(rowData.SubmittedValue);
    // const inputDate = new Date('01-01-2023');
   // const inputDate = new Date('02-02-2023');
    const existingDate = new Date(rowData.SubmittedValue);
    const formattedDate = `${existingDate.getMonth() + 1}-${existingDate.getDate()+1}-${existingDate.getFullYear()}`;
    const inputDate = new Date(formattedDate);
     this.selectedRowDate=inputDate.toISOString().substring(0, 10);
     
      //this.selectedRowDate = inputDate.toLocaleDateString('en-IN');
    }

    this.getSelectedPMTypename();
    this.getSelectedSite();
    this.Form.patchValue({
      name: this.selectedSiteName,
      Location:this.selectedLocation,
      pmType:this.selectedPMTypeName,
      milestone:this.selectedRowMilestoneName,
      selectedRowSubmitedValu:rowData.SubmittedValue,
      checklistName:rowData.ChecklistName,
      minValue:this.selectedrowMinValue,
      mixValue:this.selectedrowMixValue,
      date:this.selectedRowDate
    });
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
   formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getFullYear();
  
    // Ensure leading zeros for day and month if necessary
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  
    return `${formattedDay}-${formattedMonth}-${year}`;
  }
  getSelectedPMTypename(){
    for (const item of this.maintenanceTypes) {
      if (item.Id+"" === this.selectedMaintenanceType) {
          this.selectedPMTypeName = item.PmType1;
          break;
      }
    }
  }
  getSelectedSite(){
    
    for(const item of this.sites){
      if(item.Id+"" === this.selectedsite){
        this.selectedSiteName =item.Site;
      }

    }
  }

  toggleDisplaySeeHistory() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }

  submitForm(){
    debugger;
    // var obj: { [k: string]: any } = {};
    //  obj.QuestionInsId=this.selectRowQuestionInsId;
    //  obj.MilestoneName=this.selectedRowMilestoneName;
    //  obj.QuestionName=this.selectedRowQuestionName;
    var Actual=this.Form.value.selectedRowSubmitedValu;
    var result=this.Form.value.selectedRowSubmitedValu;
    if(this.Form.value.selectedRowSubmitedValu=='NA'){
       result="OK";
    }if(this.selectedQuestionType==='Value' || this.selectedQuestionType==='Value/NA'){
      if(this.Form.value.selectedRowSubmitedValu<=this.selectedrowMixValue && this.Form.value.selectedRowSubmitedValu>=this.selectedrowMinValue){
                result="OK";
      }else{
        result="NOT OK"
      }
    }if(this.selectedQuestionType==='Date'){
      result="OK";
      Actual=this.Form.value.date;
    }
    var obj: { [k: string]: any } = {};
    obj.QuestionInsId=this.selectRowQuestionInsId,
    obj.Result=result,
    obj.Actual=Actual+"",
    obj.Remarks=this.Form.value.remark,
  
     this.api_service.UpdateQuestionInstance(obj).subscribe(
      data => {
        setTimeout(() => {
          toastr.success('Successfully Updated Question Instance', 'Success');
          this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
          // this.Notification = 'Successfully Updated Question Instance';
          // this.display = true;
          this.getGetExecutionChecklist();
        }, 400);
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          toastr.error('Failed Update Question Instance', 'Error');
          // this.Notification = 'Failed Update Question Instance';
          // this.display = true;
        }, 400);
      });
  }
  openDialog(event) {
    debugger
    let dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '640px',
     // height:'800px',
      disableClose:true,
      data: { imageUrl: event.target.currentSrc }, 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if(result == 'submit'){
          
        }
      }
    });
  }
  Download(imagePath){
    
    const fileName = imagePath.split('/').pop() || 'image.jpg';
    debugger;
  
    FileSaver.saveAs("https://httpbin.org/image", "image.jpg");
  }
}

