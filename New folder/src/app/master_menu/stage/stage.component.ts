import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StageDialog } from 'app/Dialogs/stage/stage.component';
import { FieldConfig } from 'app/models/field-config.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {
  // @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  public form: FormGroup;
   value2:number=1;
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
              private sanitizer: DomSanitizer
            ){
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
    let dialogRef = this.dialog.open(StageDialog, {
      width: '70vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.value2++;
      }
    });
  }

  ngOnInit() {
      
  }
  // end
}
