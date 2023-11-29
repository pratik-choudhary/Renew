import { Component ,OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  projectManager: FormControl;
  public form: FormGroup;
  locationCtrl: FormControl;
  locations = [];
  reactiveLocations: any;
  user_info: any;
  typeList = [
    'Location', 'Feeder', 'Substation'
  ];
  filteredManagers: Observable<any[]>;
   managers: any;
  

  constructor(public fb: FormBuilder, private router: Router,  private api_service: ApiService,private auth_service: AuthGuard) {
    //role management      
    this.user_info = this.auth_service.getUserInfo();
      if (this.user_info) {
        if (this.user_info.role.toUpperCase() !== 'ADMIN'
          && this.user_info.role.toUpperCase() !== 'PM') {
          this.router.navigate(['/site-dashboard']);
        }
      }
    this.loadLocations();
    this.locationCtrl = new FormControl();
     //location list
      this.reactiveLocations = this.locationCtrl.valueChanges
      .startWith(this.locationCtrl.value)
      .map(val =>  this.displayFnLocation(val))
      .map(name =>  this.filterLocation(name));
   }
  loadLocations(){
     this.api_service.getLocations().subscribe(
      data => {
        this.locations = data;
      },
      err => {  
        console.log(err);
        this.api_service.checkStatus(err);

      });
  }
  displayFnLocation(value: any): string {
    return value && typeof value === 'object' ? value.model.name : value;
  }
  filterLocation(val: string) {
    return val ? this.locations.filter((loc) =>  loc.model.name.match(new RegExp(val, 'gi'))) : this.locations;
  }

onChange(newValue) {
}


ngOnInit() {
    this.form = this.fb.group({
      name : [null,[]],
      type : [null],
      minDate : [null],
      maxDate : [null],
      projectManager: ['', Validators.required]
    });
   this.api_service.getUsers().subscribe(
      data => {
        this.managers = data;
        this.filteredManagers = this.projectManager.valueChanges.startWith(null).map(s => s ? this.filterManager(s) : this.managers.slice());
        if (data.status < 200 || data.status >= 300) {
        }
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });


  }


  filterManager(name: string) {
    return this.managers.filter(s =>
      s.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
submitform() {
  var obj: {[k: string]: any} = {};
  obj.name = this.form.value.name;
  obj.project_type = this.form.value.type;
  obj.planned_end_date = this.form.value.maxDate;
  obj.planned_start_date = this.form.value.minDate;
  obj.created_by_id = this.user_info.user_id;
  obj.gatekeeper_id = this.user_info.user_id;
  if (this.form.value.type === 'Location') {
     obj.location_id = this.locationCtrl.value.id;
  }
  this.api_service.addProject(obj).subscribe(
  data => {
     this.router.navigateByUrl('/project/' + this.form.value.name + '/' + data.data.id + '/stages');
  },
  err => { 
    console.log(err);
    this.api_service.checkStatus(err);
   });
}

}
