import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomerDialog } from 'app/Dialogs/customer/customer.component';
import { FieldConfig } from 'app/models/field-config.interface';
import { Router } from '@angular/router';
import { AddProjectDialog } from "app/Dialogs/Project/project-dialog.component";
import {ApiService} from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-projects',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectsComponent implements OnInit {
  value2:number=1;
  sites: any;
  selectedSite: any;
  selected_site: any;
  user_info: any;
  constructor(public dialog: MdDialog,
              @Inject(DOCUMENT) private document: Document,
              private router: Router,
              private fb: FormBuilder,
              private iconRegistry: MdIconRegistry,
              private sanitizer: DomSanitizer,
              private api_service: ApiService,
              private auth_service: AuthGuard
            ) {
             // this.getSites()
             //role management      
             this.user_info = this.auth_service.getUserInfo();
             if (this.user_info) {
               if (this.user_info.role.toUpperCase() !== 'ADMIN'
                 && this.user_info.role.toUpperCase() !== 'PM'
                 && this.user_info.role.toUpperCase() !== 'QA'
                 && this.user_info.role.toUpperCase() !== 'SITE_MIS'
                ) {
                 this.router.navigate(['/site-dashboard']);
               }
             }
  }
  ngOnInit() {
  }
  addProjectDialog(){
    let dialogRef = this.dialog.open(AddProjectDialog, {
      width: '70vw',
      data: {
        siteId: this.selectedSite
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.value2++;
      }
    });
  }
  
}
