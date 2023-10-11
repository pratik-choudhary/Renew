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
 MdAutocompleteModule,
 MaterialModule
 } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule} from 'primeng/primeng';
import { ApiService } from 'app/services/api.service';
import { SharedModule } from '../shared/shared.module';
import { ReportComponent } from 'app/reports/reports.component';
import { ReportRoutes } from 'app/reports/reports.routing';
import { ConfirmDialogModule } from 'primeng/primeng';
import { DialogModule } from  'primeng/primeng';
import { TreeModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportRoutes),
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
    DataTableModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    ConfirmDialogModule,
    DialogModule,
    TreeModule,
    MaterialModule
    ],
  declarations: [
    ReportComponent
  ],
  providers: [ApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class ReportModule { }