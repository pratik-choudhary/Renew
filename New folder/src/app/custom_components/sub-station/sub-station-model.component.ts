import { Component, Inject, Input,Output,EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import 'rxjs/add/operator/startWith';
import {ApiService} from 'app/services/api.service';

@Component({
  selector: 'create-sub-station',
  templateUrl: './sub-station-model.html',
})

export class SubStationModalComponent {
  public form: FormGroup;
  siteCtrl: FormControl;
  reactiveSites: any;
  modelname:string;
  areaSection:boolean;
  isSiteHasData : boolean;
  @Input() parentInput:any;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  areas = [
    {id: '1244', area: 'Saswad, Hadapsar' ,state:'Maharashtra',country:'India' },
    {id: '1231', area: 'Link road, Mumbai' ,state:'Maharashtra',country:'India'},
    {id: '7973', area: 'Sector II, Belapur' ,state:'Maharashtra',country:'India'},
    {id: '7973', area: 'M.G.road, Dhanabad' ,state:'Jharkhand',country:'India'},
    {id: '7573', area: 'Jain temple, Bikaner' ,state:'Rajasthan',country:'India'},
    {id: '6973', area: 'Randhir Chouk,Dhanabad' ,state:'Jharkhand',country:'India'},
    {id: '9213', area: 'Camp area, Surat' ,state:'Gujrat',country:'India'},
    {id: '9973', area: 'SNDT road, Ahmedabad' ,state:'Gujrat',country:'India'},
    {id: '0233', area: 'Court gate,Bikaner' ,state:'Rajasthan',country:'India'},
    {id: '9903', area: 'Linnche,Kannur' ,state:'Kerala',country:'India'},
    {id: '2983', area: 'Achankovil road, Alleppey' ,state:'Kerala',country:'India'},
    {id: '9031', area: 'Gold city,Nashik' ,state:'Maharashtra',country:'India'},
  ]

  constructor(private fb: FormBuilder, public iconRegistry: MdIconRegistry,public sanitizer :DomSanitizer, private api_service: ApiService) {
    this.areaSection = false;
    this.siteCtrl = new FormControl();

    //site list
      this.reactiveSites = this.siteCtrl.valueChanges
      .startWith(this.siteCtrl.value)
      .map(val =>  this.displayFn(val))
      .map(name =>  this.filterSites(name));

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

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.name : value;
  }
  filterSites(val: string) {
    return val ? this.areas.filter((s) =>  s.area.match(new RegExp(val, 'gi'))) : this.areas;
  }
  closeDialog(){
    this.notify.emit('Click from nested component');
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

  ngOnInit() {
      this.modelname="Add Substation"
      this.form = this.fb.group({
        NAME : [null],
        SITE : [null],
        STATUS : [null]
      });

      if (this.parentInput) {
        this.modelname = 'Edit Substation';
        this.siteCtrl.setValue(this.parentInput.SITE);
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
  createSubStation(){
    var obj: {[k: string]: any} = {};
    obj.name = this.form.value.NAME;
    obj.status = this.form.value.STATUS;
    obj.site_id = 2;
    if (this.modelname == 'Add Substation'){
       this.api_service.addSubstation(obj).subscribe(
        data => {
           this.notify.emit('success');
        },
        err => { console.log(err);
            this.notify.emit('failed');
        });
    }else {
       this.api_service.updateSubstation(obj, this.parentInput.id).subscribe(
      data => {
          this.notify.emit('success');
      },
      err => { console.log(err);
         this.notify.emit('failed');
      });
    }
  }
}
