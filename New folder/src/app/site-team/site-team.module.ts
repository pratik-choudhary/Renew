import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
 MdAutocompleteModule
 } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule} from 'primeng/primeng';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import { SharedModule } from '../shared/shared.module';
import DynamicComponent from 'app/custom_components/dynamic-component';
import WorldHelloComponent from 'app/custom_components/world-hello-component';
import HelloWorldComponent from 'app/custom_components/hello-world-component';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import { SiteTeamRoutes } from 'app/site-team/site-team.routing';
import { SiteTeamComponent } from "app/site-team/site-team.component";
import { DialogModule} from  'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SiteTeamRoutes),
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
    DialogModule
    ],
  declarations: [
    SiteTeamComponent
  ],
  providers: [ApiService, CustomComponentsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class SiteTeamModule {}