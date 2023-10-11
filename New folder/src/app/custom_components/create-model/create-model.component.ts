import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import {ValidationService} from 'app/services/validation.service';

@Component({
  selector: 'create-model',
  templateUrl: './create-model.html',
  // styleUrls: ['../checklist/checklist.component.scss']
  providers:[ValidationService]
})

export class CreateModalComponent {
  display = false;
  Notification:string;
  public form: FormGroup;
  config: MdSnackBarConfig;
  notificationFlag=false;
  notificationMessage:any;
  bladeType: any;
  towerType: any;
  frequencies: any;
  tempVersions: any;
  rotorList: any;
  hubHeightList: any;
  modelname: string;
  statusList: any;
  bladeVersion: any;
  modelList = [];
  nameflag = false;
  @Input() parentInput: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() title: EventEmitter<string> = new EventEmitter<string>();
  constructor(private fb: FormBuilder, private api_service: ApiService, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef,private validation_service:ValidationService) {
    this.modelname = "Create Model";
    this.hubHeightList =[];
    this.bladeType = [];
    this.towerType = [];
    this.frequencies = [];
    this.tempVersions = [];
    this.rotorList = [];
    this.bladeVersion = [];
    this.statusList = [
      'Active', 'Inactive'
    ];
    this.api_service.getModelConfig('blade_type').subscribe(
    data => {
      this.bladeType = data;
      this.getTower();
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
      this.getTower();
      
    });

  }
getTower() {
  this.api_service.getModelConfig('tower_type').subscribe(
    data => {
      this.towerType = data;
      
      this.getBladeVersion();
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
      this.getBladeVersion();

    });
}
  getBladeVersion() {
    this.api_service.getModelConfig('blade_version').subscribe(
    data => {
      this.bladeVersion = data;
      this.getFrequency();
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
       this.getFrequency();
    });
  }

  getFrequency() {
    this.api_service.getModelConfig('frequency').subscribe(
    data => {
      this.frequencies = data;
      this.getTempratureType();
    },
    err => {
       console.log(err);
       this.api_service.checkStatus(err);
       this.getTempratureType();
    });
  }
  getTempratureType() {
    this.api_service.getModelConfig('temprature_type').subscribe(
    data => {
      this.tempVersions = data;
      this.getRotar();
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
      this.getRotar();
      
    });
  }
  getRotar(){
     this.api_service.getModelConfig('rotor_dia').subscribe(
    data => {
      this.rotorList = data;
      this.getHub();
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
      this.getHub();
    });
  }
  getHub() {
    this.api_service.getModelConfig('hub_height').subscribe(
    data => {
      this.hubHeightList = data;
    },
    err => {
      console.log(err);
      this.api_service.checkStatus(err);
    });
  }
  getModels(){
    this.modelList = [];
    this.api_service.getModules().subscribe(
        data => {
          this.modelList = data;
       },
       err => { console.log(err);
      this.api_service.checkStatus(err);
      });        
    
  }
  closeDialog() {
    this.notify.emit();
  }
  
  ngOnInit() {
    this.title.emit(this.modelname);
    this.getModels();
    this.form = this.fb.group({
      MODEL_NAME: [null, Validators.required],
      BLADE_TYPE: [null, Validators.required],
      BLADE_VERSION: [null, Validators.required],
      TOWER_TYPE: [null, Validators.required],
      FREQUENCY: [null, Validators.required],
      TEMP_VERSION: [null, Validators.required],
      ROTOR_DIA: [null, Validators.required],
      HUB_HEIGHT: [null, Validators.required],
      STATUS: ['Active', Validators.required]
    });
    if (this.parentInput) {
      this.modelname = 'Edit Model';
      this.title.emit(this.modelname);
      var obj: { [k: string]: any } = {};
      obj.MODEL_NAME = this.parentInput.name;
      obj.BLADE_TYPE = this.parentInput.blade_type;
      obj.BLADE_VERSION = this.parentInput.blade_version;
      obj.TOWER_TYPE = this.parentInput.tower_type;
      obj.FREQUENCY = this.parentInput.frequency;
      obj.TEMP_VERSION = this.parentInput.temperature_type;
      obj.ROTOR_DIA = this.parentInput.rotor_dia;
      obj.HUB_HEIGHT = this.parentInput.hub_height;
      obj.STATUS = this.parentInput.status;
      this.form.patchValue(obj);
    }
  }
  onNotification(){
    
    if(this.Notification== 'Model already exists'){
      this.display = false;
    }
    if(this.Notification== 'Created Model Successfully'){
      this.display = false;
      this.notify.emit('success');
    }
    if(this.Notification== 'Edited Model Successfully')
    {
      this.display = false;
      this.notify.emit('success');
    }
    if(this.Notification== 'Create Model Failed'){
      this.display = false;
      this.notify.emit('failed');
    }
    if(this.Notification== 'Edit Model Failed'){
      this.display = false;
      this.notify.emit('failed');
    }
   
  }
  validateModelName(name:string,id:number)
  {
    var i;
    if(id==0)
    {
      for (i=0;i<this.modelList.length;i++) {
        if (this.modelList[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      return false;
    }
    else
    {
      for (i=0;i<this.modelList.length;i++) {
        if (this.modelList[i].name.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'') && id!=this.modelList[i].id) {
            return true;
        }
      }
      return false;
    }
    
  }
  createModel() {
    var obj: { [k: string]: any } = {};
    obj.blade_type = this.form.value.BLADE_TYPE;
    obj.blade_version = this.form.value.BLADE_VERSION;
    obj.frequency = this.form.value.FREQUENCY;
    obj.hub_height = this.form.value.HUB_HEIGHT;
    obj.name = this.form.value.MODEL_NAME;
    obj.rotor_dia = this.form.value.ROTOR_DIA;
    obj.temperature_type = this.form.value.TEMP_VERSION;
    obj.tower_type = this.form.value.TOWER_TYPE;
    obj.status = this.form.value.STATUS;
    if (this.modelname === 'Create Model') {
      if(this.validateModelName(obj.name,0)==false)
      {
        this.api_service.addModules(obj).subscribe(
          data => {
            setTimeout(()=>{
            this.Notification= 'Created Model Successfully';
            this.display= true;
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
                this.Notification= 'Create Model Failed';
                this.display= true;          
              }, 400);
            }
          });
      }
      else{
        this.Notification='Model already exists';
        this.display = true;
      }
      
    } else {
      if(this.validateModelName(obj.name,this.parentInput.id)==false)
      {
      this.api_service.updateModules(obj, this.parentInput.id).subscribe(
        data => {
          setTimeout(()=>{
          this.Notification= 'Edited Model Successfully';
          this.display= true;
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
            this.Notification= 'Edit Model Failed';
            this.display= true;
            }, 400);
          }
        });
      }else
      {
        this.Notification='Model already exists';
        this.display = true;
      }
    }
  }
}
