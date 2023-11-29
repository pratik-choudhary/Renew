import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'app/services/api.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AuthGuard } from 'app/services/auth-guard';
import { BaseChartDirective } from 'ng2-charts';
import { DqrReportComponent } from '../Dialogs/dqr-report/dqr-report.component';

declare var Chart: any;

@Component({
  selector: 'app-site-dashboard',
  templateUrl: './site-dashboard.html',
  styleUrls: ['./site-dashboard.scss']
})
export class CreateSiteComponent implements OnInit {
  @ViewChild(BaseChartDirective)
  @ViewChild('ns') el:ElementRef;
  public chart: BaseChartDirective;
  show_graph_bar_flag = false;
  show_country_dashboard_flag = true;
  showDPRLink=false;
  stageId: number;
  render_charts = true;
  site_menu_graph = [];
  selected_sites = [];
  show_graph_flag = false;
  show_dashboard_flag = false;
  selectedvalue: any;
  site_name: any;
  site_id: number;
  sites: any[] = [];
  locations: any[] = [];
  stages: any[] = [];
  selectedSite: number;
  defaultSite = 0;
  filterFlag = [];
  dpr_dashboard = false;
  totalNotStartedLocationCount = 0
  currentUser: any;
  user_info: any;
  dataJSON: any;
  dataJSONCopy: any;
  chartColors = [
    { // not started
      backgroundColor: '#fe0000',
      borderColor: 'rgba(254,0,0,1)',
      pointBackgroundColor: '#fe0000',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fe0000',
      pointHoverBorderColor: 'rgba(254,0,0,1)'
    },
    {
      //pqhc
      backgroundColor: '#ff6500',
      borderColor: 'rgba(255,101,0,1)',
      pointBackgroundColor: '#ff6500',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ff6500',
      pointHoverBorderColor: 'rgba(255,101,0,1)'
    },
    {
      //precom
      backgroundColor: '#ffcc00',
      borderColor: 'rgba(255,204,0,1)',
      pointBackgroundColor: '#ffcc00',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ffcc00',
      pointHoverBorderColor: 'rgba(255,204,0,1)'
    },

    {
      //safe run
      backgroundColor: '#ffff01',
      borderColor: 'rgba(255, 255, 1,1)',
      pointBackgroundColor: '#ffff01',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ffff01',
      pointHoverBorderColor: 'rgba(255, 255, 1,1)'
    },
    {
      //comm
      backgroundColor: '#33cc33',
      borderColor: 'rgba(51,204,51,1)',
      pointBackgroundColor: '#33cc33',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#33cc33',
      pointHoverBorderColor: 'rgba(51,204,51,1)'
    },
    {
      //config
      backgroundColor: '#c8dfff',
      borderColor: 'rgba(200,223,255,1)',
      pointBackgroundColor: '#c8dfff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#c8dfff',
      pointHoverBorderColor: 'rgba(200,223,255,1)'
    },
    {
      //signoff
      backgroundColor: '#97c0ff',
      borderColor: 'rgba(151,192,255,1)',
      pointBackgroundColor: '#97c0ff',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#97c0ff',
      pointHoverBorderColor: 'rgba(151,192,255,1)'
    },
    {
      //maintenance
      backgroundColor: '#5a9edb',
      borderColor: 'rgba(90,158,219,1)',
      pointBackgroundColor: '#5a9edb',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#5a9edb',
      pointHoverBorderColor: 'rgba(90,158,219,1)'
    },
    {
      //stpt
      backgroundColor: '#005891',
      borderColor: 'rgba(0,88,145,1)',
      pointBackgroundColor: '#005891',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#005891',
      pointHoverBorderColor: 'rgba(0,88,145,1)'
    },
    {
      //cod
      backgroundColor: '#0a8884',
      borderColor: 'rgba(10,136,132,1)',
      pointBackgroundColor: '#0a8884',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#0a8884',
      pointHoverBorderColor: 'rgba(10,136,132,1)'
    },
    { // green
      backgroundColor: '#6e9c6e',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: '#6e9c6e',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#6e9c6e',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },

  ]
  searchTerm: any;
  public barChartOptions: any = {
    legend: { position: 'left' },
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {

      xAxes: [{        
        barPercentage: 1,        
        barthickness:10,
        categoryPercentage: 1,
        stacked: true,
        ticks: {
          autoSkip: false
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'No of WTGs'
        },
        stacked: true
      }]
    },
    animation: {
      onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];
                  if(data!=0)
                  {
                    ctx.fillText(data, bar._model.x, bar._model.y+15);
                  }
                  
              });
          });
      }
  }

  };

  public barChartOptions_bar: any = {
    legend: { position: 'left' },
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        barPercentage: 1,
        categoryPercentage: 1,
        barthickness:100,
        ticks: {
          autoSkip: false
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'No of WTGs'
        }
      }]
    },
    animation: {
      onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];
                  if(data!=0)
                  {
                    ctx.fillText(data, bar._model.x, bar._model.y+15);
                  }
                  
              });
          });
      }
  }
  };

  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];



  constructor(public dialog: MdDialog, private api_service: ApiService, private auth_service: AuthGuard, private fb: FormBuilder, private router: Router) {
    this.sites = [];
    this.stages = [];
  };

  generateDPRLocationDashboard()
  {
    //this.api_service.generateLocationDPRDashboard().subscribe(data=>{},err=>{});
  }

  ngOnInit() {
    this.generateDPRLocationDashboard();
    Chart.pluginService.register({
      beforeDraw: (chart) => {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function (dataset, i) {
            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [sector]
              }, chart));
            });
          });

          // turn off normal tooltips
          chart.options.tooltips.enabled = false;
        }
      },
      afterDraw: (chart, easing) => {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1)
              return;
            chart.allTooltipsOnce = true;
          }

          // turn on tooltips
          chart.options.tooltips.enabled = true;
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize();
            tooltip.update();
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
      }
    });
    this.user_info = this.auth_service.getUserInfo();
    if (this.user_info) {
      if (this.user_info.role.toLowerCase().replace(/\s/g, '') == 'engineer' && this.user_info.department_id != 10017) {
        localStorage.clear();
        this.auth_service.setUserInfo(undefined);
        this.router.navigate(['/session/signin'], { queryParams: { error: "Unauthorized" } });
        return;
      }
      if ((this.user_info.role.toUpperCase() !== 'ADMIN' && this.user_info.role.toUpperCase() !== 'SITE_MIS' && this.user_info.role.toUpperCase() !== 'PM' && this.user_info.role.toUpperCase() !== 'QA' && this.user_info.role.toUpperCase() !== 'HOD') || (this.user_info.role.toUpperCase() == 'ENGINEER' && this.user_info.department_id == 10017)) {
        this.router.navigate(['/site-dashboard']);
      }

    }
    console.log("site id for dashboard----->" + this.api_service.site_id_for_dashboard);


    // if(this.api_service.site_id_for_dashboard == null)
    // {
    //   this.currentUser = this.user_info;
    //   this.getSites();
    // }
    // else{
    //   this.currentUser = this.user_info;
    //   this.getSitesAfterNavigation();
    // }
    this.api_service.getUserSpecificSites(this.user_info.user_id).subscribe(data=>{
      
      this.dataJSON = [];
      this.api_service.getAllSitesInIndia().subscribe(data => {        
        setTimeout(()=>{
          this.showDPRLink = true;
        }, 200);
        this.show_country_dashboard_flag = true;
        this.dataJSON = data;
        this.dataJSONCopy = this.dataJSON;
        this.site_menu_graph = [];
        if (localStorage.getItem("site_id") != null && localStorage.getItem("site_id") != undefined && localStorage.getItem("site_name") != null && localStorage.getItem("site_name") != undefined) {
          var site_data = this.dataJSON.filter(x => x.site_id == localStorage.getItem("site_id"));
          this.openSiteDashboard(site_data[0].site_id, site_data[0].site_name);
        }
  
        for (var i of this.dataJSON) {
          if (i.site_id != 0) {
            this.site_menu_graph.push({
              label: i.site_name,
              value: {
                id: i.site_id
              }
            });
          }
  
        }
  
      }
        , err => {
          // console.log(err);
          this.api_service.checkStatus(err);
        });
    },err=>{
      this.api_service.checkStatus(err);
    });
    
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  backFromDPR(event:any)
  {
    this.dpr_dashboard = false;
  }

  showDPRDashboard()
  {
    if(this.dpr_dashboard == false)
    {
      this.dpr_dashboard = true;
    }
    else
    {
      this.dpr_dashboard = false;
    }
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }




  search(): void {
    let term = this.searchTerm;
    this.dataJSON = this.dataJSONCopy.filter(function (tag) {
      var regex = new RegExp(term, 'i');
      if (regex.test(tag.site_name)) {
        return tag.site_name;
      }
    });
  }


  generateDQRReports() {
    let dialogRef = this.dialog.open(DqrReportComponent, {
      width: '35vw',
      data: {
        site: this.selectedSite
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
      }
    });  
    
  }


  onBackClickGraph() {
    //  this.show_country_dashboard_flag = false;
    this.show_dashboard_flag = false;
    this.show_graph_flag = false;
    localStorage.removeItem("site_id");
    localStorage.removeItem("site_name");
    this.ngOnInit();   
  }

  onShowGraphClick() {
    var event: any;
    this.selectSitesForGraphs(event);
  }

  onBackBargraph() {
    this.show_country_dashboard_flag = true;
    this.show_graph_bar_flag = false;
    localStorage.removeItem("site_id");
    localStorage.removeItem("site_name");
    this.ngOnInit();   
  }

  onShowBarGraphClick() {
    this.show_country_dashboard_flag = false;
    this.show_graph_bar_flag = true;
    var event: any;
    this.selectSitesForGraphs(event);
  }

  selectSitesForGraphs(event: any) {
    console.log(event);
    this.selected_sites = [];
    if (event != undefined && event.value != null) {
      this.selected_sites = event.value;
    }
    if (event != undefined && event.value.length == 0) {
      this.selected_sites = [];
    }

    console.log(this.selected_sites);
    this.render_charts = false;
    // console.log(this.selected_sites);
    if (this.selected_sites.length == 0) {
      this.barChartData = [];
      this.barChartLabels = [];
      // public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
      // public barChartType: string = 'bar';
      // public barChartLegend: boolean = true;

      // public barChartData: any[] = [
      //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
      // ];
      var not_started_obj: any = {};
      not_started_obj.data = [];
      var pqhc_obj: any = {};
      pqhc_obj.data = [];
      var pre_com_obj: any = {};
      pre_com_obj.data = [];
      var com_obj: any = {};
      com_obj.data = [];
      var safe_run_obj: any = {};
      safe_run_obj.data = [];
      var config_obj: any = {};
      config_obj.data = [];
      var config_obj: any = {};
      config_obj.data = [];
      var signoff_obj: any = {};
      signoff_obj.data = [];
      var maintenance_obj: any = {};
      maintenance_obj.data = [];
      var stpt_obj: any = {};
      stpt_obj.data = [];
      var cod_obj: any = {};
      cod_obj.data = [];
      var completed_obj: any = {};
      completed_obj.data = [];
      for (var i of this.dataJSON) {
        if (i.site_id != 0) {
          completed_obj.data.push(i.completed);
          not_started_obj.data.push(i.not_started);
          pqhc_obj.data.push(i.pqhc);
          pre_com_obj.data.push(i.pre_com);
          safe_run_obj.data.push(i.safe_run);
          com_obj.data.push(i.commissioning);
          config_obj.data.push(i.config);
          signoff_obj.data.push(i.hoto_signoff);
          stpt_obj.data.push(i.stpt);
          cod_obj.data.push(i.cod);
          this.barChartLabels.push(i.site_name);
        }

      }
      // console.log(this.site_menu_graph);
      not_started_obj.label = "Not Started";
      pqhc_obj.label = "PQHC";
      pre_com_obj.label = "Pre-Com";
      com_obj.label = "Commissioning";
      safe_run_obj.label = "Safe Run";
      config_obj.label = "Configuration";
      signoff_obj.label = "Hoto Signoff";
      maintenance_obj.label = "Maintenance";
      stpt_obj.label = "STPT";
      cod_obj.label = "COD";
      completed_obj.label = "Completed";
      var data_array = [];
      data_array.push(not_started_obj);
      data_array.push(pqhc_obj);
      data_array.push(pre_com_obj);
      data_array.push(safe_run_obj);
      data_array.push(com_obj);
      data_array.push(config_obj);
      data_array.push(signoff_obj);
      data_array.push(maintenance_obj);
      data_array.push(stpt_obj);
      data_array.push(cod_obj);
      data_array.push(completed_obj);
      this.barChartData = data_array;

      if (this.chart && this.chart.chart && this.chart.chart.config) {
        //this.chart.chart.config = this.barChartOptions;
        // this.chart.chart.config.data.colors = this.chartColors;
        // this.chart.chart.config.data.options = this.barChartOptions;
        this.chart.chart.config.data.labels = this.barChartLabels;
        // this.chart.chart.config.data.datasets = this.barChartData;
        // this.chart.chart.config.legend = this.barChartLegend;
        // this.chart.chart.config.chartType = this.barChartType;
        this.chart.chart.update();
      }

      // console.log(this.barChartData);
      // console.log(this.barChartLabels);
      if (this.show_graph_bar_flag == false) {
        this.show_graph_flag = true;
        this.render_charts = true;
      }
      else {
        this.show_graph_bar_flag = true;
        this.render_charts = true;
      }


    }
    else {
      this.render_charts = false;
      this.barChartData = [];
      this.barChartLabels = [];
      // public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
      // public barChartType: string = 'bar';
      // public barChartLegend: boolean = true;

      // public barChartData: any[] = [
      //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
      // ];
      var not_started_obj: any = {};
      not_started_obj.data = [];
      var pqhc_obj: any = {};
      pqhc_obj.data = [];
      var pre_com_obj: any = {};
      pre_com_obj.data = [];
      var com_obj: any = {};
      com_obj.data = [];
      var safe_run_obj: any = {};
      safe_run_obj.data = [];
      var config_obj: any = {};
      config_obj.data = [];
      var config_obj: any = {};
      config_obj.data = [];
      var signoff_obj: any = {};
      signoff_obj.data = [];
      var maintenance_obj: any = {};
      maintenance_obj.data = [];
      var stpt_obj: any = {};
      stpt_obj.data = [];
      var cod_obj: any = {};
      cod_obj.data = [];
      var completed_obj: any = {};
      completed_obj.data = [];
      var filtered_data = [];
      for (var d = 0; d < this.dataJSON.length; d++) {
        for (var x = 0; x < this.selected_sites.length; x++) {
          if (this.selected_sites[x].id == this.dataJSON[d].site_id) {
            filtered_data.push(this.dataJSON[d]);
          }
        }
      }
      console.log(filtered_data)
      for (var i of filtered_data) {
        if (i.site_id != 0) {
          completed_obj.data.push(i.completed);
          not_started_obj.data.push(i.not_started);
          pqhc_obj.data.push(i.pqhc);
          pre_com_obj.data.push(i.pre_com);
          safe_run_obj.data.push(i.safe_run);
          com_obj.data.push(i.commissioning);
          config_obj.data.push(i.config);
          signoff_obj.data.push(i.hoto_signoff);
          stpt_obj.data.push(i.stpt);
          cod_obj.data.push(i.cod);
          this.barChartLabels.push(i.site_name);

        }

      }
      // console.log(this.site_menu_graph);
      not_started_obj.label = "Not Started";
      pqhc_obj.label = "PQHC";
      pre_com_obj.label = "Pre-Com";
      com_obj.label = "Commissioning";
      safe_run_obj.label = "Safe Run";
      config_obj.label = "Configuration";
      signoff_obj.label = "Hoto Signoff";
      maintenance_obj.label = "Maintenance";
      stpt_obj.label = "STPT";
      cod_obj.label = "COD";
      completed_obj.label = "Completed";

      // this.barChartData.push(not_started_obj);
      // this.barChartData.push(pqhc_obj);
      // this.barChartData.push(pre_com_obj);
      // this.barChartData.push(com_obj);
      // this.barChartData.push(safe_run_obj);
      // this.barChartData.push(config_obj);
      // this.barChartData.push(signoff_obj);
      // this.barChartData.push(maintenance_obj);
      // this.barChartData.push(stpt_obj);
      // this.barChartData.push(cod_obj);
      // this.barChartData.push(completed_obj);


      var data_array = [];
      data_array.push(not_started_obj);
      data_array.push(pqhc_obj);
      data_array.push(pre_com_obj);
      data_array.push(safe_run_obj);
      data_array.push(com_obj);
      data_array.push(config_obj);
      data_array.push(signoff_obj);
      data_array.push(maintenance_obj);
      data_array.push(stpt_obj);
      data_array.push(cod_obj);
      data_array.push(completed_obj);
      this.barChartData = data_array;
      console.log(this.barChartData);
      console.log(this.barChartLabels);
      

      if (this.chart && this.chart.chart && this.chart.chart.config) {
        //this.chart.chart.config = this.barChartOptions;
        // this.chart.chart.config.data.colors = this.chartColors;
        //this.chart.chart.config.data.options = this.barChartOptions;
        //this.chart.chart.config.data.options.scales.xAxes[0].barthickness = 0.1;
        this.chart.chart.config.data.labels = this.barChartLabels;                
        // this.chart.chart.config.data.datasets = this.barChartData;
        // this.chart.chart.config.legend = this.barChartLegend;
        // this.chart.chart.config.chartType = this.barChartType;
        this.chart.chart.update();
      }
      if (this.show_graph_bar_flag == false) {
        this.show_graph_flag = true;
        this.render_charts = true;
      }
      else {
        this.show_graph_bar_flag = true;
        this.render_charts = true;
      }
    }

  }

  getSitesAfterNavigation() {

    this.api_service.getUserSpecificSites(this.currentUser.user_id).subscribe(
      data => {
        if (data.length > 0) {
          this.sites = data;
          if (this.defaultSite == 0) {
            // console.log("inside get sites after navigation");
            // console.log(this.api_service.site_id_for_dashboard);
            this.selectedSite = this.api_service.site_id_for_dashboard;
            this.getDashboardDataAfterNavigation();
            this.defaultSite++;
          }
          else {
            this.selectedSite = null;
          }
        }


      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }



  getSites() {

    this.api_service.getUserSpecificSites(this.currentUser.user_id).subscribe(
      data => {
        if (data.length > 0) {
          this.sites = data;
          if (this.defaultSite == 0) {
            this.selectedSite = this.sites[0].id;
            this.getDashboardData();
            this.defaultSite++;
          }
          else {
            this.selectedSite = null;
          }
        }


      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  getColor(stage_name: any) {
    switch (stage_name) {
      case 'PQHC': return "#ff6500";
      case 'Pre-Comm': return "#ffcc00";
      case 'Safe Run': return "#ffff01";
      case 'Commissioning': return "#33cc33";
      case 'Configuration': return "#c8dfff";
      case 'TT & HOTO Sign-Off': return "#97c0ff";
      case '500Hr Maintenance': return "#5a9edb";
      case 'STPT': return "#005891";
      case 'CoD': return "#0a8884";
    }
  }
  openSiteDashboard(site_id: any, site_name: any) {    
    this.selectedSite = site_id;
    this.site_id = site_id;
    this.api_service.site_id_for_dashboard = site_id;
    localStorage.setItem("site_id", site_id);
    localStorage.setItem("site_name", site_id);
    if (site_id != 0) {
      this.selectedSite = site_id;
      this.site_name = site_name;
      this.getDashboardData();
      this.show_dashboard_flag = true;
    }
  }
  onBackClick() {
    this.show_dashboard_flag = false;
    localStorage.removeItem("site_id");
    localStorage.removeItem("site_name");
    this.ngOnInit();   
  }

  download_apk() {
    var vin = window.open("/hoto_be/data/Apk/Hoto_v1.0.apk", "_blank");
    vin.focus();
  }
  getDashboardData() {    
    // console.log("After site selection");
    // console.log(this.selectedSite);
    // this.api_service.site_id_for_dashboard = this.selectedSite;
    this.site_id = this.selectedSite;
    this.stageId = null;
    this.api_service.getChecklistsOfStage(this.selectedSite).subscribe(
      data => {
        this.stages = data;
        for (var i of this.stages) {
          this.filterFlag.push(false);
        }
      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  getDashboardDataAfterNavigation() {
    // console.log("inside getDashboardDataAfterNavigation()");
    this.selectedSite = this.api_service.site_id_for_dashboard;
    this.site_id = this.selectedSite;
    this.stageId = null;
    this.api_service.getChecklistsOfStage(this.selectedSite).subscribe(
      data => {
        this.stages = data;
        for (var i of this.stages) {
          this.filterFlag.push(false);
        }
      },
      err => {
        // console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  // end

  stageCount(count: number) {
    this.totalNotStartedLocationCount = 0;
    var total = 0;
    for (var i of this.stages) {
      total = total + i.checklist_count;
    }
    if (count == 0 || count < 0) {
      this.totalNotStartedLocationCount = 0;
    }
    if (count != 0) {
      this.totalNotStartedLocationCount = count - total;
    }
    if (this.totalNotStartedLocationCount < 0) {
      this.totalNotStartedLocationCount = this.totalNotStartedLocationCount * -1;
    }
  }

  filterDashboardByStage(id: number, i: number) {
    if (this.stageId == null) {
      this.stageId = id;
      this.filterFlag[i] = true;
    }
    else {
      this.stageId = null;
      this.filterFlag[i] = false;
    }
  }

  showTable(event){

    let el: HTMLElement = this.el.nativeElement as HTMLElement;
    el.click();  
    console.log("event triggerd");
  }

}
