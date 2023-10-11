import {Component,Inject} from '@angular/core';
import {MdDialog, MdDialogRef,MD_DIALOG_DATA } from '@angular/material';
import { FormBuilder,FormArray,FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import  { ApiService } from 'app/services/api.service';

@Component({
  selector: 'item_form',
  templateUrl: './item_form.component.html',
})

export class ItemFormDialog {
	public form: FormGroup;
  section_id:number;
  constructor(public dialogRef: MdDialogRef<ItemFormDialog>,private api_service:ApiService,private fb:FormBuilder,@Inject(MD_DIALOG_DATA) public data: any) {
    this.section_id=data.section_id;
  }
   ngOnInit() {

  		this.form = this.fb.group({ 
        OPTIONS:this.fb.array([
                  this.initLink()
              ])
  		});
    }
    initLink() {
        return this.fb.group({
            OPTION_DESCRIPTION: [null,Validators.required]
        });
    }
    addLink() {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.push(this.initLink());
    }
    removeLink(i: number) {
        const control = < FormArray > this.form.controls['OPTIONS'];
        control.removeAt(i);
    }
    emptyOption(){
         const control = < FormArray > this.form.controls['OPTIONS'];
         for(let j in control['_value']){
           control.removeAt(Number(j));
         }
    }
    // ChangeOption(){
    //   if(this.form['_value'].ITEM_TYPE=='radio button' || this.form['_value'].ITEM_TYPE=='select' || this.form['_value'].ITEM_TYPE=='checkbox'){
    //       this.addLink();
    //   }else{
    //     this.emptyOption();
    //   }
    // }
    submitItem(){
       var obj: {[k: string]: any} = {};
      // obj.ITEM_DESCRIPTION=this.form['_value'].ITEM_DESCRIPTION;
      // if(this.form['_value'].ITEM_TYPE!=undefined && this.form['_value'].ITEM_TYPE!=null){
      //    obj.ITEM_TYPE=this.form['_value'].ITEM_TYPE;
      // }else{
      //    obj.ITEM_TYPE="text";
      // }
      obj.OPTIONS=this.form['_value'].OPTIONS;
      // obj.SECTION_ID=this.section_id;
      // this.api_service.createItem(obj).subscribe(
      //   data=>{
           this.dialogRef.close(obj);
      //   },
      //   err=>{console.log(err);this.dialogRef.close(false);
      // });
    }
}