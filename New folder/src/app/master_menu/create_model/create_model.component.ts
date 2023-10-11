import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModelDialog } from 'app/Dialogs/model/model.component';
import { FieldConfig } from 'app/models/field-config.interface';
import { Router } from '@angular/router';
import { AuthGuard } from 'app/services/auth-guard';

@Component({
  selector: 'app-create-model',
  templateUrl: './create_model.component.html',
  styleUrls: ['./create_model.component.scss']
})
export class CreateModelComponent implements OnInit {
  // @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  public form: FormGroup;
  user_info:any;
  value1 = 1;
  // Declare a mapping between action ids and their event listener
  myActions = {
    'alert': (property) => { alert(JSON.stringify(property.value)) },
    'reset': (property) => { property.reset(); }
  };
  config: FieldConfig[] = [
  ];

  constructor(public dialog: MdDialog,
              @Inject(DOCUMENT) private document: Document,
              private router: Router,
              private fb: FormBuilder,
              private iconRegistry: MdIconRegistry,
              private sanitizer: DomSanitizer,
              private auth_service: AuthGuard
            ){
        this.user_info = this.auth_service.getUserInfo();
          if (this.user_info) {
            if (this.user_info.role.toUpperCase() !== 'ADMIN' && this.user_info.role.toUpperCase() !== 'SITE_MIS'  && this.user_info.role.toUpperCase() !== 'PM' && this.user_info.role.toUpperCase() !== 'QA') {
              this.router.navigate(['/site-dashboard']);
            }
          }    
        this.iconRegistry.addSvgIcon(
        'plus-circle',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/plus-circle.svg'));
        this.iconRegistry.addSvgIcon(
        'pencil',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/pencil.svg'));
  }
  private onDrop(args) {
    let [e, el] = args;
    // do something
  }
  openDialog() {
    let dialogRef = this.dialog.open(ModelDialog, {
      width: '70vw',
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.value1++;
      }
    });
  }

  ngOnInit() {
      
  }
  
  // end
}
