import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PmScheduleComponent } from './pm-schedule/pm-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: PmScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmScheduleRoutingModule { }
