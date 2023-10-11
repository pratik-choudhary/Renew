import { Component, Inject, Output, EventEmitter, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { AuthGuard } from 'app/services/auth-guard';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-site-level-header-footer',
  templateUrl: './site-level-header-footer.component.html',
  styleUrls: ['./site-level-header-footer.component.scss'],
  providers: [ConfirmationService]
})
export class SiteLevelHeaderFooterComponent implements OnInit {
  models = [];
  departments = [];
  site_id:any;
  selectedModel:any;
  selectedDepartment:any;
  disable_header_button = true;  
  disable_firstpage_button = true;
  disable_footer_button = true;

//imic button

  disable_header_button_imic = true;  
  disable_firstpage_button_imic = true;
  disable_footer_button_imic = true;



  disable_cranepad_button = true;
  disable_guideline_button = true;
  Notification: string;
  display: boolean;
  header_file: Array<File>;
  firstpage_file: Array<File>;
  footer_file: Array<File>;

//imic files
  header_file_imic: Array<File>;
  firstpage_file_imic: Array<File>;
  footer_file_imic: Array<File>;




  cranepad: Array<File>;
  guideline: Array<File>;
  show_cranepad_form=false;
  show_upload_form: boolean = false;
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<SiteLevelHeaderFooterComponent>, private auth_service: AuthGuard, private api_service: ApiService
  , private router: Router,private confirmationService: ConfirmationService,) { 
    console.log(this.data);
    this.site_id = this.data.site;
  }

  ngOnInit() {
    this.getModelsBySiteId();    
    this.getAllDepartments();
  }

  showForms()
  {
    if(this.selectedDepartment != null && this.selectedDepartment != undefined && this.selectedModel!=null && this.selectedModel!=undefined)
    {
      this.show_upload_form = true;
    }
    else
    {
      this.show_upload_form = false;
    }
  }


  showCranePadorGuideLine()
  {
    if(this.selectedDepartment != null && this.selectedDepartment != undefined && this.selectedModel!=null && this.selectedModel!=undefined)
    {
      this.show_upload_form = true;
    }
    if(this.selectedDepartment == 5)
    {
      this.show_cranepad_form = true;
    }
    else
    {
      this.show_cranepad_form = false;
    }
  }

  getAllDepartments()
  {
    this.api_service.getAllDepartments().subscribe(data=>{
      data = data.filter(x=>x.id == 3 || x.id == 4||x.id == 5);
      for(var item of data)
      {
        var obj: { [k: string]: any } = {};
        obj.label = item.name;
        obj.value = item.id;
        this.departments.push(obj);
      }
    },err=>{this.api_service.checkStatus(err);})
  }
  getModelsBySiteId()
  {
    this.api_service.getModelsBySiteId(this.site_id).subscribe(data=>{
      for(var item of data)
      {
        var obj: { [k: string]: any } = {};
        obj.label = item.name;
        obj.value = item.id;
        this.models.push(obj);
      }      
    },err=>{
      this.api_service.checkStatus(err);
    });
  }


  
  closeDialog()
  {
    this.dialogRef.close();
  }


  changeHeaderFile(fileInput: any) {
    this.header_file = <Array<File>>fileInput.target.files;
    this.disable_header_button = false;
  }

  changeFirstPageFile(fileInput: any) {
    this.firstpage_file = <Array<File>>fileInput.target.files;
    this.disable_firstpage_button = false;
    let reader = new FileReader();
     if (fileInput.target.files && fileInput.target.files.length > 0) {
       let file = fileInput.target.files[0];

       const img = new Image();
       img.src = window.URL.createObjectURL( file );

       reader.readAsDataURL(file);
       reader.onload = () => {
        console.log(img.naturalHeight);
        console.log(img.naturalWidth);
        var ratio = img.naturalHeight/img.naturalWidth;
        console.log(ratio);
        if(ratio > 1)
        {
          this.confirmationService.confirm({
            message: 'The Width to Heigth ratio of this image is greater than  1 this would cause problems in the pdf are you sure you want to continue?',
            header: 'Warning',
            icon: 'fa fa-warning',
            accept: () => {
            },
            reject: () => {
            }
        });
        }
     };
    }
  }
    changeFooterFile(fileInput: any) {
      this.footer_file = <Array<File>>fileInput.target.files;
      this.disable_footer_button = false;
    }



    changeHeaderFileIMIC(fileInput: any) {
      this.header_file_imic = <Array<File>>fileInput.target.files;
      this.disable_header_button_imic = false;
    }
  
    changeFirstPageFileIMIC(fileInput: any) {
      this.firstpage_file_imic = <Array<File>>fileInput.target.files;
      this.disable_firstpage_button_imic = false;
      let reader = new FileReader();
       if (fileInput.target.files && fileInput.target.files.length > 0) {
         let file = fileInput.target.files[0];
  
         const img = new Image();
         img.src = window.URL.createObjectURL( file );
  
         reader.readAsDataURL(file);
         reader.onload = () => {
          console.log(img.naturalHeight);
          console.log(img.naturalWidth);
          var ratio = img.naturalHeight/img.naturalWidth;
          console.log(ratio);
          if(ratio > 1)
          {
            this.confirmationService.confirm({
              message: 'The Width to Heigth ratio of this image is greater than  1 this would cause problems in the pdf are you sure you want to continue?',
              header: 'Warning',
              icon: 'fa fa-warning',
              accept: () => {
              },
              reject: () => {
              }
          });
          }
       };
      }
    }
      changeFooterFileIMIC(fileInput: any) {
        this.footer_file_imic = <Array<File>>fileInput.target.files;
        this.disable_footer_button_imic = false;
      }









    changeCranePadFile(fileInput: any) {
      this.cranepad = <Array<File>>fileInput.target.files;
      this.disable_cranepad_button = false;
    }

    changeGuidelineFile(fileInput: any) {
      this.guideline = <Array<File>>fileInput.target.files;
      this.disable_guideline_button = false;
    }

    onNotification() {
      this.display = false;
    }

    uploadHeaderFile() {
      this.disable_header_button = true;
      console.log(this.selectedModel);
      this.api_service.uploadHeaderImageBySiteId(this.header_file,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_header_button = true;
        console.log(res)
        this.header_file = null;
        if (res == "1") {
          this.Notification = "Header Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          // this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }

    uploadFirstPageFile() {
      this.disable_firstpage_button = true;
      this.api_service.uploadFirstPageImageBySiteId(this.firstpage_file,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_firstpage_button = true;
        this.firstpage_file = null;
        if (res == 1) {
          this.Notification = "First Page Content Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          //this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }



    uploadFooterFile() {
      this.disable_footer_button = true;
      this.api_service.uploadFooterImageBySiteId(this.footer_file,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_footer_button = true;
        this.footer_file = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "Footer Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }











    uploadHeaderFileIMIC() {
      this.disable_header_button = true;
      console.log(this.selectedModel);
      this.api_service.uploadIMICHeaderImageBySiteId(this.header_file_imic,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_header_button = true;
        console.log(res)
        this.header_file = null;
        if (res == "1") {
          this.Notification = "Header Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          // this.display = true;
        }, 400);

      }, (err) => {
        console.log(err);
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }

    uploadFirstPageFileIMIC() {
      this.disable_firstpage_button = true;
      this.api_service.uploadIMICFirstPageImageBySiteId(this.firstpage_file_imic,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_firstpage_button = true;
        this.firstpage_file = null;
        if (res == 1) {
          this.Notification = "First Page Content Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          //this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }



    uploadFooterFileIMIC() {
      this.disable_footer_button = true;
      this.api_service.uploadIMICFooterImageBySiteId(this.footer_file_imic,this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_footer_button = true;
        this.footer_file = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "Footer Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }























































































































    uploadCranepadFile() {
      this.disable_cranepad_button = true;
      this.api_service.uploadCranepadImageBySiteId(this.cranepad, this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_cranepad_button = true;
        this.cranepad = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "CranePad Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }


    uploadGuideline() {
      this.disable_guideline_button = true;
      this.api_service.uploadGuidelineImageBySiteId(this.guideline, this.site_id,this.selectedModel,this.selectedDepartment).then((res: any) => {
        this.disable_guideline_button = true;
        this.guideline = null;
        console.log(res);
        if (res == 1) {
          this.Notification = "Guideline Image uploaded successfully";
          this.display = true;
        }
        setTimeout(() => {
          // this.Notification = res;
          this.display = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          this.dialogRef.close(false);
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'An error occurred ';
            this.display = true;
          }, 400);
        }

      });
    }



}
