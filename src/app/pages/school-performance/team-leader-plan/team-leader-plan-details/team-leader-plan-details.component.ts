import {Component, OnInit} from '@angular/core';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {
    ConflictOfInterestDisclosureTabComponent
} from './tabs/conflict-of-interest-disclosure-tab/conflict-of-interest-disclosure-tab.component';
import {
    SelfEvaluationDocumentAnalysisTabComponent
} from './tabs/self-evaluation-document-analysis-tab/self-evaluation-document-analysis-tab.component';
import {TaskPlanTabComponent} from './tabs/task-plan-tab/task-plan-tab.component';
import {TeamLeaderAnalysisTabComponent} from './tabs/team-leader-analysis-tab/team-leader-analysis-tab.component';
import {VisitDetailsTabComponent} from './tabs/visit-details-tab/visit-details-tab.component';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {TeamLeaderPlanService} from '../../service/team-leader-plan.service';
import {VisitPlanProcessCompletionRequest} from '../../types/visit-plan-process-completion-request';
// import {Permission} from "../../../../core/enum/permission";
import {Permission} from 'src/app/core/enum/permission';
import {TeamLeaderPlanWizaredService} from "../../service/team-leader-plan-wizared.service";

@Component({
    selector: 'team-leader-plan-details',
    templateUrl: './team-leader-plan-details.component.html',
    styleUrl: './team-leader-plan-details.component.scss'
})
export class TeamLeaderPlanDetailsComponent implements OnInit {


    id: string | null = '';
    taskId: any = null;
    requestObject: any;
    mainRequestData: any;
    showTabs: boolean = false;
    title: string = '';
    isSubmitted: boolean = false;
    erActivities: SystemLookupDto[] = [];

    visitDetailsTabInputs = new Map<string, any>();
    conflictOfInterestDisclosureTabInputs = new Map<string, any>();
    taskPlanTabInputs = new Map<string, any>();
    selfEvaluationDocumentAnalysisTabInputs = new Map<string, any>();
    teamLeaderAnalysisTabInputs = new Map<string, any>();

    tabs: TabItem[] = [
        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: VisitDetailsTabComponent,
            inputs: this.visitDetailsTabInputs
        },
        {
            labelAr: 'الإفصاح عن تضارب المصالح',
            labelEn: 'Conflict of Interest Disclosure',
            component: ConflictOfInterestDisclosureTabComponent,
            inputs: this.conflictOfInterestDisclosureTabInputs
        },
        {
            labelAr: 'مخطط المهام',
            labelEn: 'Task Plan',
            component: TaskPlanTabComponent,
            inputs: this.taskPlanTabInputs
        },
        {
            labelAr: 'تحليل وثيقة الذاتي',
            labelEn: 'Self-Evaluation Document Analysis',
            component: SelfEvaluationDocumentAnalysisTabComponent,
            inputs: this.selfEvaluationDocumentAnalysisTabInputs,
        },
        {
            labelAr: 'تحليل رئيس الفريق',
            labelEn: 'Team Leader Analysis',
            component: TeamLeaderAnalysisTabComponent,
            inputs: this.teamLeaderAnalysisTabInputs,
        }
    ];

    constructor(private route: ActivatedRoute,
                private teamLeaderPlanService: TeamLeaderPlanService,
                public teamLeaderPlanWizaredService:TeamLeaderPlanWizaredService,
                private toastService: ToastService,
                public translate: TranslateService,
                private router: Router,
    ) {
    }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
        this.teamLeaderPlanService.getRequestByRequestIdAndTaskId(this.id, this.taskId).subscribe({
            next: (response) => {
                this.requestObject = response.data;
                this.preparedMainRequestData();
                this.preparedStepsInputs();
                this.showTabs = true;
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    preparedStepsInputs() {
        this.visitDetailsTabInputs.set('visitPlanRequestInfo', this.requestObject.visitPlanRequestInfoDto);
        this.conflictOfInterestDisclosureTabInputs.set('visitPlanRequestInfo', this.requestObject.visitPlanRequestInfoDto);
        this.taskPlanTabInputs.set('visitPlanRequestInfo', this.requestObject.visitPlanRequestInfoDto);
        this.selfEvaluationDocumentAnalysisTabInputs.set('visitPlanRequestInfo', this.requestObject.visitPlanRequestInfoDto);
        this.teamLeaderAnalysisTabInputs.set('visitPlanRequestInfo', this.requestObject.visitPlanRequestInfoDto);

        this.taskPlanTabInputs.set('reviewTeamAssignmentRequestInfoList', this.requestObject.visitPlanRequestInfoDto.reviewTeamAssignments);

        if (this.requestObject.serviceStep.stepCode == 'VISIT_PLAN_RETURN_FOR_EDIT') {
            this.visitDetailsTabInputs.set('isEditMode', true);
            this.conflictOfInterestDisclosureTabInputs.set('isEditMode', true);
            this.taskPlanTabInputs.set('isEditMode', true);
            this.selfEvaluationDocumentAnalysisTabInputs.set('isEditMode', true);
            this.teamLeaderAnalysisTabInputs.set('isEditMode', true);
            this.taskPlanTabInputs.set('isEditMode', true);
        } else if (this.requestObject.canUpdate) {
            this.conflictOfInterestDisclosureTabInputs.set('isEditMode', true);
            this.taskPlanTabInputs.set('isEditMode', true);
        }
    }

    preparedMainRequestData() {
        this.mainRequestData = {
            requestDate: this.requestObject.requestDate,
            applicationNo: this.requestObject.applicationNo,
            stepNameAr: this.requestObject.serviceStep.stepNameAr,
            stepNameEn: this.requestObject.serviceStep.stepNameEn,
            statusNameAr: this.requestObject.serviceStep.statusNameAr,
            statusNameEn: this.requestObject.serviceStep.statusNameEn,
        };
    }

    submit(event: any) {
        const sendObject: VisitPlanProcessCompletionRequest = {
            visitPlanRequestInfoDto: this.requestObject.visitPlanRequestInfoDto,
            action: event.action,
            comment: event.comment,
            taskId: this.taskId
        };

        this.teamLeaderPlanService.completeVisitPlanProcess(sendObject).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: event.action}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    updateVisitPlanRequest() {
        if (!this.teamLeaderPlanWizaredService.validateAllDomainsSelected(this.requestObject.visitPlanRequestInfoDto)) {
            return;
        }
        this.teamLeaderPlanService.updateVisitPlanRequest(this.requestObject.visitPlanRequestInfoDto).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: "SAVE"}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    protected readonly Permission = Permission;
}
