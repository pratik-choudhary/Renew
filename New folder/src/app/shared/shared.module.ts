import { NgModule,CUSTOM_ELEMENTS_SCHEMA ,TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { CreateModalComponent} from 'app/custom_components/create-model/create-model.component';
import { CreateModelListComponent} from 'app/custom_components/create-model-list/create-model-list.component';
import { LocationModalComponent} from 'app/custom_components/location/location-model.component';
import { LocationModelListComponent} from 'app/custom_components/location-list/location-list.component';
import { DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule, RadioButtonModule} from 'primeng/primeng';
import { CustomerModalComponent} from 'app/custom_components/customer/customer-model.component';
import { CustomerModelListComponent} from 'app/custom_components/customer-list/customer-list.component';
import { SiteModalComponent} from 'app/custom_components/site/site-model.component';
import { SiteModelListComponent} from 'app/custom_components/site-list/site-list.component';
import { FeederModalComponent} from 'app/custom_components/feeder/feeder-model.component';
import { FeederModelListComponent} from 'app/custom_components/feeder-list/feeder-list.component';
import { SubStationModalComponent} from 'app/custom_components/sub-station/sub-station-model.component';
import { SubStationModelListComponent} from 'app/custom_components/sub-station-list/sub-station-list.component';
import { AreaModalComponent} from 'app/custom_components/area/area-model.component';
import { AreaModelListComponent} from 'app/custom_components/area-list/area-list.component';
import { UserModalComponent} from 'app/custom_components/user/user-model.component';
import { UserModelListComponent} from 'app/custom_components/user-list/user-list.component';
import { StageModalComponent} from 'app/custom_components/stage/stage-model.component';
import { StageModelListComponent} from 'app/custom_components/stage-list/stage-list.component';
import { ChecklistInsForm } from 'app/custom_components/checklist-ins/checklist-ins.component';
import { NewChecklistVersion } from 'app/custom_components/new-checklist-version/new-checklist-version';
import { ChecklistAddForm } from 'app/custom_components/checklist-add-form/checklist-add-form';
import {ConfirmDepartment} from 'app/custom_components/confirm-department/confirm-department'
import {ConfirmChecklist} from 'app/custom_components/confirm-checklist/confirm-checklist';
import {ConfirmMilestone} from 'app/custom_components/confirm-milestone/confirm-milestone';
import {ProjectConfirm} from 'app/custom_components/project-confirm/project-confirm';
import {NotificationMessage} from 'app/custom_components/notification-message/notification-message';
import {DialogModule} from 'primeng/primeng';
import {ButtonModule, PanelModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import {HistoryTableComponent} from 'app/custom_components/history-table/history-table.component';
import { DprDashboardComponent } from 'app/custom_components/dpr-dashboard/dpr-dashboard.component';
import { StageEightForm } from 'app/custom_components/stage8-form/stage8_form.component';
import { ContextmenuComponent } from 'app/custom_components/context-menu/context_menu.component';
import {
  MaterialModule,
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdToolbarModule,
  MdListModule,
  MdSelectModule,
  MdChipsModule,
  MdMenuModule,
  MdCheckboxModule,
  MdOptionModule,
  MdTooltipModule,
  MdDialogRef
   } from '@angular/material';
import { QuestionTableComponent } from 'app/custom_components/question-table/question-table.component';
import { QuestionTimelineComponent } from 'app/custom_components/timeline/timeline.component';
import { MilestoneInsForm } from 'app/custom_components/milestone-ins/milestone-ins.component';
import { MilestoneImport } from 'app/custom_components/milestone-import/milestone-import.component';
import { ExcelUploadComponent } from 'app/custom_components/upload-excel/upload-excel.component';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ProjectListComponent } from 'app/custom_components/project-list/project-list.component';
import { AddProjectModel } from 'app/custom_components/add-model/add-model.component';
import { ConfirmDialogModule } from 'primeng/primeng';
import { DprLocationDashboardComponent } from './../custom_components/dpr-location-dashboard/dpr-location-dashboard.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdListModule,
    MdSelectModule,
    MdChipsModule,
    MdMenuModule,
    MdCheckboxModule,
    MdOptionModule,
    MdTooltipModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DataTableModule,
    CalendarModule,
    DropdownModule,
    FileUploadModule,
    AutoCompleteModule,
    InputTextModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DialogModule,ButtonModule, 
    PanelModule,
    MultiSelectModule
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    CreateModalComponent,
    CreateModelListComponent,
    LocationModalComponent,
    LocationModelListComponent,
    CustomerModalComponent,
    CustomerModelListComponent,
    SiteModalComponent,
    SiteModelListComponent,
    FeederModalComponent,
    FeederModelListComponent,
    SubStationModalComponent,
    SubStationModelListComponent,
    AreaModalComponent,
    AreaModelListComponent,
    UserModalComponent,
    UserModelListComponent,
    StageModalComponent,
    StageModelListComponent,
    ChecklistInsForm,
    QuestionTableComponent,
    QuestionTimelineComponent,
    MilestoneInsForm,
    MilestoneImport,
    NewChecklistVersion,
    ExcelUploadComponent,
    ProjectListComponent,
    ChecklistAddForm,
    AddProjectModel,
    ConfirmDepartment,
    ConfirmChecklist,
    ConfirmMilestone,
    ProjectConfirm,
    NotificationMessage,
    HistoryTableComponent,
    StageEightForm,
    ContextmenuComponent,
    DprDashboardComponent,
    DprLocationDashboardComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    CreateModalComponent,
    CreateModelListComponent,
    LocationModalComponent,
    LocationModelListComponent,
    CustomerModalComponent,
    CustomerModelListComponent,
    SiteModalComponent,
    SiteModelListComponent,
    FeederModalComponent,
    FeederModelListComponent,
    SubStationModalComponent,
    SubStationModelListComponent,
    AreaModalComponent,
    AreaModelListComponent,
    UserModalComponent,
    UserModelListComponent,
    StageModalComponent,
    StageModelListComponent,
    ChecklistInsForm,
    QuestionTableComponent,
    QuestionTimelineComponent,
    MilestoneInsForm,
    MilestoneImport,
    NewChecklistVersion,
    ExcelUploadComponent,
    ProjectListComponent,
    ChecklistAddForm,
    AddProjectModel,
    ConfirmDepartment,
    ConfirmChecklist,
    ConfirmMilestone,
    ProjectConfirm,
    NotificationMessage,
    HistoryTableComponent,
    StageEightForm,
    DprDashboardComponent,
    ContextmenuComponent,
    DprLocationDashboardComponent
   ],
  providers: [ MenuItems ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
