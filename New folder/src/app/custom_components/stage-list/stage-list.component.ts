import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { StageDialog } from 'app/Dialogs/stage/stage.component';
import {ApiService} from 'app/services/api.service';

@Component({
  selector: 'stage-list',
  templateUrl: './stage-list.html',
})

export class StageModelListComponent {
  stageList:any;
  active_stageList:any;
  inactive_stageList:any;
  _value:string;
  @Input() 
    public set value(val: string) {
      this._value = val;
      this.getStages();
    }
  constructor(public dialog: MdDialog, private api_service: ApiService) {

    //  this.stageList = [
    //     {"NAME": "Stage 1", "LEVEL":"2", "STATUS":"Active"},
    //     {"NAME": "Stage 2", "LEVEL":"4", "STATUS":"Active"},
    //     {"NAME": "Stage 3", "LEVEL":"3", "STATUS":"Active"},
    //     {"NAME": "Stage 4", "LEVEL":"2", "STATUS":"Active"},
    //     {"NAME": "Stage 5", "LEVEL":"4", "STATUS":"Active"},
    //     {"NAME": "Stage 6", "LEVEL":"1", "STATUS":"Active"},
    //     {"NAME": "Stage 7", "LEVEL":"3", "STATUS":"Active"},
    //     {"NAME": "Stage 8", "LEVEL":"6", "STATUS":"Active"},
    //     {"NAME": "Stage 9", "LEVEL":"2", "STATUS":"Active"}
    // ]
    this.active_stageList=[];
    this.inactive_stageList=[];
  }
  ngOnInit() {
    this.getStages();
  }

  getStages(){
    this.api_service.getStages().subscribe(
      data => {
        this.stageList = data;
        for(var i=0;i<this.stageList.length;i++)
        {
          if(this.stageList[i].status=="active")
          this.active_stageList.push(this.stageList[i]);
          else
          this.inactive_stageList.push(this.stageList[i]);
        }
       
        
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  
  deleteStage(rowData,rowIndex){
    /*
    this.api_service.deleteStageById(rowData.STAGE_ID).subscribe(
      data => {
       this.getStages();
      },
      err => { console.log(err)});
    
    */
  }
  openStageEditPopup(site) {
    let dialogRef = this.dialog.open(StageDialog, {
      width: '70vw',
      data: {
        site: site
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getStages();
      }
    });
  }
}
