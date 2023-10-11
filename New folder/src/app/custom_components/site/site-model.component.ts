import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import { ApiService } from 'app/services/api.service';
import { AutoCompleteModule } from 'primeng/primeng';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';

@Component({
  selector: 'site-dashboard',
  templateUrl: './site-model.html',
  styleUrls: ['../site/site-model.scss']
})

export class SiteModalComponent {
  public form: FormGroup;
  config: MdSnackBarConfig;
  stateCtrl: FormControl;
  areaCtrl: FormControl;
  siteCtrl: FormControl;
  display = false;
  Notification: any;
  // substationCtrl: FormControl;
  reactiveStates: any;
  reactiveAreas: any;
  reactiveSites: any;
  reactiveSubstations: any;
  reactiveAuto: string;
  modelname: string;
  areaSection: boolean;
  isSiteHasData: boolean;
  selectedCountry: any;
  selectedState: any;
  countryList: any;
  stateList: any;
  filteredCountriesMultiple: any;
  area_for_edit:any;
  selectedSubstations: any;
  @Input() parentInput: any;
  @Input() areaPageInput: any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @Output() title: EventEmitter<string> = new EventEmitter<string>();
  substation_arr = [];
  substations = [];
  substationsCopy: any;
  statusList = [
    'Active', 'Inactive'
  ];
  siteList:any;
  area_from_site: any;

