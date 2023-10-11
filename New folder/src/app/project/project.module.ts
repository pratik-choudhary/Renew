import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  MdDatepickerModule,
  MdNativeDateModule,
  MdAutocompleteModule  
   } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ProjectRoutes } from './project.routing';
 import { ProjectComponent } from './project.component';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import { SharedModule } from '../shared/shared.module';
import DynamicComponent from 'app/custom_components/dynamic-component';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import { StagesComponent } from './stages/stages.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProjectRoutes),
    MaterialModule,
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdListModule,
    MdSelectModule,
    MdTooltipModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule,
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
    DropdownModule
    ],
  declarations: [
    ProjectComponent,StagesComponent
  ],
  providers: [ApiService, CustomComponentsService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ProjectModule {}