import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { DialogModule } from 'primeng/primeng';
@Component({
  selector: 'app-add-project',
  templateUrl: './project-dialog.html',
  styleUrls: ['./project-dialog.component.scss']
})

export class AddProjectDialog {
  display = false;
  Notification: any;
  public form: FormGroup;
  parentInput: any;
  modelName: string;
  project_name: any;
  project_customer: any;
  project: any;
  modelInput: any;
  checklistInput: any;
  site_id: any;
  onlyModel = false;
  customers = [];
  addModelComp = [];
  cloneModelComp = [];
  cloneModelCompCopy = [];
  config: MdSnackBarConfig;
  duplicateFlag = false;
  duplicateChecklistFlag = false;
  invalidNameFlag = false;
  modelExistsFlag = false;
  newFlag = false;
  projects: any;
  project_id:any;
  locationCount: number;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    private api_service: ApiService,
    public dialogRef: MdDialogRef<AddProjectDialog>,
    private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef) {
  }


  onNotify(message: string) {
    if (message === 'success') {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.modelName = "Add Project";
    this.loadCustomers();
    if (this.data && this.data.project) {
      this.modelName = "Edit Project";
      this.parentInput = this.data.project;
      this.project_name = this.parentInput.name;
      this.locationCount = this.parentInput.location_count;
      this.project_id = this.data.project.Id;
      if (this.data.Models != null) {
        this.modelInput = [];
        this.checklistInput = [];
        for (var i in this.data.Models) {
          this.modelInput.push(this.data.Models[i].model.id);
          this.checklistInput.push(this.data.Models[i].checklists);
          this.addModel();
        }
      }
    }
    if (this.data.siteId) {
      this.site_id = this.data.siteId;
      this.api_service.getAllProjects(this.site_id.id).subscribe(
        data => {
          if (data != null) {
            this.projects = data;
          }
        },
        err => { console.log(err);
        this.api_service.checkStatus(err); 
      });
    }
    if (this.data && this.data.onlyModel) {
      this.onlyModel = true;
    }
  }
  loadCustomers() {
    this.customers = [];
    this.api_service.getCustomers().subscribe(
      data => {
        if (data != null) {
          for(var i of data)
          {
            this.customers.push({
              'label':i.name,
              'value':i
            });
          }
        if(this.data && this.data.project)
        {
          this.project_customer = this.customers.filter(x => x.value.id == this.parentInput.customer.id)[0].value;
        }
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  addModel() {
    this.addModelComp.push({});
    this.cloneModelComp.push({});
  }
  addModelWithInit() {
    this.modelInput = [];
    this.checklistInput = [];
    this.addModel();
  }
  deleteModel(message: string, i: number) {
    if (message == "delete") {
     /*  if (this.locationCount > 0) {
        this.Notification = "Model is in use cannot Delete";
        this.display = true;
      }
      else {
      */   
        this.addModelComp.splice(i, 1);
        this.cloneModelComp.splice(i, 1);
     /*  } */
    }
  }
  changeProjectModel(model: any, index: number) {
    this.cloneModelComp[index].model_id = model;
    this.cloneModelCompCopy = this.cloneModelComp;
  }
  setNewFlag(msg,i)
  {
    console.log(msg);
    if(msg == 1)
    {
      this.newFlag = true;
    }
  }
  changeProjectChecklist(checklists: any, index: number) {
    if(this.newFlag == true)
    { 
      var length;
      for(var i of checklists)
      {
         length = this.cloneModelComp[index].checklists.filter(x=>x.CHECKLIST_ID == i.CHECKLIST_ID).length;
         console.log(length);
         if(length == 0)
         {
          console.log('new element added');
          this.cloneModelComp[index].checklists.push(i);
         }
      }
      this.createProject(this.project_name,this.project_customer);
    }
    else
    {
      this.cloneModelComp[index].checklists = checklists;
      this.cloneModelCompCopy = this.cloneModelComp;
      console.log(this.cloneModelComp[index].checklists);
    }
    
  }
  
  onDuplicate() {
    if (this.parentInput) {
      if (this.data.Models != null) {
        this.modelInput = [];
        this.checklistInput = [];
        for (var i in this.data.Models) {
          this.modelInput.push(this.data.Models[i].model.id);
          this.checklistInput.push(this.data.Models[i].checklists);
        }
      }
    }
    else {
      if (this.cloneModelCompCopy != null) {
        this.modelInput = [];
        this.checklistInput = [];
        for (var i in this.cloneModelCompCopy) {
          this.modelInput.push(this.cloneModelCompCopy[i].model_id);
          this.checklistInput.push(this.cloneModelCompCopy[i].checklists);
        }
      }
    }
    this.duplicateChecklistFlag = false;
    this.display = false;
  }


  findDuplicateChecklistsFromSameModel(checklist1: any, checklist2: any) {
    var i, j;
    for (i = 0; i < checklist1.length; i++) {
      for (j = 0; j < checklist2.length; j++) {
        if (checklist1[i].id == checklist2[j].id) {
          this.duplicateChecklistFlag = true;
          this.Notification = "Duplicate Checklists are not allowed in same model";
          this.display = true;
          return false;
        }
      }
    }
    if (i == checklist1.length && j == checklist2.length) {
      return true;
    }
  }


  findDuplicateChecklists(checklist: any) {
    var i, j;
    for (i = 0; i < checklist.length; i++) {
      for (j = 0; j < checklist.length; j++) {
        if (checklist[i].id == checklist[j].id && i != j) {
          this.duplicateChecklistFlag = true;
          this.Notification = "Duplicate Checklists are not allowed";
          this.display = true;
          return false;
        }
      }
    }
    if (i == checklist.length && j == checklist) {
      return true;
    }
  }

  findEmptyModels(models: any) {
    for (var i of models) {
      if (i.checklist_ids.length == 0) {
        this.duplicateChecklistFlag = true;
        this.Notification = "Empty Models and Checklists are not allowed";
        this.display = true;
        return true;
      }
      if (i.model_id == null || i.model_id == undefined) {
        this.duplicateChecklistFlag = true;
        this.duplicateChecklistFlag = true;
        this.Notification = "Empty Models are not allowed";
        return true;
      }
    }
    if (i == models.length)
      return false;
  }

  validateProject(obj: any) {
    var checklist1 = [], checklist2 = [];
    var models = obj.model_ids;
    var i, j
    for (i = 0; i < models.length; i++) {
      if (this.findEmptyModels(models) == true) {
        return false;
      }
      for (j = 0; j < models.length; j++) {
        if (this.findDuplicateChecklists(models[i].checklist_ids) == false) {
          return false;
        }
        if (models[i].model_id == models[j].model_id && i != j) {
          checklist1 = models[i].checklist_ids;
          checklist2 = models[j].checklist_ids;
          if (this.findDuplicateChecklistsFromSameModel(checklist1, checklist2) == false) {
            return false;
          }
        }
      }
    }

    if (i == models.length && j == models.length) {
      return true;
    }
  }

  onNotification() {
    if (this.Notification == "Model is in use cannot Delete" || this.Notification == "Please add customer") {
      this.display = false;
      return;
    }
    if (this.invalidNameFlag == true) {
      this.invalidNameFlag = false;
      this.display = false;
      return;
    }
    else
      if (this.modelExistsFlag == true) {
        this.modelExistsFlag = false;
        this.display = false;
        return;
      }
      else
        if (this.duplicateChecklistFlag == true) {
          this.onDuplicate();
          return;
        }
        else {
          this.display = false;
          this.dialogRef.close(true);
        }

  }
  validateProjectName(obj: any) {
    if (this.data.project) {
      if(obj.name != "" && obj.name != undefined && obj.name != null){
      for (var i of this.projects) {
        if (i.name.toLowerCase().replace(/\s/g,'') == obj.name.toLowerCase().replace(/\s/g,'') && i.Id != this.data.project.Id) {
          this.invalidNameFlag = true;
          this.Notification = "Project Name already exists";
          this.display = true;
          return false;
        }
      }
    }     
      if (obj.name == "" || obj.name == undefined || obj.name == null) {
        this.Notification = "Please enter Project Name";
        this.invalidNameFlag = true;
        this.display = true;
        return false;
      }
      else {
        return true;
      }
    }
    if (obj.name == "" || obj.name == undefined || obj.name == null) {
      this.Notification = "Please enter Project Name";
      this.invalidNameFlag = true;
      this.display = true;
      return false;
    }
    if(this.data.project == undefined)
    {
      for (var i of this.projects) {
        if (i.name.toLowerCase().replace(/\s/g,'') == obj.name.toLowerCase().replace(/\s/g,'')) {
          this.invalidNameFlag = true;
          this.Notification = "Project Name already exists";
          this.display = true;
          return false;
        }
      }
    }
    return true;
  }
  validateModelExists() {
    if (this.cloneModelComp.length == 0) {
      this.modelExistsFlag = true;
      this.Notification = "Please add models";
      this.display = true;
      return false;
    }
    return true;
  }
  createProject(project_name: any, project_customer: any) {
    if(project_customer == null)
    {
      this.Notification = "Please add customer";
      this.display = true;
      return;
    }
    var obj: { [k: string]: any } = {};
    obj.name = project_name;
    obj.customer_id = project_customer.id;
    obj.site_id = this.site_id.id;
    obj.model_ids = [];
    for (var m in this.cloneModelComp) {
      var obj2: { [k: string]: any } = {};
      obj2.model_id = this.cloneModelComp[m].model_id;
      obj2.checklist_ids = [];
      for (var c in this.cloneModelComp[m].checklists) {
        var obj3: { [k: string]: any } = {};
        obj3.id = this.cloneModelComp[m].checklists[c].CHECKLIST_ID;
        obj2.checklist_ids.push(obj3);
      }
      obj.model_ids.push(obj2);
    }
    if (this.validateProjectName(obj) == true && this.validateModelExists() == true) {
      if (this.data.project) {
        if (this.validateProject(obj) == true) {
           this.api_service.updateProject(obj, this.data.project.Id).subscribe(
            data => {
              setTimeout(()=>{
              this.display = true;
              this.Notification = 'Project Updated Successfully';
            }, 400);
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
              else
              {
                setTimeout(()=>{
                  this.display = true;
                  this.Notification = 'Project Update Failed';
                }, 400);
              }
            });
        }
        else {
        }

      } else {
        if (this.validateProject(obj) == true) {
           this.api_service.addProject(obj).subscribe(
            data => {
              setTimeout(()=>{
              this.display = true;
              this.Notification = 'Project Added Successfully';
            }, 400);
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
              else
              {
                setTimeout(()=>{
                this.display = true;
                this.Notification = 'Project Add Failed';
                }, 400);
              }
            }); 
        }
      }


    }

  }
}
