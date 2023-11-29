import { Component, ViewChild, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ChecklistFormDialog } from 'app/Dialogs/checklist_form.component';
import { SectionFormDialog } from 'app/Dialogs/section_form.component';
import { ItemFormDialog } from 'app/Dialogs/item_form.component';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import { FieldConfig } from 'app/models/field-config.interface';
import { EditQuestionDialog } from 'app/Dialogs/edit-question.component';
import { Router } from '@angular/router';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import { MilestoneImportDialog } from 'app/Dialogs/milestone-import/milestone-import-dialog';
import { NewChecklistVersionDialog } from 'app/Dialogs/new-checklist-version-dialog/new-checklist-version-dialog';
import { UploadExcelDialog } from 'app/Dialogs/upload_excel/upload_excel.component';
import { ConfirmDialog } from 'app/Dialogs/confirm-dialog/confirm-dialog';
import { MilestoneDeleteDialog } from 'app/Dialogs/confirm-milestone-delete-dialog/milestone-delete';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DialogModule, DataTable } from 'primeng/primeng';
import { NotificationDialog } from 'app/Dialogs/notification-dialog/notification-dialog';
import { AuthGuard } from 'app/services/auth-guard';


@Component({
  selector: 'app-pm-schedule',
  templateUrl: './pm-schedule.component.html',
  styleUrls: ['./pm-schedule.component.scss']
})
export class PmScheduleComponent implements OnInit {
  @ViewChild('dt') dataTable: DataTable;
  checklists: any[];
  sites: any[];
  searchTerm: any;
  selectedsite = 'All';
  pmScheduleData = [];
  pmScheduleDataApprove = [];
  models = [];
  maintenanceTypes = [];
  selectedModel = 'All';
  selectedMaintenanceType: any;
  selectdtab = 'PM Schedule';
  jobId: any;
  Notification: string;
  display = false;
  pmScheduleDataApprovelist = [];

  constructor(public dialog: MdDialog,
    private api_service: ApiService,
    private auth_service: AuthGuard,
    @Inject(DOCUMENT) private document: Document,
    private componentService: CustomComponentsService,
    private router: Router,
    private fb: FormBuilder,
    private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit() {

    this.getAllSite();
    this.getAllMaintenanceTypes();
    this.getAllModels();
    this.getPmScheduleBySiteOrModelOrPMType();
    this.getPMScheduleApproval();
  }
  getPmScheduleBySiteOrModelOrPMType() {
    debugger;
    if (this.selectedMaintenanceType === undefined || this.selectedsite == 'All' || this.selectedModel == 'All') {
      this.api_service.getPmScheduleBySiteOrModelOrPMTypedemo(null, null, 0).subscribe(result => {
        debugger;
        if (result) {
          this.pmScheduleData = result.data;
        }
      });

    } else {
      this.api_service.getPmScheduleBySiteOrModelOrPMType(this.selectedsite, this.selectedModel, this.selectedMaintenanceType).subscribe(result => {
        debugger;
        if (result) {
          this.pmScheduleData = result.data;
        }
      });
    }

  }
  getPMScheduleApproval() {
    this.api_service.getPMScheduleApproval().subscribe(result => {
      debugger;
      if (result) {
        this.pmScheduleDataApprove = result.data;
      }
    });
  }
  uploadExcelDialog() {
    let dialogRef = this.dialog.open(UploadExcelDialog, {
      width: '500px',
      data: {
        sheetName: "Import PM Schedule Excel",
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.getPmScheduleBySiteOrModelOrPMType();
        }, 1200);
      }
    });
  }
  search(): void {
    let term = this.searchTerm;
  }
  getAllSite(): void {
    this.api_service.getAllSite().subscribe(result => {
      debugger;
      if (result) {
        this.sites = result.data;
        // this.sites.push("All");
        // this.selectedsite=this.sites[0];
        if (result && result.data) {
          this.sites = [
            { Id: result.length, Site: 'All' }, // Add "All" as an option
            ...result.data
          ];
          this.selectedsite = 'All'; // Set the default selection to "All"
        }

      }
    });
  }
  getAllModels() {
    this.api_service.getAllModels().subscribe(result => {
      debugger;
      if (result) {
        this.models = result.data;
        this.models.push("All");
        //  this.selectedModel = this.models[0];
        // this.getPmScheduleBySite();
      }
    });
  }
  // getAllMaintenanceTypes() {
  //   this.api_service.getAllMaintenanceTypes().subscribe(result => {
  //     debugger;
  //     if (result) {
  //       this.maintenanceTypes = result.data;
  //       debugger
  //        this.selectedMaintenanceType=1;

  //     }

  //   });

  // }
  getAllMaintenanceTypes() {
    this.api_service.getAllMaintenanceTypes().subscribe(result => {
      debugger;
      if (result && result.data) {
        this.maintenanceTypes = [
          { Id: result.length, PmType1: 'All' }, // Add "All" as an option
          ...result.data
        ];
        this.selectedMaintenanceType = result.length; // Set the default selection to "All"
      }
    });
  }
  onTabChange(event) {
    debugger
    const isApproveButtonClicked = event.target instanceof Element && event.target.closest('.suzlon-button');
    if (event.target.innerText == "PM Schedule" || event.target.innerText == "Approvals") {
      this.selectdtab = event.target.innerText;
      console.log('Selected Tab:', event.target.innerText);
    }
  }
  onNotification() {
    if (this.Notification == "Successfully Approved") {
      this.display = false;

    }
    if (this.Notification == "Approve Failed") {
      this.display = false;
    }
  }
  pmScheduleApprove(event) {
    this.jobId = 3;
    this.api_service.pmScheduleApprove(this.jobId).subscribe(result => {
      setTimeout(() => {
        debugger
        this.Notification = 'Successfully Approved';
        this.display = true;
        this.getPMScheduleApproval();
      }, 400);
    },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
        setTimeout(() => {
          this.Notification = 'Approve Failed';
          this.display = true;
        }, 400);
      });
  }
  openSections(row) {
    debugger;
    this.api_service.GetPmScheduleByJobId(row.Id).subscribe(result => {
      setTimeout(() => {
        debugger
        this.pmScheduleDataApprovelist=result.data;
      }, 400);
    })
  }
}

