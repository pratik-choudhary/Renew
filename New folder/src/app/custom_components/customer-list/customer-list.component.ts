import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { CustomerDialog } from 'app/Dialogs/customer/customer.component';
import {ApiService} from 'app/services/api.service';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.html',
})

export class CustomerModelListComponent {
  customerList:any;
  customerList_active:any;
  customerList_inactive:any;
  statusList:any;
  _value: string;
  @Input()
    public set value(val: string) {
      this._value = val;
      this.getCustomers();
    }
    value2:number=1;
    
  constructor(public dialog: MdDialog,  private api_service: ApiService) {
    this.customerList_active=[];
    this.customerList_inactive=[];
    this.statusList = [
      'Active', 'In Active'
    ];
  }
  ngOnInit() {
    this.getCustomers();
    
  }
  getCustomers() {
    this.api_service.getCustomers().subscribe(
      data => {
        data.reverse();
        this.customerList = data;
      },
      err => { console.log(err);
      this.api_service.checkStatus(err);
      });
  }

  deleteCustomer(row,index){
    this.api_service.deleteCustomerById(row.id).subscribe(
      data => {
        this.getCustomers();
      },
      err => { console.log(err);
        this.api_service.checkStatus(err);
      });

  }

  openDialog() {
    let dialogRef = this.dialog.open(CustomerDialog, {
      width: '70vw',
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getCustomers();
      }
    });
  }


  openCustomerEditPopup(customer) {
    let dialogRef = this.dialog.open(CustomerDialog, {
      width: '70vw',
      data: {
        customer: customer
      },
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getCustomers();
      }
    });
  }
  
}
