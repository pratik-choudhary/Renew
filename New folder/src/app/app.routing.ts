import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from "app/services/auth-guard";
import { DocumentStructureComponent } from 'app/document_structure/document_structure.component';
import { ReportComponent } from  'app/reports/reports.component';
export const AppRoutes: Routes = [{
  path: '',
  component: AdminLayoutComponent, canActivate: [AuthGuard],
  children: [{
    path: '',
    loadChildren: './site-dashboard/site-dashboard.module#CreateSiteModule'
  }, {
    path: 'material',
    loadChildren: './material/material.module#MaterialComponentsModule'
  },{
    path: 'checklist',
    loadChildren: './checklist/checklist.module#ChecklistModule'
  },
  {
    path: 'asset',
    loadChildren: './asset/asset.module#AssetModule'
  },
  {
    path: 'pmschedule',
    loadChildren: './pm-schedule/pm-schedule.module#PmScheduleModule'
  },
  {
    path: 'checklist-Milestone',
    loadChildren: './checklist-milestone/checklist-milestone.module#ChecklistMilestoneModule'
  },
  {
    path: 'approval',
    loadChildren: './approval/approval.module#ApprovalModule'
  },
  {
    path: 'master',
    loadChildren: './master_menu/master_menu.module#MasterMenuModule'
  },
  {
    path: 'site-management',
    loadChildren: './site-management/site-management.module#SiteManagementModule'
  }, {
    path: 'project',
    loadChildren: './project/project.module#ProjectModule'
  },{
    path: 'site-dashboard',
    loadChildren: './site-dashboard/site-dashboard.module#CreateSiteModule'
  },
  {
    path: 'site-team',
    loadChildren: './site-team/site-team.module#SiteTeamModule'
  },
  {
    path: 'location-plan',
    loadChildren: './location-plan/location-plan.module#LocationPlanModule'
  },
  {
    path:'document',
    component:DocumentStructureComponent
  },
  {
    path:'reports',
    component:ReportComponent
  }
   ]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'session',
    loadChildren: './session/session.module#SessionModule'
  }]
},

//  {
//   path: '**',
//   redirectTo: 'session/404'
// }
];
