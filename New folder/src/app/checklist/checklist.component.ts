import { Component, ViewChild, OnInit, Inject, Input } from '@angular/core';
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
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [ConfirmationService]
})
export class ChecklistComponent implements OnInit {
  // @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild('dt') dataTable: DataTable;
  checklistForm: FormGroup
  display = false;
  Notification: string;
  json: any;
  model: any;
  componentData = null;
  selectedOption: string;
  selected_checklist_id: number;
  selected_section_bredcrumb: string;
  selected_item_bredcrumb: string;
  departments = [];
  checklists: any[];
  checklistsCopy: any[];
  sections: any;
  sectionsCopy: any;
  selectedContent = 'checklist';
  checklist_items: any;
  checklist_itemsCopy: any;
  selectes_section_id: number;
  //selectedMessage: Message;
  previousValid: any;
  current_options: any;
  add_question_panel: boolean;
  hidden_question: any;
  expanded_milestone: any;
  question_model: string;
  expandFlag = false;
  cars: any;
  status_of_selected_checklist: any;
  statusValue: string;
  departments_checklists: any;
  searchTerm: any;
  searchTermMilestone: any;
  searchTermQuestion: any;
  searchTermQuestionExpanded = [];
  questionsArray: any;
  public form: FormGroup;
  hideme = [];
  first: number;
  user_info: any;
  currentUser: any;
  loader = true;
  isSeeHistoryDiv = true;
  isAddMoreflag = false;

