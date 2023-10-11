import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl,AbstractControl } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { AnonymousSubject } from 'rxjs';
@Component({
  selector: 'create-area',
  templateUrl: './area-model.html',
})

export class AreaModalComponent {
  areaName: string;
  public form: FormGroup;
  display = false;
  Notification: any;
  reactiveSites: any;
  modelname: string;
  areaSection: boolean;
  countrylist: any;
  stateList: any;
  isSiteHasData: boolean;
  statusList: any;
  selectedCountry: any;
  selectedState: any;
  config: MdSnackBarConfig;
  area_to_site: any;
  areaFlag: boolean;
  village:any;
  taluka:any;
  district:any;
  @Input() country_site: any;
  @Input() state_site: any
  @Input() areaList: any;
  @Input() parentInput: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() getResult: EventEmitter<string> = new EventEmitter<string>();
  @Output() area_site: EventEmitter<string> = new EventEmitter<string>();
  @Output() title: EventEmitter<string> = new EventEmitter<string>();
  constructor(private fb: FormBuilder, private api_service: ApiService, public iconRegistry: MdIconRegistry, public sanitizer: DomSanitizer, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef, @Inject(MD_DIALOG_DATA) public data: any) {
    this.areaSection = false;
    this.statusList = [
      'Active', 'Inactive'
    ];
    
    if(data!=null||data!=undefined)
    {
      this.areaList = data.areaList;
    }
    else{
      this.getAreaList();
    }
    this.areaFlag = false;
  }

  closeDialog() {
    this.notify.emit('close');
  }
  onCountryChange() {
    this.api_service.getAllStates(this.selectedCountry).subscribe(
      data => {
        this.stateList = data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });


  }

  validateAreaName(id:number) {
    if(id==0)
    {
      for (var i of this.areaList) {
        if (i.name.toLowerCase().replace(/\s/g,'') == this.areaName.toLowerCase().replace(/\s/g,'') && i.state_id == this.selectedState && i.country_id == this.selectedCountry) {
        this.Notification = "Area already exists";
        this.display = true;
        return false;
      }
    }  
    return true;  
    }
    else
    {
      for (var i of this.areaList) {
        if (i.name.toLowerCase().replace(/\s/g,'') == this.areaName.toLowerCase().replace(/\s/g,'') && i.state_id == this.selectedState && i.country_id == this.selectedCountry && i.id!=id ) {
        this.Notification = "Area already exists";
        this.display = true;
        return false;
      }
    }  
    return true;

    }

    
  }

  getAreaList()
  {
    this.api_service.getAreaList().subscribe(
      data => {
        this.areaList = data; 
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }



  ngOnInit() {
    this.api_service.getAllCountries().subscribe(
      data => {
        this.countrylist = data;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

    this.selectedCountry = 101;
    this.onCountryChange();
    if (this.country_site) {
      this.selectedCountry = this.country_site;
      this.onCountryChange();
      this.selectedState = this.state_site;
      this.getAreaList();
    }


    this.modelname = "Add Area";
    this.title.emit(this.modelname);
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      status: ['Active', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required]
    });
    this.getAreaList();
    if (this.parentInput) {
      this.areaName = this.parentInput.name;
      this.selectedCountry = this.parentInput.country.id;
      this.selectedState = this.parentInput.state.id;
      this.village = this.parentInput.village;
      this.taluka = this.parentInput.taluka;
      this.district = this.parentInput.district;
      this.onCountryChange();
      this.modelname = 'Edit Area';
      this.title.emit(this.modelname);
      var obj: { [k: string]: any } = {};
      obj.name = this.form['_value'].name;
      obj.status = this.form['_value'].status;
      obj.country_id = this.form['_value'].country;
      obj.state_id = this.form['_value'].state;
      console.log(this.parentInput);
      this.form.patchValue(this.parentInput);
    }

  }
  onNotification() {
    if(this.Notification == "Area already exists"){
      this.display = false;
    }
    if (this.Notification == 'Area Added Successfully') {
      if (this.country_site && this.country_site) {
        this.display = false;
        this.area_site.emit(this.area_to_site);
      }
      this.notify.emit('submit');
    }
    if (this.Notification == 'Area Updated Successfully') {
      this.display = false;
      this.notify.emit('submit');
    }
    if (this.Notification == 'Area Add Failed') {
      this.display = false;
      this.notify.emit('failed');
    }
    if (this.Notification == 'Area Update Failed') {
      this.display = false;
      this.notify.emit('failed');
    }
  }
  saveUpdateArea() {
    var obj: { [k: string]: any } = {};
    obj.name = this.form['_value'].name;
    obj.status = this.form['_value'].status;
    obj.country_id = this.form['_value'].country;
    obj.state_id = this.form['_value'].state;  
    if (this.modelname === 'Add Area') {
      if(this.validateAreaName(0)==true){

        this.api_service.saveArea(obj).subscribe(
          data => {
            //this.getResult.emit('data');
            if (this.country_site && this.state_site) {
              this.area_to_site = obj.name;
              this.area_site.emit(obj.name);
              //send new Area to site dialog
            }
            else {
              setTimeout(()=>{
              this.Notification = 'Area Added Successfully';
              this.display = true;
            }, 400);
            }
          },
          err => {
            console.log(err);
            if(err.status == 401)
            {
              this.closeDialog(); 
              setTimeout(()=>{
              this.api_service.checkStatus(err);
            },1000);
            }
            else
            {
              setTimeout(()=>{
                this.Notification = 'Area Add Failed';
                this.display = true;
              }, 400);
            }
          });
      }
      
    } else {
      if(this.validateAreaName(this.parentInput.id)==true)
      {
        this.api_service.updateArea(this.parentInput.id, obj).subscribe(
          data => {
            setTimeout(()=>{
            this.Notification = 'Area Updated Successfully';
            this.display = true;
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
                this.Notification = 'Area Update Failed';
                this.display = true;
              }, 400);
            }
          });
  

      }
      
    }
  }
}
