import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdChipList, MD_DIALOG_DATA, MdIconRegistry } from '@angular/material';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms'
import { QuestionInfoDialog } from 'app/Dialogs/question-info/question-info.component';
import { UploadHeaderFooterComponent } from 'app/Dialogs/upload-header-footer/upload-header-footer.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { ChecklistHistoryDialog } from 'app/Dialogs/history-checklist-dashboard/history-dialog.component';
import { DialogModule } from 'primeng/primeng';
import { AuthGuard } from 'app/services/auth-guard';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
    selector: 'app-assign-checklist',
    templateUrl: './checklist-assignment.html',
    styleUrls: ['../assignment.component.scss'],
    providers: [ConfirmationService]
})
export class ChecklistAssignmentComponent implements OnInit {
    selectedMessage: any;
    message: any;
    milestones: any;
    sub: any;
    stage: string;
    department: string;
    checklists: any;
    location_id: any;
    select_milestone: any;
    stage_id: number;
    users = [];
    currentUser: any;
    stageName: any;
    display = false;    
    dept_id: number;
    Notification: string;
    constructor(private confirmationService: ConfirmationService,public dialog: MdDialog, private route: ActivatedRoute, private api_service: ApiService, private router: Router, private auth_service: AuthGuard) {
        this.milestones = [
            { 'checklist_ins': { 'id': '1', 'name': 'Checklist#1' }, 'milestone': { 'id': 1, 'name': 'Milestone#1' }, 'planed_start_date': '', 'assign_to': '' },
            { 'checklist_ins': { 'id': '1', 'name': 'Checklist#1' }, 'milestone': { 'id': 1, 'name': 'Milestone#2' }, 'planed_start_date': '', 'assign_to': '' },
            { 'checklist_ins': { 'id': '1', 'name': 'Checklist#1' }, 'milestone': { 'id': 1, 'name': 'Milestone#3' }, 'planed_start_date': '', 'assign_to': '' },
            { 'checklist_ins': { 'id': '1', 'name': 'Checklist#1' }, 'milestone': { 'id': 1, 'name': 'Milestone#4' }, 'planed_start_date': '', 'assign_to': '' },
            { 'checklist_ins': { 'id': '2', 'name': 'Checklist#2' }, 'milestone': { 'id': 1, 'name': 'Milestone#5' }, 'planed_start_date': '', 'assign_to': '' },
            { 'checklist_ins': { 'id': '3', 'name': 'Checklist#3' }, 'milestone': { 'id': 1, 'name': 'Milestone#6' }, 'planed_start_date': '', 'assign_to': '' }
        ];
        this.message = {
            from: 'P-1',
            date: 1427207139000,
            subject: 'Check out this weeks most popular website designs in the Milkyway!',
            tag: 'Personal',
            type: 'danger',
            important: true,
            id: 1
        };

        this.currentUser = this.auth_service.getUserInfo();
        this.currentUser.role = this.currentUser.role.toString().toLowerCase();

    }
    ngOnInit() {
        this.location_id = this.route.params['_value'].id;
        this.sub = this.route
            .queryParams
            .subscribe(params => {
                this.stage = params['stage'] || '';
                this.department = params['dept'] || '';
                this.stage_id = params['stage'];
                this.dept_id = params['dept_id'];
                //   if(this.stage == 'pre-commissioning'){
                //       this.stage_id = 3;
                //   }else{
                //       this.stage_id = 1;
                //   }
            });
        this.getChecklists();
    }

