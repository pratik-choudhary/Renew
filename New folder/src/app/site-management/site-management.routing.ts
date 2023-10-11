import {Routes} from '@angular/router';
import { LocationComponent } from "app/master_menu/location/location.component";
import { ProjectsComponent } from "app/master_menu/project/project.component";
export const SiteManagementRoutes: Routes = [{
    path: '',
    children: [
    {
      path: 'location',
      component: LocationComponent
    },
    {
      path: 'project',
      component: ProjectsComponent
    }
   ]
  }];