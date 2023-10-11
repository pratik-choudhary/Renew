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
import { SharedModule } from '../shared/shared.module';
import { DocumentStructureComponent } from 'app/document_structure/document_structure.component';
import { DocumentStructureRoutes } from 'app/document_structure/document_structure.routing';
import { ConfirmDialogModule } from 'primeng/primeng';
import { DialogModule } from  'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DocumentStructureRoutes),
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
    
    ],
  declarations: [
    DocumentStructureComponent
  ],
  providers: [ApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class DocumentStructureModule { }