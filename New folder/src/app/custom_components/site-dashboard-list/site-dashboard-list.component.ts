import { Component, Inject, Input, Output, EventEmitter, OnInit,ElementRef, ViewChild} from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogConfig, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import { ApiService } from 'app/services/api.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ChangeDetectionStrategy } from '@angular/core';
import { MapDialog } from 'app/Dialogs/map_dialog/map_dialog';
import { IssueRegisterComponent } from 'app/Dialogs/issue-register/issue-register.component';
declare var tableToExcel: any;
@Component({
    selector: 'site-dashboard-list',
    templateUrl: './site-dashboard-list.html',
    styleUrls: ['./site-dashboard-list.scss'],
    providers: [ConfirmationService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateSiteListComponent implements OnInit {
    @ViewChild('map') el:ElementRef;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    @Input() stageId: number;
    @Input() siteId: number;
    @Output() count: EventEmitter<number> = new EventEmitter<number>();
    siteList: any;
    locationsCopy: any[] = [];
    locations: any[] = [];
    map_locations = [];
    list: any[] = [];
    searchTerm: string;
    checklistFlag = true;
    cod_certificate_id: any;
    new_dashboard = [];
    new_dashboard_excel = [];
    new_dashboard_copy = [];
    is_initialized = false;
    constructor(public dialog: MdDialog, private confirmationService: ConfirmationService, private router: Router, private api_service: ApiService) {
        this.locations = [];
    }
    search(): void {
        let term = this.searchTerm;
        this.new_dashboard = this.new_dashboard_copy.filter(function (tag) {
            var regex = new RegExp(term, 'i');
            if (regex.test(tag.location_name)) {
                return tag.location_name;
            }
        });
    }


    applyReadFlagStyle(rowData: any): string {
        if (rowData.location_id == 0) return 'hide_row';
    }
    openMapDialog() {
        console.log('locations inside dasbhoard');
        console.log(this.map_locations);

        let dialogRef = this.dialog.open(MapDialog, {
            height: '100%',
            width: '100%',
            disableClose: true,
            data: this.map_locations
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    exportToExcel() {
        let excelFileName = "Dashboard";
        tableToExcel('gt-loss-grid1', 'Site Dashboard', excelFileName);
    }
    getNewDashBoard() {
        this.api_service.getNewDashboard(this.siteId).subscribe(data => {
            //this.new_dashboard = data;
            this.new_dashboard_copy = data;
            var temp = [];
            this.new_dashboard =[];
            let x = [];
            for (var location of data) {
                this.map_locations.push(location);
                var obj: { [k: string]: any } = {};
                obj.location = location.location;
                obj.model_name = location.model_name;
                obj.ok_questions = location.ok_questions;
                obj.not_ok_questions = location.not_ok_questions;
                obj.current_stage = location.current_stage;                
                obj.location_id = location.location_id;
                obj.location_name = location.location_name;
                obj.current_stage_name = location.current_stage_name;
                obj.stage_1_civil_hod_count = location.stage_1_civil_hod_count;
                obj.stage_1_civil_qa_count = location.stage_1_civil_qa_count;
                obj.stage_1_civil_completed_count = location.stage_1_civil_completed_count;
                obj.stage_1_electrical_hod_count = location.stage_1_electrical_completed_count;
                obj.stage_1_electrical_qa_count = location.stage_1_electrical_qa_count;
                obj.stage_1_electrical_completed_count = location.stage_1_electrical_completed_count;
                obj.stage_1_mechanical_hod_count = location.stage_1_mechanical_hod_count ;
                obj.stage_1_mechanical_qa_count =location.stage_1_mechanical_qa_count;
                obj.stage_1_mechanical_completed_count = location.stage_1_mechanical_completed_count ;
                obj.stage_2_precom_hod_count = location.stage_2_precom_hod_count;
                obj.stage_2_precom_qa_count = location.stage_2_precom_qa_count;
                obj.stage_2_precom_completed_count = location.stage_2_precom_completed_count;
                obj.stage_3_safe_run_hod_count = location.stage_3_safe_run_hod_count;
                obj.stage_3_safe_run_qa_count = location.stage_3_safe_run_qa_count;
                obj.stage_3_safe_run_completed_count = location.stage_3_safe_run_completed_count;
                obj.stage_4_comm_hod_count = location.stage_4_comm_hod_count;
                obj.stage_4_comm_qa_count = location.stage_4_comm_qa_count;
                obj.stage_4_comm_completed_count = location.stage_4_comm_completed_count;
                obj.stage_5_config_hod_count = location.stage_5_config_hod_count;
                obj.stage_5_config_qa_count = location.stage_5_config_qa_count;
                obj.stage_5_config_completed_count = location.stage_5_config_completed_count;
                obj.stage_6_hoto_signoff_hod_count = location.stage_6_hoto_signoff_hod_count;
                obj.stage_6_hoto_signoff_qa_count = location.stage_6_hoto_signoff_qa_count;
                obj.stage_6_hoto_signoff_completed_count = location.stage_6_hoto_signoff_completed_count;
                obj.stage_7_maintenance_hod_count = location.stage_7_maintenance_hod_count;
                obj.stage_7_maintenance_qa_count = location.stage_7_maintenance_qa_count;
                obj.show_hoto_certificate = location.show_hoto_certificate;
                obj.show_stpt_certificate = location.show_stpt_certificate;
                obj.stage_7_maintenance_completed_count = location.stage_7_maintenance_completed_count ;
                x.push(obj);
            }   
            this.new_dashboard = x;         
            // let event: HTMLElement = this.el.nativeElement as HTMLElement;
            // event.click();
            this.notify.emit("show table");
        }, err => {

        });
    }

    ngOnInit() {
        this.getNewDashBoard();
    }

    generatePDF(row) {
        this.api_service.getCertificateByLocationId(row.location.id).subscribe(
            data => {
                if (data == "File created successfully") {
                    var vin = window.open("/hoto_be/data/Certificate/" + row.location.id + ".pdf", "_blank");
                    vin.focus();
                }
            }, err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }
    generateInternalPDF(row) {
        this.api_service.getInternalCertificateByLocationId(row.location.id).subscribe(
            data => {
                if (data == "File created successfully") {
                    var vin = window.open("/hoto_be/data/Internal_Certificate/" + row.location.id + ".pdf", "_blank");
                    vin.focus();
                }
            }, err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }

    openIssueRegisterDialog()
    {
        this.api_service.downloadIssueRegister(this.siteId).subscribe(data=>{
            const urlCreator = window.URL;
            if (urlCreator) {
              const url = urlCreator.createObjectURL(data);
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.href = url;
              a.download = "IssueRegister" + '.xlsx';
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
          }
        },
          err=>{});
        // let dialogRef = this.dialog.open(IssueRegisterComponent, {
        //     data:this.siteId,
        //     width: '40vw',
        //     height:'200px',
        //     disableClose: true,            
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //     }
        // });
    }
    getSTPTCertificate(row) {
        this.api_service.getSTPTCertificateByLocationId(row.location.id).subscribe(
            data => {
                if (data != 0) {
                    var vin = window.open("/hoto_be/data/STPT/" + data + ".pdf", "_blank");
                    vin.focus();
                }
            }
            , err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });

    }

    OpenLocationDashboard(locationData: any) {
        console.log(locationData);
        if (locationData.current_stage == null && locationData.location.status != 'complete' && locationData.location.status != 'in-progress') {
            this.confirmationService.confirm({
                message: 'This Location has not started yet still do you want to continue ?',
                header: 'Confirmation',
                icon: 'fa fa-info',
                accept: () => {
                    this.router.navigate(['site-dashboard/location', locationData.location_id]);
                }
            });
        }
        else {
            this.router.navigate(['site-dashboard/location', locationData.location_id]);
        }

    }


}
