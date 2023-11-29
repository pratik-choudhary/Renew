import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { ChecklistFormDialog} from 'app/Dialogs/checklist_form.component';
import { EditQuestionDialog} from 'app/Dialogs/edit-question.component';
import { SectionFormDialog} from 'app/Dialogs/section_form.component';
import { ItemFormDialog } from 'app/Dialogs/item_form.component';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import { LocationDialog } from 'app/Dialogs/location/location.component';
import { CustomerDialog } from 'app/Dialogs/customer/customer.component';
import { SiteDialog } from 'app/Dialogs/site/site.component';
import { FeederDialog } from 'app/Dialogs/feeder/feeder.component';
import { SubStationDialog } from 'app/Dialogs/sub-station/sub-station.component';
import { AreaDialog } from 'app/Dialogs/area/area.component';
import { UserDialog } from 'app/Dialogs/user/user.component';
import { StageDialog } from 'app/Dialogs/stage/stage.component';
import { ApiService } from 'app/services/api.service';
import { ValidationService } from 'app/services/validation.service';
import { EditComponent } from 'app/custom_components/edit-popup/edit-component.component';
import { EditInputComponent } from 'app/custom_components/form-input/edit-popup/edit-popup.component';
import { EditTextComponent } from 'app/custom_components/form-text/edit-popup/edit-popup.component';
import { GroupQuestionComponent } from 'app/custom_components/group-question/group-question.component';
import { QuestionInfoDialog } from 'app/Dialogs/question-info/question-info.component';
import { MilestoneTableDialog } from 'app/Dialogs/milestone-table/milestone-table.component';
import { MilestoneImportDialog } from 'app/Dialogs/milestone-import/milestone-import-dialog';
import { NewChecklistVersionDialog } from 'app/Dialogs/new-checklist-version-dialog/new-checklist-version-dialog';
import { UploadExcelDialog } from 'app/Dialogs/upload_excel/upload_excel.component';
import { AddProjectDialog } from 'app/Dialogs/Project/project-dialog.component';
import { ConfirmDialog } from 'app/Dialogs/confirm-dialog/confirm-dialog';
import { MilestoneDeleteDialog } from 'app/Dialogs/confirm-milestone-delete-dialog/milestone-delete';
import { AuthGuard } from 'app/services/auth-guard';
import { NotificationDialog } from 'app/Dialogs/notification-dialog/notification-dialog';
import { DialogModule, AutoCompleteModule, DropdownModule,ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import { DataTableModule, CalendarModule,InputTextModule, RadioButtonModule} from 'primeng/primeng';
import { ChecklistHistoryDialog } from 'app/Dialogs/history-checklist-dashboard/history-dialog.component';
import { StartSubstationDialog } from 'app/Dialogs/start-substation/start-substation.component';
import { StartFeederDialog } from 'app/Dialogs/start-feeder/start-feeder.component';
import { ConfigPopupDialog } from 'app/Dialogs/cofiguration-stage/configuration.component';
import { Stage4CommissioningDialog } from  'app/Dialogs/stage4_commissioning/stage4_commissioning';
import { Stage3ApproveDetails } from 'app/Dialogs/stage3_approve_details/stage3_approve_details';
import { Stage2ApproveDetails } from 'app/Dialogs/stage2_approve_details/stage2_approve_details';
import { Stage7ApproveDetails } from 'app/Dialogs/stage7_approve_details/stage7_approve_details';
import { Stage8ApproveDetails } from 'app/Dialogs/stage8_approve_details/stage8_approve_details';
import { Stage9ApproveDetails } from 'app/Dialogs/stage9_approve_details/stage9_approve_details';
import { Stage8Details } from 'app/Dialogs/stage8_details_dialog/stage8_details_dialog';
import { LocationStatusDetails } from 'app/Dialogs/location_status_dialog/location_status_dialog.component';
import { Stage6ApproveDetails } from 'app/Dialogs/stage6_approve_details/stage6_approve_details';
import { DocumentStructureComponent } from 'app/document_structure/document_structure.component';
import { ReportComponent } from 'app/reports/reports.component';
import {TreeModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {MapDialog} from 'app/Dialogs/map_dialog/map_dialog';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { WtgTraceabilityUploadComponent } from './Dialogs/wtg-traceability-upload/wtg-traceability-upload.component';
import { UploadHeaderFooterComponent } from './Dialogs/upload-header-footer/upload-header-footer.component';
import { DqrReportComponent } from './Dialogs/dqr-report/dqr-report.component';
import { DprLocationSummaryComponent } from './Dialogs/dpr-location-summary/dpr-location-summary.component';
import { SiteLevelHeaderFooterComponent } from './Dialogs/site-level-header-footer/site-level-header-footer.component';
import { IssueRegisterComponent } from './Dialogs/issue-register/issue-register.component';
import { ImageDialogComponent } from './Dialogs/image-dialog/image-dialog.component';




//import { AgmCoreModule } from '@agm/core';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MapDialog,
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ChecklistFormDialog,
    SectionFormDialog,
    ItemFormDialog,
    EditInputComponent,
    EditComponent,
    EditTextComponent,
    EditQuestionDialog,
    GroupQuestionComponent,
    ModelDialog,
    LocationDialog,
    CustomerDialog,
    SiteDialog,
    FeederDialog,
    SubStationDialog,
    AreaDialog,
    UserDialog,
    StageDialog,
    QuestionInfoDialog,
    MilestoneTableDialog,
    MilestoneImportDialog,
    NewChecklistVersionDialog,
    UploadExcelDialog,
    AddProjectDialog,
    ConfirmDialog,
    MilestoneDeleteDialog,
    NotificationDialog,
    ChecklistHistoryDialog,
    StartSubstationDialog,
    StartFeederDialog,
    ConfigPopupDialog,
    Stage4CommissioningDialog,
    Stage3ApproveDetails,
    Stage2ApproveDetails,
    Stage7ApproveDetails,
    Stage8ApproveDetails,
    Stage9ApproveDetails,
    Stage8Details,
    LocationStatusDetails,
    Stage6ApproveDetails,
    DocumentStructureComponent,
    ReportComponent,
    WtgTraceabilityUploadComponent,
    UploadHeaderFooterComponent,
    DqrReportComponent,
    DprLocationSummaryComponent,
    SiteLevelHeaderFooterComponent,
    IssueRegisterComponent,
    ImageDialogComponent,
   

  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAdw9ouK5zHHPq-dY-quwQ7s5wqqAm2c5I'      
    }),
    AgmSnazzyInfoWindowModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
   RouterModule.forRoot(AppRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
   
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    MaterialModule,
    FlexLayoutModule,
    DialogModule,
    AutoCompleteModule,
    DropdownModule,
    DataTableModule,
    CalendarModule,
    InputTextModule, 
    RadioButtonModule,
    ConfirmDialogModule,
    TreeModule,
    CheckboxModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyDxXS0BIb9k38Wwug3k0fR3cL54El-D5qM'
    // })
  ],
  entryComponents: [
  IssueRegisterComponent,
  DprLocationSummaryComponent,
  ChecklistFormDialog,
  SectionFormDialog,
  ItemFormDialog,
  EditQuestionDialog,
  EditInputComponent,
  EditComponent,
  EditTextComponent,
  ModelDialog,
  LocationDialog,
  CustomerDialog,
  SiteDialog,
  FeederDialog,
  SubStationDialog,
  AreaDialog,
  UserDialog,
  StageDialog,
  QuestionInfoDialog,
  MilestoneTableDialog,
  MilestoneImportDialog,
  NewChecklistVersionDialog,
  UploadExcelDialog,
  AddProjectDialog,
  ConfirmDialog,
  MilestoneDeleteDialog,
  NotificationDialog,
  ChecklistHistoryDialog,
  StartSubstationDialog,
  StartFeederDialog,
  ConfigPopupDialog,
  Stage4CommissioningDialog,
  Stage3ApproveDetails,
  Stage2ApproveDetails,
  Stage7ApproveDetails,
  Stage8ApproveDetails,
  Stage9ApproveDetails,
  Stage8Details,
  LocationStatusDetails,
  Stage6ApproveDetails,
  MapDialog,
  WtgTraceabilityUploadComponent,
  UploadHeaderFooterComponent,
  DqrReportComponent,
  SiteLevelHeaderFooterComponent,
  ImageDialogComponent,
  ],
  providers: [
    ApiService,
    AuthGuard,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    ValidationService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
