import { MasterMenuRoutes } from './master_menu.routing';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { DialogModule} from  'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
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
  import { DataTableModule, CalendarModule, AutoCompleteModule } from 'primeng/primeng';
  import { ApiService } from 'app/services/api.service';
  import { CustomComponentsService } from 'app/services/custom_components.service';
  import {InlineEditorModule} from '@qontu/ngx-inline-editor';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { CustomerComponent } from './customer/customer.component';
  import {UserComponent} from './user/user.component';
  import {StageComponent} from './stage/stage.component';
  import {AreaComponent} from './area/area.component';
  import { NgxChartsModule } from '@swimlane/ngx-charts';
  import { CreateModelComponent } from "app/master_menu/create_model/create_model.component";
  import { SiteComponent } from "app/master_menu/site/site.component";
  import { SubStationComponent } from "app/master_menu/sub_station/sub_station.component";
  import { FeederComponent } from "app/master_menu/feeders/feeder.component";
  import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
  import { DropdownModule, InputTextModule, RadioButtonModule} from 'primeng/primeng';
  import { ContractorComponent } from './contractor/contractor.component';
  

  // import { AutoCompleteModule } from 'primeng/autocomplete';




  @NgModule({
    imports: [
    MdAutocompleteModule,
   // BrowserModule,
   // BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(MasterMenuRoutes),
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
    InlineEditorModule,
    DataTableModule,
    CalendarModule,
    MaterialModule,
    FlexLayoutModule,
    AutoCompleteModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule
    ],
    declarations: [
      CustomerComponent,
      UserComponent,
      StageComponent,
      AreaComponent,
      CreateModelComponent,
      SiteComponent,
      SubStationComponent,
      FeederComponent,
      ContractorComponent
    ],
    providers: [ApiService, CustomComponentsService],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
export class MasterMenuModule{}