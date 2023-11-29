import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistMilestoneRoutingModule } from './checklist-milestone-routing.module';
import { ChecklistMilestoneComponent } from './checklist-milestone/checklist-milestone.component';
import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
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
   } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {DataTableModule, CalendarModule, DropdownModule, AutoCompleteModule, InputTextModule} from 'primeng/primeng';
import { ApiService } from 'app/services/api.service';
import { CustomComponentsService } from 'app/services/custom_components.service';
import { SharedModule } from '../shared/shared.module';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import {ConfirmDialogModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';




@NgModule({
  imports: [
    CommonModule,
    ChecklistMilestoneRoutingModule,
    CommonModule,
   // RouterModule.forChild(AssetRoutingModule),
    MaterialModule,
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdListModule,
    MdSelectModule,
    MdTooltipModule,
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
    AutoCompleteModule,
    InputTextModule,
    ConfirmDialogModule,
    DialogModule,
    MdDatepickerModule,
    MdNativeDateModule,
  ],
  declarations: [ChecklistMilestoneComponent],
  providers: [ApiService, CustomComponentsService],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class ChecklistMilestoneModule { }
