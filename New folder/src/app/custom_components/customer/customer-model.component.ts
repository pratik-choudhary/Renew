import {Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import {ApiService} from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import {ValidationService} from 'app/services/validation.service';
import { DialogModule} from  'primeng/primeng';
@Component({
  selector: 'create-customer',
  templateUrl: './customer-model.html',
  providers:[ValidationService]
})

export class CustomerModalComponent {
  public form: FormGroup;
  config :MdSnackBarConfig; 
  stateCtrl: FormControl;
  reactiveStates: any;
  reactiveAuto:string;
  modelname:string;
  statusList:any;
  countrylist:any;
  statelist:any;
  selectedCountry: any;
  selectedState:any;
  display=false;
  Notification:any; 
  customerList = [];
  @Input() parentInput:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  @Output() title: EventEmitter<string> = new EventEmitter<string>();
  constructor(private fb: FormBuilder, private api_service: ApiService,private validation_service:ValidationService,private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef) {
    this.statusList = [
      'Active', 'Inactive'
    ];
  }

  closeDialog(){
    this.notify.emit('Click from nested component');
  }

  onCountryChange(){
    

    this.api_service.getAllStates(this.selectedCountry).subscribe(
      data => {
        this.statelist=data; 
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
    });
  
  }

  getCustomers(){
    this.customerList = [];
    this.api_service.getCustomers().subscribe(
        data => {
            this.customerList = data;
        },
        err => { console.log(err);
        this.api_service.checkStatus(err);
        });
  }

  ngOnInit() {
    this.getCustomers();
    this.api_service.getAllCountries().subscribe(
      data => {
        this.countrylist=data; 
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
    });
    this.selectedCountry=101;
    this.onCountryChange();
    this.modelname="Add Customer";
    this.title.emit(this.modelname);
    this.form = this.fb.group({
      NAME : [null,Validators.required],
      ADDRESS : [null,Validators.required],
      STATUS : ['Active',Validators.required],
      country:[null,Validators.required],
      state:[null,Validators.required]
    });

    if (this.parentInput) {
      this.modelname = 'Edit Customer';
      this.title.emit(this.modelname);
      this.selectedCountry =this.parentInput.country.id;
      this.selectedState = this.parentInput.state.id;
      this.onCountryChange();
      var obj: {[k: string]: any } = {};
      obj.NAME = this.parentInput.name;
      obj.ADDRESS = this.parentInput.address;
      obj.STATUS = this.parentInput.status;
      obj.country_id = this.parentInput.country;
      obj.state_id = this.parentInput.state;
      this.form.patchValue(obj);
    }
  }

  onNotification(){
    this.display=false;
    if(this.Notification == 'Customer Added Successfully'){
      this.notify.emit('success');
    }
    if(this.Notification == 'Customer Edited Successfully')
    {
      this.notify.emit('success');
    }
    if(this.Notification == 'Customer Add Failed'){
      this.notify.emit('failed');
    }
    if(this.Notification == 'Customer Edit Failed'){
      this.notify.emit('failed');
    }
   
  }
  validateCustomerName(name:string,id:number)
  {
    var i;
    if(id==0)
    {
      for (i=0;i< this.customerList.length;i++) {
        if (this.customerList[i].name.toLowerCase().replace(/\s/g,'') === name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      return false;
    }
    else
    {
      for (i=0;i< this.customerList.length;i++) {
        if (this.customerList[i].name.toLowerCase().replace(/\s/g,'') === name.toLowerCase().replace(/\s/g,'')&& this.customerList[i].id!=id) {
            return true;
        }
      }
      return false;
    }
    
  }
  onSubmit() {
    var obj: {[k: string]: any } = {};
    obj.address = this.form.value.ADDRESS;
    obj.name = this.form.value.NAME;
    obj.status = this.form.value.STATUS;
    obj.country_id = this.form.value.country;
    obj.state_id = this.form.value.state;
    
    if (this.modelname === 'Add Customer') {
      if(this.validateCustomerName(obj.name,0)==false)
      {
        this.api_service.addCustomer(obj).subscribe(
          data => {
            setTimeout(()=>{
            this.Notification = 'Customer Added Successfully';
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
                this.Notification = 'Customer Add Failed';
                this.display= true;
              }, 400);
            }
          });  
      }else
      {
        this.Notification = 'Customer already exists';
        this.display = true;
      }
    }else{
      if(this.validateCustomerName(obj.name,this.parentInput.id)==false)
      {
        this.api_service.updateCustomer(obj,this.parentInput.id).subscribe(
        data => {
          setTimeout(()=>{
            this.Notification = 'Customer Edited Successfully';
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
            this.Notification = 'Customer Edit Failed';
            this.display= true;
            }, 400);
          }
        });
      }
      else
      {
        this.Notification = 'Customer already exists';
        this.display = true;
      }
    }
  }
}
