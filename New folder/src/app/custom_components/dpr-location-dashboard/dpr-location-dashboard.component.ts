import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';
import { MdDialog } from '@angular/material';
import { DprLocationSummaryComponent } from '../../Dialogs/dpr-location-summary/dpr-location-summary.component';
declare var tableToExcel: any;

@Component({
  selector: 'app-dpr-location-dashboard',
  templateUrl: './dpr-location-dashboard.component.html',
  styleUrls: ['./dpr-location-dashboard.component.scss']
})
export class DprLocationDashboardComponent implements OnInit {
  @Output() back: EventEmitter<string> = new EventEmitter<string>();
  @Input() site_list: any;
  location_data = [];
  datasource = [];
  temp_data = [];
  Notification: string;
  display: boolean;
  user_info: any;
  disabled_flag = false;
  total_data: any;
  defaultDate = null;
  totalRecords: number;
  constructor(public dialog: MdDialog, private api_service: ApiService, private auth_service: AuthGuard, ) {
    console.log("site id list recived");
    this.user_info = this.auth_service.getUserInfo();
    if (this.user_info) {
      if (this.user_info.role.toUpperCase() !== 'ADMIN' && this.user_info.role.toUpperCase() !== 'SITE_MIS' && this.user_info.role.toUpperCase() !== 'PM') {
        this.disabled_flag = true;
      }
    }
  }

  getColor(x) {
    var color: string;
    color = 'lightgreen';
    x.parentNode.parentNode.style.background = color; // x.parentNode.parentNode accesses the <td> element of table :)
  }

