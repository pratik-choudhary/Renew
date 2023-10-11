import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'create-location',
  templateUrl: './location-model.html',
})

export class LocationModalComponent {
  public form: FormGroup;
  stateCtrl: FormControl;
  customerCtrl: FormControl;
  siteCtrl: FormControl;
  reactiveStates: any;
  reactiveCustomers: any;
  reactiveSites: any;
  reactiveAuto: string;
  modelname: string;
  customerSection: boolean;
  isSiteHasData: boolean;
  @Input() parentInput: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  states = [];

  custmers = [];

  sites = [];

  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer, private api_service: ApiService) {
    this.customerSection = false;
    this.stateCtrl = new FormControl();
    this.customerCtrl = new FormControl();
    this.siteCtrl = new FormControl();

    //model list
      this.reactiveStates = this.stateCtrl.valueChanges
      .startWith(this.stateCtrl.value)
      .map(val => this.displayFn(val))
      .map(name => this.filterStates(name));

    //customer list
      this.reactiveCustomers = this.customerCtrl.valueChanges
      .startWith(this.customerCtrl.value)
      .map(val => this.displayFn(val))
      .map(name => this.filterCustomers(name));

    //site list
      this.reactiveSites = this.siteCtrl.valueChanges
      .startWith(this.siteCtrl.value)
      .map(val => this.displayFn(val))
      .map(site => this.filterSites(site));

      this.loadModels();
      this.loadSites();
      this.loadCustomers();

      this.iconRegistry.addSvgIcon( 
        'plus-circle',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
        this.iconRegistry.addSvgIcon(
        'arrow_back',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_arrow_back_black_24px.svg'));
        this.iconRegistry.addSvgIcon(
        'location',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_place_black_24px.svg'));
        this.iconRegistry.addSvgIcon(
        'pencil',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/pencil.svg'));
  }
  loadModels() {
    this.api_service.getModules().subscribe(
    data => {
      this.states = data;
    },
    err => { console.log(err);
    this.api_service.checkStatus(err);
    });
  }
  loadSites() {
    this.api_service.getSites().subscribe(
    data => {
      this.sites = data;
    },
    err => { console.log(err);
    this.api_service.checkStatus(err);
    });
  }
  loadCustomers(){
    this.api_service.getCustomers().subscribe(
    data => {
      this.custmers = data;
    },
    err => { console.log(err);
    this.api_service.checkStatus(err);
    });
  }
  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.name : value;
  }
  displayFnSite(value: any): string {
    return value && typeof value === 'object' ? value.site : value;
  }

  filterStates(val: string) {
    return val ? this.states.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.states;
  }

  filterCustomers(val: string) {
    return val ? this.custmers.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.custmers;
  }

  filterSites(val: string) {
    return val ? this.sites.filter((s) => s.site.match(new RegExp(val, 'gi'))) : this.sites;
  }

  closeDialog(){
    this.notify.emit('Click from nested component');
  }

  toggleCustomerSection(){
    if(this.customerSection){
        this.customerSection = false;
    }else{
        this.customerSection = true; 
    }
  }

  onToggle(name: string) {
      this.customerCtrl.setValue(name);
      this.customerSection = false;
  }

  clearSite(){
    if(this.siteCtrl.value){
      this.siteCtrl.reset();
    }
  }
  transformChip(chip) {
    // If it is an object, it's already a known chip
   // if (angular.isObject(chip)) {
      return chip;
    //}
  }
  createLocation() {
    var obj: {[k: string]: any} = {};
    obj.external_id = this.form.value.ID;
   obj.status = this.form.value.STATUS;
   obj.customer_id = this.customerCtrl.value.id;
   obj.model_id = this.stateCtrl.value.id;
   obj.site_id = this.siteCtrl.value.id;
   if (this.modelname == 'Add Location'){
        this.api_service.addLocation(obj).subscribe(
          data => {
            this.notify.emit('success');
          },
          err => { console.log(err);
          this.notify.emit('failed');
        this.api_service.checkStatus(err); });
    }else{
         this.api_service.updateLocation(obj, this.parentInput.id).subscribe(
          data => {
            this.notify.emit('success');
          },
          err => { console.log(err);
            this.api_service.checkStatus(err);
          this.notify.emit('failed'); });
    }
  }

  ngOnInit() {
      this.modelname="Add Location"
      this.form = this.fb.group({
        ID : [null],
        stateCtrl : [null],
        STATUS : [null]
      });

      if(this.parentInput){
        this.modelname = 'Edit Location';
        var obj: {[k: string]: any} = {};
        obj.ID = this.parentInput.external_id;
        obj.STATUS = this.parentInput.status;
        this.form.patchValue(obj);
      }
      if(this.siteCtrl.value){
        this.isSiteHasData = true;
      }else{
        this.isSiteHasData = false;
      }
  }
}
