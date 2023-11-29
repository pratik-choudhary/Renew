import { Component, Output, EventEmitter, Input, Inject ,ElementRef,Renderer2,ViewChild} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { ChecklistComponent } from 'app/checklist/checklist.component';
import { MilestoneInsForm } from 'app/custom_components/milestone-ins/milestone-ins.component';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import {ValidationService} from 'app/services/validation.service';
import { AuthGuard } from 'app/services/auth-guard';
import {ChecklistFormDialog} from 'app/Dialogs/checklist_form.component';
@Component({
  selector: 'checklist-add-form',
  templateUrl: './checklist-add-form.html',
})

export class ChecklistAddForm {
  currentUser:any;
  modelName: string;
  stages: any;
  statusdata: any;
  departments: any;
  departmentsCopy:any;
  display = false;
  disable_model = false;
  Notification: any;
  config: MdSnackBarConfig;
  public form: FormGroup;
  selectedDepartment: any;
  @Input() parentInput: any;
  milestone_no: any;
  milestone_name: any;
  modelList: any;
  milestone_forms = [];
  milestone_array = [];
  editChecklist: boolean;
  edit_milestone_no=[];
  edit_name=[];
  edit_id=[];
  milestones=[];
  checklistName:any;
  checklists=[];
  index:number;
  sections:any;
  feederStageFlag:boolean;
  selectModel:any;
  is_prerequisite=false;
  is_imic=false;
  pqhc_flag= false;
  edit_date = false;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() title: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('modelDD') el:ElementRef;
  @ViewChild('version') version_box : ElementRef;
  @ViewChild('name') name_box : ElementRef; 
  @ViewChild('stage') stage_box:ElementRef;
  @ViewChild('status') status_box:ElementRef;
  @ViewChild('docdate') doc_date:ElementRef;
  constructor(private api_service: ApiService, private fb: FormBuilder, @Inject(MD_DIALOG_DATA) public data: any, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef, private auth_service: AuthGuard, private validation_service:ValidationService,public dialogRef: MdDialogRef<ChecklistFormDialog>) {

    this.departments = [];
    this.stages = [];
    this.statusdata = [];
    this.currentUser = this.auth_service.getUserInfo();
  }
  ngOnInit() {
    this.loadDept();
    this.feederStageFlag = false;
    this.editChecklist = true;
    this.getModules();
    this.getChecklists();
    this.modelName = "Create New Checklist";
    this.title.emit(this.modelName);

    this.form = this.fb.group({
      NAME: [null, Validators.required],
      MODEL: [null, Validators.required],
      VERSION: ['0', Validators.required],
      DEPARTMENT: [null, Validators.required],
      STAGE: [null, Validators.required],
      STATUS:[null, Validators.required],
      document_name:[null,Validators.required],
      document_date:[null,Validators.required]
    });


    if (this.data) {
      setTimeout(()=>{    
      this.loadSections(this.data.checklist.CHECKLIST.CHECKLIST_ID);
      this.form.controls.NAME.setValidators([Validators.required]);
      this.form.controls.NAME.updateValueAndValidity();
      this.modelName = "Edit Checklist";
      this.title.emit(this.modelName);
      var obj: { [k: string]: any } = {};
      console.log(this.data);
      if(this.data.date_flag == true)
      {
        this.edit_date = true;
        this.name_box.nativeElement.disabled = true;
        this.stage_box.nativeElement.disabled = true;
        this.status_box.nativeElement.disabled = true;
        this.el.nativeElement.disabled = true;
      }
      this.checklistName = this.data.checklist.CHECKLIST.NAME;
      this.checklistName = this.checklistName.substring(this.checklistName.lastIndexOf('_')+1,this.checklistName.length);
      obj.NAME = this.checklistName.substring(this.checklistName.lastIndexOf('_')+1,this.checklistName.length);
      obj.MODEL = this.data.checklist.CHECKLIST.MODEL.id;
      obj.VERSION = this.data.checklist.CHECKLIST.VERSION; 
      obj.STAGE = this.data.checklist.CHECKLIST.STAGE_ID;
      obj.STATUS = this.data.checklist.CHECKLIST.STATUS
      obj.DEPARTMENT = this.data.checklist.CHECKLIST.DEPARTMENT.id;
      obj.document_name = this.data.checklist.CHECKLIST.document_name;
      console.log(this.data.checklist.CHECKLIST.document_date);
      if(this.data.checklist.CHECKLIST.document_date!=null)
      {
        if(this.data.checklist.CHECKLIST.document_date.toString().indexOf('0001')!=-1)
        {
          this.form.controls.document_date.reset();            
        }
        else
        {
          obj.document_date = new Date(this.data.checklist.CHECKLIST.document_date);      
        }
      }
      
      console.log(this.data.checklist.CHECKLIST.is_prerequisite);
      if(this.data.checklist.CHECKLIST.is_prerequisite == 1)
      {
        this.is_prerequisite = true;
      }
      else{
        this.is_prerequisite = false;
      }
      if(this.data.checklist.CHECKLIST.is_imic == 1)
      {
        this.is_imic = true;
      }
      else{
        this.is_imic = false;
      }
      this.form.patchValue(obj);
      this.editChecklist = false;
      this.version_box.nativeElement.disabled = true;
      
      this.getDepartments('get');
      this.index=0;
      this.selectModel = this.data.checklist.CHECKLIST.MODEL.id;
      },500);
    }
    this.api_service.getAllStages().subscribe(
      data => {
        this.stages = data;
        this.statusdata = data;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }

  loadSections(id:number) {
    this.api_service.getSectionByChecklistId(id).subscribe(
      data => {
        debugger;
        this.sections = data;
        if(data.length>0)
        {
          for(var i of this.sections)
          {
            this.milestone_forms.push({});
            this.milestone_array.push({});
            this.edit_milestone_no=i.MILESTONE_NO;
            this.milestones.push(i);
          }
          this.form.clearValidators();
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  getModules() {
    this.api_service.getModules().subscribe(
      data => {
        this.modelList = data;
        this.modelList = this.modelList.filter(x => x.id != 30052);
        this.modelList = this.modelList.filter(x => x.name!="Master Data Model");
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  loadDept() {
    this.api_service.getAllDepartments().subscribe(
      data => {
        this.departmentsCopy = data;
        if (data.status < 200 || data.status >= 300) {
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  getDepartments(msg: any) {
    this.getModules();
    if(this.form.value.STAGE == 1)
    {
      this.pqhc_flag = true;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id==3 || x.id==4 || x.id==5);
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }
    if(this.form.value.STAGE == 4 || this.form.value.STAGE == 6 || this.form.value.STAGE == 10)
    {
      this.pqhc_flag = false;
      this.departments = [];
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }
    if(this.form.value.STAGE == 3)
    {
      this.pqhc_flag = false;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id==7);
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }
    if(this.form.value.STAGE == 5)
    {
      this.pqhc_flag = false;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id == 10013);
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }
    if(this.form.value.STAGE == 7)
    {
      this.pqhc_flag = false;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id==5);
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }
    if(this.form.value.STAGE == 8 ||  this.form.value.STAGE == 9 )
    {
      this.pqhc_flag = false;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id == 10014);
      if(this.feederStageFlag == true && this.el.nativeElement.disabled == true)
      {
        this.feederStageFlag = false;
        this.form.controls.MODEL.reset();  
        this.el.nativeElement.disabled = false;
      }
    }    
    if (this.form.value.STAGE == 11) {
      this.pqhc_flag = false;
      let model = this.modelList.filter(x => x.name === 'Feeder')[0];
      this.form.patchValue({MODEL: model.id});
      this.el.nativeElement.disabled = true;
      this.feederStageFlag = true;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id==10015);
    }
    else if (this.form.value.STAGE == 12) {
      this.pqhc_flag = false;
      let model = this.modelList.filter(x => x.name === 'Substation')[0];
      this.form.patchValue({MODEL: model.id});
      this.el.nativeElement.disabled = true;
      this.feederStageFlag = true;
      this.departments = [];
      this.departments = this.departmentsCopy.filter(x => x.id==10016);
    }
    
  }

  change_checklist_type(){
    this.is_prerequisite = !this.is_prerequisite;
    console.log('prereuqisit-->'+this.is_prerequisite);
  }
  change_imic_type(){
    this.is_imic = !this.is_imic;
    console.log('imic-->'+this.is_imic);
  }
  getChecklists()
  {
    this.checklists=[];
    this.api_service.getChecklistNames().subscribe(
     data => {
       this.checklists = data;  
     },
     err => { console.log(err);
     this.api_service.checkStatus(err);
    });
  }
  loadMilestones() {
    this.milestone_forms.push({});
    this.milestone_array.push({});
  }
  removeMilestoneIns($event, index) {
    this.milestone_forms.splice(index, 1);
  }
  deleteMilestone($event,index){
    if(this.milestone_array[index].SECTION_ID != null)
    {
      this.api_service.deleteMilestoneById(this.milestone_array[index].SECTION_ID).subscribe(
        data => {
          setTimeout(()=>{   
            this.milestone_array.splice(index,1);
            this.milestone_forms.splice(index,1); 
            if(this.modelName == "Edit Checklist")
            {
              this.milestones.splice(index,1);
            }
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
    else{
      this.milestone_array.splice(index,1);
      this.milestone_forms.splice(index,1); 
      this.Notification = "Milestone deleted Successfully";
      this.display = true;
    }
   
  }

  onNotification() {
    if(this.Notification == 'Checklist name already exists'
    || this.Notification == "Milestone deleted Successfully"
    || this.Notification == 'Empty Milestones are not allowed'
    || this.Notification == "Milestone delete Failed"  
    || this.Notification == "Minimum value for revision must be 0"
    || this.Notification == "Minimum value of number is 1"
    || this.Notification == "Milestone number cannot be empty"
    || this.Notification == "Milestone name cannot be empty"
  )
    {
      this.display = false;
    }
    if (this.Notification == 'Checklist Added Successfully'
     || this.Notification == 'Checklist Updated Successfully') {
      this.display = false;
      this.notify.emit('success');
    }
    if (this.Notification == 'Checklist Add Failed'
     || this.Notification == 'Checklist Update  Failed') {
      this.display = false;
      this.notify.emit('failed');
    }
  }

  checkEmptyMilestone()
  {
    if(this.edit_date == true)
    {
      return true;
    }
    for(var i of this.milestone_array)
    {
      if(i.MILESTONE_NO==null)  
      {
        this.Notification = 'Milestone number cannot be empty';
        this.display = true;
        return true;
      }
      if(i.NAME==null)
      {
        this.Notification = 'Milestone name cannot be empty';
        this.display = true;
        return true;
      }
      if(i.MILESTONE_NO < 1)
      {
        this.Notification = "Minimum value of number is 1";
        this.display = true;
        return true;
      }
    }
    return false;
  }

  validateChecklistName(name:string,id:number,version:number)
  {
    if(id==0)
    {
      for (var i=0;i< this.checklists.length;i++) {
        if (this.checklists[i].NAME.toLowerCase().replace(/\s/g,'') === name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      if(i==this.checklists.length)
      {
        return false;
      }
    }
    else
    {
      for (var i=0;i< this.checklists.length;i++) {
        if (this.checklists[i].NAME.toLowerCase().replace(/\s/g,'') === name.toLowerCase().replace(/\s/g,'') && this.checklists[i].CHECKLIST_ID != id) 
        {
          if(version > this.checklists[i].VERSION)
          {
            return false;
          }
          else
          {
            return true;
          }
        }
      }
      if(i==this.checklists.length)
      {
        return false;
      }

    }    
  }

  dateIncrease(date:Date){
    var y = date.getFullYear(),
    m = date.getMonth() + 1, // january is month 0 in javascript
    d = date.getDate();
    var pad = function(val) { var str = val.toString(); return (str.length < 2) ? "0" + str : str};
    var dateString = [y, pad(m), pad(d)].join("-");
    return dateString;
  }
  updateDates()
  {
    var obj: { [k: string]: any } = {};
    obj.document_date = this.dateIncrease(this.form['_value'].document_date);
    obj.document_name = this.form['_value'].document_name;    
    this.api_service.updateChecklist(obj, this.data.checklist.CHECKLIST.CHECKLIST_ID).subscribe(data => {
      setTimeout(()=>{
      this.Notification = 'Checklist Updated Successfully';
      this.display = true;
      }, 400);
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
          setTimeout(()=>{ 
            this.Notification = 'Checklist Update  Failed';
            this.display = true;
          }, 400);
        }
        
      }); 

  }
  createChecklist() {
    if(this.edit_date == true)
    {
      this.updateDates();
    }
    var obj: { [k: string]: any } = {};
    var modelName,departmentName;
    for(var i of this.modelList)
    {
      if(i.id == this.form['_value'].MODEL)
      {
        modelName = i.name;
        break;
      }
    }
    for(var j of this.departments){
      if(j.id== this.form['_value'].DEPARTMENT)
      {
        departmentName = j.name;
        break;
      }
    }
    obj.NAME = departmentName+"_"+modelName+"_"+this.form['_value'].VERSION+"_"+this.form['_value'].NAME;
    obj.MODEL_ID = this.form['_value'].MODEL;
    obj.DEPARTMENT_ID = this.form['_value'].DEPARTMENT;
    obj.VERSION = this.form['_value'].VERSION;
    obj.STAGE_ID = this.form['_value'].STAGE;
    obj["CREATED_BY"] = this.currentUser.user_id;
    obj.MILESTONES = this.milestone_array;
    obj.document_date = this.dateIncrease(this.form['_value'].document_date);
    obj.document_name = this.form['_value'].document_name;
    console.log(obj);
    if(this.is_prerequisite == true)
    {
      obj.is_prerequisite = 1;
    }
    else
    {
      obj.is_prerequisite = 0;
    }
    if(this.is_imic == true)
    {
      obj.is_imic = 1;
    }
    else
    {
      obj.is_imic = 0;
    }
    console.log(obj.is_prerequisite);
    var nameflag = false;
    if(obj.VERSION < 0)
    {
      this.Notification = "Minimum value for revision must be 0";
      this.display = true;
    }
    else 
    {
      if(this.data==null)
      {
        var nameflag = this.validateChecklistName(obj.NAME,0,1);
      }
      if(nameflag==true)
      { 
        this.Notification = 'Checklist name already exists';
        this.display=true;
      }
      if(this.checkEmptyMilestone()==false && nameflag==false)
      {
        if (this.data) {
          if(this.validateChecklistName(obj.NAME,this.data.checklist.CHECKLIST.CHECKLIST_ID,this.data.checklist.CHECKLIST.VERSION)==false)
            {
               this.api_service.updateChecklist(obj, this.data.checklist.CHECKLIST.CHECKLIST_ID).subscribe(data => {
                setTimeout(()=>{
                this.Notification = 'Checklist Updated Successfully';
                this.display = true;
                }, 400);
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
                    setTimeout(()=>{ 
                      this.Notification = 'Checklist Update  Failed';
                      this.display = true;
                    }, 400);
                  }
                  
                }); 
            }
            else
            {
              this.Notification = 'Checklist name already exists';
              this.display = true;
            }
              
        } else {
    
        this.api_service.createChecklist(obj).subscribe(data => {
          setTimeout(()=>{
            this.Notification = 'Checklist Added Successfully';
            this.display = true;
          }, 400);
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
                setTimeout(()=>{
                  this.Notification = 'Checklist Add Failed';
                  this.display = true;
                }, 400);
              }
              
            }); 
         }
  
  
      }



    }
    
    

  }
  getMilestoneId(id:number,index: number){
    this.milestone_array[index].SECTION_ID = id;
  }
  getMilestoneName(name: string, index: number) {
    this.milestone_array[index].NAME = name;
    this.milestone_array[index].CREATED_BY = this.currentUser.user_id;
  }
  getMilestoneNo(no: number, index: number) {   
      this.milestone_array[index].MILESTONE_NO = no;
  }
  
}


