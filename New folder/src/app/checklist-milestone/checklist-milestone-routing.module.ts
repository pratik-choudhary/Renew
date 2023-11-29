import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChecklistMilestoneComponent } from './checklist-milestone/checklist-milestone.component';


const routes: Routes = [
  {
    path: '',
    component: ChecklistMilestoneComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistMilestoneRoutingModule { }
