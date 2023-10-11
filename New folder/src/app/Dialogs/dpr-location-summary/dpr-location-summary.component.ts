import { Component, OnInit ,Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dpr-location-summary',
  templateUrl: './dpr-location-summary.component.html',
  styleUrls: ['./dpr-location-summary.component.scss']
})
export class DprLocationSummaryComponent implements OnInit {
location_data=[];
location_data_summary=[];
  total_data: { [k: string]: any; };
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<DprLocationSummaryComponent>
  ) {
    this.location_data = this.data;
    //total calculation

    var obj: { [k: string]: any } = {};
    obj.id = 1;
    obj.editable_flag=false;
    obj.type="total_obj";
    obj.client_name = this.location_data.filter(x=>x.client_name != "" && x.client_name !=null).length;
    obj.state =this.location_data.filter(x=>x.state!="" && x.state!=null).length;
    obj.site =  this.location_data.filter(x=>x.site!="" && x.site!=null).length;
    obj.model = this.location_data.filter(x=>x.model!="" && x.model!=null).length
    obj.feeder_no = this.location_data.filter(x=>x.feeder_no !="" && x.feeder_no!=null).length;
    obj.cf_new = this.location_data.filter(x=>x.cf_new!="" &&x.cf_new!=null ).length;
    obj.location_id = this.location_data.filter(x=>x.location_id!=""&&x.location_id !=null).length;
    obj.location = this.location_data.filter(x=>x.location!=""&& x.location!=null).length;
    obj.capacity = this.location_data.filter(x=>x.capacity!=""&& x.capacity!=null).length;
    obj.project_definition = this.location_data.filter(x=>x.project_definition!=""&& x.project_definition!=null).length;
    obj.survey_no = this.location_data.filter(x=>x.survey_no!=""&& x.survey_no!=null).length;
    obj.village = this.location_data.filter(x=>x.village!=""&& x.village!=null).length;
    obj.taluka = this.location_data.filter(x=>x.taluka!=""&& x.taluka!=null).length;
    obj.district = this.location_data.filter(x=>x.district!=""&& x.district!=null).length;
    obj.dispatch_clearance_date = this.location_data.filter(x=>x.dispatch_clearance_date!=""&& x.dispatch_clearance_date!=null).length;
    obj.po_commissioning_date = this.location_data.filter(x=>x.po_commissioning_date!=""&& x.po_commissioning_date!=null).length;
    obj.laf_mom_release = this.location_data.filter(x=>x.laf_mom_release!=""&& x.laf_mom_release!=null).length;
    obj.conditional_laf_workfront = this.location_data.filter(x=>x.conditional_laf_workfront!=""&& x.conditional_laf_workfront!=null).length;;
    obj.laf_mom_acceptance = this.location_data.filter(x=>x.laf_mom_acceptance!=""&& x.laf_mom_acceptance!=null).length;
    obj.soil_testing = this.location_data.filter(x=>x.soil_testing!=""&& x.soil_testing!=null).length;
    obj.re_engg = this.location_data.filter(x=>x.re_engg!=""&& x.re_engg!=null).length;;
    obj.approach_road = this.location_data.filter(x=>x.approach_road!=""&& x.approach_road!=null).length;
    obj.stub_reciept = this.location_data.filter(x=>x.stub_reciept!=""&& x.stub_reciept!=null).length;
    obj.stub_hw_reciept = this.location_data.filter(x=>x.stub_hw_reciept!=""&& x.stub_hw_reciept!=null).length;
    obj.lattice_tower_reciept = this.location_data.filter(x=>x.lattice_tower_reciept!=""&& x.lattice_tower_reciept!=null).length;
    obj.lattice_internal_reciept = this.location_data.filter(x=>x.lattice_internal_reciept!=""&& x.lattice_internal_reciept!=null).length;
    obj.tadap_reciept = this.location_data.filter(x=>x.tadap_reciept!=""&& x.tadap_reciept!=null).length;
    obj.tplate_reciept = this.location_data.filter(x=>x.tplate_reciept!=""&& x.tplate_reciept!=null).length;
    obj.t1_reciept = this.location_data.filter(x=>x.t1_reciept!=""&& x.t1_reciept!=null).length;
    obj.t2_reciept = this.location_data.filter(x=>x.t2_reciept!=""&& x.t2_reciept!=null).length;
    obj.t3_reciept = this.location_data.filter(x=>x.t3_reciept!=""&& x.t3_reciept!=null).length;
    obj.t4_reciept = this.location_data.filter(x=>x.t4_reciept!=""&& x.t4_reciept!=null).length;
    obj.full_tower_reciept = this.location_data.filter(x=>x.full_tower_reciept!=""&& x.full_tower_reciept!=null).length;
    obj.tower_hardware_reciept = this.location_data.filter(x=>x.tower_hardware_reciept!=""&& x.tower_hardware_reciept!=null).length;
    obj.cable_reciept = this.location_data.filter(x=>x.cable_reciept!=""&& x.cable_reciept!=null).length;
    obj.power_panel_converter_panel_reciept = this.location_data.filter(x=>x.power_panel_converter_panel_reciept!=""&& x.power_panel_converter_panel_reciept!=null).length;
    obj.dfig_panel_reciept = this.location_data.filter(x=>x.dfig_panel_reciept!=""&& x.dfig_panel_reciept!=null).length;
    obj.transformer_reciept = this.location_data.filter(x=>x.transformer_reciept!=""&& x.transformer_reciept!=null).length;
    obj.hub_reciept = this.location_data.filter(x=>x.hub_reciept!=""&& x.hub_reciept!=null).length;
    obj.hub_kit_reciept = this.location_data.filter(x=>x.hub_kit_reciept!=""&& x.hub_kit_reciept!=null).length;
    obj.nacelle_reciept = this.location_data.filter(x=>x.nacelle_reciept!=""&& x.nacelle_reciept!=null).length;
    obj.nacelle_kit_reciept = this.location_data.filter(x=>x.nacelle_kit_reciept!=""&& x.nacelle_kit_reciept!=null).length;
    obj.blade_with_service_reciept = this.location_data.filter(x=>x.blade_with_service_reciept!=""&& x.blade_with_service_reciept!=null).length;
    obj.lift = this.location_data.filter(x=>x.lift!=""&& x.lift!=null).length;
    obj.full_wtg_reciept = this.location_data.filter(x=>x.full_wtg_reciept!=""&& x.full_wtg_reciept!=null).length;
    obj.wtg_wcc_offered_to_customer = this.location_data.filter(x=>x.wtg_wcc_offered_to_customer!=""&& x.wtg_wcc_offered_to_customer!=null).length;
    obj.wtg_wcc_completed_by_customer = this.location_data.filter(x=>x.wtg_wcc_completed_by_customer!=""&& x.wtg_wcc_completed_by_customer!=null).length;
    obj.civil_material_reciept_anchor_bolts_studs_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_anchor_bolts_studs_for_tub_model!=""&& x.civil_material_reciept_anchor_bolts_studs_for_tub_model!=null).length;
    obj.civil_material_reciept_ar_lsp_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_ar_lsp_for_tub_model!=""&& x.civil_material_reciept_ar_lsp_for_tub_model!=null).length;      
    obj.civil_material_reciept_tmt = this.location_data.filter(x=>x.civil_material_reciept_tmt!=""&& x.civil_material_reciept_tmt!=null).length;
    obj.civil_material_reciept_packing_plate_for_tub_model = this.location_data.filter(x=>x.civil_material_reciept_packing_plate_for_tub_model!=""&& x.civil_material_reciept_packing_plate_for_tub_model!=null).length;
    obj.electrical_material_reciept_css = this.location_data.filter(x=>x.electrical_material_reciept_css!=""&& x.electrical_material_reciept_css!=null).length;
    obj.electrical_material_reciept_ctpt = this.location_data.filter(x=>x.electrical_material_reciept_ctpt!=""&& x.electrical_material_reciept_ctpt!=null).length;
    obj.electrical_material_reciept_la = this.location_data.filter(x=>x.electrical_material_reciept_la!=""&& x.electrical_material_reciept_la!=null).length;
    obj.electrical_material_reciept_rsj_pole = this.location_data.filter(x=>x.electrical_material_reciept_rsj_pole!=""&& x.electrical_material_reciept_rsj_pole!=null).length;
    obj.electrical_material_reciept_conductor = this.location_data.filter(x=>x.electrical_material_reciept_conductor!=""&& x.electrical_material_reciept_conductor!=null).length;
    obj.excavation = this.location_data.filter(x=>x.excavation!=""&& x.excavation!=null).length;
    obj.pcc = this.location_data.filter(x=>x.pcc!=""&& x.pcc!=null).length;
    obj.civil_pcc_wcc_offered_to_customer = this.location_data.filter(x=>x.civil_pcc_wcc_offered_to_customer!=""&& x.civil_pcc_wcc_offered_to_customer!=null).length;
    obj.civil_pcc_wcc_completed_by_customer = this.location_data.filter(x=>x.civil_wcc_completed_by_customer!=""&& x.civil_pcc_wcc_completed_by_customer!=null).length;
    obj.stub_assembly_ar_assembly = this.location_data.filter(x=>x.stub_assembly_ar_assembly!=""&& x.stub_assembly_ar_assembly!=null).length;
    obj.stub_erection = this.location_data.filter(x=>x.stub_erection!=""&& x.stub_erection!=null).length;
    obj.reinforcement_binding_and_formwork = this.location_data.filter(x=>x.reinforcement_binding_and_formwork!=""&& x.reinforcement_binding_and_formwork!=null).length;;
    obj.shuttering = this.location_data.filter(x=>x.shuttering!=""&& x.shuttering!=null).length;
    obj.foundation_casting_raft =this.location_data.filter(x=>x.foundation_casting_raft!=""&& x.foundation_casting_raft!=null).length;                  
    obj.foundation_casting_pedestal = this.location_data.filter(x=>x.foundation_casting_pedestal!=""&& x.foundation_casting_pedestal!=null).length;
    obj.completion_of_foundation = this.location_data.filter(x=>x.completion_of_foundation!=""&& x.completion_of_foundation!=null).length;
    obj.seven_day_test_report = this.location_data.filter(x=>x.seven_day_test_report!=""&& x.seven_day_test_report!=null).length;
    obj.twenty_eight_day_test_report = this.location_data.filter(x=>x.twenty_eight_day_test_report!=""&& x.twenty_eight_day_test_report!=null).length;
    obj.civil_wcc_offered_to_customer = this.location_data.filter(x=>x.civil_wcc_offered_to_customer!=""&& x.civil_wcc_offered_to_customer!=null).length;
    obj.civil_wcc_completed_by_customer = this.location_data.filter(x=>x.civil_wcc_completed_by_customer!=""&& x.civil_wcc_completed_by_customer!=null).length;
    obj.dp_yard_civil_plinth_platform = this.location_data.filter(x=>x.dp_yard_civil_plinth_platform!=""&& x.dp_yard_civil_plinth_platform!=null).length;
    obj.trafo_css_erection = this.location_data.filter(x=>x.trafo_css_erection!=""&& x.trafo_css_erection!=null).length;
    obj.ctpt_erection = this.location_data.filter(x=>x.ctpt_erection!=""&& x.ctpt_erection!=null).length;
    obj.metering_and_plumbing_work = this.location_data.filter(x=>x.metering_and_plumbing_work!=""&& x.metering_and_plumbing_work!=null).length;
    obj.earthing_strip_laying = this.location_data.filter(x=>x.earthing_strip_laying!=""&& x.earthing_strip_laying!=null).length;
    obj.lt_cable_laying_and_termination = this.location_data.filter(x=>x.lt_cable_laying_and_termination!=""&& x.lt_cable_laying_and_termination!=null).length;
    obj.completion_of_dp_yard = this.location_data.filter(x=>x.completion_of_dp_yard!=""&& x.completion_of_dp_yard!=null).length;  
    obj.scope_of_lnt_lines_in_total_no_of_poles = this.location_data.filter(x=>x.scope_of_lnt_lines_in_total_no_of_poles!=""&& x.scope_of_lnt_lines_in_total_no_of_poles!=null).length;
    obj.survey_done_in_total_nos_int = this.location_data.filter(x=>x.survey_done_in_total_nos_int!=""&& x.survey_done_in_total_nos_int!=null).length;
    obj.pit_excavations_in_nos_int = this.location_data.filter(x=>x.pit_excavations_in_nos_int!=""&& x.pit_excavations_in_nos_int!=null).length;
    obj.pole_erection_in_nos_int = this.location_data.filter(x=>x.pole_erection_no_nos_int!=""&& x.pole_erection_in_nos_int!=null).length;
    obj.pole_stringing_in_nos_int = this.location_data.filter(x=>x.pole_stringing_in_nos_int!=""&& x.pole_stringing_in_nos_int!=null).length;
    obj.internal_line_completion = this.location_data.filter(x=>x.internal_line_completion!=""&& x.internal_line_completion!=null).length;      
    obj.scope_of_external_line_in_total_no_of_poles = this.location_data.filter(x=>x.scope_of_external_line_in_total_no_of_poles!=""&& x.scope_of_external_line_in_total_no_of_poles!=null).length;
    obj.surve_done_in_total_nos_ext = this.location_data.filter(x=>x.surve_done_in_total_nos_ext!=""&& x.surve_done_in_total_nos_ext!=null).length;
    obj.pit_excavations_in_nos_ext = this.location_data.filter(x=>x.pit_excavations_in_nos_ext!=""&& x.pit_excavations_in_nos_ext!=null).length;
    obj.pole_erection_no_nos_ext = this.location_data.filter(x=>x.pole_erection_no_nos_ext!=""&& x.pole_erection_no_nos_ext!=null).length;
    obj.pole_stringing_in_nos_ext = this.location_data.filter(x=>x.pole_stringing_in_nos_ext!=""&& x.pole_stringing_in_nos_ext!=null).length;
    obj.external_line_completion = this.location_data.filter(x=>x.external_line_completion!=""&& x.external_line_completion!=null).length;
    obj.electrical_dp_yard_wcc_offered_to_customer = this.location_data.filter(x=>x.electrical_dp_yard_wcc_offered_to_customer!=""&& x.electrical_dp_yard_wcc_offered_to_customer!=null).length;
    obj.electrical_dp_yard_wcc_completed_by_customer = this.location_data.filter(x=>x.electrical_dp_yard_wcc_completed_by_customer!=""&& x.electrical_dp_yard_wcc_completed_by_customer!=null).length;
    obj.electrical_33kv_line_wcc_completed_by_customer = this.location_data.filter(x=>x.electrical_33kv_line_wcc_completed_by_customer!=""&& x.electrical_33kv_line_wcc_completed_by_customer!=null).length;
    obj.electrical_33kv_line_wcc_offered_to_customer = this.location_data.filter(x=>x.electrical_33kv_line_wcc_offered_to_customer!=""&& x.electrical_33kv_line_wcc_offered_to_customer!=null).length;
    obj.assembly_lattice_start = this.location_data.filter(x=>x.assembly_lattice_start!=""&& x.assembly_lattice_start!=null).length;
    obj.assembly_lattice_finisih = this.location_data.filter(x=>x.assembly_lattice_finisih!=""&& x.assembly_lattice_finisih!=null).length;
    obj.assembly_transition_adapter = this.location_data.filter(x=>x.assembly_transition_adapter!=""&& x.assembly_transition_adapter!=null).length;
    obj.crane_boomup = this.location_data.filter(x=>x.crane_boomup!=""&& x.crane_boomup!=null).length;
    obj.erection_of_is4 = this.location_data.filter(x=>x.erection_of_is4!=""&& x.erection_of_is4!=null).length;
    obj.erection_of_is3 = this.location_data.filter(x=>x.erection_of_is3!=""&& x.erection_of_is3!=null).length;
    obj.erection_of_is2 = this.location_data.filter(x=>x.erection_of_is2!=""&& x.erection_of_is2!=null).length;
    obj.erection_of_lattice_tower = this.location_data.filter(x=>x.erection_of_lattice_tower!=""&& x.erection_of_lattice_tower!=null).length;
    obj.erection_of_tubular_tower = this.location_data.filter(x=>x.erection_of_tubular_tower!=""&& x.erection_of_tubular_tower!=null).length;
    obj.erection_nacelle = this.location_data.filter(x=>x.erection_nacelle!=""&& x.erection_nacelle!=null).length;
    obj.rotor_assembly = this.location_data.filter(x=>x.rotor_assembly!=""&& x.rotor_assembly!=null).length;
    obj.crane_package = this.location_data.filter(x=>x.crane_package!=""&& x.crane_package!=null).length;
    obj.wtg_erection = this.location_data.filter(x=>x.wtg_erection!=""&& x.wtg_erection!=null).length;
    obj.lift_landing_platform = this.location_data.filter(x=>x.lift_landing_platform!=""&& x.lift_landing_platform!=null).length;
    obj.lift_installation = this.location_data.filter(x=>x.lift_installation!=""&& x.lift_installation!=null).length;
    obj.lift_ftu = this.location_data.filter(x=>x.lift_ftu!=""&& x.lift_ftu!=null).length;
    obj.wtg_cable_termination = this.location_data.filter(x=>x.wtg_cable_termination!=""&& x.wtg_cable_termination!=null).length;
    obj.mech_wcc_offered_to_customer = this.location_data.filter(x=>x.mech_wcc_offered_by_customer!=""&& x.mech_wcc_offered_by_customer!=null).length;         
    obj.mech_wcc_completed_by_customer = this.location_data.filter(x=>x.mech_wcc_completed_by_customer!=""&& x.mech_wcc_completed_by_customer!=null).length;          
    obj.wtg_pre_commissioning = this.location_data.filter(x=>x.wtg_pre_commissioning!=""&& x.wtg_pre_commissioning!=null).length;
    obj.safe_run = this.location_data.filter(x=>x.safe_run!=""&& x.safe_run!=null).length;      
    obj.ceig_approval = this.location_data.filter(x=>x.ceig_approval!=""&& x.ceig_approval!=null).length;
    obj.wtg_commissioning = this.location_data.filter(x=>x.wtg_commissioning!=""&& x.wtg_commissioning!=null).length;
    obj.wtg_in_generation = this.location_data.filter(x=>x.wtg_in_generation!=""&& x.wtg_in_generation!=null).length;
    obj.comm_wcc_offered_to_customer = this.location_data.filter(x=>x.comm_wcc_offered_to_customer!=""&& x.comm_wcc_offered_to_customer!=null).length;
    obj.comm_wcc_competed_by_customer = this.location_data.filter(x=>x.comm_wcc_competed_by_customer!=""&& x.comm_wcc_competed_by_customer!=null).length;
    obj.risk_remark = this.location_data.filter(x=>x.risk_remark!=""&& x.risk_remark!=null).length;
    obj.mitigation_plan = this.location_data.filter(x=>x.mitigation_plan!=""&& x.mitigation_plan!=null).length;
    obj.name_of_civil_contractor = this.location_data.filter(x=>x.name_of_civil_contractor!=""&& x.name_of_civil_contractor!=null).length;
    obj.name_of_electrical_contractor_dp_yard = this.location_data.filter(x=>x.name_of_electrical_contractor_dp_yard!=""&& x.name_of_electrical_contractor_dp_yard!=null).length;
    obj.name_of_electrical_contractor_elect_yard = this.location_data.filter(x=>x.name_of_electrical_contractor_elect_yard!=""&& x.name_of_electrical_contractor_elect_yard!=null).length;
    obj.name_of_assembly_contractor = this.location_data.filter(x=>x.name_of_assembly_contractor!=""&& x.name_of_assembly_contractor!=null).length;
    obj.name_of_mechanical_contractor = this.location_data.filter(x=>x.name_of_mechanical_contractor!=""&& x.name_of_mechanical_contractor!=null).length;
    obj.name_of_cable_termination = this.location_data.filter(x=>x.name_of_cable_termination!=""&& x.name_of_cable_termination!=null).length;
    obj.hoto_projects_oms = this.location_data.filter(x=>x.hoto_projects_oms!=""&& x.hoto_projects_oms!=null).length;
    obj.hoto_customer = this.location_data.filter(x=>x.hoto_customer!=""&& x.hoto_customer!=null).length;
    obj.saveFlag = false;
    this.total_data = obj;
    //ends here
    this.location_data_summary.push(this.total_data);
  }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogRef.close(false);
  }
}
