import {Component, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent  {

  public form: FormGroup;
  title:string;
  parentInput:any;
  imageUrl:any;
  constructor(
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<ImageDialogComponent>) {
    
    }

    onNotify(message:string) {
      setTimeout(() => {
         this.dialogRef.close(message);
    }, 500);
      
    }
    getTitle(message:string)
    {
      this.title="Attachment";
    }

    closeDialog(){
      this.dialogRef.close(true);
    }
    ngOnInit() {
      if (this.data && this.data.imageUrl){
        debugger;
       this.imageUrl=this.data.imageUrl;
      }
    }
   
}