  areas = [];

  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry, public sanitizer: DomSanitizer, private api_service: ApiService, private snackbar: MdSnackBar,
    public viewContainerRef: ViewContainerRef) {
    this.areaSection = false;
    this.stateCtrl = new FormControl();
    this.areaCtrl = new FormControl();
    this.siteCtrl = new FormControl();
    //this.substationCtrl = new FormControl();
    this.api_service.getAllCountries().subscribe(
      data => {
        this.countryList = data;
        if (this.parentInput) {
          this.selectedCountry = this.countryList.filter(x => x.name === this.parentInput.COUNTRY)[0].id;
          this.parentInput.COUNTRY = this.selectedCountry;
          this.onCountryChange();
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
    
    this.reactiveAreas = this.areaCtrl.valueChanges
      .startWith(this.areaCtrl.value)
      .map(val => this.displayFn(val))
      .map(name => this.filterAreas(name));

    this.reactiveSites = this.siteCtrl.valueChanges
      .startWith(this.siteCtrl.value)
      .map(val => this.displayFn(val))
      .map(name => this.filterAreas(name));

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


  onCountryChange() {
    this.api_service.getAllStates(this.selectedCountry).subscribe(
      data => {
        this.stateList = data;
        if (this.parentInput) {
          //    this.selectedState = this.stateList.filter(x => x.name === this.parentInput.STATE)[0].id;
          for (var i of this.stateList) {
            if (i.name == this.parentInput.STATE) {
              this.selectedState = i.id;
              this.getAreas();
            }
          }
          this.parentInput.STATE = this.selectedState;
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }

  onNotify(message: any) {
    this.area_from_site = message;
    this.getAreas();
    this.toggleAreaSection();
  }

  changeSubstations(selectedSubstations) {
  }

  getSubstations() {
    this.api_service.getSubstations().subscribe(
      data => {
        this.substationsCopy = data;
        for (var i of data) {
          this.substations.push({
            'label': i.name,
            'value': i
          });
        }

      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  uniq(a) {
    return Array.from(new Set(a));
  }
  onStateChange(){
    this.getAreas();
  }
  getSites() {
    this.api_service.getSites().subscribe(
     data => {
       data.reverse();
       this.siteList = data;
     },
     err => { console.log(err);
    this.api_service.checkStatus(err);
    });
 }
  getAreas() {
    if(this.selectedState)
    {
      this.api_service.getStateSpecificAreas(this.selectedState).subscribe(
        data => {
          this.areas = data;
          var areaList = data.reverse();
          if(this.area_from_site)
          {
            for(var i of areaList)
            {
              if(i.name==this.area_from_site)
              {
                this.area_from_site = i.id;
                if(this.modelname=='Edit Site')
                {
                  this.parentInput.AREA_DISTRICT = this.area_from_site;
                }
                break;
              }
            }
          }

          if(this.area_from_site==null)
          {
            if (this.parentInput) {
              this.modelname = 'Edit Site';
              this.title.emit(this.modelname);
              this.areaCtrl.setValue(this.parentInput.AREA_DISTRICT);
              this.stateCtrl.setValue(this.parentInput.STATE);
              for (var j of this.parentInput.substationCtrl) 
              {
                for (var i of this.substationsCopy)   {
                  if (i.id == j.id) {
                    this.substationsCopy.splice(i, 1);
                  }
                }
              } 
              this.substations = [];
              for (var i of this.parentInput.substationCtrl) {
                this.substations.push({
                  'label': i.name,
                  'value': i
                });
              }
              this.form.patchValue(this.parentInput);
              for (var i of this.substationsCopy) {
                this.substations.push({
                  'label': i.name,
                  'value': i
                });
              }
              
    
            }
          }
          
        },
        err => {
          console.log(err);
          this.api_service.checkStatus(err);
        });


    } 
  }
  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.name : value;
  }

  filterCountryMultiple(event) {
    let query = event.query;
    this.filteredCountriesMultiple = this.filterCountry(query, this.substations);
  }
  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let sub = countries[i];
      if (sub.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(sub);
      }
    }
    return filtered;
  }

  /* filterStates(val: string) {
    return val ? this.states.filter((s) =>  s.name.match(new RegExp(val, 'gi'))) : this.states;
  } */

  filterAreas(val: string) {
    return val ? this.areas.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.areas;
  }
  filterSubstations(val: string) {
    return val ? this.substations.filter((s) => s.name.match(new RegExp(val, 'gi'))) : this.substations;
  }
  closeDialog() {
    this.notify.emit('failed');
  }

  toggleAreaSection() {
    if (this.areaSection) {
      this.areaSection = false;
      this.getAreas();
    } else {
      this.areaSection = true;
      this.getAreas();
    }
  }

  onToggle(name: string) {
    this.areaCtrl.setValue(name);
    this.areaSection = false;
    this.getAreas();
  }

  clearSite() {
    if (this.areaCtrl.value) {
      this.areaCtrl.reset();
    }
  }
  transformChip(chip) {
    // If it is an object, it's already a known chip
    // if (angular.isObject(chip)) {
    return chip;
    //}
  }
  addSubstations(member, evt) {
    //this.substationCtrl.patchValue('');
    let flag = false;
    if (evt.source.selected == true) {
      for (let m of this.substation_arr) {
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

  ngOnInit() {
    
    this.modelname = "Add Site";
    this.title.emit(this.modelname);
    this.selectedCountry = 101;
    this.onCountryChange();
    this.form = this.fb.group({
      COUNTRY: [null],
      stateCtrl: [null],
      AREA_DISTRICT: [null, Validators.required],
      SITE: [null],
      STATUS: ['Active'],
      substationCtrl: []
    });


    if (this.areaCtrl.value) {
      this.isSiteHasData = true;
    } else {
      this.isSiteHasData = false;
    }
    this.getSubstations();
    this.getAreas();
    this.getSites();
  }

  onNotification() {
    if (this.Notification == 'Site Name already exists') {
      this.display = false;
    }
    if (this.Notification == 'Substations cannot be empty') {
      this.display = false;
    }
    if (this.Notification == 'Site Added Successfully') {
      this.display = false;
      this.notify.emit('success');
    }
    if (this.Notification == 'Site Edited Successfully') {
      this.display = false;
      this.notify.emit('success');
    }
    if (this.Notification == 'Site Add  Failed') {
      this.display = false;
      this.notify.emit('failed');
    }
    if (this.Notification == 'Site Edit Failed') {
      this.display = false;
      this.notify.emit('failed');
    }

  }

  validateSiteName(name:string,id:number)
  {
    var i;
    if(id==0)
    {
      for (i=0;i<this.siteList.length;i++) {
        if (this.siteList[i].site.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'')) {
            return true;
        }
      }
      return false;
    }
    else
    {
      for (i=0;i<this.siteList.length;i++) {
        if (this.siteList[i].site.toLowerCase().replace(/\s/g,'') == name.toLowerCase().replace(/\s/g,'') && this.siteList[i].id!=id) {
            return true;
        }
      }
      return false;
    }
    
  }

  createSite() {
    var obj: { [k: string]: any } = {};
    obj.country = this.countryList.filter(value => value.id === parseInt(this.form.value.COUNTRY))[0].name;
    obj.state = this.stateList.filter(v => v.id === parseInt(this.form.value.stateCtrl))[0].name;
    obj.area_id = this.form.value.AREA_DISTRICT;
    obj.status = this.form.value.STATUS;
    obj.site = this.form.value.SITE;
    if(this.form.value.substationCtrl==null)
    {
      this.Notification = 'Substations cannot be empty';
      this.display = true;
    }
    else{
      obj.substations = this.form.value.substationCtrl;
      if (this.modelname === 'Add Site') {
        if(this.validateSiteName(obj.site,0)==false)
        {
          this.api_service.createSite(obj).subscribe(
            data => {
              setTimeout(()=>{
              this.Notification = 'Site Added Successfully';
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
                  this.Notification = 'Site Add  Failed';
                  this.display = true;
                  }, 400);
              }
            });
        }
        else
        {
          this.Notification = 'Site Name already exists';
          this.display = true;
        }
      } else {
        if(this.validateSiteName(obj.site,this.parentInput.id)==false)
        {
        this.api_service.updateSite(obj, this.parentInput.id).subscribe(
          data => {
            setTimeout(()=>{
            this.Notification = 'Site Edited Successfully';
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
              this.Notification = 'Site Edit Failed';
              this.display = true;
            }, 400);
           }
          });
        }
        else
        {
          this.Notification = 'Site Name already exists';
          this.display = true;
        }
      }
      //this.getAreas();

    }
  }
}
