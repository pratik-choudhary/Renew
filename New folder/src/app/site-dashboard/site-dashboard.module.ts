import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MultiSelectModule} from 'primeng/primeng';
import {
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
  MdAutocompleteModule,
  MdTabsModule
} from '@angular/material';
import { ChartsModule,BaseChartDirective } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import {DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule} from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
// import DynamicComponent from 'app/custom_components/dynamic-component';
// import WorldHelloComponent from 'app/custom_components/world-hello-component';
// import HelloWorldComponent from 'app/custom_components/hello-world-component';
import {CreateSiteListComponent} from 'app/custom_components/site-dashboard-list/site-dashboard-list.component';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import { AssignmentComponent } from 'app/site-dashboard/location-dashboard/assignment.component';
import { ChecklistAssignmentComponent } from 'app/site-dashboard/checklist-assignment/checklist-assignment.component';
import { CreateSiteRoutes } from "app/site-dashboard/site-dashboard.routing";
import { CreateSiteComponent } from "app/site-dashboard/site-dashboard.component";
import { ConfirmDialogModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { Configuration_question } from "app/site-dashboard/configuration_question/configuration_question";
@NgModule({
  imports: [
    CommonModule,
    MultiSelectModule,
    RouterModule.forChild(CreateSiteRoutes),
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdListModule,
    MdSelectModule,
    MdTooltipModule,
    MdAutocompleteModule,
    FlexLayoutModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MdChipsModule,
    MdMenuModule,
    MdCheckboxModule,
    SharedModule,
    MdOptionModule,
    NgxDatatableModule,
    InlineEditorModule,
    DataTableModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    ChartsModule,
    NgxChartsModule,
    ConfirmDialogModule,
    DialogModule,
    MdTabsModule
  ],
  declarations: [
    CreateSiteComponent, CreateSiteListComponent, AssignmentComponent, ChecklistAssignmentComponent, Configuration_question
  ],
  providers: [ApiService, CustomComponentsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CreateSiteModule {}
