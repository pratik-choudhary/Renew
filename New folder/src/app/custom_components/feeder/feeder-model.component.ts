import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import {ApiService} from 'app/services/api.service';

@Component({
  selector: 'create-feeder',
  templateUrl: './feeder-model.html',
  styleUrls: ['./feeder-model.scss']
})

export class FeederModalComponent {
  public form: FormGroup;
  siteCtrl: FormControl;
  reactiveSites: any;
  modelname: string;
  areaSection: boolean;
  isSiteHasData: boolean;
  @Input() parentInput: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  substation_arr= [];
  states = [
    {code:'AP' , name :  'Andhra Pradesh'},
    {code:'AR' , name :  'Arunachal Pradesh'},
    {code:'AS' , name :  'Assam'},
    {code:'BR' , name :  'Bihar'},
    {code:'CT' , name :  'Chhattisgarh'},
    {code:'GA' , name :  'Goa'},
    {code:'GJ' , name :  'Gujarat'},
    {code:'HR' , name :  'Haryana'},
    {code:'HP' , name :  'Himachal Pradesh'},
    {code:'JK' , name :  'Jammu & Kashmir'},
    {code:'JH' , name :  'Jharkhand'},
    {code:'KA' , name :  'Karnataka'},
    {code:'KL' , name :  'Kerala'},
    {code:'MP' , name :  'Madhya Pradesh'},
    {code:'MH' , name :  'Maharashtra'},
    {code:'MN' , name :  'Manipur'},
    {code:'ML' , name :  'Meghalaya'},
    {code:'MZ' , name :  'Mizoram'},
    {code:'NL' , name :  'Nagaland'},
    {code:'OR' , name :  'Odisha'},
    {code:'PB' , name :  'Punjab'},
    {code:'RJ' , name :  'Rajasthan'},
    {code:'SK' , name :  'Sikkim'},
    {code:'TN' , name :  'Tamil Nadu'},
    {code:'TR' , name :  'Tripura'},
    {code:'UK' , name :  'Uttarakhand'},
    {code:'UP' , name :  'Uttar Pradesh'},
    {code:'WB' , name :  'West Bengal'}
  ];

  areas = [];
  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer, private api_service: ApiService) {
    this.areaSection = false;
    this.siteCtrl = new FormControl();

    //site list
      this.reactiveSites = this.siteCtrl.valueChanges
      .startWith(this.siteCtrl.value)
      .map(val =>  this.displayFn(val))
      .map(name =>  this.filterAreas(name));

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
       this.loadSubstations();
      }
  loadSubstations() {
     this.api_service.getSubstations().subscribe(
      data => {
        this.areas = data;
      },
      err => { console.log(err); });
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.name : value;
  }
  filterAreas(val: string) {
    return val ? this.areas.filter((s) =>  s.name.match(new RegExp(val, 'gi'))) : this.areas;
  }
  closeDialog(){
    this.notify.emit('Click from nested component');
  }
  addSubstations(member, evt) {
    this.siteCtrl.patchValue('');
    let flag = false;
    if (evt.source.selected == true){
        for (let m of this.substation_arr){
          if (m.id === member.id) {
                flag = true;
                break;
          }
      }
      if (flag === false) {
        this.substation_arr.push(member);
      }
    }
  }
  deleteSubstations(index) {
    this.substation_arr.splice(index, 1);
  }

  toggleAreaSection(){
    if(this.areaSection){
        this.areaSection = false;
    }else{
        this.areaSection = true; 
    }
  }

  onToggle(name:string) {
    this.siteCtrl.setValue(name);
    this.areaSection = false;
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
  addFeeder() {
    var obj: {[k: string]: any} = {};
    obj.name = this.form.value.NAME;
    obj.status = this.form.value.STATUS;
    obj.substation_id = this.siteCtrl.value.id;
    if (this.modelname === 'Add Feeder') {
       this.api_service.addFeeder(obj).subscribe(
        data => {
          this.notify.emit("success");
        },
        err => { console.log(err);
        this.notify.emit("failed");
      });
    }else {
       this.api_service.updateFeeder(obj, this.parentInput.id).subscribe(
        data => {
          this.notify.emit("success");
        },
        err => { console.log(err);
        this.notify.emit("failed");  });
    }
  }

  ngOnInit() {
      this.modelname="Add Feeder"
      this.form = this.fb.group({
        NAME : [null],
        SITE : [null],
        STATUS : [null]
      });

      if (this.parentInput) {
        this.modelname = 'Edit Feeder';
        this.siteCtrl.setValue(this.parentInput.substation);
        var obj: {[k: string]: any} = {};
        obj.NAME = this.parentInput.name;
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
