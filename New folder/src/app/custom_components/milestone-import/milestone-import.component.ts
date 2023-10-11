import { Component, Inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'app/services/api.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { ViewContainerRef } from '@angular/core';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'milestone-import',
    templateUrl: './milestone-import.html',
    providers: [ConfirmationService]
})

export class MilestoneImport implements OnInit {
    public form: FormGroup;
    display = false;
    Notification: any;
    config: MdSnackBarConfig;
    @Input() selectedChecklist_id: number;
    departmentFlag = false;
    milestones = [];
    checklists: any = [];
    departments: any = [];
    department_id: any;
    checklist_id: any;
    milestone_id: any;
    selectedDepartment: any;
    selectedChecklist: any;
    selectedMilestone: any;
    currentChecklistDepartment: any;
    currentChecklistId: any;
    checklistFlag = false;
    milestoneFlag = false;
    currentChecklistMilestones: any;
    @Output() notify: EventEmitter<string> = new EventEmitter<string>();
    constructor(private fb: FormBuilder, private api_service: ApiService, private snackbar: MdSnackBar,
        public viewContainerRef: ViewContainerRef, private confirmationService: ConfirmationService) {
        this.api_service.getAllChecklist().subscribe(
            data => {
                this.checklists = data;
            },
            err => { console.log(err);
            this.api_service.checkStatus(err);
            });

    }

    closeDialog() {
        this.notify.emit('failed');
    }
    onNotification() {
        if (this.checklistFlag == true) {
            this.onNotifyChecklist('success');
            this.display=false;
        }
        else {
            this.display = false;
            if (this.Notification == 'Milestone Imported Successfully') {
                this.notify.emit('success');
            }
            if (this.Notification == 'Milestone Import Failed') {
                this.notify.emit('failed');
            }
        }

    }
    submitMilestoneImport() {
        var obj: { [k: string]: any } = {};
        obj.current_checklist_id = this.selectedChecklist_id;
        obj.milestone_id = this.form.value.MILESTONE;
        this.api_service.createMilestoneImport(obj).subscribe(
            data => {
                setTimeout(()=>{
                this.Notification = 'Milestone Imported Successfully';
                this.display = true;
            }, 400);
            }, err => {
                console.log(err);
                if(err.status == 401)
                {
                  this.closeDialog();
                  setTimeout(()=>{
                  this.api_service.checkStatus(err);
                  }, 1000);
                }
                else
                {
                    setTimeout(()=>{
                        this.Notification = 'Milestone Import Failed';
                        this.display = true;
                    }, 400);
                }
                
            }
        );
    }

    getMilestonesOfCurrentChecklist() {
        this.api_service.getSectionByChecklistId(this.selectedChecklist_id).subscribe(
            data => {
                this.currentChecklistMilestones = data;
            },
            err => { console.log(err);
            this.api_service.checkStatus(err);
            });

    }
    selectedMilestoneValueObj(obj: any) {
        var selectedMilestoneObj: any;

        for (var i of this.milestones) {
            if (i.SECTION_ID == this.selectedMilestone) {
                selectedMilestoneObj = i;
            }
        }
        for (var i of this.currentChecklistMilestones) {
            if (i.NAME == selectedMilestoneObj.NAME) {
                this.milestoneFlag = true;
                this.confirmationService.confirm({
                    message: 'Milestone already exists are you sure you want to continue?',
                    header: 'Warning',
                    icon: 'fa fa-warning',
                    accept: () => {
                        this.onNotifyMilestone('success');
                    },
                    reject: () => {
                        this.onNotifyMilestone('failed');
                    }
                });
                break;
            }
        }
    }


    selectedChecklistValueObj() {
        //getSectionByChecklistId(id: number)
        if (this.selectedChecklist_id == this.selectedChecklist) {
            this.checklistFlag = true;
            this.Notification = "The checklist you have selected is the  current checklist";
            this.display = true;
        }
        this.api_service.getSectionByChecklistId(this.form.value.CHECKLIST).subscribe(
            data => {
                this.milestones = data;
            },
            err => { console.log(err);
            this.api_service.checkStatus(err);
            });
        this.getMilestonesOfCurrentChecklist();
    }

    selectedDepartmentValueObj(id: any) {
        

        for (var i of this.checklists) {
            if (i.CHECKLIST.CHECKLIST_ID == this.selectedChecklist_id) {
                if (i.CHECKLIST.DEPARTMENT_ID != this.selectedDepartment) {
                    this.departmentFlag = true;
                    this.confirmationService.confirm({
                        message: 'The department you have selected does not match current checklist Department Are you sure you want to continue?',
                        header: 'Warning',
                        icon: 'fa fa-warning',
                        accept: () => {
                            this.onNotifyDepartment('success');
                        },
                        reject: () => {
                            this.onNotifyDepartment('failed');
                        }
                    });
                    break;
                }
            }
        }

    }
    onNotifyDepartment(msg: any) {

        if (msg == "success") {
            this.departmentFlag = false;
        }
        if (msg == "failed") {
            this.departmentFlag = false;
            for (var i of this.checklists) {
                if (i.CHECKLIST.CHECKLIST_ID == this.selectedChecklist_id) {
                    this.selectedDepartment = i.CHECKLIST.DEPARTMENT_ID;

                }
            }

        }

    }
    onNotifyChecklist(msg: any) {
        if (msg == "success") {
            this.selectedChecklist = 0;
            this.form.controls.CHECKLIST.reset;
            this.milestones = [];
            this.checklistFlag = false;
        }
        if (msg == "failed") {
            this.selectedChecklist = 0;
            this.form.controls.CHECKLIST.reset;
            this.milestones = [];
            this.checklistFlag = false;
        }

    }
    onNotifyMilestone(msg: any) {
        if (msg == "success") {
            this.milestoneFlag = false;
        }
        if (msg == "failed") {
            this.selectedMilestone = 0;
            this.form.controls.MILESTONE.reset;
            this.milestoneFlag = false;
        }

    }
    ngOnInit() {
        this.api_service.getAllDepartments().subscribe(
            data => {
                this.departments = data;
            },
            err => { console.log(err);
            this.api_service.checkStatus(err);
            });


        this.form = this.fb.group({
            DEPARTMENT: [null, Validators.required],
            CHECKLIST: [null, Validators.required],
            MILESTONE: [null, Validators.required]
        });


    }
}





