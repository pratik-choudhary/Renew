import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'app/services/api.service';
declare var tableToExcel: any;

@Component({
  selector: 'app-dpr-dashboard',
  templateUrl: './dpr-dashboard.component.html',
  styleUrls: ['./dpr-dashboard.component.scss']
})
export class DprDashboardComponent implements OnInit {
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('click') el:ElementRef;
  excelflag = false;
  dpr_dashboard = [];
  dpr_dashboard_copy = [];
  dpr_dashboard_location_flag=false;
  sho_dpr_location_dashboard = false;
  searchTerm:any;
  site_id_array = [];
  constructor( private api_service: ApiService) { }

  ngOnInit() {
    this.getDPRDashboard();
  }

  backFromDPRLocationDashboard(event:any)
  {
    this.sho_dpr_location_dashboard = false;
    this.site_id_array = [];
  }

  
  goToLocationDPRDashboard(){
    var dpr_location_list = this.dpr_dashboard.filter(x=>x.location_dashboard_flag == true);
    
    for(var item of dpr_location_list)
    {
      var obj: { [k: string]: any } = {};
      obj.site_id=item.site_id;
      this.site_id_array.push(obj);
    }
    console.log(this.site_id_array);
    this.sho_dpr_location_dashboard = true;
  }
  setLocationDPRFlag(i:any){
    if(this.dpr_dashboard[i].location_dashboard_flag == true)
    {
      this.dpr_dashboard[i].location_dashboard_flag = false
      if(this.dpr_dashboard.filter(x=>x.location_dashboard_flag == true).length == 0)
      {
        this.dpr_dashboard_location_flag = false;  
      }
    }
    else
    {
      this.dpr_dashboard[i].location_dashboard_flag = true;
      this.dpr_dashboard_location_flag = true;
    }
  }

  refresh()
  {
    this.getDPRDashboard();
  }

  getDPRDashboard(){
    this.api_service.getDPRDashboard().subscribe(data => {
      var temp = [];
      this.dpr_dashboard = [];
      this.dpr_dashboard_copy = [];
      for(var item of data)
      {
        var obj: { [k: string]: any } = {};
        obj.state = item.state;
        obj.site = item.site;
        obj.site_id = item.site_id;
        obj.laf = item.laf;
        obj.total_locations = item.total_locations;
        obj.pcc = item.pcc;
        obj.reinforcement_binding = item.reinforcement_binding;
        obj.soil_testing = item.soil_testing;
        obj.value_no = item.value_no;
        obj.wtg_commissioning = item.wtg_commissioning;
        obj.wtg_erection = item.wtg_erection;
        obj.wtg_generation = item.wtg_generation;
        obj.wtg_precomissioning = item.wtg_precomissioning;
        obj.assembly_lattice_finish = item.assembly_lattice_finish;
        obj.completion_foundation = item.completion_foundation;
        obj.foundation_concrete = item.foundation_concrete;
        obj.excavation = item.excavation;
        obj.erection_of_lattice_tower = item.erection_of_lattice_tower;
        obj.hoto_customer = item.hoto_customer;
        obj.dp_yard = item.dp_yard;
        obj.dp_civil = item.dp_civil;
        obj.location_dashboard_flag = false;
        if(obj.site=="")
        {
          obj.showCheckbox = false;          
        }
        else
        {
          obj.showCheckbox = true;
        }
        temp.push(obj);
      }
      this.dpr_dashboard = temp;
      this.dpr_dashboard_copy = temp;
    },err=>{});
  }

  
  search(): void {    
    let term = this.searchTerm;
    this.dpr_dashboard = this.dpr_dashboard_copy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.site)) {        
        return tag.site;
      }      
    });
  }

  exportToExcel() {    
    this.api_service.getDPRDashboardExcel().subscribe(data => {      
      const urlCreator = window.URL;
      if (urlCreator) {
        const url = urlCreator.createObjectURL(data);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = "DPRDashboard" + '.xls';
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    }, err => { });

      
    
    
    // this.excelflag = true;
    // setTimeout(function(){ 
    //   let excelFileName = "Dashboard";
    //   tableToExcel('dprtable', 'DPR Dashboard', excelFileName);      
    //  }, 3000);
    // this.excelflag = false;
}



  onBackClick()
  {
    this.notify.emit('back');
  }

}
