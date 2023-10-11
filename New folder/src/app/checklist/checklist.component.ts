import { Component, ViewChild, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [ConfirmationService]
})
export class ChecklistComponent implements OnInit {
  // @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild('dt') dataTable: DataTable;
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
  first:number;
  user_info: any;
  currentUser:any;
  loader=true;
  isSeeHistoryDiv = true;
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
    this.first=1;
    
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
    
    if(this.Notification =="Activity Question delete Failed"){
      this.display = false;
    }
    if(this.Notification == "Activity Question deleted Successfully")
    {
      this.display = false;
      if(this.expandFlag==true)
      {
        this.openAllMilestones();
      }
      else
      {
        this.loadSections();
      }
    }
    if(this.Notification =="Question delete Failed"){
      this.display = false;
    }
    if(this.Notification == "Question deleted Successfully")
    {
      this.display = false;
      if(this.expandFlag==true)
      {
        this.openAllMilestones();
      }
      else
      {
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
            setTimeout(()=>{
            this.Notification = "Checklist deleted Successfully";
            this.display = true;
          }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.Notification = "Checklist delete Failed";
            this.display = true;
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
            setTimeout(()=>{
            this.Notification = "Milestone deleted Successfully";
            this.display = true;
          }, 400);
          },
          err => {
            console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.Notification = "Milestone delete Failed";
            this.display = true;
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
        date_flag : false,
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
  openEditDates(checklist){
    var name = checklist.CHECKLIST.NAME;
    let dialogRef = this.dialog.open(ChecklistFormDialog, {
      width: '80vw',
      data: {
        date_flag : true,
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

  openNewChecklistVersionDialog(id: any, version: any, dept: any, model: any, stage_id: number) {
    let dialogRef = this.dialog.open(NewChecklistVersionDialog, {
      width: '30vw',
      data: {
        'current_checklist_id': id,
        'current_checklist_version': version,
        'created_by': this.user_info.user_id,
        'dept_id': dept,
        'model_id': model,
        'stage_id': stage_id
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChecklists();
      }
    });
  }
  publishChecklistStatus(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to publish this Checklist?',
      header: 'Confirmation',
      icon: 'fa fa-info',
      accept: () => {
    var obj: { [k: string]: any } = {};
    obj.STATUS = 'published';
    this.api_service.updateChecklistStatusById(id, obj).subscribe(
      data => {
        setTimeout(() => {
        this.Notification = 'Checklist published Successfully';
        this.display = true;
      }, 400);
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
        this.Notification = 'Checklist publish Failed';
        this.display = true;
      }, 400);
      });
    }});
  }
  createDialog() {
    var length;
   for(var i of this.checklists)
   {
     if(i.CHECKLIST.CHECKLIST_ID==this.selected_checklist_id)
     {
        length = i.CHECKLIST.SECTION_COUNT;
        break;
     }
   }
    let dialogRef = this.dialog.open(SectionFormDialog, {
      width: '70vw',
      data: {
        checklist_id: this.selected_checklist_id,
        sectionsLength:length
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
      width: '70vw',
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
        checklistId: this.selected_checklist_id,
        createdBy: 1
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
  openSections(name: string, id: number, status: any) {
    this.status_of_selected_checklist = status;
    this.document.body.scrollTop = 0;
    this.selected_checklist_id = id;
    this.selected_section_bredcrumb = name;
    this.selectedContent = 'section';
    this.api_service.getSectionByChecklistId(this.selected_checklist_id).subscribe(
      data => {
        this.sections = data;
        this.sectionsCopy = data;
      },
      err => { console.log(err);
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
          err => { console.log(err);
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
        this.sections = data;
        this.sections = this.sort(this.sections, 'MILESTONE_NO');
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  loadChecklists() {
    this.api_service.getAllChecklist().subscribe(
      data => {
        this.checklists = data;
        this.checklistsCopy = data;
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
      });
    this.expandFlag = false;
  }


  getAllChecklists() {
    this.loader=true;
    this.api_service.getAllChecklist().subscribe(
      data => {
        this.loader=false;
        this.checklists = data;
        this.checklistsCopy = data;
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
      });

  }
  ngOnInit() {
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    // load all checklists
    this.getAllChecklists();
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
      err => { console.log(err);
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
  openQuestionDeletePopup(id:number) { //individual
     this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Question?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
         this.api_service.deleteIndividualQuestionById(id).subscribe(
          data => {
          setTimeout(()=>{
              this.Notification  = "Question deleted Successfully";
              this.display = true;
            }, 400);
          },
          err => { console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
              this.Notification  = "Question delete Failed";
              this.display = true;
            }, 400);
          }); 
      }
    }); 

  }
  openGroupQuestionDeletePopup(id:number) { //Activity
     this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this Activity Question?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
         this.api_service.deleteGroupQuestionById(id).subscribe(
          data => {
            setTimeout(()=>{
              this.Notification  = "Activity Question deleted Successfully";
              this.display = true;
            }, 400);
          },
          err => { console.log(err);
            this.api_service.checkStatus(err);
            setTimeout(()=>{
            this.Notification  = "Activity Question delete Failed";
            this.display = true;
          }, 400);
          }); 
        }
    });
  }
  openQuestionEditPopup(section, question) {
    let dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '70vw',
      data: {
        question: question,
        milestone_id: section.SECTION_ID,
        tabs: 'individual',
        checklist_status: section.CHECKLIST_STATUS
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
    let dialogRef = this.dialog.open(EditQuestionDialog, {
      width: '70vw',
      data: {
        milestone_id: section.SECTION_ID,
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
    if (this.expanded_milestone == milestone) {
      this.expanded_milestone = undefined;
    } else {
      this.expanded_milestone = milestone;
      this.checklist_items = [];
      this.api_service.getQuestions(milestone.SECTION_ID).subscribe(
        data => {
          this.checklist_items = data;
          this.checklist_itemsCopy = data;
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
    this.api_service.getQuestions(milestone.SECTION_ID).subscribe(
      data => {
        milestone.CHECKLIST_ITEMS = data;
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
  toggleDisplaySeeHistory(){
    this.isSeeHistoryDiv = !this.isSeeHistoryDiv;
  }
  // end
}
