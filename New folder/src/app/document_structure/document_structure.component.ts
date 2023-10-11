import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, DOCUMENT } from '@angular/platform-browser';
import { CustomValidators } from 'ng2-validation';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import { TreeNode } from 'primeng/primeng';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';



@Component({
  selector: 'app-document_structure',
  templateUrl: './document_structure.html',
  styleUrls: ['./document_structure.scss'],
  providers: [ConfirmationService]
})

export class DocumentStructureComponent {
  upload_text_box: any;
  files = []
  currentUser: any;
  selectedFile: TreeNode;
  openItems = [];
  fileToUpload: Array<File>;
  fileDetails: any;
  disable_button = true;
  file_list: any;
  Notification: any;
  upload_path: any;
  display = false;
  selected_item: any;
  delete_permission = false;
  private items2: MenuItem[];
  items = [];
  download_path: any;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  deleteItem: any;
  display_path = [];
  node: any;
  navigation_path: any;
  file_count: any;
  typeFlag: any;
  openItemFlag = false;
  deleteFileFlag = false;
  constructor(public dialog: MdDialog, private confirmationService: ConfirmationService, private api_service: ApiService, public sanitizer: DomSanitizer, private auth_service: AuthGuard, private router: Router, private iconRegistry: MdIconRegistry) {
    this.currentUser = this.auth_service.getUserInfo();
    this.currentUser.role = this.currentUser.role.toString().toLowerCase();
    this.iconRegistry.addSvgIcon(
      'pdf',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/pdf_file.svg'));
      this.iconRegistry.addSvgIcon(
        'png',
        sanitizer.bypassSecurityTrustResourceUrl('assets/images/png_file.svg'));
      
      this.iconRegistry.addSvgIcon(
      'folder',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/folder_full.svg'));
    this.iconRegistry.addSvgIcon(
      'jpg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/jpg_file.svg'));
    this.iconRegistry.addSvgIcon(
      'xls',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/xls_file.svg'));
    this.iconRegistry.addSvgIcon(
      'doc',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/doc_file.svg'));
  }

  getDocuments() {
    this.api_service.getDocuments(this.currentUser.user_id).subscribe(
      data => {
        this.files = data;
        if(data.length == 0)
        {
          this.api_service.generateDocumentStructure().subscribe(data=>{},err=>{
            console.log(err);
            this.api_service.checkStatus(err);    
          });
        }
        //this.upload_path = data[0].path;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }

  onrightClick(event, item) {
    // this.contextmenuX = event.clientX
    // this.contextmenuY = event.clientY
    // this.contextmenu = true;
    // if (item.type == 'file') {
    //   this.deleteItem = item;
    // }

  }
  //disables the menu
  ngOnInit() {
    this.getDocuments();
  }
  openContextMenu($event) {

  }

  disableContextMenu() {
    this.contextmenu = false;
  }

  openFile(item) {
    var obj: { [k: string]: any } = {};
    obj.path = item.path;
    this.api_service.downloadDocument(obj).subscribe(
      data => {
        //this.download_path = data;

        var urlCreator = window.URL;
        if (urlCreator) {
          // var d = data.text(); 
          // var contentType = "text/pdf";
          //   var blob = new Blob([d], { type: contentType });
          var url = urlCreator.createObjectURL(data);
          var a = document.createElement("a");
          document.body.appendChild(a);
          //a.style = "display: none";
          a.href = url;
          var file_data = item.path.substring(item.path.lastIndexOf('\\') + 1, item.path.length);
          var tokens = file_data.split('$$');
          a.download = tokens[2] //you may assign this value from header as well 
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }
  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 1000000;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  refreshNode(node) {
    node.children = [];
    var obj: { [k: string]: any } = {};
    obj.path = this.selected_item.path;
    this.api_service.refreshPath(obj,this.currentUser.user_id).subscribe(
      data => {
        node.children = data[0].children;
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }
  nodeSelect(event) {
    if (event.node.type != 'file') {
      this.upload_path = event.node.path;
      this.selected_item = event.node;
      this.refreshPath();
      this.node = event.node;
      this.getDisplayPath(this.node);
    }
    this.refreshNode(this.node);
  }
  sort(arr) {
    var temp;
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < (arr.length - i - 1); j++) {
        if (arr[j].creation_time < arr[j + 1].creation_time) {
          temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  setNewFlag(max)
  {
    for(var i of this.openItems)
    {
      if(i.id == max)
      {
        i.new_flag = 1;
        break;
      }
    }
  }
  refreshPath() {
    this.openItems = [];
    var obj: { [k: string]: any } = {};
    obj.path = this.selected_item.path;
    this.api_service.refreshPath(obj,this.currentUser.user_id).subscribe(
      data => {
        this.openItems = data[0].children;
        this.openItemFlag = true;
        if (this.openItems.length > 0 && this.openItems[0].type != undefined) {
          this.typeFlag = this.openItems[0].type;
        }
        if (this.openItems.length > 0 && this.openItems[0].type == 'file') {
          this.openItems = this.sort(this.openItems);
          for (var i = 0; i < this.openItems.length; i++)
           {
            this.openItems[i].deleteflag = false;
            var match_items = this.openItems.filter(x=>x.label == this.openItems[i].label);
            var max=0;
            if(match_items.length > 1)
            {
              for(var j of match_items) 
              {
                if(max < j.id)
                {
                  max=j.id;
                }
              }
            }
            
            this.setNewFlag(max);
           }




        }
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });

  }

  navigate(item, index) {
    var obj: { [k: string]: any } = {};
    obj.path = "D:\\" + "Document_Directory";
    for (var i = 0; i <= index; i++) {
      obj.path = obj.path + "\\" + this.display_path[i].real_path;
    }
    this.api_service.refreshPath(obj,this.currentUser.user_id).subscribe(
      data => {
        this.openItems = data[0].children;
        this.openItems = data[0].children;
        this.openItemFlag = true;
        if (this.openItems.length > 0 && this.openItems[0].type != undefined) {
          this.typeFlag = this.openItems[0].type;
        }
        if (this.openItems.length > 0 && this.openItems[0].type == 'file') {
          this.openItems = this.sort(this.openItems);
          for (var i = 0; i < this.openItems.length; i++)
           {
            this.openItems[i].deleteflag = false;
            var match_items = this.openItems.filter(x=>x.label == this.openItems[i].label);
            var max=0;
            if(match_items.length > 1)
            {
              for(var j of match_items) 
              {
                if(max < j.id)
                {
                  max=j.id;
                }
              }
            }
            
            this.setNewFlag(max);
           }
        }
        this.getDisplayPath(obj);
      },
      err => {
        console.log(err);
        this.api_service.checkStatus(err);
      });
  }

  getDisplayPath(item) {
    this.navigation_path = item.path;
    var token = item.path.split("\\");
    this.display_path = [];
    for (var i = 2; i < token.length; i++) {

      if (token[i].indexOf('$$') > -1) {
        var obj: { [k: string]: any } = {};
        obj.display_path = token[i].substring(0, token[i].indexOf('$$'));
        obj.real_path = token[i];
        this.display_path.push(obj);
      }
      else {
        var obj: { [k: string]: any } = {};
        obj.display_path = token[i];
        obj.real_path = token[i];
        this.display_path.push(obj);
      }
    }

  }
  onItemSelect(item) {
    if (item.type == "folder") {
      this.upload_path = item.path;
      this.selected_item = item;
      this.refreshPath();
      this.getDisplayPath(item);
    }
  }

  validateFiles() {
    for (var i of this.fileToUpload) {
      var count = 0;
      var extension = i.name.substring(i.name.lastIndexOf('.') + 1, i.name.length);
      if (extension.replace(/\s/g, '').toString().toLowerCase() === 'pdf' || 
      extension.replace(/\s/g, '').toString().toLowerCase() === 'jpg' ||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'jpeg' ||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'doc' ||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'docx' ||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'xlsx' ||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'xls'||
      extension.replace(/\s/g, '').toString().toLowerCase() === 'png'
     ||
     extension.replace(/\s/g, '').toString().toLowerCase() === 'zip'
     ||
     extension.replace(/\s/g, '').toString().toLowerCase() === 'txt'
     ||
     extension.replace(/\s/g, '').toString().toLowerCase() === 'apk'
     ||
     extension.replace(/\s/g, '').toString().toLowerCase() === 'sql'
      )
       {
        count++;
      }
    }
    if (count > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  uploadFile() {
    if (this.validateFiles() == true) {
      this.api_service.uploadDocument(this.fileToUpload, this.upload_path, this.currentUser.user_id).then((res: string) => {
        this.disable_button = false;
        setTimeout(() => {
          this.Notification = res;
          this.display = true;
          this.refreshPath();
          this.file_count = undefined;
          this.disable_button = true;
        }, 400);

      }, (err) => {
        err = JSON.parse(err);
        var error = "Authorization has been denied for this request.";
        if (err.Message.replace(/\s/g, '') == error.replace(/\s/g, '')) {
          localStorage.clear();
          this.auth_service.setUserInfo(undefined);
          this.router.navigateByUrl('/session/signin?error=timeout', { queryParams: { error: "timeout" } });
        }
        else {
          setTimeout(() => {
            this.Notification = 'File upload Failed';
            this.display = true;
          }, 400);
        }

      });
    }
    else {
      this.Notification = 'Supported formats are .xlsx,.pdf,.docx,.jpg,.doc,.xls,.png,.jpeg';
      this.display = true;
    }

  }


  changeFile(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
    if (this.fileToUpload.length == 1) {
      this.file_count = this.fileToUpload.length + " file selected";
    }
    else {
      this.file_count = this.fileToUpload.length + " files selected";
    }

    if (this.fileToUpload.length == 0) {
      this.disable_button = true;
      this.file_count = undefined;
    }
    else {
      this.disable_button = false;
    }
  }


  onDelete($event) {
    this.refreshPath();
    this.contextmenu = false;
    this.refreshNode(this.node);
  }
  onNotification() {
    this.display = false;
    this.refreshPath();
    this.fileToUpload = [];
    this.deleteFileFlag = false;
  }
  nodeUnselect($event) {

  }
  setDeleteFlag(i){
    if(this.openItems[i].deleteflag == false)
    {
      this.openItems[i].deleteflag = true;
    }
    else
    {
      this.openItems[i].deleteflag = false;
    }

    if(this.openItems.filter(x => x.deleteflag == true).length > 0)
    {
        this.deleteFileFlag = true;
    }
    else
    {
      this.deleteFileFlag = false;
    }

  }


  deleteFiles()
  {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete these Files?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
          var delete_files = this.openItems.filter(x=>x.deleteflag == true);
          var obj: { [k: string]: any } = {};
          obj.delete_files = [];
          for(var i of delete_files)
          {
            var obj2: { [k: string]: any } = {};
            obj2.path = i.path;
            obj.delete_files.push(obj2); 
          }
          this.api_service.deleteDocument(obj).subscribe(
            data => {
              setTimeout(()=>{   
                this.Notification = "File deleted successfully";
                this.display = true;
              },400);
            }, err => {
              this.Notification = "File delete Failed";
              this.display = true;
              console.log(err);
              this.api_service.checkStatus(err);
            });
        }});
  }

}//end of class


