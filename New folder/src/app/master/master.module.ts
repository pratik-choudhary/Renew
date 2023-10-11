import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdToolbarModule,
  MdTabsModule,
  MdListModule,
  MdSlideToggleModule,
  MdSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MasterRoutes } from './master.routing';
import { AreaComponent } from './area/area-model.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MasterRoutes),
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdTabsModule,
    MdListModule,
    MdSlideToggleModule,
    MdSelectModule,
    FlexLayoutModule,
    FormsModule,
    NgxDatatableModule
  ],
  declarations: [
    AreaComponent
  ]
})

export class MasterModule {}
