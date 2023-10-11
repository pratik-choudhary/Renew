import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'site',
  templateUrl: './site.html',
})

export class SiteDialog {
  public form: FormGroup;
  title:string;
  parentInput:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<SiteDialog>) {
    
    }

    onNotify(message:string) {
      if (message === 'success') {
        this.dialogRef.close(true);
      }else {
        this.dialogRef.close(false);
      }
    }

    closeDialog(){
      this.dialogRef.close(false);
    }
    getTitle(message:string){
      this.title = message;
    }

    ngOnInit() {
      if (this.data && this.data.site) {
         var obj: {[k: string]: any} = {};
         obj.COUNTRY = this.data.site.country;
         obj.SITE = this.data.site.site;
         obj.STATE = this.data.site.state;
         obj.STATUS = this.data.site.status;
         obj.id = this.data.site.id;
         obj.substationCtrl = this.data.site.substations;
         obj.AREA_DISTRICT = this.data.site.area.id;
        this.parentInput = obj;
      }
    }
}
