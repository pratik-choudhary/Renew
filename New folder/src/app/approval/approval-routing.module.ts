import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QAApprovalComponent } from './qa-approval/qa-approval.component';

const routes: Routes = [
  {
    path: '',
    component: QAApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
