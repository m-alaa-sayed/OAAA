import {Component, OnInit} from '@angular/core';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {VisitDetailsStepComponent} from './steps/visit-details-step/visit-details-step.component';
import {
    ConflictOfInterestDisclosureStepComponent
} from './steps/conflict-of-interest-disclosure-step/conflict-of-interest-disclosure-step.component';
import {TaskPlanStepComponent} from './steps/task-plan-step/task-plan-step.component';
import {
    SelfEvaluationDocumentAnalysisStepComponent
} from './steps/self-evaluation-document-analysis-step/self-evaluation-document-analysis-step.component';
import {TeamLeaderAnalysisStepComponent} from './steps/team-leader-analysis-step/team-leader-analysis-step.component';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {TeamLeaderPlanService} from '../../service/team-leader-plan.service';
import {VisitPlanRequestInfo} from '../../types/visit-plan-request-info';
import {ReviewTeamAssignmentRequestInfo} from '../../types/review-team-assignment-request-info';

@Component({
    selector: 'team-leader-plan-creation',
    templateUrl: './team-leader-plan-creation.component.html',
    styleUrl: './team-leader-plan-creation.component.scss'
})
export class TeamLeaderPlanCreationComponent implements OnInit {

    //-- created object
    visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
    reviewTeamAssignmentRequestInfoList: ReviewTeamAssignmentRequestInfo[] = [];

    id !: number;
    navigateParam: any;
    mainDataObject: any;

    visitDetailsStepInputs = new Map<string, any>();
    conflictOfInterestDisclosureStepInputs = new Map<string, any>();
    taskPlanStepInputs = new Map<string, any>();
    selfEvaluationDocumentAnalysisStepInputs = new Map<string, any>();
    teamLeaderAnalysisStepInputs = new Map<string, any>();


    steps: StepItem[] = [
        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: VisitDetailsStepComponent,
            inputs: this.visitDetailsStepInputs
        },
        {
            labelAr: 'الإفصاح عن تضارب المصالح',
            labelEn: 'Conflict of Interest Disclosure',
            component: ConflictOfInterestDisclosureStepComponent,
            inputs: this.conflictOfInterestDisclosureStepInputs
        },
        {
            labelAr: 'مخطط المهام',
            labelEn: 'Task Plan',
            component: TaskPlanStepComponent,
            inputs: this.taskPlanStepInputs
        },
        {
            labelAr: 'تحليل وثيقة الذاتي',
            labelEn: 'Self-Evaluation Document Analysis',
            component: SelfEvaluationDocumentAnalysisStepComponent,
            inputs: this.selfEvaluationDocumentAnalysisStepInputs,
        },
        {
            labelAr: 'تحليل رئيس الفريق',
            labelEn: 'Team Leader Analysis',
            component: TeamLeaderAnalysisStepComponent,
            inputs: this.teamLeaderAnalysisStepInputs,
        }

    ];


    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private teamLeaderPlanService: TeamLeaderPlanService) {
    }


    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
        if (this.id) {
            this.getPlanDetails();
        } else {
            const stateData = window.history.state;
            if (stateData?.scheduledSchoolVisit) {
                if (!this.visitPlanRequestInfo.scheduledSchoolVisit) {
                    this.visitPlanRequestInfo.scheduledSchoolVisit = stateData?.scheduledSchoolVisit;
                    this.visitPlanRequestInfo.scheduledSchoolVisitId = stateData?.scheduledSchoolVisit.id;
                    this.preparedStepsInputs();
                }
            }
        }
    }


    getPlanDetails() {
        this.teamLeaderPlanService.getPlanDetails(this.id).subscribe({
            next: (response) => {
                this.visitPlanRequestInfo = response.data;
                this.preparedStepsInputs();
                this.preparedMainDataObject();
                this.getVisitTeamMembers();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }


    private getVisitTeamMembers() {
        this.teamLeaderPlanService.getVisitTeamMembers(this.visitPlanRequestInfo.scheduledSchoolVisitId || 0).subscribe({
            next: (response) => {
                this.reviewTeamAssignmentRequestInfoList = response.data;
                this.taskPlanStepInputs.set('reviewTeamAssignmentRequestInfoList', this.reviewTeamAssignmentRequestInfoList);
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    preparedStepsInputs() {
        let isEditMode = !this.visitPlanRequestInfo.requestId;
        this.visitDetailsStepInputs.set('visitPlanRequestInfo', this.visitPlanRequestInfo);
        this.visitDetailsStepInputs.set('isEditMode', isEditMode);
        this.conflictOfInterestDisclosureStepInputs.set('visitPlanRequestInfo', this.visitPlanRequestInfo);
        this.conflictOfInterestDisclosureStepInputs.set('isEditMode', isEditMode);
        this.taskPlanStepInputs.set('visitPlanRequestInfo', this.visitPlanRequestInfo);
        this.taskPlanStepInputs.set('isEditMode', isEditMode);
        this.selfEvaluationDocumentAnalysisStepInputs.set('visitPlanRequestInfo', this.visitPlanRequestInfo);
        this.selfEvaluationDocumentAnalysisStepInputs.set('isEditMode', isEditMode);
        this.teamLeaderAnalysisStepInputs.set('visitPlanRequestInfo', this.visitPlanRequestInfo);
        this.teamLeaderAnalysisStepInputs.set('isEditMode', isEditMode);
    }

    preparedMainDataObject() {
        let status = !this.visitPlanRequestInfo.request ? this.translate.instant('PAGES.COMMON.LABELS.PENDING') :
            (this.translate.currentLang == 'ar' ? this.visitPlanRequestInfo.request?.serviceStep?.statusNameAr : this.visitPlanRequestInfo.request?.serviceStep?.statusNameEn)
        this.mainDataObject = {
            code: this.visitPlanRequestInfo.request?.applicationNo,
            date: this.visitPlanRequestInfo.request?.requestDate,
            status: status
        }
    }

}