  allTurbineTypes = [];
  allOEMTypes = [];
  models = [];
  maintenanceTypes = [];
  category1s = [];
  category2s = [];
  category3s = [];
  selectedMaintenanceType: any;
  selectedModel: any;
  formSubmitted: boolean = false;
  // expand row
  // Declare a mapping between action ids and their event listener
  myActions = {
    'alert': (property) => { alert(JSON.stringify(property.value)) },
    'reset': (property) => { property.reset(); }
  };
  config: FieldConfig[] = [
  ];


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
  ) {
    //role management
    this.user_info = this.auth_service.getUserInfo();
    if (this.user_info) {
      if (this.user_info.role.toUpperCase() !== 'ADMIN' && this.user_info.role.toUpperCase() !== 'SITE_MIS' && this.user_info.role.toUpperCase() !== 'PM' && this.user_info.role.toUpperCase() !== 'QA') {
        this.router.navigate(['/site-dashboard']);
      }
    }

    this.iconRegistry.addSvgIcon(
      'plus-circle',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
    this.iconRegistry.addSvgIcon(
      'plus-circle-blue',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle-blue.svg'));
    this.iconRegistry.addSvgIcon(
      'pencil',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/pencil.svg'));
    this.iconRegistry.addSvgIcon(
      'delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/delete.svg'));
    this.sections = [];
    this.question_model = 'question';
    this.expanded_milestone = undefined;
    this.loadQuestions();
    this.statusValue = "Draft";
    this.status_of_selected_checklist = "draft";
    this.first = 1;

  }
  private onDrop(args) {
    let [e, el] = args;
    // do something
  }



  search(): void {
    let term = this.searchTerm;
    this.checklists = this.checklistsCopy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.CHECKLIST.NAME)) {
        return tag.CHECKLIST.NAME;
      }
      if (regex.test(tag.CHECKLIST.MODEL.name)) {
        return tag.CHECKLIST.MODEL.name;
      }
      if (regex.test(tag.CHECKLIST.VERSION)) {
        return regex.test(tag.CHECKLIST.VERSION);
      }
      if (regex.test(tag.CHECKLIST.DEPARTMENT.name)) {
        return regex.test(tag.CHECKLIST.DEPARTMENT.name);
      }
    });
  }

  searchMilestone(): void {
    let term = this.searchTermMilestone;
    this.sections = this.sectionsCopy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.NAME)) {
        return tag.NAME;
      }
    });
  }
  searchQuestions(): void {
    let term = this.searchTermQuestion;
    this.checklist_items = this.checklist_itemsCopy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.QUESTION)) {
        return tag.QUESTION;
      }

    });
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  searchQuestionsExpanded(i: number) {
    let term = this.searchTermQuestionExpanded[i];
    this.sections[i].CHECKLIST_ITEMS = this.sectionsCopy[i].CHECKLIST_ITEMS.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.QUESTION)) {
        return tag.QUESTION;
      }
    });
    if (term == "") {
      for (var j of this.sections)
        this.openMilestoneExpanded(j);
    }

  }

  openDialog() {
    
    this.checklistForm = this.fb.group({
      name: ['', Validators.required],
      turbineType: ['', Validators.required],
      OEMType: ['', Validators.required],
      model: ['', Validators.required],
      maintenanceType: ['', Validators.required],
      revisionNumber: [1],
      modelfilter: [''],
      manintenancetypefilter: [''],
      categorys: this.fb.array([]),
    })
    this.addCategoryGroup();
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    // let dialogRef = this.dialog.open(ChecklistFormDialog, {
    //   width: '60vw',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadChecklists();
    //   }
    // });
  }
  openNotificationDialog(msg: string) {
    let dialogRef = this.dialog.open(NotificationDialog, {
      width: '70vw',
      data: msg,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChecklists();
      }
    });
  }

  onNotification() {
    if(this.Notification == "Checklist Added Successfully"){
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    }
    if(this.Notification == "Checklist Add Failed"){
      this.display = false;
      this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
    }

    if (this.Notification == "Activity Question delete Failed") {
      this.display = false;
    }
    if (this.Notification == "Activity Question deleted Successfully") {
      this.display = false;
      if (this.expandFlag == true) {
        this.openAllMilestones();
      }
      else {
        this.loadSections();
      }
    }
    if (this.Notification == "Question delete Failed") {
      this.display = false;
    }
    if (this.Notification == "Question deleted Successfully") {
      this.display = false;
      if (this.expandFlag == true) {
        this.openAllMilestones();
      }
      else {
        this.loadSections();
      }
    }
    if (this.Notification == 'Checklist published Successfully') {
      this.display = false;
      this.loadChecklists();
    }
    if (this.Notification == 'Checklist deleted Successfully') {
      this.display = false;
      this.loadChecklists();
    }
    if (this.Notification == 'Checklist delete Failed') {
      this.display = false;
    }
    if (this.Notification == 'Checklist publish Failed') {
      this.display = false;
    }
    if (this.Notification == 'Milestone deleted Successfully') {
      this.display = false;
      this.loadSections();
    }
    if (this.Notification == 'Milestone delete Failed') {
      this.display = false;
    }

  }

  openConfirmDeleteDialog(checklist) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Checklist?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.api_service.deleteChecklistById(checklist.CHECKLIST.CHECKLIST_ID).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Checklist Deleted Successfully', 'Success');
              
              //this.Notification = "Checklist deleted Successfully";
             // this.display = true;
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Checklist Delete Failed', 'Error');
             // this.Notification = "Checklist delete Failed";
             // this.display = true;
            }, 400);
          });
      }
    });
  }

  deleteMilestoneDialog(section) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Milestone?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.api_service.deleteMilestoneById(section.SECTION_ID).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Milestone Deleted Successfully', 'Success');
              //this.Notification = "Milestone deleted Successfully";
              //this.display = true;
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Milestone Delete Failed', 'Error');
              //this.Notification = "Milestone delete Failed";
              //this.display = true;
            }, 400);
          });
      }
    });
    //delete Milestone function
  }
  openEditDialog(checklist) {

    var name = checklist.CHECKLIST.NAME;
    let dialogRef = this.dialog.open(ChecklistFormDialog, {
      width: '80vw',
      data: {
        date_flag: false,
        checklist: checklist
      },
      disableClose: true

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChecklists();
      }
    });
  }
  openEditDates(checklist) {
    var name = checklist.CHECKLIST.NAME;
    let dialogRef = this.dialog.open(ChecklistFormDialog, {
      width: '80vw',
      data: {
        date_flag: true,
        checklist: checklist
      },
      disableClose: true

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChecklists();
      }
    });
  }
  openImportMilestoneDialog() {
    let dialogRef = this.dialog.open(MilestoneImportDialog, {
      width: '70vw',
      data: {
        'current_checklist_id': this.selected_checklist_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  }

  openNewChecklistVersionDialog(id: any, version: any, model: any,status: any) {
    if(status=='Published'){
    let dialogRef = this.dialog.open(NewChecklistVersionDialog, {
      width: '30vw',
      data: {
        'current_checklist_id': id,
        'current_checklist_version': version,
        'created_by': this.user_info.user_id,
        'model_id': model,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChecklists();
      }
    });
  }else if(status=='Draft'){
    this.publishChecklistStatus(id,version);
  }
  }
  publishChecklistStatus(id,version) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to publish this Checklist?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
        // var obj: { [k: string]: any } = {};
        // obj.STATUS = 'published';
        this.api_service.createNewChecklistVersion(id,version).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Checklist Published Successfully', 'Success');
              //this.Notification = 'Checklist published Successfully';
              //this.display = true;
              this.loadChecklists();
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Checklist Publish Failed', 'Error');
            //  this.Notification = 'Checklist publish Failed';
             // this.display = true;
            }, 400);
          });
      }
    });
  }
  createDialog() {
    var length;
    for (var i of this.checklists) {
      if (i.CHECKLIST.CHECKLIST_ID == this.selected_checklist_id) {
        length = i.CHECKLIST.SECTION_COUNT;
        break;
      }
    }
    let dialogRef = this.dialog.open(SectionFormDialog, {
      width: '40vw',
      data: {
        checklist_id: this.selected_checklist_id,
        sectionsLength: length
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  }
  editDialog(data) {
    let dialogRef = this.dialog.open(SectionFormDialog, {
      width: '40vw',
      data: {
        checklist_id: this.selected_checklist_id,
        parentInput: data
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  }


  openCreateItemDialog() {
    let dialogRef = this.dialog.open(ItemFormDialog, {
      width: '70vw',
      data: {
        section_id: this.selectes_section_id
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.current_options = result.OPTIONS;
      } else {
      }
    });
  }
  uploadExcelDialog() {
    let dialogRef = this.dialog.open(UploadExcelDialog, {
      width: '500px',
      data: {
        sheetName:"Import Checklist Excel",
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.loadSections();
        }, 1200);
      }
    });
  }
  downloadTemplate(){
    this.api_service.downloadTemplate("cheklistTemplate.xlsx").subscribe((response: any) => {
        debugger;
      
      },
      err => {
        this.api_service.checkStatus(err);
      });
  }
  openSections(name: string, id: number, status: any) {
    debugger;
    this.status_of_selected_checklist = status;
    this.document.body.scrollTop = 0;
    this.selected_checklist_id = id;
    this.selected_section_bredcrumb = name;
    this.selectedContent = 'section';
    this.api_service.getSectionByChecklistId(this.selected_checklist_id).subscribe(
      data => {
        debugger;
        this.sections = data.data;
        this.sectionsCopy = data.data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  openItems(checklist: any, section: any) {
    this.document.body.scrollTop = 0;
    this.selected_section_bredcrumb = checklist.CHECKLIST.NAME;
    this.selected_item_bredcrumb = section.NAME;
    this.selectedContent = 'item';
    this.selectes_section_id = section.SECTION_ID;
    this.getItems(section.SECTION_ID);
  }
  openItemsFromSection(section: any) {
    this.document.body.scrollTop = 0;
    this.selected_item_bredcrumb = section.NAME;
    this.selectedContent = 'item';
    this.selectes_section_id = section.SECTION_ID;
    this.getItems(section.SECTION_ID);
  }

  //function for sorting sections by miletone no
  sort(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }


  generateChecklistsByDepartment(data: any) {
    for (var i of data) {
      this.checklists.push(i);
      this.checklistsCopy.push(i);
    }
  }
  getChecklistsByDepartment() {
    this.checklists = [];
    this.checklistsCopy = [];
    var i;
    for (i = 0; i < this.departments.length; i++) {
      if (this.departments[i].selected == true) {

        this.api_service.getAllChecklistDetailsByDept(this.departments[i].id).subscribe(
          data => {
            this.generateChecklistsByDepartment(data);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
          });
      }
    }
    for (i = 0; i < this.departments.length; i++) {
      if (this.departments[i].selected == false) { }
      else {
        break;
      }
    }
    if (i == this.departments.length) {
      this.getAllChecklists();
    }
  }
  removeDepartmentFilter() {
    for (var i of this.departments) {
      i.selected = false;
    }
    this.getAllChecklists();
  }

  selectDepartments(id: any) {
    for (var i = 0; i < this.departments.length; i++) {
      if (this.departments[i].id == id) {
        if (this.departments[i].selected == false) {
          this.departments[i].selected = true;
        }
        else {
          this.departments[i].selected = false;
        }

      }
    }
    this.getChecklistsByDepartment();
  }


  loadSections() {
    this.api_service.getSectionByChecklistId(this.selected_checklist_id).subscribe(
      data => {
        debugger;
        this.sections = data.data;
        this.sections = this.sort(this.sections, 'MILESTONE_NO');
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  loadChecklists() {
    this.api_service.getAllChecklistByModelIdAndPMType(this.selectedModel, this.selectedMaintenanceType).subscribe(
      data => {
        

        this.checklists =data.data;
        this.checklistsCopy = data.data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
    this.expandFlag = false;
  }


  getAllChecklists() {
    this.loader = false;
    this.api_service.getAllChecklistByModelIdAndPMType(this.selectedModel, this.selectedMaintenanceType).subscribe(
      data => {
      


        this.checklists = data.data;
        this.checklistsCopy = data.data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }
  ngOnInit() {

    this.checklistForm = this.fb.group({
      name: ['', Validators.required],
      turbineType: ['', Validators.required],
      OEMType: ['', Validators.required],
      model: ['', Validators.required],
      maintenanceType: ['', Validators.required],
      revisionNumber: [1],
      modelfilter: [''],
      manintenancetypefilter: [''],
      // category1:['', Validators.required],
      // category2:['', Validators.required],
      // category3:['', Validators.required],
      categorys: this.fb.array([]),
    })
    this.addCategoryGroup();
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    // load all checklists

    this.getAllTurbineType();
    this.getAllOEMTypes();
    this.getAllModels();
    this.getAllMaintenanceTypes();
    this.getCategory1s();
    // load all departments
    this.api_service.getAllDepartments().subscribe(
      data => {
        for (var i of data) {
          var obj: { [k: string]: any } = {};
          obj.id = i.id;
          obj.name = i.name;
          obj.status = i.status;
          obj.selected = false;
          this.departments.push(obj);
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });



    this.form = this.fb.group({
      QUESTION: [null, Validators.required],
      SPECIFICATION: [null, Validators.required],
      ACTUAL: [''],
      PHOTO: [false],
      OPTION_TYPE: ['radio', Validators.required],
      CRITICALITY: ['high', Validators.required],
      OPTIONS: []
    });

  }

  getAllTurbineType() {
    this.api_service.getAllTurbineType().subscribe(result => {
      debugger;
      if (result) {
        this.allTurbineTypes = result.data;
      }
    });
  }
  getAllOEMTypes() {
    this.api_service.getAllOEMTypes().subscribe(result => {
      debugger;
      if (result) {
        this.allOEMTypes = result.data;
      }
    });
  }
  getAllModels() {
    this.api_service.getAllModels().subscribe(result => {
      debugger;
      if (result) {
        this.models = result.data;
        this.selectedModel = this.models[0];
      }
    });
  }
  getAllMaintenanceTypes() {
    this.api_service.getAllMaintenanceTypes().subscribe(result => {
      debugger;
      if (result) {
        this.maintenanceTypes = result.data;
        this.selectedMaintenanceType = this.maintenanceTypes[0].Id;
        this.getAllChecklists();
      }
    });
  }
  getCategory1s() {
    this.api_service.getAllCategory1s().subscribe(result => {
      debugger;
      if (result) {
        this.category1s = result.data;
      }
    });
  }
  getAllCategory2s(event, index) {
    debugger;
    this.api_service.getAllCategory2s(event.target.value).subscribe(result => {
      if (result) {
        this.category2s[index] = result.data;
      }
    });
  }
  getAllCategory3s(event, index) {
    // this.category3s=[];
    var categroy1 = this.checklistForm.controls.categorys.value[index].category1
    var categroy2 = event.target.value
    if (categroy1.length > 0 && categroy2.length) {
      this.api_service.getAllCategory3s(categroy1, categroy2).subscribe(result => {
        if (result) {
          debugger;
          this.category3s[index] = result.data;
        }
      });
    }
  }
  submitUserForm() {
    this.formSubmitted = true 
    debugger;
    if (this.checklistForm.status === "VALID") {
      var obj = {
        // "checklisT_ID": 0,
        "name": this.checklistForm.value.name,
        "oem": this.checklistForm.value.OEMType,
        "maintenance_Type": this.checklistForm.value.maintenanceType,
        "modelName": this.checklistForm.value.model,
        "revisionNumber": this.checklistForm.value.revisionNumber + "",
        "turbineTypeId": this.checklistForm.value.turbineType,
        "categoryList": this.checklistForm.value.categorys,
        "checkedBy": ""
      }
      this.api_service.createCheckList(obj).subscribe(result => {
        setTimeout(() => {
          toastr.success('Checklist Added Successfully', 'Success');
         // this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
         // this.Notification = 'Checklist Added Successfully';
          this.formSubmitted = false
          this.checklistForm = this.fb.group({
            name: ['', Validators.required],
            turbineType: ['', Validators.required],
            OEMType: ['', Validators.required],
            model: ['', Validators.required],
            maintenanceType: ['', Validators.required],
            revisionNumber: [1],
            modelfilter: [''],
            manintenancetypefilter: [''],
            categorys: this.fb.array([]),
          })
          this.addCategoryGroup();
         // this.display = true;
          this.isSeeHistoryDiv=false
        }, 400);
        err => {
          console.log(err);
          if (err.status == 401) {
            //this.closeDialog();
            setTimeout(() => {
              this.api_service.checkStatus(err);
            }, 1000);
          }
          else {
            setTimeout(() => {
              toastr.error('Checklist Add Failed', 'Error');
             // this.Notification = 'Checklist Add Failed';
             // this.display = true;
            }, 400);
          }
        }
      })
    }else{
      // for (const controlName in this.checklistForm.controls) {
      //   if (this.checklistForm.controls.hasOwnProperty(controlName)) {
      //     const control = this.checklistForm.controls[controlName];
          
      //     if (control.status== "INVALID") {
      //       control.markAsDirty();
      //       control.updateValueAndValidity({ onlySelf: true });
      //     }
      //   }
      // }
    }
  }
  

  addCategoryGroup() {
    const categoryGroup = this.fb.group({
      category1: ['', Validators.required],
      category2: ['', Validators.required],
      category3: ['', Validators.required]
    });
    this.categoryGroups.push(categoryGroup);
  //  this.category1s.push([]);
    this.category2s.push([]);
    this.category3s.push([]);
  }
  removeCategoryGroup(){
    debugger
    var index=this.categoryGroups.length-1;
    if(index!=0){
    this.categoryGroups.removeAt(index);
    }
  }

  get categoryGroups() {
    return this.checklistForm.get('categorys') as FormArray;
  }


  getItems(id: number): void {
    // get checklist items
    // this.api_service.getQuestions().subscribe(
    //   data => {
    //     this.checklist_items = data;
    //   },
    //   err => { console.log(err) });

    this.add_question_panel = undefined;
    // render forms
    this.form = this.fb.group({
      QUESTION: [null, Validators.required],
      SPECIFICATION: [null, Validators.required],
      ACTUAL: [''],
      PHOTO: [false],
      OPTION_TYPE: ['radio', Validators.required],
      CRITICALITY: ['high', Validators.required],
      OPTIONS: []
    });
    setTimeout(() => {
    }, 100);
  }
  // onSelect(message: Message): void {
  //   this.selectedMessage = message;
  // }
  submit() {
  }
  createTemplate() {
  }
  createQuestion() {

  }
  updateQuestion(id: number) {
    if (this.form['_status'] == 'VALID') {
      this.hideQuestionPanel();
      this.api_service.updateQuestion(id, this.form['_value']).subscribe(
        data => {
          this.loadQuestions();
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });
    }
  }
  showQuestionPanel() {
    this.add_question_panel = true;
    this.hidden_question = undefined;
  }
  hideQuestionPanel() {
    this.add_question_panel = false;
    this.hidden_question = undefined;
  }
  editQuestion(question) {
    this.add_question_panel = false;
    this.hidden_question = question;
    this.form.patchValue(question);
  }
  loadQuestions() {
  }
  openQuestionDeletePopup(id: number) { //individual
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Question?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.api_service.deleteIndividualQuestionById(id).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Question Deleted Successfully', 'Success');
             // this.Notification = "Question deleted Successfully";
             // this.display = true;
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Question Delete Failed', 'Error');
             // this.Notification = "Question delete Failed";
              //this.display = true;
            }, 400);
          });
      }
    });

  }
  openGroupQuestionDeletePopup(id: number) { //Activity
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Activity Question?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.api_service.deleteGroupQuestionById(id).subscribe(
          data => {
            setTimeout(() => {
              toastr.success('Activity Question deleted Successfully', 'Success');
              //this.Notification = "Activity Question deleted Successfully";
             // this.display = true;
            }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(() => {
              toastr.error('Activity Question Delete Failed', 'Error');
              //this.Notification = "Activity Question delete Failed";
             // this.display = true;
            }, 400);
          });
      }
    });
  }
  openQuestionEditPopup(section, question) {
    debugger;
    let dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '70vw',
      data: {
        question: question,
        milestone_id: section.Id,
        tabs: 'individual',
        checklist_status: section.Status
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  }
  openQuestionPopup(section) {
    debugger;
    let dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '70vw',
      data: {
        milestone_id: section.Id,
        tabs: 'both'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  }
  openMilestone(milestone) {
    debugger;
    if (this.expanded_milestone == milestone) {
      this.expanded_milestone = undefined;
    } else {
      this.expanded_milestone = milestone;
      this.checklist_items = [];
      this.api_service.getQuestions(milestone.Id).subscribe(
        data => {
          debugger;
          this.checklist_items = data.data;
          this.checklist_itemsCopy = data.data;
        },
        err => {
          this.checklist_items = [];
          console.log(err);
          this.api_service.checkStatus(err);
        });
    }
  }

  collapseMilestones() {
    this.expandFlag = false;
    this.hideme = [];
  }

  openMilestoneExpanded(milestone) {
    debugger;
    this.api_service.getQuestions(milestone.Id).subscribe(
      data => {
        debugger;
        milestone.CHECKLIST_ITEMS = data.data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  openAllMilestones() {
    this.expandFlag = true;
    for (var i of this.sections) {
      this.openMilestoneExpanded(i);
      this.hideme.push(i);

    }
    this.sectionsCopy = this.sections;
  }

  saveEditable(ev, row) {
    this.api_service.updateQuestion(row.QUESTION_ID, row).subscribe(
      data => {
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  addGroupTemplateInActivity(section, row) {
    let dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '70vw',
      data: {
        milestone_id: section.SECTION_ID,
        activity_id: row.ACTIVITY_ID,
        tabs: 'group'
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSections();
      }
    });
  };
  toggleDisplaySeeHistory() {
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
  isAddMore() {
    this.isAddMoreflag = true;
  }
  // end
}
