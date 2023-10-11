import { Routes } from '@angular/router';
import { CreateSiteComponent } from 'app/site-dashboard/site-dashboard.component';
import { AssignmentComponent } from 'app/site-dashboard/location-dashboard/assignment.component';
import { ChecklistAssignmentComponent } from 'app/site-dashboard/checklist-assignment/checklist-assignment.component';
import { Configuration_question} from 'app/site-dashboard/configuration_question/configuration_question';
export const CreateSiteRoutes: Routes = [
  {
    path: '',
    component: CreateSiteComponent
  },
  {
    path: 'location/:id',
    component: AssignmentComponent
  },
  {
    path: 'checklists/:id',
    component: ChecklistAssignmentComponent
  },
  {
    path:'configuration/:stage/:location',
    component:Configuration_question
  }
];