  BackToDPRDashboard() {
    this.back.emit("back");
  }
  ngOnInit() {
    console.log(this.site_list);
    this.api_service.getLocationDPRDashboard(this.site_list).subscribe(data => {
      this.datasource = data;
      this.totalRecords = this.datasource.length;
      console.log("total records---->"+this.totalRecords);
      this.temp_data = this.datasource.slice(0, 10);
      console.log("records after slice----->"+this.temp_data.length);
      var temp = [];
      for (var item of this.temp_data) {
        var obj: { [k: string]: any } = {};
        obj.id = item.id;
        obj.client_name = item.client_name;
        obj.state = item.state;
        obj.site = item.site;
        obj.model = item.model;
        obj.feeder_no = item.feeder_no;
        obj.cf_new = item.cf_new;
        obj.location_id = item.location_id;
        obj.location = item.location;
        obj.capacity = item.capacity;
        obj.project_definition = item.project_definition;
        obj.survey_no = item.survey_no;
        obj.village = item.village;
        obj.taluka = item.taluka;
        obj.district = item.district;
        if (item.dispatch_clearance_date != null) {
          obj.dispatch_clearance_date = new Date(item.dispatch_clearance_date);
        }
        else {
          obj.dispatch_clearance_date = null;
        }
        if (item.po_commissioning_date != null) {
          obj.po_commissioning_date = new Date(item.po_commissioning_date);
        }
        else {
          obj.po_commissioning_date = null;
        }
        if (item.laf_mom_release != null) {
          obj.laf_mom_release = new Date(item.laf_mom_release);
        }
        else {
          obj.laf_mom_release = null;
        }
        if (item.conditional_laf_workfront != null) {
          obj.conditional_laf_workfront = new Date(item.conditional_laf_workfront);
        }
        else {
          obj.conditional_laf_workfront = null;
        }
        if (item.laf_mom_acceptance != null) {
          obj.laf_mom_acceptance = new Date(item.laf_mom_acceptance);
        }
        else {
          obj.laf_mom_acceptance = null;
        }
        if (item.soil_testing != null) {
          obj.soil_testing = new Date(item.soil_testing);
        }
        else {
          obj.soil_testing = null;
        }
        if (item.re_engg != null) {
          obj.re_engg = new Date(item.re_engg);
        }
        else {
          obj.re_engg = null;
        }
        if (item.approach_road != null) {
          obj.approach_road = new Date(item.approach_road);
        }
        else {
          obj.approach_road = null;
        }
        if (item.stub_reciept != null) {
          obj.stub_reciept = new Date(item.stub_reciept);
        }
        else {
          obj.stub_reciept = null;
        }
        if (item.electrical_material_reciept_la != null) {
          obj.electrical_material_reciept_la = new Date(item.electrical_material_reciept_la);
        }
        else {
          obj.electrical_material_reciept_la = null;
        }
        if (item.stub_hw_reciept != null) {
          obj.stub_hw_reciept = new Date(item.stub_hw_reciept);
        }
        else {
          obj.stub_hw_reciept = null;
        }
        if (item.lattice_tower_reciept != null) {
          obj.lattice_tower_reciept = new Date(item.lattice_tower_reciept);
        }
        else {
          obj.lattice_tower_reciept = null;
        }
        if (item.lattice_internal_reciept != null) {
          obj.lattice_internal_reciept = new Date(item.lattice_internal_reciept);
        }
        else {
          obj.lattice_internal_reciept = null;
        }
        if (item.tadap_reciept != null) {
          obj.tadap_reciept = new Date(item.tadap_reciept);
        }
        else {
          obj.tadap_reciept = null;
        }
        if (item.tplate_reciept != null) {
          obj.tplate_reciept = new Date(item.tplate_reciept);
        }
        else {
          obj.tplate_reciept = null;
        }


        if (item.t1_reciept != null) {
          obj.t1_reciept = new Date(item.t1_reciept);
        }
        else {
          obj.t1_reciept = null;
        }
        if (item.t2_reciept != null) {
          obj.t2_reciept = new Date(item.t2_reciept);
        }
        else {
          obj.t2_reciept = null;
        }
        if (item.t3_reciept != null) {
          obj.t3_reciept = new Date(item.t3_reciept);
        }
        else {
          obj.t3_reciept = null;
        }
        if (item.t4_reciept != null) {
          obj.t4_reciept = new Date(item.t4_reciept);
        }
        else {
          obj.t4_reciept = null;
        }
        if (item.full_tower_reciept != null) {
          obj.full_tower_reciept = new Date(item.full_tower_reciept);
        }
        else {
          obj.full_tower_reciept = null;
        }
        if (item.tower_hardware_reciept != null) {
          obj.tower_hardware_reciept = new Date(item.tower_hardware_reciept);
        }
        else {
          obj.tower_hardware_reciept = null;
        }
        if (item.cable_reciept != null) {
          obj.cable_reciept = new Date(item.cable_reciept);
        }
        else {
          obj.cable_reciept = null;
        }
        if (item.power_panel_converter_panel_reciept != null) {
          obj.power_panel_converter_panel_reciept = new Date(item.power_panel_converter_panel_reciept);
        }
        else {
          obj.power_panel_converter_panel_reciept = null;
        }
        if (item.dfig_panel_reciept != null) {
          obj.dfig_panel_reciept = new Date(item.dfig_panel_reciept);
        }
        else {
          obj.dfig_panel_reciept = null;
        }
        if (item.transformer_reciept != null) {
          obj.transformer_reciept = new Date(item.transformer_reciept);
        }
        else {
          obj.transformer_reciept = null;
        }


        if (item.hub_reciept != null) {
          obj.hub_reciept = new Date(item.hub_reciept);
        }
        else {
          obj.hub_reciept = null;
        }
        if (item.hub_kit_reciept != null) {
          obj.hub_kit_reciept = new Date(item.hub_kit_reciept);
        }
        else {
          item.hub_kit_reciept = null;
        }
        if (item.nacelle_reciept != null) {
          obj.nacelle_reciept = new Date(item.nacelle_reciept);
        }
        else {
          obj.nacelle_reciept = null;
        }
        if (item.nacelle_kit_reciept != null) {
          obj.nacelle_kit_reciept = new Date(item.nacelle_kit_reciept);
        }
        else {
          obj.nacelle_kit_reciept = null;
        }
        if (item.blade_with_service_reciept != null) {
          obj.blade_with_service_reciept = new Date(item.blade_with_service_reciept);
        }
        else {
          obj.blade_with_service_reciept = null;
        }
        if (item.lift != null) {
          obj.lift = new Date(item.lift);
        }
        else {
          obj.lift = null;
        }
        if (item.full_wtg_reciept != null) {
          obj.full_wtg_reciept = new Date(item.full_wtg_reciept);
        }
        else {
          obj.full_wtg_reciept = null;
        }

        if (item.wtg_wcc_offered_to_customer != null) {
          obj.wtg_wcc_offered_to_customer = new Date(item.wtg_wcc_offered_to_customer);
        }
        else {
          obj.wtg_wcc_offered_to_customer = null;
        }
        if (item.wtg_wcc_completed_by_customer != null) {
          obj.wtg_wcc_completed_by_customer = new Date(item.wtg_wcc_completed_by_customer);
        }
        else {
          obj.wtg_wcc_completed_by_customer = null;
        }
        if (item.civil_material_reciept_anchor_bolts_studs_for_tub_model != null) {
          obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = new Date(item.civil_material_reciept_anchor_bolts_studs_for_tub_model);
        }
        else {
          obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = null;
        }
        if (item.civil_material_reciept_ar_lsp_for_tub_model != null) {
          obj.civil_material_reciept_ar_lsp_for_tub_model = new Date(item.civil_material_reciept_ar_lsp_for_tub_model);
        }
        else {
          obj.civil_material_reciept_ar_lsp_for_tub_model = null;
        }
        if (item.civil_material_reciept_tmt != null) {
          obj.civil_material_reciept_tmt = new Date(item.civil_material_reciept_tmt);
        }
        else {
          obj.civil_material_reciept_tmt = null;
        }
        if (item.civil_material_reciept_packing_plate_for_tub_model != null) {
          obj.civil_material_reciept_packing_plate_for_tub_model = new Date(item.civil_material_reciept_packing_plate_for_tub_model);
        }
        else {
          obj.civil_material_reciept_packing_plate_for_tub_model = null;
        }
        if (item.electrical_material_reciept_css != null) {
          obj.electrical_material_reciept_css = new Date(item.electrical_material_reciept_css);
        }
        else {
          obj.electrical_material_reciept_css = null;
        }
        if (item.electrical_material_reciept_ctpt != null) {
          obj.electrical_material_reciept_ctpt = new Date(item.electrical_material_reciept_ctpt);
        }
        else {
          obj.electrical_material_reciept_ctpt = null;
        }
        if (item.electrical_material_reciept_rsj_pole != null) {
          obj.electrical_material_reciept_rsj_pole = new Date(item.electrical_material_reciept_rsj_pole);
        }
        else {
          obj.electrical_material_reciept_rsj_pole = null;
        }

        if (item.electrical_material_reciept_conductor != null) {
          obj.electrical_material_reciept_conductor = new Date(item.electrical_material_reciept_conductor);
        }
        else {
          obj.electrical_material_reciept_conductor = null;
        }





        if (item.excavation != null) {
          obj.excavation = new Date(item.excavation);
        }
        else {
          obj.excavation = null;
        }
        if (item.pcc != null) {
          obj.pcc = new Date(item.pcc);
        }
        else {
          obj.pcc = null;
        }
        if (item.civil_pcc_wcc_offered_to_customer != null) {
          obj.civil_pcc_wcc_offered_to_customer = new Date(item.civil_pcc_wcc_offered_to_customer);
        }
        else {
          obj.civil_pcc_wcc_offered_to_customer = null;
        }
        if (item.civil_pcc_wcc_completed_by_customer != null) {
          obj.civil_pcc_wcc_completed_by_customer = new Date(item.civil_pcc_wcc_completed_by_customer);
        }
        else {
          obj.civil_pcc_wcc_completed_by_customer = null;
        }

        if (item.stub_assembly_ar_assembly != null) {
          obj.stub_assembly_ar_assembly = new Date(item.stub_assembly_ar_assembly);
        }
        else {
          obj.stub_assembly_ar_assembly = null;
        }
        if (item.stub_erection != null) {
          obj.stub_erection = new Date(item.stub_erection);
        }
        else {
          obj.stub_erection = null;
        }

        if (item.reinforcement_binding_and_formwork != null) {
          obj.reinforcement_binding_and_formwork = new Date(item.reinforcement_binding_and_formwork);
        }
        else {
          obj.reinforcement_binding_and_formwork = null;
        }
        if (item.shuttering != null) {
          obj.shuttering = new Date(item.shuttering);
        }
        else {
          obj.shuttering = null;
        }
        if (item.foundation_casting_raft != null) {
          obj.foundation_casting_raft = new Date(item.foundation_casting_raft);
        }
        else {
          obj.foundation_casting_raft = null;
        }

        if (item.foundation_casting_pedestal != null) {
          obj.foundation_casting_pedestal = new Date(item.foundation_casting_pedestal);
        }
        else {
          obj.foundation_casting_pedestal = null;
        }
        if (item.completion_of_foundation != null) {
          obj.completion_of_foundation = new Date(item.completion_of_foundation);
        }
        else {
          obj.completion_of_foundation = null;
        }


        if (item.seven_day_test_report != null) {
          obj.seven_day_test_report = new Date(item.seven_day_test_report);
        }
        else {
          obj.seven_day_test_report = null;
        }
        if (item.twenty_eight_day_test_report != null) {
          obj.twenty_eight_day_test_report = new Date(item.twenty_eight_day_test_report);
        }
        else {
          obj.twenty_eight_day_test_report = null;
        }
        if (item.civil_wcc_offered_to_customer != null) {
          obj.civil_wcc_offered_to_customer = new Date(item.civil_wcc_offered_to_customer);
        }
        else {
          obj.civil_wcc_offered_to_customer = null;
        }

        if (item.civil_wcc_completed_by_customer != null) {
          obj.civil_wcc_completed_by_customer = new Date(item.civil_wcc_completed_by_customer);
        }
        else {
          obj.civil_wcc_completed_by_customer = null;
        }


        if (item.dp_yard_civil_plinth_platform != null) {
          obj.dp_yard_civil_plinth_platform = new Date(item.dp_yard_civil_plinth_platform);
        }
        else {
          obj.dp_yard_civil_plinth_platform = null;
        }
        if (item.trafo_css_erection != null) {
          obj.trafo_css_erection = new Date(item.trafo_css_erection);
        }
        else {
          obj.trafo_css_erection = null;
        }
        if (item.ctpt_erection != null) {
          obj.ctpt_erection = new Date(item.ctpt_erection);
        }
        else {
          obj.ctpt_erection = null;
        }
        if (item.metering_and_plumbing_work != null) {
          obj.metering_and_plumbing_work = new Date(item.metering_and_plumbing_work);
        }
        else {
          obj.metering_and_plumbing_work = null;
        }


        if (item.earthing_strip_laying !== null) {
          obj.earthing_strip_laying = new Date(item.earthing_strip_laying);
        }
        else {
          obj.earthing_strip_laying = null;
        }
        if (item.lt_cable_laying_and_termination != null) {
          obj.lt_cable_laying_and_termination = new Date(item.lt_cable_laying_and_termination);
        }
        else {
          obj.lt_cable_laying_and_termination = null;
        }
        if (item.completion_of_dp_yard != null) {
          obj.completion_of_dp_yard = new Date(item.completion_of_dp_yard);
        }
        else {
          obj.completion_of_dp_yard = null;
        }

        obj.scope_of_lnt_lines_in_total_no_of_poles = item.scope_of_lnt_lines_in_total_no_of_poles;
        obj.survey_done_in_total_nos_int = item.survey_done_in_total_nos_int;
        obj.pit_excavations_in_nos_int = item.pit_excavations_in_nos_int;
        obj.pole_erection_in_nos_int = item.pole_erection_in_nos_int;
        obj.pole_stringing_in_nos_int = item.pole_stringing_in_nos_int;
        if (item.internal_line_completion != null) {
          obj.internal_line_completion = new Date(item.internal_line_completion);
        }
        else {
          obj.internal_line_completion = null;
        }

        obj.scope_of_external_line_in_total_no_of_poles = item.scope_of_external_line_in_total_no_of_poles;
        obj.surve_done_in_total_nos_ext = item.surve_done_in_total_nos_ext;
        obj.pit_excavations_in_nos_ext = item.pit_excavations_in_nos_ext;
        obj.pole_erection_no_nos_ext = item.pole_erection_no_nos_ext;
        obj.pole_stringing_in_nos_ext = item.pole_stringing_in_nos_ext;

        if (item.external_line_completion != null) {
          obj.external_line_completion = new Date(item.external_line_completion);
        }
        else {
          obj.external_line_completion = null;
        }
        if (item.electrical_dp_yard_wcc_offered_to_customer != null) {
          obj.electrical_dp_yard_wcc_offered_to_customer = new Date(item.electrical_dp_yard_wcc_offered_to_customer);
        }
        else {
          obj.electrical_dp_yard_wcc_offered_to_customer = null;
        }
        if (item.electrical_dp_yard_wcc_completed_by_customer != null) {
          obj.electrical_dp_yard_wcc_completed_by_customer = new Date(item.electrical_dp_yard_wcc_completed_by_customer);
        }
        else {
          obj.electrical_dp_yard_wcc_completed_by_customer = null;
        }
        if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
          obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
        }
        else {
          obj.electrical_33kv_line_wcc_completed_by_customer = null;
        }
        if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
          obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
        }
        else {
          obj.electrical_33kv_line_wcc_completed_by_customer = null;
        }
        if (item.electrical_33kv_line_wcc_offered_to_customer != null) {
          obj.electrical_33kv_line_wcc_offered_to_customer = new Date(item.electrical_33kv_line_wcc_offered_to_customer);
        }
        else {
          obj.electrical_33kv_line_wcc_offered_to_customer = null;
        }
        if (item.assembly_lattice_start != null) {
          obj.assembly_lattice_start = new Date(item.assembly_lattice_start);
        }
        else {
          obj.assembly_lattice_start = null;
        }
        if (item.assembly_lattice_finisih != null) {
          obj.assembly_lattice_finisih = new Date(item.assembly_lattice_finisih);
        }
        else {
          obj.assembly_lattice_finisih = null;
        }
        if (item.assembly_transition_adapter != null) {
          obj.assembly_transition_adapter = new Date(item.assembly_transition_adapter);
        }
        else {
          obj.assembly_transition_adapter = null;
        }

        if (item.crane_boomup != null) {
          obj.crane_boomup = new Date(item.crane_boomup);
        }
        else {
          obj.crane_boomup = null
        }
        if (item.erection_of_is4 != null) {
          obj.erection_of_is4 = new Date(item.erection_of_is4);
        }
        else {
          obj.erection_of_is4 = null;
        }
        if (item.erection_of_is3 != null) {
          obj.erection_of_is3 = new Date(item.erection_of_is3);
        }
        else {
          obj.erection_of_is3 = null;
        }
        if (item.erection_of_is2 != null) {
          obj.erection_of_is2 = new Date(item.erection_of_is2);
        }
        else {
          obj.erection_of_is2 = null;
        }
        if (item.erection_of_lattice_tower != null) {
          obj.erection_of_lattice_tower = new Date(item.erection_of_lattice_tower);
        }
        else {
          obj.erection_of_lattice_tower = null;
        }

        if (item.erection_of_tubular_tower != null) {
          obj.erection_of_tubular_tower = new Date(item.erection_of_tubular_tower);
        }
        else {
          obj.erection_of_tubular_tower = null;
        }
        if (item.erection_nacelle != null) {
          obj.erection_nacelle = new Date(item.erection_nacelle);
        }
        else {
          obj.erection_nacelle = null;
        }
        if (item.rotor_assembly != null) {
          obj.rotor_assembly = new Date(item.rotor_assembly);
        }
        else {
          obj.rotor_assembly = null;
        }
        if (item.crane_package != null) {
          obj.crane_package = item.crane_package;
        }
        else {
          obj.crane_package = null;
        }

        if (item.wtg_erection != null) {
          obj.wtg_erection = new Date(item.wtg_erection);
        }
        else {
          obj.wtg_erection = null;
        }
        if (item.lift_landing_platform != null) {
          obj.lift_landing_platform = new Date(item.lift_landing_platform);
        }
        else {
          obj.lift_landing_platform = null;
        }
        if (item.lift_installation != null) {
          obj.lift_installation = new Date(item.lift_installation);
        }
        else {
          obj.lift_installation = null;
        }
        if (item.lift_ftu != null) {
          obj.lift_ftu = new Date(item.lift_ftu);
        }
        else {
          obj.lift_ftu = null;
        }
        if (item.wtg_cable_termination != null) {
          obj.wtg_cable_termination = new Date(item.wtg_cable_termination);
        }
        else {
          obj.wtg_cable_termination = null;
        }
        if (item.mech_wcc_offered_to_customer != null) {
          obj.mech_wcc_offered_to_customer = new Date(item.mech_wcc_offered_to_customer);
        }
        else {
          obj.mech_wcc_offered_to_customer = null;
        }
        if (item.mech_wcc_completed_by_customer != null) {
          obj.mech_wcc_completed_by_customer = new Date(item.mech_wcc_completed_by_customer);
        }
        else {
          obj.mech_wcc_completed_by_customer = null;
        }
        if (item.wtg_pre_commissioning != null) {
          obj.wtg_pre_commissioning = new Date(item.wtg_pre_commissioning);
        }
        else {
          obj.wtg_pre_commissioning = null;
        }
        if (item.safe_run != null) {
          obj.safe_run = new Date(item.safe_run);
        }
        else {
          obj.safe_run = null;
        }
        if (item.ceig_approval != null) {
          obj.ceig_approval = new Date(item.ceig_approval);
        }
        else {
          obj.ceig_approval = null;
        }
        if (item.wtg_commissioning != null) {
          obj.wtg_commissioning = new Date(item.wtg_commissioning);
        }
        else {
          obj.wtg_commissioning = null;
        }
        if (item.wtg_in_generation != null) {
          obj.wtg_in_generation = new Date(item.wtg_in_generation);
        }
        else {
          obj.wtg_in_generation = null;
        }

        if (item.comm_wcc_offered_to_customer != null) {
          obj.comm_wcc_offered_to_customer = new Date(item.comm_wcc_offered_to_customer);
        }
        else {
          obj.comm_wcc_offered_to_customer = null;
        }
        if (item.comm_wcc_competed_by_customer != null) {
          obj.comm_wcc_competed_by_customer = new Date(item.comm_wcc_competed_by_customer);
        }
        else {
          obj.comm_wcc_competed_by_customer = null;
        }
        obj.risk_remark = item.risk_remark;
        obj.mitigation_plan = item.mitigation_plan;
        obj.name_of_civil_contractor = item.name_of_civil_contractor;
        obj.name_of_electrical_contractor_dp_yard = item.name_of_electrical_contractor_dp_yard;
        obj.name_of_electrical_contractor_elect_yard = item.name_of_electrical_contractor_elect_yard;
        obj.name_of_assembly_contractor = item.name_of_assembly_contractor;
        obj.name_of_mechanical_contractor = item.name_of_mechanical_contractor;
        obj.name_of_cable_termination = item.name_of_cable_termination;
        if (item.hoto_projects_oms != null) {
          obj.hoto_projects_oms = new Date(item.hoto_projects_oms);
        }
        else {
          obj.hoto_projects_oms = null;
        }
        if (item.hoto_customer != null) {
          obj.hoto_customer = new Date(item.hoto_customer);
        }
        else {
          obj.hoto_customer = null;
        }

        obj.saveFlag = false;
        obj.editable_flag = true;
        temp.push(obj);
      }
      this.location_data = temp;
    }, err => { });

  }


  exportToExcel() {
    this.api_service.getDPRLocationDashboardExcel(this.site_list).subscribe(data => {      
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
   // let excelFileName = "Dashboard";
   // tableToExcel('exceltable', 'DPR Dashboard', excelFileName);
  }

  refresh() {
    this.ngOnInit();
  }

  increaseDate(date: Date) {

    //this is a hacky
    if (date.getMilliseconds() == 0 && date.getMinutes() == 0 && date.getHours() == 0) {
      date.setDate(date.getDate() + 1);
    } else {
    }
    //return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return date;
  }

  updateLocationDPRDashboard(item: any, i: any) {
    console.log(item);
    console.log(i);
   // console.log(this.location_data_original);
    var obj: { [k: string]: any } = {};
    obj.id = item.id;
    obj.client_name = item.client_name;
    obj.state = item.state;
    obj.site = item.site;
    obj.model = item.model;
    obj.feeder_no = item.feeder_no;
    obj.cf_new = item.cf_new;
    obj.location_id = item.location_id;
    obj.location = item.location;
    obj.capacity = item.capacity;
    obj.project_definition = item.project_definition;
    obj.survey_no = item.survey_no;
    obj.village = item.village;
    obj.taluka = item.taluka;
    obj.district = item.district;
    if (item.dispatch_clearance_date != null) {
      console.log(new Date(item.dispatch_clearance_date));
      obj.dispatch_clearance_date = this.increaseDate(new Date(item.dispatch_clearance_date));
    }
    else {
      obj.dispatch_clearance_date = null;
    }
    if (item.po_commissioning_date != null) {
      console.log(item.po_commissioning_date);
      obj.po_commissioning_date = this.increaseDate(new Date(item.po_commissioning_date));
    }
    else {
      obj.po_commissioning_date = null;
    }
    if (item.laf_mom_release != null) {
      console.log(item.laf_mom_release)
      obj.laf_mom_release = this.increaseDate(new Date(item.laf_mom_release));
    }
    else {
      obj.laf_mom_release = null;
    }
    if (item.conditional_laf_workfront != null) {
      obj.conditional_laf_workfront = this.increaseDate(new Date(item.conditional_laf_workfront));
    }
    else {
      obj.conditional_laf_workfront = null;
    }
    if (item.laf_mom_acceptance != null) {
      obj.laf_mom_acceptance = this.increaseDate(new Date(item.laf_mom_acceptance));
    }
    else {
      obj.laf_mom_acceptance = null;
    }
    if (item.soil_testing != null) {
      obj.soil_testing = this.increaseDate(new Date(item.soil_testing));
    }
    else {
      obj.soil_testing = null;
    }
    if (item.re_engg != null) {
      obj.re_engg = this.increaseDate(new Date(item.re_engg));
    }
    else {
      obj.re_engg = null;
    }
    if (item.approach_road != null) {
      obj.approach_road = this.increaseDate(new Date(item.approach_road));
    }
    else {
      obj.approach_road = null;
    }
    if (item.stub_reciept != null) {
      obj.stub_reciept = this.increaseDate(new Date(item.stub_reciept));
    }
    else {
      obj.stub_reciept = null;
    }
    if (item.stub_hw_reciept != null) {
      obj.stub_hw_reciept = this.increaseDate(new Date(item.stub_hw_reciept));
    }
    else {
      obj.stub_hw_reciept = null;
    }
    if (item.lattice_tower_reciept != null) {
      obj.lattice_tower_reciept = this.increaseDate(new Date(item.lattice_tower_reciept));
    }
    else {
      obj.lattice_tower_reciept = null;
    }
    if (item.lattice_internal_reciept != null) {
      obj.lattice_internal_reciept = this.increaseDate(new Date(item.lattice_internal_reciept));
    }
    else {
      obj.lattice_internal_reciept = null;
    }
    if (item.tadap_reciept != null) {
      obj.tadap_reciept = this.increaseDate(new Date(item.tadap_reciept));
    }
    else {
      obj.tadap_reciept = null;
    }
    if (item.tplate_reciept != null) {
      obj.tplate_reciept = this.increaseDate(new Date(item.tplate_reciept));
    }
    else {
      obj.tplate_reciept = null;
    }

    if (item.t1_reciept != null) {
      obj.t1_reciept = this.increaseDate(new Date(item.t1_reciept));
    }
    else {
      obj.t1_reciept = null;
    }
    if (item.t2_reciept != null) {
      obj.t2_reciept = this.increaseDate(new Date(item.t2_reciept));
    }
    else {
      obj.t2_reciept = null;
    }
    if (item.t3_reciept != null) {
      obj.t3_reciept = this.increaseDate(new Date(item.t3_reciept));
    }
    else {
      obj.t3_reciept = null;
    }
    if (item.t4_reciept != null) {
      obj.t4_reciept = this.increaseDate(new Date(item.t4_reciept));
    }
    else {
      obj.t4_reciept = null;
    }
    if (item.full_tower_reciept != null) {
      obj.full_tower_reciept = this.increaseDate(new Date(item.full_tower_reciept));
    }
    else {
      obj.full_tower_reciept = null;
    }
    if (item.tower_hardware_reciept != null) {
      obj.tower_hardware_reciept = this.increaseDate(new Date(item.tower_hardware_reciept));
    }
    else {
      obj.tower_hardware_reciept = null;
    }
    if (item.cable_reciept != null) {
      obj.cable_reciept = this.increaseDate(new Date(item.cable_reciept));
    }
    else {
      obj.cable_reciept = null;
    }
    if (item.power_panel_converter_panel_reciept != null) {
      obj.power_panel_converter_panel_reciept = this.increaseDate(new Date(item.power_panel_converter_panel_reciept));
    }
    else {
      obj.power_panel_converter_panel_reciept = null;
    }
    if (item.dfig_panel_reciept != null) {
      obj.dfig_panel_reciept = this.increaseDate(new Date(item.dfig_panel_reciept));
    }
    else {
      obj.dfig_panel_reciept = null;
    }
    if (item.transformer_reciept != null) {
      obj.transformer_reciept = this.increaseDate(new Date(item.transformer_reciept));
    }
    else {
      obj.transformer_reciept = null;
    }


    if (item.hub_reciept != null) {
      obj.hub_reciept = this.increaseDate(new Date(item.hub_reciept));
    }
    else {
      obj.hub_reciept = null;
    }
    if (item.hub_kit_reciept != null) {
      obj.hub_kit_reciept = this.increaseDate(new Date(item.hub_kit_reciept));
    }
    else {
      item.hub_kit_reciept = null;
    }
    if (item.nacelle_reciept != null) {
      obj.nacelle_reciept = this.increaseDate(new Date(item.nacelle_reciept));
    }
    else {
      obj.nacelle_reciept = null;
    }

    if (item.nacelle_kit_reciept != null) {
      obj.nacelle_kit_reciept = this.increaseDate(new Date(item.nacelle_kit_reciept));
    }
    else {
      obj.nacelle_kit_reciept = null;
    }
    if (item.blade_with_service_reciept != null) {
      obj.blade_with_service_reciept = this.increaseDate(new Date(item.blade_with_service_reciept));
    }
    else {
      obj.blade_with_service_reciept = null;
    }
    if (item.lift != null) {
      obj.lift = this.increaseDate(new Date(item.lift));
    }
    else {
      obj.lift = null;
    }
    if (item.full_wtg_reciept != null) {
      obj.full_wtg_reciept = this.increaseDate(new Date(item.full_wtg_reciept));
    }
    else {
      obj.full_wtg_reciept = null;
    }

    if (item.wtg_wcc_offered_to_customer != null) {
      obj.wtg_wcc_offered_to_customer = this.increaseDate(new Date(item.wtg_wcc_offered_to_customer));
    }
    else {
      obj.wtg_wcc_offered_to_customer = null;
    }
    if (item.wtg_wcc_completed_by_customer != null) {
      obj.wtg_wcc_completed_by_customer = this.increaseDate(new Date(item.wtg_wcc_completed_by_customer));
    }
    else {
      obj.wtg_wcc_completed_by_customer = null;
    }
    if (item.civil_material_reciept_anchor_bolts_studs_for_tub_model != null) {
      obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = this.increaseDate(new Date(item.civil_material_reciept_anchor_bolts_studs_for_tub_model));
    }
    else {
      obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = null;
    }
    if (item.civil_material_reciept_ar_lsp_for_tub_model != null) {
      obj.civil_material_reciept_ar_lsp_for_tub_model = this.increaseDate(new Date(item.civil_material_reciept_ar_lsp_for_tub_model));
    }
    else {
      obj.civil_material_reciept_ar_lsp_for_tub_model = null;
    }
    if (item.civil_material_reciept_tmt != null) {
      obj.civil_material_reciept_tmt = this.increaseDate(new Date(item.civil_material_reciept_tmt));
    }
    else {
      obj.civil_material_reciept_tmt = null;
    }
    if (item.civil_material_reciept_packing_plate_for_tub_model != null) {
      obj.civil_material_reciept_packing_plate_for_tub_model = this.increaseDate(new Date(item.civil_material_reciept_packing_plate_for_tub_model));
    }
    else {
      obj.civil_material_reciept_packing_plate_for_tub_model = null;
    }
    if (item.electrical_material_reciept_css != null) {
      obj.electrical_material_reciept_css = this.increaseDate(new Date(item.electrical_material_reciept_css));
    }
    else {
      obj.electrical_material_reciept_css = null;
    }
    if (item.electrical_material_reciept_ctpt != null) {
      obj.electrical_material_reciept_ctpt = this.increaseDate(new Date(item.electrical_material_reciept_ctpt));
    }
    else {
      obj.electrical_material_reciept_ctpt = null;
    }
    if (item.electrical_material_reciept_la != null) {
      obj.electrical_material_reciept_la = this.increaseDate(new Date(item.electrical_material_reciept_la));
    }
    else {
      obj.electrical_material_reciept_la = null;
    }
    if (item.electrical_material_reciept_rsj_pole != null) {
      obj.electrical_material_reciept_rsj_pole = this.increaseDate(new Date(item.electrical_material_reciept_rsj_pole));
    }
    else {
      obj.electrical_material_reciept_rsj_pole = null;
    }
    if (item.electrical_material_reciept_conductor != null) {
      obj.electrical_material_reciept_conductor = this.increaseDate(new Date(item.electrical_material_reciept_conductor));
    }
    else {
      obj.electrical_material_reciept_conductor = null;
    }





    if (item.excavation != null) {
      obj.excavation = this.increaseDate(new Date(item.excavation));
    }
    else {
      obj.excavation = null;
    }
    if (item.pcc != null) {
      obj.pcc = this.increaseDate(new Date(item.pcc));
    }
    else {
      obj.pcc = null;
    }
    if (item.civil_pcc_wcc_offered_to_customer != null) {
      obj.civil_pcc_wcc_offered_to_customer = this.increaseDate(new Date(item.civil_pcc_wcc_offered_to_customer));
    }
    else {
      obj.civil_pcc_wcc_offered_to_customer = null;
    }
    if (item.civil_pcc_wcc_completed_by_customer != null) {
      obj.civil_pcc_wcc_completed_by_customer = this.increaseDate(new Date(item.civil_pcc_wcc_completed_by_customer));
    }
    else {
      obj.civil_pcc_wcc_completed_by_customer = null;
    }

    if (item.stub_assembly_ar_assembly != null) {
      obj.stub_assembly_ar_assembly = this.increaseDate(new Date(item.stub_assembly_ar_assembly));
    }
    else {
      obj.stub_assembly_ar_assembly = null;
    }
    if (item.stub_erection != null) {
      obj.stub_erection = this.increaseDate(new Date(item.stub_erection));
    }
    else {
      obj.stub_erection = null;
    }

    // if(item.reinforcement_binding_and_formwork!=null &&  this.location_data_original[i].reinforcement_binding_and_formwork!=item.reinforcement_binding_and_formwork)
    // {
    //   obj.reinforcement_binding_and_formwork = this.increaseDate(new Date(item.reinforcement_binding_and_formwork));
    // }
    // else
    // {
    //   obj.reinforcement_binding_and_formwork = null;
    // }
    if (item.shuttering != null) {
      obj.shuttering = this.increaseDate(new Date(item.shuttering));
    }
    else {
      obj.shuttering = null;
    }
    if (item.foundation_casting_raft != null) {
      obj.foundation_casting_raft = item.foundation_casting_raft;
    }
    else {
      obj.foundation_casting_raft = null;
    }
    if (item.foundation_casting_pedestal != null) {
      obj.foundation_casting_pedestal = this.increaseDate(new Date(item.foundation_casting_pedestal));
    }
    else {
      obj.foundation_casting_pedestal = null;
    }
    // if(item.completion_of_foundation!=null && this.location_data_original[i].completion_of_foundation!=item.completion_of_foundation)  
    // {
    //   obj.completion_of_foundation = this.increaseDate(new Date(item.completion_of_foundation));
    // }
    // else
    // {
    //   obj.completion_of_foundation = null;
    // }


    if (item.seven_day_test_report != null) {
      obj.seven_day_test_report = this.increaseDate(new Date(item.seven_day_test_report));
    }
    else {
      obj.seven_day_test_report = null;
    }
    if (item.twenty_eight_day_test_report != null) {
      obj.twenty_eight_day_test_report = this.increaseDate(new Date(item.twenty_eight_day_test_report));
    }
    else {
      obj.twenty_eight_day_test_report = null;
    }
    if (item.civil_wcc_offered_to_customer != null) {
      obj.civil_wcc_offered_to_customer = this.increaseDate(new Date(item.civil_wcc_offered_to_customer));
    }
    else {
      obj.civil_wcc_offered_to_customer = null;
    }
    if (item.civil_wcc_completed_by_customer != null) {
      obj.civil_wcc_completed_by_customer = this.increaseDate(new Date(item.civil_wcc_completed_by_customer));
    }
    else {
      obj.civil_wcc_completed_by_customer = null;
    }


    if (item.dp_yard_civil_plinth_platform != null) {
      obj.dp_yard_civil_plinth_platform = this.increaseDate(new Date(item.dp_yard_civil_plinth_platform));
    }
    else {
      obj.dp_yard_civil_plinth_platform = null;
    }
    if (item.trafo_css_erection != null) {
      obj.trafo_css_erection = this.increaseDate(new Date(item.trafo_css_erection));
    }
    else {
      obj.trafo_css_erection = null;
    }
    if (item.ctpt_erection != null) {
      obj.ctpt_erection = this.increaseDate(new Date(item.ctpt_erection));
    }
    else {
      obj.ctpt_erection = null;
    }
    if (item.metering_and_plumbing_work != null) {
      obj.metering_and_plumbing_work = this.increaseDate(new Date(item.metering_and_plumbing_work));
    }
    else {
      obj.metering_and_plumbing_work = null;
    }


    if (item.earthing_strip_laying !== null) {
      obj.earthing_strip_laying = this.increaseDate(new Date(item.earthing_strip_laying));
    }
    else {
      obj.earthing_strip_laying = null;
    }
    if (item.lt_cable_laying_and_termination != null) {
      obj.lt_cable_laying_and_termination = this.increaseDate(new Date(item.lt_cable_laying_and_termination));
    }
    else {
      obj.lt_cable_laying_and_termination = null;
    }
    if (item.completion_of_dp_yard != null) {
      obj.completion_of_dp_yard = this.increaseDate(new Date(item.completion_of_dp_yard));
    }
    else {
      obj.completion_of_dp_yard = null;
    }

    obj.scope_of_lnt_lines_in_total_no_of_poles = item.scope_of_lnt_lines_in_total_no_of_poles;
    obj.survey_done_in_total_nos_int = item.survey_done_in_total_nos_int;
    obj.pit_excavations_in_nos_int = item.pit_excavations_in_nos_int;
    obj.pole_erection_in_nos_int = item.pole_erection_in_nos_int;
    obj.pole_stringing_in_nos_int = item.pole_stringing_in_nos_int;
    if (item.internal_line_completion != null) {
      obj.internal_line_completion = this.increaseDate(new Date(item.internal_line_completion));
    }
    else {
      obj.internal_line_completion = null;
    }

    obj.scope_of_external_line_in_total_no_of_poles = item.scope_of_external_line_in_total_no_of_poles;
    obj.surve_done_in_total_nos_ext = item.surve_done_in_total_nos_ext;
    obj.pit_excavations_in_nos_ext = item.pit_excavations_in_nos_ext;
    obj.pole_erection_no_nos_ext = item.pole_erection_no_nos_ext;
    obj.pole_stringing_in_nos_ext = item.pole_stringing_in_nos_ext;
    if (item.external_line_completion != null) {
      obj.external_line_completion = this.increaseDate(new Date(item.external_line_completion));
    }
    else {
      obj.external_line_completion = null;
    }
    if (item.electrical_dp_yard_wcc_offered_to_customer != null) {
      obj.electrical_dp_yard_wcc_offered_to_customer = this.increaseDate(new Date(item.electrical_dp_yard_wcc_offered_to_customer));
    }
    else {
      obj.electrical_dp_yard_wcc_offered_to_customer = null;
    }
    if (item.electrical_dp_yard_wcc_offered_to_customer != null) {
      obj.electrical_dp_yard_wcc_offered_to_customer = this.increaseDate(new Date(item.electrical_dp_yard_wcc_offered_to_customer));
    }
    else {
      obj.electrical_dp_yard_wcc_offered_to_customer = null;
    }

    if (item.electrical_dp_yard_wcc_completed_by_customer != null) {
      obj.electrical_dp_yard_wcc_completed_by_customer = this.increaseDate(new Date(item.electrical_dp_yard_wcc_completed_by_customer));
    }
    else {
      obj.electrical_dp_yard_wcc_completed_by_customer = null;
    }
    if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
      obj.electrical_33kv_line_wcc_completed_by_customer = this.increaseDate(new Date(item.electrical_33kv_line_wcc_completed_by_customer));
    }
    else {
      obj.electrical_33kv_line_wcc_completed_by_customer = null;
    }
    if (item.assembly_lattice_start != null) {
      obj.assembly_lattice_start = this.increaseDate(new Date(item.assembly_lattice_start));
    }
    else {
      obj.assembly_lattice_start = null;
    }
    if (item.assembly_lattice_finisih != null) {
      obj.assembly_lattice_finisih = this.increaseDate(new Date(item.assembly_lattice_finisih));
    }
    else {
      obj.assembly_lattice_finisih = null;
    }
    if (item.assembly_transition_adapter != null) {
      obj.assembly_transition_adapter = this.increaseDate(new Date(item.assembly_transition_adapter));
    }
    else {
      obj.assembly_transition_adapter = null;
    }
    if (item.crane_boomup != null) {
      obj.crane_boomup = this.increaseDate(new Date(item.crane_boomup));
    }
    else {
      obj.crane_boomup = null
    }
    if (item.erection_of_is4 != null) {
      obj.erection_of_is4 = this.increaseDate(new Date(item.erection_of_is4));
    }
    else {
      obj.erection_of_is4 = null;
    }
    if (item.erection_of_is3 != null) {
      obj.erection_of_is3 = this.increaseDate(new Date(item.erection_of_is3));
    }
    else {
      obj.erection_of_is3 = null;
    }
    if (item.erection_of_is2 != null) {
      obj.erection_of_is2 = this.increaseDate(new Date(item.erection_of_is2));
    }
    else {
      obj.erection_of_is2 = null;
    }

    if (item.erection_of_lattice_tower != null) {
      obj.erection_of_lattice_tower = this.increaseDate(new Date(item.erection_of_lattice_tower));
    }
    else {
      obj.erection_of_lattice_tower = null;
    }

    if (item.erection_of_tubular_tower != null) {
      obj.erection_of_tubular_tower = this.increaseDate(new Date(item.erection_of_tubular_tower));
    }
    else {
      obj.erection_of_tubular_tower = null;
    }
    if (item.erection_nacelle != null) {
      obj.erection_nacelle = this.increaseDate(new Date(item.erection_nacelle));
    }
    else {
      obj.erection_nacelle = null;
    }
    if (item.rotor_assembly != null) {
      obj.rotor_assembly = this.increaseDate(new Date(item.rotor_assembly));
    }
    else {
      obj.rotor_assembly = null;
    }

    obj.crane_package = item.crane_package;
    if (item.wtg_erection != null) {
      obj.wtg_erection = this.increaseDate(new Date(item.wtg_erection));
    }
    else {
      obj.wtg_erection = null;
    }
    if (item.lift_landing_platform != null) {
      obj.lift_landing_platform = this.increaseDate(new Date(item.lift_landing_platform));
    }
    else {
      obj.lift_landing_platform = null;
    }
    if (item.lift_installation != null) {
      obj.lift_installation = this.increaseDate(new Date(item.lift_installation));
    }
    else {
      obj.lift_installation = null;
    }
    if (item.lift_ftu != null) {
      obj.lift_ftu = this.increaseDate(new Date(item.lift_ftu));
    }
    else {
      obj.lift_ftu = null;
    }
    if (item.wtg_cable_termination != null) {
      obj.wtg_cable_termination = this.increaseDate(new Date(item.wtg_cable_termination));
    }
    else {
      obj.wtg_cable_termination = null;
    }
    if (item.mech_wcc_offered_to_customer != null) {
      obj.mech_wcc_offered_to_customer = this.increaseDate(new Date(item.mech_wcc_offered_to_customer));
    }
    else {
      obj.mech_wcc_offered_to_customer = null;
    }
    if (item.mech_wcc_completed_by_customer != null) {
      obj.mech_wcc_completed_by_customer = this.increaseDate(new Date(item.mech_wcc_completed_by_customer));
    }
    else {
      obj.mech_wcc_completed_by_customer = null;
    }
    // if(item.wtg_pre_commissioning!=null )
    // {
    //   obj.wtg_pre_commissioning = this.increaseDate(new Date(item.wtg_pre_commissioning));  
    // }
    // else
    // {
    //   obj.wtg_pre_commissioning = null;
    // }        
    // if(item.safe_run!=null)
    // {
    //   obj.safe_run = this.increaseDate(new Date(item.safe_run));
    // }
    // else
    // {
    //   obj.safe_run =null;
    // }
    if (item.ceig_approval != null) {
      obj.ceig_approval = this.increaseDate(new Date(item.ceig_approval));
    }
    else {
      obj.ceig_approval = null;
    }
    // if(item.wtg_commissioning!=null)
    // {
    //   obj.wtg_commissioning = this.increaseDate(new Date(item.wtg_commissioning));
    // }  
    // else
    // {
    //   obj.wtg_commissioning = null;
    // }
    if (item.wtg_in_generation != null) {
      obj.wtg_in_generation = this.increaseDate(new Date(item.wtg_in_generation));
    }
    else {
      obj.wtg_in_generation = null;
    }

    if (item.comm_wcc_offered_to_customer != null) {
      obj.comm_wcc_offered_to_customer = this.increaseDate(new Date(item.comm_wcc_offered_to_customer));
    }
    else {
      obj.comm_wcc_offered_to_customer = null;
    }
    if (item.comm_wcc_competed_by_customer != null) {
      obj.comm_wcc_competed_by_customer = this.increaseDate(new Date(item.comm_wcc_competed_by_customer));
    }
    else {
      obj.comm_wcc_competed_by_customer = null;
    }
    if (item.electrical_33kv_line_wcc_offered_to_customer != null) {
      obj.electrical_33kv_line_wcc_offered_to_customer = this.increaseDate(new Date(item.electrical_33kv_line_wcc_offered_to_customer));
    }
    else {
      obj.electrical_33kv_line_wcc_offered_to_customer = null;
    }
    obj.risk_remark = item.risk_remark;
    obj.mitigation_plan = item.mitigation_plan;
    obj.name_of_civil_contractor = item.name_of_civil_contractor;
    obj.name_of_electrical_contractor_dp_yard = item.name_of_electrical_contractor_dp_yard;
    obj.name_of_electrical_contractor_elect_yard = item.name_of_electrical_contractor_elect_yard;
    obj.name_of_assembly_contractor = item.name_of_assembly_contractor;
    obj.name_of_mechanical_contractor = item.name_of_mechanical_contractor;
    obj.name_of_cable_termination = item.name_of_cable_termination;
    // if(item.hoto_projects_oms!=null)
    // {
    //   obj.hoto_projects_oms = this.increaseDate(new Date(item.hoto_projects_oms));
    // }
    // else
    // {
    //   obj.hoto_projects_oms = null;
    // }
    if (item.hoto_customer != null) {
      obj.hoto_customer = this.increaseDate(new Date(item.hoto_customer));
    }
    else {
      obj.hoto_customer = null;
    }

    this.api_service.updateLocationDPRDashboard(obj, obj.id).subscribe(data => {
      setTimeout(() => {
        if (data == 1) {
          this.display = true;
          this.Notification = 'Location Dashboard DPR data updated';
        }
        else {
          this.display = true;
          this.Notification = 'Location Dashboard DPR data update failed';
        }
      }, 400);
    }, err => { });



  }

  loadDataLazy(event: any) {
    setTimeout(() => {
      if (this.datasource) {
        this.temp_data = this.datasource.slice(event.first, (event.first + event.rows));
        var temp = [];
        for (var item of this.temp_data) {
          var obj: { [k: string]: any } = {};
          obj.id = item.id;
          obj.client_name = item.client_name;
          obj.state = item.state;
          obj.site = item.site;
          obj.model = item.model;
          obj.feeder_no = item.feeder_no;
          obj.cf_new = item.cf_new;
          obj.location_id = item.location_id;
          obj.location = item.location;
          obj.capacity = item.capacity;
          obj.project_definition = item.project_definition;
          obj.survey_no = item.survey_no;
          obj.village = item.village;
          obj.taluka = item.taluka;
          obj.district = item.district;
          if (item.dispatch_clearance_date != null) {
            obj.dispatch_clearance_date = new Date(item.dispatch_clearance_date);
          }
          else {
            obj.dispatch_clearance_date = null;
          }
          if (item.po_commissioning_date != null) {
            obj.po_commissioning_date = new Date(item.po_commissioning_date);
          }
          else {
            obj.po_commissioning_date = null;
          }
          if (item.laf_mom_release != null) {
            obj.laf_mom_release = new Date(item.laf_mom_release);
          }
          else {
            obj.laf_mom_release = null;
          }
          if (item.conditional_laf_workfront != null) {
            obj.conditional_laf_workfront = new Date(item.conditional_laf_workfront);
          }
          else {
            obj.conditional_laf_workfront = null;
          }
          if (item.laf_mom_acceptance != null) {
            obj.laf_mom_acceptance = new Date(item.laf_mom_acceptance);
          }
          else {
            obj.laf_mom_acceptance = null;
          }
          if (item.soil_testing != null) {
            obj.soil_testing = new Date(item.soil_testing);
          }
          else {
            obj.soil_testing = null;
          }
          if (item.re_engg != null) {
            obj.re_engg = new Date(item.re_engg);
          }
          else {
            obj.re_engg = null;
          }
          if (item.approach_road != null) {
            obj.approach_road = new Date(item.approach_road);
          }
          else {
            obj.approach_road = null;
          }
          if (item.stub_reciept != null) {
            obj.stub_reciept = new Date(item.stub_reciept);
          }
          else {
            obj.stub_reciept = null;
          }
          if (item.electrical_material_reciept_la != null) {
            obj.electrical_material_reciept_la = new Date(item.electrical_material_reciept_la);
          }
          else {
            obj.electrical_material_reciept_la = null;
          }
          if (item.stub_hw_reciept != null) {
            obj.stub_hw_reciept = new Date(item.stub_hw_reciept);
          }
          else {
            obj.stub_hw_reciept = null;
          }
          if (item.lattice_tower_reciept != null) {
            obj.lattice_tower_reciept = new Date(item.lattice_tower_reciept);
          }
          else {
            obj.lattice_tower_reciept = null;
          }
          if (item.lattice_internal_reciept != null) {
            obj.lattice_internal_reciept = new Date(item.lattice_internal_reciept);
          }
          else {
            obj.lattice_internal_reciept = null;
          }
          if (item.tadap_reciept != null) {
            obj.tadap_reciept = new Date(item.tadap_reciept);
          }
          else {
            obj.tadap_reciept = null;
          }
          if (item.tplate_reciept != null) {
            obj.tplate_reciept = new Date(item.tplate_reciept);
          }
          else {
            obj.tplate_reciept = null;
          }


          if (item.t1_reciept != null) {
            obj.t1_reciept = new Date(item.t1_reciept);
          }
          else {
            obj.t1_reciept = null;
          }
          if (item.t2_reciept != null) {
            obj.t2_reciept = new Date(item.t2_reciept);
          }
          else {
            obj.t2_reciept = null;
          }
          if (item.t3_reciept != null) {
            obj.t3_reciept = new Date(item.t3_reciept);
          }
          else {
            obj.t3_reciept = null;
          }
          if (item.t4_reciept != null) {
            obj.t4_reciept = new Date(item.t4_reciept);
          }
          else {
            obj.t4_reciept = null;
          }
          if (item.full_tower_reciept != null) {
            obj.full_tower_reciept = new Date(item.full_tower_reciept);
          }
          else {
            obj.full_tower_reciept = null;
          }
          if (item.tower_hardware_reciept != null) {
            obj.tower_hardware_reciept = new Date(item.tower_hardware_reciept);
          }
          else {
            obj.tower_hardware_reciept = null;
          }
          if (item.cable_reciept != null) {
            obj.cable_reciept = new Date(item.cable_reciept);
          }
          else {
            obj.cable_reciept = null;
          }
          if (item.power_panel_converter_panel_reciept != null) {
            obj.power_panel_converter_panel_reciept = new Date(item.power_panel_converter_panel_reciept);
          }
          else {
            obj.power_panel_converter_panel_reciept = null;
          }
          if (item.dfig_panel_reciept != null) {
            obj.dfig_panel_reciept = new Date(item.dfig_panel_reciept);
          }
          else {
            obj.dfig_panel_reciept = null;
          }
          if (item.transformer_reciept != null) {
            obj.transformer_reciept = new Date(item.transformer_reciept);
          }
          else {
            obj.transformer_reciept = null;
          }


          if (item.hub_reciept != null) {
            obj.hub_reciept = new Date(item.hub_reciept);
          }
          else {
            obj.hub_reciept = null;
          }
          if (item.hub_kit_reciept != null) {
            obj.hub_kit_reciept = new Date(item.hub_kit_reciept);
          }
          else {
            item.hub_kit_reciept = null;
          }
          if (item.nacelle_reciept != null) {
            obj.nacelle_reciept = new Date(item.nacelle_reciept);
          }
          else {
            obj.nacelle_reciept = null;
          }
          if (item.nacelle_kit_reciept != null) {
            obj.nacelle_kit_reciept = new Date(item.nacelle_kit_reciept);
          }
          else {
            obj.nacelle_kit_reciept = null;
          }
          if (item.blade_with_service_reciept != null) {
            obj.blade_with_service_reciept = new Date(item.blade_with_service_reciept);
          }
          else {
            obj.blade_with_service_reciept = null;
          }
          if (item.lift != null) {
            obj.lift = new Date(item.lift);
          }
          else {
            obj.lift = null;
          }
          if (item.full_wtg_reciept != null) {
            obj.full_wtg_reciept = new Date(item.full_wtg_reciept);
          }
          else {
            obj.full_wtg_reciept = null;
          }

          if (item.wtg_wcc_offered_to_customer != null) {
            obj.wtg_wcc_offered_to_customer = new Date(item.wtg_wcc_offered_to_customer);
          }
          else {
            obj.wtg_wcc_offered_to_customer = null;
          }
          if (item.wtg_wcc_completed_by_customer != null) {
            obj.wtg_wcc_completed_by_customer = new Date(item.wtg_wcc_completed_by_customer);
          }
          else {
            obj.wtg_wcc_completed_by_customer = null;
          }
          if (item.civil_material_reciept_anchor_bolts_studs_for_tub_model != null) {
            obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = new Date(item.civil_material_reciept_anchor_bolts_studs_for_tub_model);
          }
          else {
            obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = null;
          }
          if (item.civil_material_reciept_ar_lsp_for_tub_model != null) {
            obj.civil_material_reciept_ar_lsp_for_tub_model = new Date(item.civil_material_reciept_ar_lsp_for_tub_model);
          }
          else {
            obj.civil_material_reciept_ar_lsp_for_tub_model = null;
          }
          if (item.civil_material_reciept_tmt != null) {
            obj.civil_material_reciept_tmt = new Date(item.civil_material_reciept_tmt);
          }
          else {
            obj.civil_material_reciept_tmt = null;
          }
          if (item.civil_material_reciept_packing_plate_for_tub_model != null) {
            obj.civil_material_reciept_packing_plate_for_tub_model = new Date(item.civil_material_reciept_packing_plate_for_tub_model);
          }
          else {
            obj.civil_material_reciept_packing_plate_for_tub_model = null;
          }
          if (item.electrical_material_reciept_css != null) {
            obj.electrical_material_reciept_css = new Date(item.electrical_material_reciept_css);
          }
          else {
            obj.electrical_material_reciept_css = null;
          }
          if (item.electrical_material_reciept_ctpt != null) {
            obj.electrical_material_reciept_ctpt = new Date(item.electrical_material_reciept_ctpt);
          }
          else {
            obj.electrical_material_reciept_ctpt = null;
          }
          if (item.electrical_material_reciept_rsj_pole != null) {
            obj.electrical_material_reciept_rsj_pole = new Date(item.electrical_material_reciept_rsj_pole);
          }
          else {
            obj.electrical_material_reciept_rsj_pole = null;
          }

          if (item.electrical_material_reciept_conductor != null) {
            obj.electrical_material_reciept_conductor = new Date(item.electrical_material_reciept_conductor);
          }
          else {
            obj.electrical_material_reciept_conductor = null;
          }





          if (item.excavation != null) {
            obj.excavation = new Date(item.excavation);
          }
          else {
            obj.excavation = null;
          }
          if (item.pcc != null) {
            obj.pcc = new Date(item.pcc);
          }
          else {
            obj.pcc = null;
          }
          if (item.civil_pcc_wcc_offered_to_customer != null) {
            obj.civil_pcc_wcc_offered_to_customer = new Date(item.civil_pcc_wcc_offered_to_customer);
          }
          else {
            obj.civil_pcc_wcc_offered_to_customer = null;
          }
          if (item.civil_pcc_wcc_completed_by_customer != null) {
            obj.civil_pcc_wcc_completed_by_customer = new Date(item.civil_pcc_wcc_completed_by_customer);
          }
          else {
            obj.civil_pcc_wcc_completed_by_customer = null;
          }

          if (item.stub_assembly_ar_assembly != null) {
            obj.stub_assembly_ar_assembly = new Date(item.stub_assembly_ar_assembly);
          }
          else {
            obj.stub_assembly_ar_assembly = null;
          }
          if (item.stub_erection != null) {
            obj.stub_erection = new Date(item.stub_erection);
          }
          else {
            obj.stub_erection = null;
          }

          if (item.reinforcement_binding_and_formwork != null) {
            obj.reinforcement_binding_and_formwork = new Date(item.reinforcement_binding_and_formwork);
          }
          else {
            obj.reinforcement_binding_and_formwork = null;
          }
          if (item.shuttering != null) {
            obj.shuttering = new Date(item.shuttering);
          }
          else {
            obj.shuttering = null;
          }
          if (item.foundation_casting_raft != null) {
            obj.foundation_casting_raft = new Date(item.foundation_casting_raft);
          }
          else {
            obj.foundation_casting_raft = null;
          }

          if (item.foundation_casting_pedestal != null) {
            obj.foundation_casting_pedestal = new Date(item.foundation_casting_pedestal);
          }
          else {
            obj.foundation_casting_pedestal = null;
          }
          if (item.completion_of_foundation != null) {
            obj.completion_of_foundation = new Date(item.completion_of_foundation);
          }
          else {
            obj.completion_of_foundation = null;
          }


          if (item.seven_day_test_report != null) {
            obj.seven_day_test_report = new Date(item.seven_day_test_report);
          }
          else {
            obj.seven_day_test_report = null;
          }
          if (item.twenty_eight_day_test_report != null) {
            obj.twenty_eight_day_test_report = new Date(item.twenty_eight_day_test_report);
          }
          else {
            obj.twenty_eight_day_test_report = null;
          }
          if (item.civil_wcc_offered_to_customer != null) {
            obj.civil_wcc_offered_to_customer = new Date(item.civil_wcc_offered_to_customer);
          }
          else {
            obj.civil_wcc_offered_to_customer = null;
          }

          if (item.civil_wcc_completed_by_customer != null) {
            obj.civil_wcc_completed_by_customer = new Date(item.civil_wcc_completed_by_customer);
          }
          else {
            obj.civil_wcc_completed_by_customer = null;
          }


          if (item.dp_yard_civil_plinth_platform != null) {
            obj.dp_yard_civil_plinth_platform = new Date(item.dp_yard_civil_plinth_platform);
          }
          else {
            obj.dp_yard_civil_plinth_platform = null;
          }
          if (item.trafo_css_erection != null) {
            obj.trafo_css_erection = new Date(item.trafo_css_erection);
          }
          else {
            obj.trafo_css_erection = null;
          }
          if (item.ctpt_erection != null) {
            obj.ctpt_erection = new Date(item.ctpt_erection);
          }
          else {
            obj.ctpt_erection = null;
          }
          if (item.metering_and_plumbing_work != null) {
            obj.metering_and_plumbing_work = new Date(item.metering_and_plumbing_work);
          }
          else {
            obj.metering_and_plumbing_work = null;
          }


          if (item.earthing_strip_laying !== null) {
            obj.earthing_strip_laying = new Date(item.earthing_strip_laying);
          }
          else {
            obj.earthing_strip_laying = null;
          }
          if (item.lt_cable_laying_and_termination != null) {
            obj.lt_cable_laying_and_termination = new Date(item.lt_cable_laying_and_termination);
          }
          else {
            obj.lt_cable_laying_and_termination = null;
          }
          if (item.completion_of_dp_yard != null) {
            obj.completion_of_dp_yard = new Date(item.completion_of_dp_yard);
          }
          else {
            obj.completion_of_dp_yard = null;
          }

          obj.scope_of_lnt_lines_in_total_no_of_poles = item.scope_of_lnt_lines_in_total_no_of_poles;
          obj.survey_done_in_total_nos_int = item.survey_done_in_total_nos_int;
          obj.pit_excavations_in_nos_int = item.pit_excavations_in_nos_int;
          obj.pole_erection_in_nos_int = item.pole_erection_in_nos_int;
          obj.pole_stringing_in_nos_int = item.pole_stringing_in_nos_int;
          if (item.internal_line_completion != null) {
            obj.internal_line_completion = new Date(item.internal_line_completion);
          }
          else {
            obj.internal_line_completion = null;
          }

          obj.scope_of_external_line_in_total_no_of_poles = item.scope_of_external_line_in_total_no_of_poles;
          obj.surve_done_in_total_nos_ext = item.surve_done_in_total_nos_ext;
          obj.pit_excavations_in_nos_ext = item.pit_excavations_in_nos_ext;
          obj.pole_erection_no_nos_ext = item.pole_erection_no_nos_ext;
          obj.pole_stringing_in_nos_ext = item.pole_stringing_in_nos_ext;

          if (item.external_line_completion != null) {
            obj.external_line_completion = new Date(item.external_line_completion);
          }
          else {
            obj.external_line_completion = null;
          }
          if (item.electrical_dp_yard_wcc_offered_to_customer != null) {
            obj.electrical_dp_yard_wcc_offered_to_customer = new Date(item.electrical_dp_yard_wcc_offered_to_customer);
          }
          else {
            obj.electrical_dp_yard_wcc_offered_to_customer = null;
          }
          if (item.electrical_dp_yard_wcc_completed_by_customer != null) {
            obj.electrical_dp_yard_wcc_completed_by_customer = new Date(item.electrical_dp_yard_wcc_completed_by_customer);
          }
          else {
            obj.electrical_dp_yard_wcc_completed_by_customer = null;
          }
          if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
            obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
          }
          else {
            obj.electrical_33kv_line_wcc_completed_by_customer = null;
          }
          if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
            obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
          }
          else {
            obj.electrical_33kv_line_wcc_completed_by_customer = null;
          }
          if (item.electrical_33kv_line_wcc_offered_to_customer != null) {
            obj.electrical_33kv_line_wcc_offered_to_customer = new Date(item.electrical_33kv_line_wcc_offered_to_customer);
          }
          else {
            obj.electrical_33kv_line_wcc_offered_to_customer = null;
          }
          if (item.assembly_lattice_start != null) {
            obj.assembly_lattice_start = new Date(item.assembly_lattice_start);
          }
          else {
            obj.assembly_lattice_start = null;
          }
          if (item.assembly_lattice_finisih != null) {
            obj.assembly_lattice_finisih = new Date(item.assembly_lattice_finisih);
          }
          else {
            obj.assembly_lattice_finisih = null;
          }
          if (item.assembly_transition_adapter != null) {
            obj.assembly_transition_adapter = new Date(item.assembly_transition_adapter);
          }
          else {
            obj.assembly_transition_adapter = null;
          }

          if (item.crane_boomup != null) {
            obj.crane_boomup = new Date(item.crane_boomup);
          }
          else {
            obj.crane_boomup = null
          }
          if (item.erection_of_is4 != null) {
            obj.erection_of_is4 = new Date(item.erection_of_is4);
          }
          else {
            obj.erection_of_is4 = null;
          }
          if (item.erection_of_is3 != null) {
            obj.erection_of_is3 = new Date(item.erection_of_is3);
          }
          else {
            obj.erection_of_is3 = null;
          }
          if (item.erection_of_is2 != null) {
            obj.erection_of_is2 = new Date(item.erection_of_is2);
          }
          else {
            obj.erection_of_is2 = null;
          }
          if (item.erection_of_lattice_tower != null) {
            obj.erection_of_lattice_tower = new Date(item.erection_of_lattice_tower);
          }
          else {
            obj.erection_of_lattice_tower = null;
          }

          if (item.erection_of_tubular_tower != null) {
            obj.erection_of_tubular_tower = new Date(item.erection_of_tubular_tower);
          }
          else {
            obj.erection_of_tubular_tower = null;
          }
          if (item.erection_nacelle != null) {
            obj.erection_nacelle = new Date(item.erection_nacelle);
          }
          else {
            obj.erection_nacelle = null;
          }
          if (item.rotor_assembly != null) {
            obj.rotor_assembly = new Date(item.rotor_assembly);
          }
          else {
            obj.rotor_assembly = null;
          }
          if (item.crane_package != null) {
            obj.crane_package = item.crane_package;
          }
          else {
            obj.crane_package = null;
          }

          if (item.wtg_erection != null) {
            obj.wtg_erection = new Date(item.wtg_erection);
          }
          else {
            obj.wtg_erection = null;
          }
          if (item.lift_landing_platform != null) {
            obj.lift_landing_platform = new Date(item.lift_landing_platform);
          }
          else {
            obj.lift_landing_platform = null;
          }
          if (item.lift_installation != null) {
            obj.lift_installation = new Date(item.lift_installation);
          }
          else {
            obj.lift_installation = null;
          }
          if (item.lift_ftu != null) {
            obj.lift_ftu = new Date(item.lift_ftu);
          }
          else {
            obj.lift_ftu = null;
          }
          if (item.wtg_cable_termination != null) {
            obj.wtg_cable_termination = new Date(item.wtg_cable_termination);
          }
          else {
            obj.wtg_cable_termination = null;
          }
          if (item.mech_wcc_offered_to_customer != null) {
            obj.mech_wcc_offered_to_customer = new Date(item.mech_wcc_offered_to_customer);
          }
          else {
            obj.mech_wcc_offered_to_customer = null;
          }
          if (item.mech_wcc_completed_by_customer != null) {
            obj.mech_wcc_completed_by_customer = new Date(item.mech_wcc_completed_by_customer);
          }
          else {
            obj.mech_wcc_completed_by_customer = null;
          }
          if (item.wtg_pre_commissioning != null) {
            obj.wtg_pre_commissioning = new Date(item.wtg_pre_commissioning);
          }
          else {
            obj.wtg_pre_commissioning = null;
          }
          if (item.safe_run != null) {
            obj.safe_run = new Date(item.safe_run);
          }
          else {
            obj.safe_run = null;
          }
          if (item.ceig_approval != null) {
            obj.ceig_approval = new Date(item.ceig_approval);
          }
          else {
            obj.ceig_approval = null;
          }
          if (item.wtg_commissioning != null) {
            obj.wtg_commissioning = new Date(item.wtg_commissioning);
          }
          else {
            obj.wtg_commissioning = null;
          }
          if (item.wtg_in_generation != null) {
            obj.wtg_in_generation = new Date(item.wtg_in_generation);
          }
          else {
            obj.wtg_in_generation = null;
          }

          if (item.comm_wcc_offered_to_customer != null) {
            obj.comm_wcc_offered_to_customer = new Date(item.comm_wcc_offered_to_customer);
          }
          else {
            obj.comm_wcc_offered_to_customer = null;
          }
          if (item.comm_wcc_competed_by_customer != null) {
            obj.comm_wcc_competed_by_customer = new Date(item.comm_wcc_competed_by_customer);
          }
          else {
            obj.comm_wcc_competed_by_customer = null;
          }
          obj.risk_remark = item.risk_remark;
          obj.mitigation_plan = item.mitigation_plan;
          obj.name_of_civil_contractor = item.name_of_civil_contractor;
          obj.name_of_electrical_contractor_dp_yard = item.name_of_electrical_contractor_dp_yard;
          obj.name_of_electrical_contractor_elect_yard = item.name_of_electrical_contractor_elect_yard;
          obj.name_of_assembly_contractor = item.name_of_assembly_contractor;
          obj.name_of_mechanical_contractor = item.name_of_mechanical_contractor;
          obj.name_of_cable_termination = item.name_of_cable_termination;
          if (item.hoto_projects_oms != null) {
            obj.hoto_projects_oms = new Date(item.hoto_projects_oms);
          }
          else {
            obj.hoto_projects_oms = null;
          }
          if (item.hoto_customer != null) {
            obj.hoto_customer = new Date(item.hoto_customer);
          }
          else {
            obj.hoto_customer = null;
          }

          obj.saveFlag = false;
          obj.editable_flag = true;
          temp.push(obj);
        }
        this.location_data = temp;
      }
    }, 250);


  }




  // getLocationDPRDashboard() {
  //   this.location_data = [];
  //   this.api_service.getLocationDPRDashboard(this.site_list).subscribe(data => {
  //     //console.log(data);
  //     var temp = [];
  //     for (var item of data) {
  //       var obj: { [k: string]: any } = {};
  //       obj.id = item.id;
  //       obj.client_name = item.client_name;
  //       obj.state = item.state;
  //       obj.site = item.site;
  //       obj.model = item.model;
  //       obj.feeder_no = item.feeder_no;
  //       obj.cf_new = item.cf_new;
  //       obj.location_id = item.location_id;
  //       obj.location = item.location;
  //       obj.capacity = item.capacity;
  //       obj.project_definition = item.project_definition;
  //       obj.survey_no = item.survey_no;
  //       obj.village = item.village;
  //       obj.taluka = item.taluka;
  //       obj.district = item.district;
  //       if (item.dispatch_clearance_date != null) {
  //         obj.dispatch_clearance_date = new Date(item.dispatch_clearance_date);
  //       }
  //       else {
  //         obj.dispatch_clearance_date = null;
  //       }
  //       if (item.po_commissioning_date != null) {
  //         obj.po_commissioning_date = new Date(item.po_commissioning_date);
  //       }
  //       else {
  //         obj.po_commissioning_date = null;
  //       }
  //       if (item.laf_mom_release != null) {
  //         obj.laf_mom_release = new Date(item.laf_mom_release);
  //       }
  //       else {
  //         obj.laf_mom_release = null;
  //       }
  //       if (item.conditional_laf_workfront != null) {
  //         obj.conditional_laf_workfront = new Date(item.conditional_laf_workfront);
  //       }
  //       else {
  //         obj.conditional_laf_workfront = null;
  //       }
  //       if (item.laf_mom_acceptance != null) {
  //         obj.laf_mom_acceptance = new Date(item.laf_mom_acceptance);
  //       }
  //       else {
  //         obj.laf_mom_acceptance = null;
  //       }
  //       if (item.soil_testing != null) {
  //         obj.soil_testing = new Date(item.soil_testing);
  //       }
  //       else {
  //         obj.soil_testing = null;
  //       }
  //       if (item.re_engg != null) {
  //         obj.re_engg = new Date(item.re_engg);
  //       }
  //       else {
  //         obj.re_engg = null;
  //       }
  //       if (item.approach_road != null) {
  //         obj.approach_road = new Date(item.approach_road);
  //       }
  //       else {
  //         obj.approach_road = null;
  //       }
  //       if (item.stub_reciept != null) {
  //         obj.stub_reciept = new Date(item.stub_reciept);
  //       }
  //       else {
  //         obj.stub_reciept = null;
  //       }
  //       if (item.electrical_material_reciept_la != null) {
  //         obj.electrical_material_reciept_la = new Date(item.electrical_material_reciept_la);
  //       }
  //       else {
  //         obj.electrical_material_reciept_la = null;
  //       }
  //       if (item.stub_hw_reciept != null) {
  //         obj.stub_hw_reciept = new Date(item.stub_hw_reciept);
  //       }
  //       else {
  //         obj.stub_hw_reciept = null;
  //       }
  //       if (item.lattice_tower_reciept != null) {
  //         obj.lattice_tower_reciept = new Date(item.lattice_tower_reciept);
  //       }
  //       else {
  //         obj.lattice_tower_reciept = null;
  //       }
  //       if (item.lattice_internal_reciept != null) {
  //         obj.lattice_internal_reciept = new Date(item.lattice_internal_reciept);
  //       }
  //       else {
  //         obj.lattice_internal_reciept = null;
  //       }
  //       if (item.tadap_reciept != null) {
  //         obj.tadap_reciept = new Date(item.tadap_reciept);
  //       }
  //       else {
  //         obj.tadap_reciept = null;
  //       }
  //       if (item.tplate_reciept != null) {
  //         obj.tplate_reciept = new Date(item.tplate_reciept);
  //       }
  //       else {
  //         obj.tplate_reciept = null;
  //       }


  //       if (item.t1_reciept != null) {
  //         obj.t1_reciept = new Date(item.t1_reciept);
  //       }
  //       else {
  //         obj.t1_reciept = null;
  //       }
  //       if (item.t2_reciept != null) {
  //         obj.t2_reciept = new Date(item.t2_reciept);
  //       }
  //       else {
  //         obj.t2_reciept = null;
  //       }
  //       if (item.t3_reciept != null) {
  //         obj.t3_reciept = new Date(item.t3_reciept);
  //       }
  //       else {
  //         obj.t3_reciept = null;
  //       }
  //       if (item.t4_reciept != null) {
  //         obj.t4_reciept = new Date(item.t4_reciept);
  //       }
  //       else {
  //         obj.t4_reciept = null;
  //       }
  //       if (item.full_tower_reciept != null) {
  //         obj.full_tower_reciept = new Date(item.full_tower_reciept);
  //       }
  //       else {
  //         obj.full_tower_reciept = null;
  //       }
  //       if (item.tower_hardware_reciept != null) {
  //         obj.tower_hardware_reciept = new Date(item.tower_hardware_reciept);
  //       }
  //       else {
  //         obj.tower_hardware_reciept = null;
  //       }
  //       if (item.cable_reciept != null) {
  //         obj.cable_reciept = new Date(item.cable_reciept);
  //       }
  //       else {
  //         obj.cable_reciept = null;
  //       }
  //       if (item.power_panel_converter_panel_reciept != null) {
  //         obj.power_panel_converter_panel_reciept = new Date(item.power_panel_converter_panel_reciept);
  //       }
  //       else {
  //         obj.power_panel_converter_panel_reciept = null;
  //       }
  //       if (item.dfig_panel_reciept != null) {
  //         obj.dfig_panel_reciept = new Date(item.dfig_panel_reciept);
  //       }
  //       else {
  //         obj.dfig_panel_reciept = null;
  //       }
  //       if (item.transformer_reciept != null) {
  //         obj.transformer_reciept = new Date(item.transformer_reciept);
  //       }
  //       else {
  //         obj.transformer_reciept = null;
  //       }


  //       if (item.hub_reciept != null) {
  //         obj.hub_reciept = new Date(item.hub_reciept);
  //       }
  //       else {
  //         obj.hub_reciept = null;
  //       }
  //       if (item.hub_kit_reciept != null) {
  //         obj.hub_kit_reciept = new Date(item.hub_kit_reciept);
  //       }
  //       else {
  //         item.hub_kit_reciept = null;
  //       }
  //       if (item.nacelle_reciept != null) {
  //         obj.nacelle_reciept = new Date(item.nacelle_reciept);
  //       }
  //       else {
  //         obj.nacelle_reciept = null;
  //       }
  //       if (item.nacelle_kit_reciept != null) {
  //         obj.nacelle_kit_reciept = new Date(item.nacelle_kit_reciept);
  //       }
  //       else {
  //         obj.nacelle_kit_reciept = null;
  //       }
  //       if (item.blade_with_service_reciept != null) {
  //         obj.blade_with_service_reciept = new Date(item.blade_with_service_reciept);
  //       }
  //       else {
  //         obj.blade_with_service_reciept = null;
  //       }
  //       if (item.lift != null) {
  //         obj.lift = new Date(item.lift);
  //       }
  //       else {
  //         obj.lift = null;
  //       }
  //       if (item.full_wtg_reciept != null) {
  //         obj.full_wtg_reciept = new Date(item.full_wtg_reciept);
  //       }
  //       else {
  //         obj.full_wtg_reciept = null;
  //       }

  //       if (item.wtg_wcc_offered_to_customer != null) {
  //         obj.wtg_wcc_offered_to_customer = new Date(item.wtg_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.wtg_wcc_offered_to_customer = null;
  //       }
  //       if (item.wtg_wcc_completed_by_customer != null) {
  //         obj.wtg_wcc_completed_by_customer = new Date(item.wtg_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.wtg_wcc_completed_by_customer = null;
  //       }
  //       if (item.civil_material_reciept_anchor_bolts_studs_for_tub_model != null) {
  //         obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = new Date(item.civil_material_reciept_anchor_bolts_studs_for_tub_model);
  //       }
  //       else {
  //         obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = null;
  //       }
  //       if (item.civil_material_reciept_ar_lsp_for_tub_model != null) {
  //         obj.civil_material_reciept_ar_lsp_for_tub_model = new Date(item.civil_material_reciept_ar_lsp_for_tub_model);
  //       }
  //       else {
  //         obj.civil_material_reciept_ar_lsp_for_tub_model = null;
  //       }
  //       if (item.civil_material_reciept_tmt != null) {
  //         obj.civil_material_reciept_tmt = new Date(item.civil_material_reciept_tmt);
  //       }
  //       else {
  //         obj.civil_material_reciept_tmt = null;
  //       }
  //       if (item.civil_material_reciept_packing_plate_for_tub_model != null) {
  //         obj.civil_material_reciept_packing_plate_for_tub_model = new Date(item.civil_material_reciept_packing_plate_for_tub_model);
  //       }
  //       else {
  //         obj.civil_material_reciept_packing_plate_for_tub_model = null;
  //       }
  //       if (item.electrical_material_reciept_css != null) {
  //         obj.electrical_material_reciept_css = new Date(item.electrical_material_reciept_css);
  //       }
  //       else {
  //         obj.electrical_material_reciept_css = null;
  //       }
  //       if (item.electrical_material_reciept_ctpt != null) {
  //         obj.electrical_material_reciept_ctpt = new Date(item.electrical_material_reciept_ctpt);
  //       }
  //       else {
  //         obj.electrical_material_reciept_ctpt = null;
  //       }
  //       if (item.electrical_material_reciept_rsj_pole != null) {
  //         obj.electrical_material_reciept_rsj_pole = new Date(item.electrical_material_reciept_rsj_pole);
  //       }
  //       else {
  //         obj.electrical_material_reciept_rsj_pole = null;
  //       }

  //       if (item.electrical_material_reciept_conductor != null) {
  //         obj.electrical_material_reciept_conductor = new Date(item.electrical_material_reciept_conductor);
  //       }
  //       else {
  //         obj.electrical_material_reciept_conductor = null;
  //       }





  //       if (item.excavation != null) {
  //         obj.excavation = new Date(item.excavation);
  //       }
  //       else {
  //         obj.excavation = null;
  //       }
  //       if (item.pcc != null) {
  //         obj.pcc = new Date(item.pcc);
  //       }
  //       else {
  //         obj.pcc = null;
  //       }
  //       if (item.civil_pcc_wcc_offered_to_customer != null) {
  //         obj.civil_pcc_wcc_offered_to_customer = new Date(item.civil_pcc_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.civil_pcc_wcc_offered_to_customer = null;
  //       }
  //       if (item.civil_pcc_wcc_completed_by_customer != null) {
  //         obj.civil_pcc_wcc_completed_by_customer = new Date(item.civil_pcc_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.civil_pcc_wcc_completed_by_customer = null;
  //       }

  //       if (item.stub_assembly_ar_assembly != null) {
  //         obj.stub_assembly_ar_assembly = new Date(item.stub_assembly_ar_assembly);
  //       }
  //       else {
  //         obj.stub_assembly_ar_assembly = null;
  //       }
  //       if (item.stub_erection != null) {
  //         obj.stub_erection = new Date(item.stub_erection);
  //       }
  //       else {
  //         obj.stub_erection = null;
  //       }

  //       if (item.reinforcement_binding_and_formwork != null) {
  //         obj.reinforcement_binding_and_formwork = new Date(item.reinforcement_binding_and_formwork);
  //       }
  //       else {
  //         obj.reinforcement_binding_and_formwork = null;
  //       }
  //       if (item.shuttering != null) {
  //         obj.shuttering = new Date(item.shuttering);
  //       }
  //       else {
  //         obj.shuttering = null;
  //       }
  //       if (item.foundation_casting_raft != null) {
  //         obj.foundation_casting_raft = new Date(item.foundation_casting_raft);
  //       }
  //       else {
  //         obj.foundation_casting_raft = null;
  //       }

  //       if (item.foundation_casting_pedestal != null) {
  //         obj.foundation_casting_pedestal = new Date(item.foundation_casting_pedestal);
  //       }
  //       else {
  //         obj.foundation_casting_pedestal = null;
  //       }
  //       if (item.completion_of_foundation != null) {
  //         obj.completion_of_foundation = new Date(item.completion_of_foundation);
  //       }
  //       else {
  //         obj.completion_of_foundation = null;
  //       }


  //       if (item.seven_day_test_report != null) {
  //         obj.seven_day_test_report = new Date(item.seven_day_test_report);
  //       }
  //       else {
  //         obj.seven_day_test_report = null;
  //       }
  //       if (item.twenty_eight_day_test_report != null) {
  //         obj.twenty_eight_day_test_report = new Date(item.twenty_eight_day_test_report);
  //       }
  //       else {
  //         obj.twenty_eight_day_test_report = null;
  //       }
  //       if (item.civil_wcc_offered_to_customer != null) {
  //         obj.civil_wcc_offered_to_customer = new Date(item.civil_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.civil_wcc_offered_to_customer = null;
  //       }

  //       if (item.civil_wcc_completed_by_customer != null) {
  //         obj.civil_wcc_completed_by_customer = new Date(item.civil_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.civil_wcc_completed_by_customer = null;
  //       }


  //       if (item.dp_yard_civil_plinth_platform != null) {
  //         obj.dp_yard_civil_plinth_platform = new Date(item.dp_yard_civil_plinth_platform);
  //       }
  //       else {
  //         obj.dp_yard_civil_plinth_platform = null;
  //       }
  //       if (item.trafo_css_erection != null) {
  //         obj.trafo_css_erection = new Date(item.trafo_css_erection);
  //       }
  //       else {
  //         obj.trafo_css_erection = null;
  //       }
  //       if (item.ctpt_erection != null) {
  //         obj.ctpt_erection = new Date(item.ctpt_erection);
  //       }
  //       else {
  //         obj.ctpt_erection = null;
  //       }
  //       if (item.metering_and_plumbing_work != null) {
  //         obj.metering_and_plumbing_work = new Date(item.metering_and_plumbing_work);
  //       }
  //       else {
  //         obj.metering_and_plumbing_work = null;
  //       }


  //       if (item.earthing_strip_laying !== null) {
  //         obj.earthing_strip_laying = new Date(item.earthing_strip_laying);
  //       }
  //       else {
  //         obj.earthing_strip_laying = null;
  //       }
  //       if (item.lt_cable_laying_and_termination != null) {
  //         obj.lt_cable_laying_and_termination = new Date(item.lt_cable_laying_and_termination);
  //       }
  //       else {
  //         obj.lt_cable_laying_and_termination = null;
  //       }
  //       if (item.completion_of_dp_yard != null) {
  //         obj.completion_of_dp_yard = new Date(item.completion_of_dp_yard);
  //       }
  //       else {
  //         obj.completion_of_dp_yard = null;
  //       }

  //       obj.scope_of_lnt_lines_in_total_no_of_poles = item.scope_of_lnt_lines_in_total_no_of_poles;
  //       obj.survey_done_in_total_nos_int = item.survey_done_in_total_nos_int;
  //       obj.pit_excavations_in_nos_int = item.pit_excavations_in_nos_int;
  //       obj.pole_erection_in_nos_int = item.pole_erection_in_nos_int;
  //       obj.pole_stringing_in_nos_int = item.pole_stringing_in_nos_int;
  //       if (item.internal_line_completion != null) {
  //         obj.internal_line_completion = new Date(item.internal_line_completion);
  //       }
  //       else {
  //         obj.internal_line_completion = null;
  //       }

  //       obj.scope_of_external_line_in_total_no_of_poles = item.scope_of_external_line_in_total_no_of_poles;
  //       obj.surve_done_in_total_nos_ext = item.surve_done_in_total_nos_ext;
  //       obj.pit_excavations_in_nos_ext = item.pit_excavations_in_nos_ext;
  //       obj.pole_erection_no_nos_ext = item.pole_erection_no_nos_ext;
  //       obj.pole_stringing_in_nos_ext = item.pole_stringing_in_nos_ext;

  //       if (item.external_line_completion != null) {
  //         obj.external_line_completion = new Date(item.external_line_completion);
  //       }
  //       else {
  //         obj.external_line_completion = null;
  //       }
  //       if (item.electrical_dp_yard_wcc_offered_to_customer != null) {
  //         obj.electrical_dp_yard_wcc_offered_to_customer = new Date(item.electrical_dp_yard_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.electrical_dp_yard_wcc_offered_to_customer = null;
  //       }
  //       if (item.electrical_dp_yard_wcc_completed_by_customer != null) {
  //         obj.electrical_dp_yard_wcc_completed_by_customer = new Date(item.electrical_dp_yard_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.electrical_dp_yard_wcc_completed_by_customer = null;
  //       }
  //       if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
  //         obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.electrical_33kv_line_wcc_completed_by_customer = null;
  //       }
  //       if (item.electrical_33kv_line_wcc_completed_by_customer != null) {
  //         obj.electrical_33kv_line_wcc_completed_by_customer = new Date(item.electrical_33kv_line_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.electrical_33kv_line_wcc_completed_by_customer = null;
  //       }
  //       if (item.electrical_33kv_line_wcc_offered_to_customer != null) {
  //         obj.electrical_33kv_line_wcc_offered_to_customer = new Date(item.electrical_33kv_line_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.electrical_33kv_line_wcc_offered_to_customer = null;
  //       }
  //       if (item.assembly_lattice_start != null) {
  //         obj.assembly_lattice_start = new Date(item.assembly_lattice_start);
  //       }
  //       else {
  //         obj.assembly_lattice_start = null;
  //       }
  //       if (item.assembly_lattice_finisih != null) {
  //         obj.assembly_lattice_finisih = new Date(item.assembly_lattice_finisih);
  //       }
  //       else {
  //         obj.assembly_lattice_finisih = null;
  //       }
  //       if (item.assembly_transition_adapter != null) {
  //         obj.assembly_transition_adapter = new Date(item.assembly_transition_adapter);
  //       }
  //       else {
  //         obj.assembly_transition_adapter = null;
  //       }

  //       if (item.crane_boomup != null) {
  //         obj.crane_boomup = new Date(item.crane_boomup);
  //       }
  //       else {
  //         obj.crane_boomup = null
  //       }
  //       if (item.erection_of_is4 != null) {
  //         obj.erection_of_is4 = new Date(item.erection_of_is4);
  //       }
  //       else {
  //         obj.erection_of_is4 = null;
  //       }
  //       if (item.erection_of_is3 != null) {
  //         obj.erection_of_is3 = new Date(item.erection_of_is3);
  //       }
  //       else {
  //         obj.erection_of_is3 = null;
  //       }
  //       if (item.erection_of_is2 != null) {
  //         obj.erection_of_is2 = new Date(item.erection_of_is2);
  //       }
  //       else {
  //         obj.erection_of_is2 = null;
  //       }
  //       if (item.erection_of_lattice_tower != null) {
  //         obj.erection_of_lattice_tower = new Date(item.erection_of_lattice_tower);
  //       }
  //       else {
  //         obj.erection_of_lattice_tower = null;
  //       }

  //       if (item.erection_of_tubular_tower != null) {
  //         obj.erection_of_tubular_tower = new Date(item.erection_of_tubular_tower);
  //       }
  //       else {
  //         obj.erection_of_tubular_tower = null;
  //       }
  //       if (item.erection_nacelle != null) {
  //         obj.erection_nacelle = new Date(item.erection_nacelle);
  //       }
  //       else {
  //         obj.erection_nacelle = null;
  //       }
  //       if (item.rotor_assembly != null) {
  //         obj.rotor_assembly = new Date(item.rotor_assembly);
  //       }
  //       else {
  //         obj.rotor_assembly = null;
  //       }
  //       if (item.crane_package != null) {
  //         obj.crane_package = item.crane_package;
  //       }
  //       else {
  //         obj.crane_package = null;
  //       }

  //       if (item.wtg_erection != null) {
  //         obj.wtg_erection = new Date(item.wtg_erection);
  //       }
  //       else {
  //         obj.wtg_erection = null;
  //       }
  //       if (item.lift_landing_platform != null) {
  //         obj.lift_landing_platform = new Date(item.lift_landing_platform);
  //       }
  //       else {
  //         obj.lift_landing_platform = null;
  //       }
  //       if (item.lift_installation != null) {
  //         obj.lift_installation = new Date(item.lift_installation);
  //       }
  //       else {
  //         obj.lift_installation = null;
  //       }
  //       if (item.lift_ftu != null) {
  //         obj.lift_ftu = new Date(item.lift_ftu);
  //       }
  //       else {
  //         obj.lift_ftu = null;
  //       }
  //       if (item.wtg_cable_termination != null) {
  //         obj.wtg_cable_termination = new Date(item.wtg_cable_termination);
  //       }
  //       else {
  //         obj.wtg_cable_termination = null;
  //       }
  //       if (item.mech_wcc_offered_to_customer != null) {
  //         obj.mech_wcc_offered_to_customer = new Date(item.mech_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.mech_wcc_offered_to_customer = null;
  //       }
  //       if (item.mech_wcc_completed_by_customer != null) {
  //         obj.mech_wcc_completed_by_customer = new Date(item.mech_wcc_completed_by_customer);
  //       }
  //       else {
  //         obj.mech_wcc_completed_by_customer = null;
  //       }
  //       if (item.wtg_pre_commissioning != null) {
  //         obj.wtg_pre_commissioning = new Date(item.wtg_pre_commissioning);
  //       }
  //       else {
  //         obj.wtg_pre_commissioning = null;
  //       }
  //       if (item.safe_run != null) {
  //         obj.safe_run = new Date(item.safe_run);
  //       }
  //       else {
  //         obj.safe_run = null;
  //       }
  //       if (item.ceig_approval != null) {
  //         obj.ceig_approval = new Date(item.ceig_approval);
  //       }
  //       else {
  //         obj.ceig_approval = null;
  //       }
  //       if (item.wtg_commissioning != null) {
  //         obj.wtg_commissioning = new Date(item.wtg_commissioning);
  //       }
  //       else {
  //         obj.wtg_commissioning = null;
  //       }
  //       if (item.wtg_in_generation != null) {
  //         obj.wtg_in_generation = new Date(item.wtg_in_generation);
  //       }
  //       else {
  //         obj.wtg_in_generation = null;
  //       }

  //       if (item.comm_wcc_offered_to_customer != null) {
  //         obj.comm_wcc_offered_to_customer = new Date(item.comm_wcc_offered_to_customer);
  //       }
  //       else {
  //         obj.comm_wcc_offered_to_customer = null;
  //       }
  //       if (item.comm_wcc_competed_by_customer != null) {
  //         obj.comm_wcc_competed_by_customer = new Date(item.comm_wcc_competed_by_customer);
  //       }
  //       else {
  //         obj.comm_wcc_competed_by_customer = null;
  //       }
  //       obj.risk_remark = item.risk_remark;
  //       obj.mitigation_plan = item.mitigation_plan;
  //       obj.name_of_civil_contractor = item.name_of_civil_contractor;
  //       obj.name_of_electrical_contractor_dp_yard = item.name_of_electrical_contractor_dp_yard;
  //       obj.name_of_electrical_contractor_elect_yard = item.name_of_electrical_contractor_elect_yard;
  //       obj.name_of_assembly_contractor = item.name_of_assembly_contractor;
  //       obj.name_of_mechanical_contractor = item.name_of_mechanical_contractor;
  //       obj.name_of_cable_termination = item.name_of_cable_termination;
  //       if (item.hoto_projects_oms != null) {
  //         obj.hoto_projects_oms = new Date(item.hoto_projects_oms);
  //       }
  //       else {
  //         obj.hoto_projects_oms = null;
  //       }
  //       if (item.hoto_customer != null) {
  //         obj.hoto_customer = new Date(item.hoto_customer);
  //       }
  //       else {
  //         obj.hoto_customer = null;
  //       }

  //       obj.saveFlag = false;
  //       obj.editable_flag = true;
  //       temp.push(obj);
  //     }
  //     this.location_data = temp;
  //     // console.log(this.location_data_original);









  //     // var obj: { [k: string]: any } = {};
  //     // obj.id = item.id;
  //     // obj.editable_flag=false;
  //     // obj.type="total_obj";
  //     // obj.client_name = this.location_data.filter(x=>x.client_name != "" && x.client_name !=null).length;
  //     // obj.state =this.location_data.filter(x=>x.state!="" && x.state!=null).length;
  //     // obj.site =  this.location_data.filter(x=>x.site!="" && x.site!=null).length;
  //     // obj.model = this.location_data.filter(x=>x.model!="" && x.model!=null).length
  //     // obj.feeder_no = this.location_data.filter(x=>x.feeder_no !="" && x.feeder_no!=null).length;
  //     // obj.cf_new = this.location_data.filter(x=>x.cf_new!="" &&x.cf_new!=null ).length;
  //     // obj.location_id = this.location_data.filter(x=>x.location_id!=""&&x.location_id !=null).length;
  //     // obj.location = this.location_data.filter(x=>x.location!=""&& x.location!=null).length;
  //     // obj.capacity = this.location_data.filter(x=>x.capacity!=""&& x.capacity!=null).length;
  //     // obj.project_definition = this.location_data.filter(x=>x.project_definition!=""&& x.project_definition!=null).length;
  //     // obj.survey_no = this.location_data.filter(x=>x.survey_no!=""&& x.survey_no!=null).length;
  //     // obj.village = this.location_data.filter(x=>x.village!=""&& x.village!=null).length;
  //     // obj.taluka = this.location_data.filter(x=>x.taluka!=""&& x.taluka!=null).length;
  //     // obj.district = this.location_data.filter(x=>x.district!=""&& x.district!=null).length;
  //     // obj.dispatch_clearance_date = this.location_data.filter(x=>x.dispatch_clearance_date!=""&& x.dispatch_clearance_date!=null).length;
  //     // obj.po_commissioning_date = this.location_data.filter(x=>x.po_commissioning_date!=""&& x.po_commissioning_date!=null).length;
  //     // obj.laf_mom_release = this.location_data.filter(x=>x.laf_mom_release!=""&& x.laf_mom_release!=null).length;
  //     // obj.conditional_laf_workfront = this.location_data.filter(x=>x.conditional_laf_workfront!=""&& x.conditional_laf_workfront!=null).length;;
  //     // obj.laf_mom_acceptance = this.location_data.filter(x=>x.laf_mom_acceptance!=""&& x.laf_mom_acceptance!=null).length;
  //     // obj.soil_testing = this.location_data.filter(x=>x.soil_testing!=""&& x.soil_testing!=null).length;
  //     // obj.re_engg = this.location_data.filter(x=>x.re_engg!=""&& x.re_engg!=null).length;;
  //     // obj.approach_road = this.location_data.filter(x=>x.approach_road!=""&& x.approach_road!=null).length;
  //     // obj.stub_reciept = this.location_data.filter(x=>x.stub_reciept!=""&& x.stub_reciept!=null).length;
  //     // obj.stub_hw_reciept = this.location_data.filter(x=>x.stub_hw_reciept!=""&& x.stub_hw_reciept!=null).length;
  //     // obj.lattice_tower_reciept = this.location_data.filter(x=>x.lattice_tower_reciept!=""&& x.lattice_tower_reciept!=null).length;
  //     // obj.lattice_internal_reciept = this.location_data.filter(x=>x.lattice_internal_reciept!=""&& x.lattice_internal_reciept!=null).length;
  //     // obj.tadap_reciept = this.location_data.filter(x=>x.tadap_reciept!=""&& x.tadap_reciept!=null).length;
  //     // obj.tplate_reciept = this.location_data.filter(x=>x.tplate_reciept!=""&& x.tplate_reciept!=null).length;
  //     // obj.t1_reciept = this.location_data.filter(x=>x.t1_reciept!=""&& x.t1_reciept!=null).length;
  //     // obj.t2_reciept = this.location_data.filter(x=>x.t2_reciept!=""&& x.t2_reciept!=null).length;
  //     // obj.t3_reciept = this.location_data.filter(x=>x.t3_reciept!=""&& x.t3_reciept!=null).length;
  //     // obj.t4_reciept = this.location_data.filter(x=>x.t4_reciept!=""&& x.t4_reciept!=null).length;
  //     // obj.full_tower_reciept = this.location_data.filter(x=>x.full_tower_reciept!=""&& x.full_tower_reciept!=null).length;
  //     // obj.tower_hardware_reciept = this.location_data.filter(x=>x.tower_hardware_reciept!=""&& x.tower_hardware_reciept!=null).length;
  //     // obj.cable_reciept = this.location_data.filter(x=>x.cable_reciept!=""&& x.cable_reciept!=null).length;
  //     // obj.power_panel_converter_panel_reciept = this.location_data.filter(x=>x.power_panel_converter_panel_reciept!=""&& x.power_panel_converter_panel_reciept!=null).length;
  //     // obj.dfig_panel_reciept = this.location_data.filter(x=>x.dfig_panel_reciept!=""&& x.dfig_panel_reciept!=null).length;
  //     // obj.transformer_reciept = this.location_data.filter(x=>x.transformer_reciept!=""&& x.transformer_reciept!=null).length;
  //     // obj.hub_reciept = this.location_data.filter(x=>x.hub_reciept!=""&& x.hub_reciept!=null).length;
  //     // obj.hub_kit_reciept = this.location_data.filter(x=>x.hub_kit_reciept!=""&& x.hub_kit_reciept!=null).length;
  //     // obj.nacelle_reciept = this.location_data.filter(x=>x.nacelle_reciept!=""&& x.nacelle_reciept!=null).length;
  //     // obj.nacelle_kit_reciept = this.location_data.filter(x=>x.nacelle_kit_reciept!=""&& x.nacelle_kit_reciept!=null).length;
  //     // obj.blade_with_service_reciept = this.location_data.filter(x=>x.blade_with_service_reciept!=""&& x.blade_with_service_reciept!=null).length;
  //     // obj.lift = this.location_data.filter(x=>x.lift!=""&& x.lift!=null).length;
  //     // obj.full_wtg_reciept = this.location_data.filter(x=>x.full_wtg_reciept!=""&& x.full_wtg_reciept!=null).length;
  //     // obj.wtg_wcc_offered_to_customer = this.location_data.filter(x=>x.wtg_wcc_offered_to_customer!=""&& x.wtg_wcc_offered_to_customer!=null).length;
  //     // obj.wtg_wcc_completed_by_customer = this.location_data.filter(x=>x.wtg_wcc_completed_by_customer!=""&& x.wtg_wcc_completed_by_customer!=null).length;
  //     // obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_anchor_bolts_studs_for_tub_model!=""&& x.civil_material_reciept_anchor_bolts_studs_for_tub_model!=null).length;
  //     // obj.civil_material_reciept_ar_lsp_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_ar_lsp_for_tub_model!=""&& x.civil_material_reciept_ar_lsp_for_tub_model!=null).length;      
  //     // obj.civil_material_reciept_tmt = this.location_data.filter(x=>x.civil_material_reciept_tmt!=""&& x.civil_material_reciept_tmt!=null).length;
  //     // obj.civil_material_reciept_packing_plate_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_packing_plate_for_tub_model!=""&& x.civil_material_reciept_packing_plate_for_tub_model!=null).length;
  //     // obj.electrical_material_reciept_css = this.location_data.filter(x=>x.electrical_material_reciept_css!=""&& x.electrical_material_reciept_css!=null).length;
  //     // obj.electrical_material_reciept_ctpt = this.location_data.filter(x=>x.electrical_material_reciept_ctpt!=""&& x.electrical_material_reciept_ctpt!=null).length;
  //     // obj.electrical_material_reciept_la = this.location_data.filter(x=>x.electrical_material_reciept_la!=""&& x.electrical_material_reciept_la!=null).length;
  //     // obj.electrical_material_reciept_rsj_pole = this.location_data.filter(x=>x.electrical_material_reciept_rsj_pole!=""&& x.electrical_material_reciept_rsj_pole!=null).length;
  //     // obj.electrical_material_reciept_conductor = this.location_data.filter(x=>x.electrical_material_reciept_conductor!=""&& x.electrical_material_reciept_conductor!=null).length;
  //     // obj.excavation = this.location_data.filter(x=>x.excavation!=""&& x.excavation!=null).length;
  //     // obj.pcc = this.location_data.filter(x=>x.pcc!=""&& x.pcc!=null).length;
  //     // obj.civil_pcc_wcc_offered_to_customer = this.location_data.filter(x=>x.civil_pcc_wcc_offered_to_customer!=""&& x.civil_pcc_wcc_offered_to_customer!=null).length;
  //     // obj.civil_pcc_wcc_completed_by_customer = this.location_data.filter(x=>x.civil_wcc_completed_by_customer!=""&& x.civil_pcc_wcc_completed_by_customer!=null).length;
  //     // obj.stub_assembly_ar_assembly = this.location_data.filter(x=>x.stub_assembly_ar_assembly!=""&& x.stub_assembly_ar_assembly!=null).length;
  //     // obj.stub_erection = this.location_data.filter(x=>x.stub_erection!=""&& x.stub_erection!=null).length;
  //     // obj.reinforcement_binding_and_formwork = this.location_data.filter(x=>x.reinforcement_binding_and_formwork!=""&& x.reinforcement_binding_and_formwork!=null).length;;
  //     // obj.shuttering = this.location_data.filter(x=>x.shuttering!=""&& x.shuttering!=null).length;
  //     // obj.foundation_casting_raft =this.location_data.filter(x=>x.foundation_casting_raft!=""&& x.foundation_casting_raft!=null).length;                  
  //     // obj.foundation_casting_pedestal = this.location_data.filter(x=>x.foundation_casting_pedestal!=""&& x.foundation_casting_pedestal!=null).length;
  //     // obj.completion_of_foundation = this.location_data.filter(x=>x.completion_of_foundation!=""&& x.completion_of_foundation!=null).length;
  //     // obj.seven_day_test_report = this.location_data.filter(x=>x.seven_day_test_report!=""&& x.seven_day_test_report!=null).length;
  //     // obj.twenty_eight_day_test_report = this.location_data.filter(x=>x.twenty_eight_day_test_report!=""&& x.twenty_eight_day_test_report!=null).length;
  //     // obj.civil_wcc_offered_to_customer = this.location_data.filter(x=>x.civil_wcc_offered_to_customer!=""&& x.civil_wcc_offered_to_customer!=null).length;
  //     // obj.civil_wcc_completed_by_customer = this.location_data.filter(x=>x.civil_wcc_completed_by_customer!=""&& x.civil_wcc_completed_by_customer!=null).length;
  //     // obj.dp_yard_civil_plinth_platform = this.location_data.filter(x=>x.dp_yard_civil_plinth_platform!=""&& x.dp_yard_civil_plinth_platform!=null).length;
  //     // obj.trafo_css_erection = this.location_data.filter(x=>x.trafo_css_erection!=""&& x.trafo_css_erection!=null).length;
  //     // obj.ctpt_erection = this.location_data.filter(x=>x.ctpt_erection!=""&& x.ctpt_erection!=null).length;
  //     // obj.metering_and_plumbing_work = this.location_data.filter(x=>x.metering_and_plumbing_work!=""&& x.metering_and_plumbing_work!=null).length;
  //     // obj.earthing_strip_laying = this.location_data.filter(x=>x.earthing_strip_laying!=""&& x.earthing_strip_laying!=null).length;
  //     // obj.lt_cable_laying_and_termination = this.location_data.filter(x=>x.lt_cable_laying_and_termination!=""&& x.lt_cable_laying_and_termination!=null).length;
  //     // obj.completion_of_dp_yard = this.location_data.filter(x=>x.completion_of_dp_yard!=""&& x.completion_of_dp_yard!=null).length;  
  //     // obj.scope_of_lnt_lines_in_total_no_of_poles = this.location_data.filter(x=>x.scope_of_lnt_lines_in_total_no_of_poles!=""&& x.scope_of_lnt_lines_in_total_no_of_poles!=null).length;
  //     // obj.survey_done_in_total_nos_int = this.location_data.filter(x=>x.survey_done_in_total_nos_int!=""&& x.survey_done_in_total_nos_int!=null).length;
  //     // obj.pit_excavations_in_nos_int = this.location_data.filter(x=>x.pit_excavations_in_nos_int!=""&& x.pit_excavations_in_nos_int!=null).length;
  //     // obj.pole_erection_in_nos_int = this.location_data.filter(x=>x.pole_erection_no_nos_int!=""&& x.pole_erection_in_nos_int!=null).length;
  //     // obj.pole_stringing_in_nos_int = this.location_data.filter(x=>x.pole_stringing_in_nos_int!=""&& x.pole_stringing_in_nos_int!=null).length;
  //     // obj.internal_line_completion = this.location_data.filter(x=>x.internal_line_completion!=""&& x.internal_line_completion!=null).length;      
  //     // obj.scope_of_external_line_in_total_no_of_poles = this.location_data.filter(x=>x.scope_of_external_line_in_total_no_of_poles!=""&& x.scope_of_external_line_in_total_no_of_poles!=null).length;
  //     // obj.surve_done_in_total_nos_ext = this.location_data.filter(x=>x.surve_done_in_total_nos_ext!=""&& x.surve_done_in_total_nos_ext!=null).length;
  //     // obj.pit_excavations_in_nos_ext = this.location_data.filter(x=>x.pit_excavations_in_nos_ext!=""&& x.pit_excavations_in_nos_ext!=null).length;
  //     // obj.pole_erection_no_nos_ext = this.location_data.filter(x=>x.pole_erection_no_nos_ext!=""&& x.pole_erection_no_nos_ext!=null).length;
  //     // obj.pole_stringing_in_nos_ext = this.location_data.filter(x=>x.pole_stringing_in_nos_ext!=""&& x.pole_stringing_in_nos_ext!=null).length;
  //     // obj.external_line_completion = this.location_data.filter(x=>x.external_line_completion!=""&& x.external_line_completion!=null).length;
  //     // obj.electrical_dp_yard_wcc_offered_to_customer = this.location_data.filter(x=>x.electrical_dp_yard_wcc_offered_to_customer!=""&& x.electrical_dp_yard_wcc_offered_to_customer!=null).length;
  //     // obj.electrical_dp_yard_wcc_completed_by_customer = this.location_data.filter(x=>x.electrical_dp_yard_wcc_completed_by_customer!=""&& x.electrical_dp_yard_wcc_completed_by_customer!=null).length;
  //     // obj.electrical_33kv_line_wcc_completed_by_customer = this.location_data.filter(x=>x.electrical_33kv_line_wcc_completed_by_customer!=""&& x.electrical_33kv_line_wcc_completed_by_customer!=null).length;
  //     // obj.electrical_33kv_line_wcc_offered_to_customer = this.location_data.filter(x=>x.electrical_33kv_line_wcc_offered_to_customer!=""&& x.electrical_33kv_line_wcc_offered_to_customer!=null).length;
  //     // obj.assembly_lattice_start = this.location_data.filter(x=>x.assembly_lattice_start!=""&& x.assembly_lattice_start!=null).length;
  //     // obj.assembly_lattice_finisih = this.location_data.filter(x=>x.assembly_lattice_finisih!=""&& x.assembly_lattice_finisih!=null).length;
  //     // obj.assembly_transition_adapter = this.location_data.filter(x=>x.assembly_transition_adapter!=""&& x.assembly_transition_adapter!=null).length;
  //     // obj.crane_boomup = this.location_data.filter(x=>x.crane_boomup!=""&& x.crane_boomup!=null).length;
  //     // obj.erection_of_is4 = this.location_data.filter(x=>x.erection_of_is4!=""&& x.erection_of_is4!=null).length;
  //     // obj.erection_of_is3 = this.location_data.filter(x=>x.erection_of_is3!=""&& x.erection_of_is3!=null).length;
  //     // obj.erection_of_is2 = this.location_data.filter(x=>x.erection_of_is2!=""&& x.erection_of_is2!=null).length;
  //     // obj.erection_of_lattice_tower = this.location_data.filter(x=>x.erection_of_lattice_tower!=""&& x.erection_of_lattice_tower!=null).length;
  //     // obj.erection_of_tubular_tower = this.location_data.filter(x=>x.erection_of_tubular_tower!=""&& x.erection_of_tubular_tower!=null).length;
  //     // obj.erection_nacelle = this.location_data.filter(x=>x.erection_nacelle!=""&& x.erection_nacelle!=null).length;
  //     // obj.rotor_assembly = this.location_data.filter(x=>x.rotor_assembly!=""&& x.rotor_assembly!=null).length;
  //     // obj.crane_package = this.location_data.filter(x=>x.crane_package!=""&& x.crane_package!=null).length;
  //     // obj.wtg_erection = this.location_data.filter(x=>x.wtg_erection!=""&& x.wtg_erection!=null).length;
  //     // obj.lift_landing_platform = this.location_data.filter(x=>x.lift_landing_platform!=""&& x.lift_landing_platform!=null).length;
  //     // obj.lift_installation = this.location_data.filter(x=>x.lift_installation!=""&& x.lift_installation!=null).length;
  //     // obj.lift_ftu = this.location_data.filter(x=>x.lift_ftu!=""&& x.lift_ftu!=null).length;
  //     // obj.wtg_cable_termination = this.location_data.filter(x=>x.wtg_cable_termination!=""&& x.wtg_cable_termination!=null).length;
  //     // obj.mech_wcc_offered_to_customer = this.location_data.filter(x=>x.mech_wcc_offered_by_customer!=""&& x.mech_wcc_offered_by_customer!=null).length;         
  //     // obj.mech_wcc_completed_by_customer = this.location_data.filter(x=>x.mech_wcc_completed_by_customer!=""&& x.mech_wcc_completed_by_customer!=null).length;          
  //     // obj.wtg_pre_commissioning = this.location_data.filter(x=>x.wtg_pre_commissioning!=""&& x.wtg_pre_commissioning!=null).length;
  //     // obj.safe_run = this.location_data.filter(x=>x.safe_run!=""&& x.safe_run!=null).length;      
  //     // obj.ceig_approval = this.location_data.filter(x=>x.ceig_approval!=""&& x.ceig_approval!=null).length;
  //     // obj.wtg_commissioning = this.location_data.filter(x=>x.wtg_commissioning!=""&& x.wtg_commissioning!=null).length;
  //     // obj.wtg_in_generation = this.location_data.filter(x=>x.wtg_in_generation!=""&& x.wtg_in_generation!=null).length;
  //     // obj.comm_wcc_offered_to_customer = this.location_data.filter(x=>x.comm_wcc_offered_to_customer!=""&& x.comm_wcc_offered_to_customer!=null).length;
  //     // obj.comm_wcc_competed_by_customer = this.location_data.filter(x=>x.comm_wcc_competed_by_customer!=""&& x.comm_wcc_competed_by_customer!=null).length;
  //     // obj.risk_remark = this.location_data.filter(x=>x.risk_remark!=""&& x.risk_remark!=null).length;
  //     // obj.mitigation_plan = this.location_data.filter(x=>x.mitigation_plan!=""&& x.mitigation_plan!=null).length;
  //     // obj.name_of_civil_contractor = this.location_data.filter(x=>x.name_of_civil_contractor!=""&& x.name_of_civil_contractor!=null).length;
  //     // obj.name_of_electrical_contractor_dp_yard = this.location_data.filter(x=>x.name_of_electrical_contractor_dp_yard!=""&& x.name_of_electrical_contractor_dp_yard!=null).length;
  //     // obj.name_of_electrical_contractor_elect_yard = this.location_data.filter(x=>x.name_of_electrical_contractor_elect_yard!=""&& x.name_of_electrical_contractor_elect_yard!=null).length;
  //     // obj.name_of_assembly_contractor = this.location_data.filter(x=>x.name_of_assembly_contractor!=""&& x.name_of_assembly_contractor!=null).length;
  //     // obj.name_of_mechanical_contractor = this.location_data.filter(x=>x.name_of_mechanical_contractor!=""&& x.name_of_mechanical_contractor!=null).length;
  //     // obj.name_of_cable_termination = this.location_data.filter(x=>x.name_of_cable_termination!=""&& x.name_of_cable_termination!=null).length;
  //     // obj.hoto_projects_oms = this.location_data.filter(x=>x.hoto_projects_oms!=""&& x.hoto_projects_oms!=null).length;
  //     // obj.hoto_customer = this.location_data.filter(x=>x.hoto_customer!=""&& x.hoto_customer!=null).length;
  //     // obj.saveFlag = false;
  //     // this.total_data = obj;
  //     //      this.location_data.push(obj);





  //   }, err => { });
  // }



  openSummary() {
    if(this.datasource)
    {

      let dialogRef = this.dialog.open(DprLocationSummaryComponent, {
        width: '60vw',
        data: this.datasource,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    }
    

  }



  showSaveButton(i) {
    this.location_data[i].saveFlag = true;
  }
  onNotification() {
    this.display = false;
    this.location_data = [];
    //this.getLocationDPRDashboard();
  }


}
