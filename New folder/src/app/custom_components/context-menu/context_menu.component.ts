import { Component, Inject, Input,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomValidators } from 'ng2-validation';
import { MdMenu, MdMenuItem } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contextmenu',
  templateUrl: './context_menu.component.html',
  styleUrls: ['./context_menu.scss'],
  providers: [ConfirmationService]
})
export class ContextmenuComponent {
  currentUser: any;
  display = false;
  Notification:any;
  
  constructor(private confirmationService: ConfirmationService, private api_service: ApiService, public sanitizer: DomSanitizer, private auth_service: AuthGuard, private router: Router) {
    this.currentUser = this.auth_service.getUserInfo();

  }
  @Input() x = 0;
  @Input() y = 0;
  @Input() deleteItem;
  @Output() refresh: EventEmitter<string> = new EventEmitter<string>();


  deleteFile() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this File?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        var obj: { [k: string]: any } = {};
        obj.path = this.deleteItem.path;
        this.api_service.deleteDocument(obj).subscribe(
          data => {
            setTimeout(()=>{   
              this.Notification = "File deleted successfully";
              this.display = true;

            },400);
          }, err => {
            console.log(err);
            this.api_service.checkStatus(err);
          }

        );
      }
    });

  }

onNotification()
{
  if(this.Notification == "File deleted successfully")
  {
    this.display = false;
    this.refresh.emit('refresh');
  }
}

}