import {Routes} from '@angular/router';
import {CustomerComponent} from './customer/customer.component';
import {UserComponent} from './user/user.component';
import {StageComponent} from  './stage/stage.component';
import {AreaComponent} from './area/area.component';
import {CreateModelComponent} from './create_model/create_model.component';
import { SiteComponent } from "app/master_menu/site/site.component";
import { SubStationComponent } from "app/master_menu/sub_station/sub_station.component";
import { FeederComponent } from "app/master_menu/feeders/feeder.component";
import { ContractorComponent } from './contractor/contractor.component';
export const MasterMenuRoutes: Routes = [{
    path: '',
    children: [
      {
      path: 'substation',
      component: SubStationComponent
    },
    
    {
      path: 'feeder',
      component: FeederComponent
    },
    {
      path: 'customer',
      component: CustomerComponent
    },
    {
      path: 'site',
      component: SiteComponent
    },
    {
      path: 'user',
      component: UserComponent
    },
    {
      path: 'stage',
      component: StageComponent
    },
    {
      path: 'area',
      component: AreaComponent
    },
    {
      path: 'model',
      component: CreateModelComponent
    },
    {
      path:'contractor',
      component:ContractorComponent
    }
   ]
  }];