    deleteExistingImages(checklist_id:any)
    {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the existing images?',
            header: 'Warning',
            icon: 'fa fa-warning',
            accept: () => {
                this.api_service.DeleteExistingImagesOfReports(checklist_id).subscribe(data=>{
                    setTimeout(() => {
                        this.Notification = 'Images Deleted Successfully';
                        this.display = true;
                    }, 400);
                },err=>{});
            },
            reject: () => {
            }
        });
        
        
    }
    getChecklists() {
        var stage_id = 1;
        this.api_service.getChecklistsForDashboard(this.location_id, this.stage_id).subscribe(data => {
            this.checklists = data;
            for(var item of this.checklists)
                {                    
                    if(item.checklist.is_prerequisite == 1)
                    {
                      item.is_prerequisite = true;   
                    }
                    else
                    {
                        item.is_prerequisite = false;   
                    }
                    if(item.checklist.is_imic == 1)
                    {
                        item.is_imic = true;
                    }
                    else
                    {
                        item.is_imic = false;    
                    }                    
                    if(item.checklist.is_wtg == 1)
                    {
                        item.is_wtg = true;
                    }
                    else
                    {
                        item.is_wtg = false;    
                    }
                }
                console.log(this.checklists);
            this.stageName = this.checklists[0].stage.stage.name;
            if (this.department && this.dept_id) {
                this.checklists = this.checklists.filter(x => x.checklist.DEPARTMENT_ID == this.dept_id);
                for(var item of this.checklists)
                {
                    if(item.checklist.is_prerequisite == 1)
                    {
                      item.is_prerequisite = true;   
                    }
                    else
                    {
                        item.is_prerequisite = false;   
                    }
                    if(item.checklist.is_imic == 1)
                    {
                        item.is_imic = true;
                    }
                    else
                    {
                        item.is_imic = false;    
                    }                    
                    if(item.checklist.is_wtg == 1)
                    {
                        item.is_wtg = true;
                    }
                    else
                    {
                        item.is_wtg = false;    
                    }
                }
                console.log(this.checklists);
            }
        },
            err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });

    }
    loadUsers(site_id: number, id: number) {
        this.api_service.getAllocatedTeam(site_id, id).subscribe(data => {
            if (data != null) {
                this.users = [];
                for (var i of data) {
                    this.users.push({
                        'label': i.name,
                        'value': i
                    });
                }
            }
        }, err => {
            console.log(err);
            this.api_service.checkStatus(err);
        });
    }
    onSelect(message: any): void {
        this.selectedMessage = message;
    }
    openQuestionInfo(milestone: any,checklist:any) {              
        console.log(checklist);
        var wtg = false;
        if(checklist.is_wtg == true)
        {
            wtg = true;
        }
        let dialogRef = this.dialog.open(QuestionInfoDialog, {
            width: '90vw',
            height: '85vh',
            data: {
                'milestone': milestone,
                'wtg':wtg,
                'department_id':checklist.checklist.DEPARTMENT_ID
            },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    viewHistory(checklist_id: number) {

        let dialogRef = this.dialog.open(ChecklistHistoryDialog, {
            width: '52vw',
            data: {
                id: checklist_id
            },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    generateChecklistReports(checklist_ins_id: number,disable:boolean) {
        if(disable == false)
        {
            this.api_service.generateChecklistReports(checklist_ins_id, this.location_id,this.stage_id).subscribe(
                data => {
                    if (data === 'file created succesfully') {
                        var vin = window.open("/hoto_be/data/Reports/" + checklist_ins_id + ".pdf", "_blank");
                        vin.focus();
                    }
                }
                , err => {
                    console.log(err);
                    this.api_service.checkStatus(err);
                });
        }        
    }

    generatePrerequisiteChecklistReports(checklist_ins_id: number) {
        //file created succesfully
        this.api_service.generatePrerequisiteChecklistReports(checklist_ins_id).subscribe(
            data => {
                if (data === 'File created Successfully') {
                    var vin = window.open("/hoto_be/data/prerequisite/" + checklist_ins_id + ".pdf", "_blank");
                    vin.focus();
                }
            }
            , err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }

    generateImicChecklistReports(checklist_ins_id: number){
        this.api_service.generateChecklistReports(checklist_ins_id, this.location_id,this.stage_id).subscribe(
            data => {
                if (data === 'File created Successfully') {
                    var vin = window.open("/hoto_be/data/IMIC_Reports/" + checklist_ins_id + ".pdf", "_blank");
                    vin.focus();
                }
            }
            , err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }

    generateMilestoneReports(milestone_ins_id) {
        this.api_service.generateMilestoneReports(milestone_ins_id, this.location_id,this.stage_id).subscribe(
            data => {
                if (data === 'file created succesfully') {
                    var vin = window.open("/hoto_be/data/Milestone_Reports/" + milestone_ins_id + ".pdf", "_blank");
                    vin.focus();
                }
            }
            , err => {
                console.log(err);
                this.api_service.checkStatus(err);
            });
    }

    selectLegend(data) {

        let dialogRef = this.dialog.open(QuestionInfoDialog, {
            width: '90vw',
            height: '85vh',
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    showSelectedMilestones(checklist) {
        if (this.select_milestone === checklist) {
            this.select_milestone = undefined;
        } else {
            this.select_milestone = checklist;
        }
    }
    getQuestionOkCount(checklist) {
        let approve = 0;
        for (let i of checklist.milestones) {
            approve = approve + i.statastic.approved_count;
        }
        return approve;
    }
    getQuestionNotOkCount(checklist) {
        let reject = 0;
        for (let i of checklist.milestones) {
            reject = reject + i.statastic.rejected_count;
        }
        return reject;
    }
    getQuestionInprogessCount(checklist) {
        let inprogess = 0;
        for (let i of checklist.milestones) {
            inprogess = inprogess + i.statastic.inprogess_count;
        }
        return inprogess;
    }
    checkVisibility(milestones) {
        let flag = true;
        for (let m in milestones) {
            if (milestones[m].status == 'qa_submitted' || milestones[m].status == 'com-submitted') {
                flag = true;
            } else {
                flag = false;
                break;
            }
        }
        return flag;
    }
    assignMilestone(id: number, milestone_id: number) {
        var obj: { [k: string]: any } = {};
        obj.assignedTo = id;
        obj.status = "re-assigned";
        this.api_service.assignMilestone(obj, milestone_id).subscribe(data => {
            if (data != null) {
            }
        }, err => {
            console.log(err);
            this.api_service.checkStatus(err);
        });
    }
    onNotification() {
        if (this.Notification == 'Checklist approved Successfully') {
            this.display = false;
            this.getChecklists();
        }
        if (this.Notification == 'Session timed out' || this.Notification == 'Internal Server error') {
            this.display = false;
            localStorage.clear();
            this.auth_service.setUserInfo(undefined);
            this.router.navigate(['/session/signin']);
        }
        if(this.Notification == 'Images Deleted Successfully')
        {
            this.display = false;
            this.getChecklists();
        }
    }

    openHeaderFooterUpload(checklist_ins_id:any,dept_id:any)
    {
        var obj: { [k: string]: any } = {};
        console.log("inside assignment component");
        console.log(checklist_ins_id);
        console.log(dept_id);
        obj.checklist_ins_id = checklist_ins_id;
        obj.dept_id = dept_id;
        let dialogRef = this.dialog.open(UploadHeaderFooterComponent, {
            width: '40vw',
            height: '85vh',
            data: obj,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getChecklists();
        });
    }
    approveChecklist(checklist_id: number) {
        var obj: { [k: string]: any } = {};
        obj.status = "approved";
        this.api_service.approveChecklist(checklist_id).subscribe(data => {
            if (data != null) {
                setTimeout(() => {
                    this.Notification = 'Checklist approved Successfully';
                    this.display = true;
                }, 400);
            }
        }, err => {
            console.log(err);
            this.api_service.checkStatus(err);
        });
    }
}
