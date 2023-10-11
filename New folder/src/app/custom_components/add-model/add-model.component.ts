import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ApiService } from 'app/services/api.service';
import {MultiSelectModule} from 'primeng/primeng';
@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['../milestone-ins/milestone-ins.scss'],
  providers: [ConfirmationService]
})
export class AddProjectModel implements OnInit {
  _modelInput: any;
  _checklistInput: any;
  @Output() afterdelete: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeProjectModel: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeProjectChecklist: EventEmitter<number> = new EventEmitter<number>();
  @Output() newFlag: EventEmitter<number> = new EventEmitter<number>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  public set modelInput(val: string) {
    this._modelInput = val;
  }
  @Input()
  public set checklistInput(val: string) {
    this._checklistInput = val;
  }
  @Input() locationCount:number;
  @Input() updateFlag:boolean;
  @Input() project_id:number;

  milestone_no: any;
  milestone_name: any;
  project_model: any;
  project_checklists: any;
  project_checklists2: any;
  models = [];
  countries: any[];
  filteredCountriesMultiple: any[];
  filteredCountriesMultiple2: any[];
  results = [];
  checklists=[];
  usesFlag=false;
  modelCopy:any;
  newChecklistsFlag = false;
  completeFlag = false;
  constructor(public fb: FormBuilder, public dialog: MdDialog, private api_service: ApiService, private confirmationService: ConfirmationService) { }
  ngOnInit() {
    this.loadModels();
  }
  loadModels() {
    this.api_service.getModules().subscribe(
      data => {
        if (data != null) {
          data = data.filter(x => x.id != 30052);
          data = data.filter(x=>x.name!= "Master Data Model");
          this.modelCopy = data;
           for (var  i of data){
              this.models.push({
               'label': i.name,
               'value': i
              });
           }
        }
        if (this._modelInput) {
          var uses = this.models.filter(x => x.value.id == this._modelInput)[0].value.uses;
          if(uses > 0 && this.locationCount > 0)
          {
            this.usesFlag = true;
          }
          this.project_model = this.models.filter(x => x.value.id == this._modelInput)[0].value;
          this.loadChecklists(this._modelInput);
          this.changeProjectModel.emit(this.project_model.id);
        }
        if (this._checklistInput) {
          this.project_checklists = this._checklistInput;
          for(var i of this._checklistInput)
          {
            this.checklists.push({
              'label':i.NAME,
              'value':i
            });
          }
          this.changeProjectChecklist.emit(this.project_checklists);
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }
  changeProModel(project_model) {
    this.changeProjectModel.emit(project_model.id);
    this.project_checklists = [];
    this.checklists = [];
    this.loadChecklists(project_model.id);
  }
  
  changeChecklists2(project_checklists)
  {
    if(this.newChecklistsFlag == true)
    {
      this.confirmationService.confirm({
      message: 'Are you sure that you want to add these checklists?',
      header: 'Add Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
      this.newFlag.emit(1);
      this.changeProjectChecklist.emit(project_checklists);
      this.newChecklistsFlag = false;
      this.completeFlag = true;   
      }
    });
    
     
    }

  }
  changeChecklists(project_checklists) {
    if(this.newChecklistsFlag == false)
    {
    this.changeProjectChecklist.emit(project_checklists);
    }
  }
  
  deleteMileStoneIns() {
    this.afterdelete.emit();
  }
  filterCountryMultiple(event) {
    let query = event.query;
    this.filteredCountriesMultiple = this.filterCountry(query, this.results);
  }
  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let checklist = countries[i];
      if (checklist.NAME.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        filtered.push(checklist);
      }
    }
    return filtered;
  }
  
  addNewChecklists()
  {
    this.newChecklistsFlag = true;
    this.getNextStageChecklists();
  }
  loadChecklists(id: number) {
      this.api_service.getChecklistByModel(id).subscribe(
        data => {
          this.results = data;
          for(var i of this.results)
          {
            this.checklists.push({
              'label':i.NAME,
               'value':i
            });
          }
          
        },
        err => { console.log(err);
          this.api_service.checkStatus(err);
        });

    
  }

  getNextStageChecklists()
  {
    this.checklists = [];
    this.api_service.getChecklistForNextStages(this.project_id,this._modelInput).subscribe(
      data => {
        this.results = data;
        for(var i of this.results)
        {
          this.checklists.push({
            'label':i.NAME,
             'value':i
          });
        }
        
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  unselectChecklists(element, array) {
    var arr1 = array.filter(e => e !== element);
    this.changeChecklists(arr1);
  }

  deleteModel() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this model?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.delete.emit("delete");
      }
    });

  }

}
