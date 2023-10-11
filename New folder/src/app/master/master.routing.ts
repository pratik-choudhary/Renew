import { Routes } from '@angular/router';

import { AreaComponent } from './area/area-model.component';
export const MasterRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'area',
      component: AreaComponent
    }]
  }
];
