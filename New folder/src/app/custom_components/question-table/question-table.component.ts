import {Component, Inject, Output, Input, EventEmitter, OnInit} from '@angular/core';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ApiService } from "app/services/api.service";

@Component({
  selector: 'app-question-table',
  templateUrl: './question-table.html',
  styleUrls: ['./question-table.scss']
})

export class QuestionTableComponent implements OnInit {
  checklist_items: any;
  make:any;
  manufacturer:any;
  serial_no:any;
  set:any;
  @Input() department_id:any;
  @Input() is_wtg:any;
  @Input() milestoneId: any;
  @Output() onQuestionSelect: EventEmitter<string> = new EventEmitter<string>();
  filter_val: string = '';
   list = [];
  constructor(private api_service: ApiService) {
      
  }
  filterFunction(dt) {
    dt.filter('Not Ok','OPTIONS','equals');
  }

  sort(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
  ngOnInit() {
    if(this.is_wtg == true && this.department_id == 3)
    {
      this.make = "Make / Manufacturer";
      this.manufacturer = "Plant / Supplied by";
      this.serial_no = "Batch / Serial No.";
      this.set = "Test Certificate No.";
    }
    if(this.is_wtg == true && this.department_id == 4)
    {
      this.make = "Make / Manufacturer";
      this.manufacturer = "Plant / Supplied by";
      this.serial_no = "Serial No.";
      this.set = "Test Certificate No.";
    }
    if(this.is_wtg == true && this.department_id == 5)
    {
      this.make = "Make";
      this.manufacturer = "Manufacturer / Plant / Supplied by";
      this.serial_no = "Serial No.";
      this.set = "Additional details as applicable";
    }
    if(this.is_wtg)
    {
      console.log("inside question table component" + this.is_wtg);
      this.api_service.getWTGQuestionInstance(this.milestoneId).subscribe(
        data => {
          this.list = [];
          if (data != null) {
             for(var i in data){
              var obj: {[k: string]: any} = {};
               obj.QUESTION_ID = data[i].id;
               obj.ACTIVITY_ID = data[i].activity_ins_id;
               if(data[i].activity_ins_id != null){
                 obj.ACTIVITY_NAME = data[i].activity.name;
                 obj.HAS_CHILD = data[i].activity.has_child;
               }
               obj.SPECIFICATION = data[i].question.SPECIFICATION;
               obj.QUESTION = data[i].question.QUESTION;
               obj.QUESTION_NO = data[i].question.QUESTION_NO;
               if(data[i].isNcd == true)
               {
                 obj.OPTIONS = "Ok with RFD";
                 if(data[i].ncd_doc)
                 {
                   obj.ncd_docs = data[i].ncd_doc;
                 }                        
               }
               else
               if(data[i].options){
                  if(data[i].options.toLowerCase() == 'true' && data[i].isNcd == false)
                  {
                      obj.OPTIONS = "Ok";
                  }else{
                      obj.OPTIONS = "Not Ok";
                  }
               }
               obj.MAKE = data[i].make;
               obj.MANUFACTURER = data[i].manufacturer;
               obj.SERIAL_NO = data[i].serial_no;
               obj.SET = data[i].set;
               //obj.ACTUAL = data[i].actual;
               //obj.REMARK = data[i].remark;
               obj.status = data[i].status;
               if(data[i].last_updated){
                  obj.last_updated_by = data[i].last_updated.name;
               }               
               this.list.push(obj);
          }
          }
          this.checklist_items = this.list;
          this.checklist_items = this.sort(this.checklist_items,"QUESTION_NO");      
          //this.checklist_items = this.checklist_items.shift();
          console.log(this.checklist_items);
          
          for(var j=0;j<this.checklist_items.length;j++)
          {
            if(this.checklist_items[j].QUESTION_ID == 0)
            {
              this.checklist_items.splice(j,1);  
            }
            if(this.checklist_items[j].ACTIVITY_NAME== "Tower sections Details")
            {
              this.checklist_items[j].ACTIVITY_ID = 274;
            }
            if(this.checklist_items[j].ACTIVITY_NAME == "Adapter plate details")
            {
              this.checklist_items[j].ACTIVITY_ID = 275;
            }
            if(this.checklist_items[j].ACTIVITY_NAME == "Blades")
            {
              this.checklist_items[j].ACTIVITY_ID = 276;
            }
          }
        
          
        },
        err => {
          this.checklist_items = [];
          console.log(err);
          this.api_service.checkStatus(err);
         } );
    }
    else
    {
      this.api_service.getQuestionInstance(this.milestoneId).subscribe(
        data => {
          this.list = [];
          if (data != null) {
             for(var i in data){
              var obj: {[k: string]: any} = {};
               obj.QUESTION_ID = data[i].id;
               obj.ACTIVITY_ID = data[i].activity_ins_id;
               if(data[i].activity_ins_id != null){
                 obj.ACTIVITY_NAME = data[i].activity.name;
                 obj.HAS_CHILD = data[i].activity.has_child;
               }
               obj.SPECIFICATION = data[i].question.SPECIFICATION;
               obj.QUESTION = data[i].question.QUESTION;
               obj.QUESTION_NO = data[i].question.QUESTION_NO;
               if(data[i].isNcd == true)
               {
                 obj.OPTIONS = "Ok with RFD";
                 if(data[i].ncd_doc)
                 {
                   obj.ncd_docs = data[i].ncd_doc;
                 }                        
               }
               else
               if(data[i].options){
                  if(data[i].options.toLowerCase() == 'true' && data[i].isNcd == false)
                  {
                      obj.OPTIONS = "Ok";
                  }else{
                      obj.OPTIONS = "Not Ok";
                  }
               }
               
               obj.ACTUAL = data[i].actual;
               obj.REMARK = data[i].remark;
               obj.status = data[i].status;
               if(data[i].last_updated){
                  obj.last_updated_by = data[i].last_updated.name;
               }
               this.list.push(obj);
          }
          }
          this.checklist_items = this.list;
          console.log(this.checklist_items);
        },
        err => {
          this.checklist_items = [];
          console.log(err);
          this.api_service.checkStatus(err);
         } );
    }
     
  }
  selectQuestion(row) {
    if(this.is_wtg == false)
    {
      this.onQuestionSelect.emit(row);
    }    
  }

  openRFD(row)
  {
    for(var i=0; i < row.ncd_docs.length;i++)
    {
      var vin = window.open(row.ncd_docs[i],"_blank");
      vin.focus();
    }
  }
}
