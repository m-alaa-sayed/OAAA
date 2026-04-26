import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    QualityAssuranceFollowUpFormService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form.service';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {FollowUpDuringVisitComponent} from '../../sub-steps/follow-up-during-visit/follow-up-during-visit.component';
import {SchoolReadinessComponent} from '../../sub-steps/school-readiness/school-readiness.component';
import {
    TeamPerformanceEvaluationComponent
} from '../../sub-steps/team-performance-evaluation/team-performance-evaluation.component';
import {TeamLeaderEvaluationComponent} from '../../sub-steps/team-leader-evaluation/team-leader-evaluation.component';
import {
    ReviewReportEvaluationComponent
} from '../../sub-steps/review-report-evaluation/review-report-evaluation.component';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';

@Component({
    selector: 'during-after-visit',
    templateUrl: './during-after-visit.component.html',
    styleUrl: './during-after-visit.component.scss'
})
export class DuringAfterVisitComponent extends BaseTabComponent implements OnInit {

    @Input() qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;
    @Input() showButtons: boolean = true;
    @Input() editable: boolean = true;
    @Input() visitFrom?: string;
    @Input() visitTo?: string;
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    //-- inputs
    followUpDuringVisitTabInputs = new Map<string, any>();
    schoolReadinessTabInputs = new Map<string, any>();
    teamPerformanceEvaluationTabInputs = new Map<string, any>();
    teamLeaderEvaluationTabInputs = new Map<string, any>();
    reviewReportEvaluationTabInputs = new Map<string, any>();


    showTabs: boolean = false;
    steps: StepItem[] = [
        {
            labelAr: 'المتابعة أثناء الزيارة',
            labelEn: 'Follow-up During the Visit',
            component: FollowUpDuringVisitComponent,
            inputs: this.followUpDuringVisitTabInputs
        },
        {
            labelAr: 'إستعداد المدرسة',
            labelEn: 'School Readiness',
            component: SchoolReadinessComponent,
            inputs: this.schoolReadinessTabInputs
        },
        {
            labelAr: 'تقييم عمل الفريق',
            labelEn: 'Team Performance Evaluation',
            component: TeamPerformanceEvaluationComponent,
            inputs: this.teamPerformanceEvaluationTabInputs
        },
        {
            labelAr: 'تقييم رئيس الفريق',
            labelEn: 'Team Leader Evaluation',
            component: TeamLeaderEvaluationComponent,
            inputs: this.teamLeaderEvaluationTabInputs
        },
        {
            labelAr: 'تقييم تقرير المراجعة النهائية',
            labelEn: 'Final Review Report Evaluation',
            component: ReviewReportEvaluationComponent,
            inputs: this.reviewReportEvaluationTabInputs
        }
    ];

    constructor(
        public qualityAssuranceFollowUpFormService: QualityAssuranceFollowUpFormService,
        public toastService: ToastService,
        public translate: TranslateService) {
        super();
    }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData() {
        this.followUpDuringVisitTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.followUpDuringVisitTabInputs.set('editable', this.editable);
        this.followUpDuringVisitTabInputs.set('visitFrom', this.visitFrom);
        this.followUpDuringVisitTabInputs.set('visitTo', this.visitTo);

        this.schoolReadinessTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.schoolReadinessTabInputs.set('editable', this.editable);

        this.teamPerformanceEvaluationTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.teamPerformanceEvaluationTabInputs.set('editable', this.editable);

        this.teamLeaderEvaluationTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.teamLeaderEvaluationTabInputs.set('editable', this.editable);

        this.reviewReportEvaluationTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.reviewReportEvaluationTabInputs.set('editable', this.editable);

        this.showTabs = true;
    }

    save(action: any) {
        this.qualityAssuranceFollowUpFormService.save(this.qualityAssuranceFormInfo, action);
    }

    validateForm(action: string) {
        if (!this.qualityAssuranceFollowUpFormService.validateQualityAssuranceFollowUpFormMandatoryFields(this.qualityAssuranceFormInfo, this.visitFrom, this.visitTo)) return;
        this.save(action);
    }
}

