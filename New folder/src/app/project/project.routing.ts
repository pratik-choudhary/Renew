import { Routes } from '@angular/router';

import { ProjectComponent } from './project.component';
import { StagesComponent } from './stages/stages.component';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectComponent
  },
  {
    path: ':name/:id/stages',
    component: StagesComponent
  }
];
