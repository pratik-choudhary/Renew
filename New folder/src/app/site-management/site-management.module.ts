import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  MdToolbarModule,
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdListModule, MdGridListModule,
  MdMenuModule,
  MdSidenavModule,
  MdProgressBarModule,
  MdTabsModule,
  MdDialogModule,
  MaterialModule,
  MdSelectModule,
  MdChipsModule,
  MdCheckboxModule,
  MdOptionModule,
  MdTooltipModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdAutocompleteModule
 } from '@angular/material';
  import { FlexLayoutModule } from '@angular/flex-layout';
  import { SharedModule } from '../shared/shared.module';
  import { NgxDatatableModule } from '@swimlane/ngx-datatable';
  import { DataTableModule } from 'primeng/primeng';
  import { CalendarModule } from 'primeng/primeng';
  import { DropdownModule } from 'primeng/primeng';
  import { ApiService } from 'app/services/api.service';
  import { CustomComponentsService } from 'app/services/custom_components.service';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { NgxChartsModule } from '@swimlane/ngx-charts';
  import { ProjectsComponent } from "app/master_menu/project/project.component";
  
  import { LocationComponent } from "app/master_menu/location/location.component";
  import { SiteManagementRoutes } from "app/site-management/site-management.routing";


  @NgModule({
    imports: [
    MdAutocompleteModule,
   // BrowserModule,
   // BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(SiteManagementRoutes),
    MdToolbarModule,
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdListModule,
    MdGridListModule,
    MdMenuModule,
    MdSidenavModule,
    MdProgressBarModule,
    MdTabsModule,
    MdDialogModule,
    FlexLayoutModule,
    MdSelectModule,
    MdTooltipModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MdChipsModule,
    MdCheckboxModule,
    MdOptionModule,
    NgxDatatableModule,
    DataTableModule,
    CalendarModule,
    DropdownModule,
    MaterialModule,
    FlexLayoutModule,
    ],
    declarations: [
      
      LocationComponent,
       ProjectsComponent
    ],
    providers: [ApiService, CustomComponentsService],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
export class SiteManagementModule { }