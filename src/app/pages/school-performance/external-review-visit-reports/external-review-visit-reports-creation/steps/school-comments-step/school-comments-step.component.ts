import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ExternalReviewVisitReportsWizaredService} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {VisitReportSubmissionRequestInfo} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'school-comments-step',
    templateUrl: './school-comments-step.component.html',
    styleUrl: './school-comments-step.component.scss'
})
export class SchoolCommentsStepComponent extends BaseStepComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;

    constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                protected override router: Router,
                private authService: AuthService,
                public translate: TranslateService) {
        super(externalReviewVisitReportsWizaredService, router);
    }

    get isSchoolCommentEditable(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }

    getAxisDomains(axisKey: string): VisitReportDomainEvaluation[] {
        // Try groupedDomainEvaluationDimension first
        if (this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension?.[axisKey]) {
            return this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension[axisKey];
        }
        // Fallback: group from domainEvaluations if groupedDomainEvaluationDimension is not available
        if (this.visitReportSubmissionRequestInfo.domainEvaluations && this.visitReportSubmissionRequestInfo.domainEvaluations.length > 0) {
            const filtered = this.visitReportSubmissionRequestInfo.domainEvaluations.filter(
                domain => domain.evaluationDimension === axisKey
            );
            console.log(`getAxisDomains(${axisKey}): Found ${filtered.length} domains from domainEvaluations`, filtered);
            return filtered;
        }
        console.log(`getAxisDomains(${axisKey}): No domains found. groupedDomainEvaluationDimension:`, this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension, 'domainEvaluations:', this.visitReportSubmissionRequestInfo.domainEvaluations);
        return [];
    }

    getDomainLabel(domainCode: string): string {
        return `PAGES.COMMON.LABELS.${domainCode}`;
    }

    hasAnyDomainComments(): boolean {
        return this.getAxisDomains('LEARNING_QUALITY').length > 0 ||
               this.getAxisDomains('SCHOOL_PROCESS_QUALITY').length > 0 ||
               this.getAxisDomains('LEARNING_AND_SCHOOL_PROCESS_QUALITY_ASSURANCE').length > 0;
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

}

