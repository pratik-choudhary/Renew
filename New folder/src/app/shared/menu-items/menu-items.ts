import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type: string;
  role: string;
  icon: string;
  url: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  role?: string;
  url?: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}
const MENUITEMS = [
     {
      state: 'master',
      name: 'Configuration',
      type: 'sub',
      icon: 'settings',
      role: 'ADMIN,HOD,PM,SITE_MIS,QA',
      children: [
      //   {
      //     state: 'contractor',
      //     name: 'Contractor',
      //     type: 'link',
      //     icon: 'transfer_within_a_station',
      //     url: 'master',
      //     role: 'ADMIN'
      // },
      //   {
      //     state: 'customer',
      //     name: 'Customer',
      //     type: 'link',
      //     icon: 'person_outline',
      //     url: 'master',
      //     role: 'ADMIN'
      // },
      // {
      //     state: 'area',
      //     name: 'Area',
      //     type: 'link',
      //     icon: 'place',
      //     url: 'master',
      //     role: 'ADMIN,PM,SITE_MIS'
      // },
      //  {
      //   state: 'model',
      //   name: 'Model',
      //   type: 'link',
      //   icon: 'library_add',
      //   url: 'master',
      //   role: 'ADMIN,PM,SITE_MIS,QA'
      // },
      {
        state: 'checklist',
        name: 'Checklist',
        type: 'link',
        icon: 'assignment',
        url: null,
        role: 'ADMIN,PM,SITE_MIS,QA'
      },
      // {
      //   state: 'substation',
      //   name: 'Substation',
      //   type: 'link',
      //   icon: 'equalizer',
      //   url: 'master',
      //   role: 'ADMIN,PM,SITE_MIS'
      // },
      // {
      //   state: 'feeder',
      //   name: 'Feeder',
      //   type: 'link',
      //   icon: 'store_mall_directory',
      //   url: 'master',
      //   role: 'ADMIN,PM,SITE_MIS'
      // },
      // {
      //   state: 'site',
      //   name: 'Site',
      //   type: 'link',
      //   icon: 'my_location',
      //   url: 'master',
      //   role: 'ADMIN,PM,SITE_MIS'
      // },
      {
        state: 'user',
        name: 'User Management',
        type: 'link',
        icon: 'person',
        url: 'master',
        role: 'ADMIN,PM,SITE_MIS,HOD,QA'
      },
      {
        state: 'asset',
        name: 'Asset',
        type: 'link',
        icon: 'currency_exchange',
        url: null,
        role: 'ADMIN,PM,SITE_MIS,HOD,QA'
      },
      {
        state: 'pmschedule',
        name: 'PM Schedule',
        type: 'link',
        icon: 'access_time',
        url: null,
        role: 'ADMIN,PM,SITE_MIS,HOD,QA'
      }
      ]
     },
    {
      state: 'site-management',
      name: 'Execution',
      type: 'sub',
      icon: 'directions_run',
      role: 'ADMIN,HOD,PM,SITE_MIS,QA',
      children: [
        {
          state: 'checklist-Milestone',
          name: 'Checklist',
          type: 'link',
          icon: 'assignment',
          url: null,
          role: 'ADMIN,PM,SITE_MIS,QA'
          
        },
        {
          state: 'approval',
          name: 'Approval',
          type: 'link',
          icon: 'task',
          url: null,
          role: 'ADMIN,PM,SITE_MIS,QA'
          
        },
      // {
      //   state: 'location',
      //   name: 'Location',
      //   type: 'link',
      //   icon: 'location_on',
      //   url: 'site-management',
      //   role: 'ADMIN,PM,SITE_MIS'
      // },
      // {
      //   state: 'location-plan',
      //   name: 'Location Planning',
      //   type: 'link',
      //   icon: 'access_time',
      //   url: null,
      //   role: 'ADMIN,PM,SITE_MIS,HOD'
      // },
      // {
      //   state: 'site-team',
      //   name: 'Site Team',
      //   type: 'link',
      //   icon: 'supervisor_account',
      //   url: null,
      //   role: 'ADMIN,PM,SITE_MIS'
      // },
       ]
     }
];



@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  // add(menu: Menu) {
  //   MENUITEMS.push(menu);
  // }
}
