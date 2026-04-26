import {Component, Input} from '@angular/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'school-comments-tab',
    templateUrl: './school-comments-tab.component.html',
    styleUrl: './school-comments-tab.component.scss'
})
export class SchoolCommentsTabComponent extends BaseTabComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;

    constructor(private authService: AuthService, public translate: TranslateService) {
        super();
    }

    get isSchoolCommentEditable(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }

    getAxisDomains(axisKey: string): VisitReportDomainEvaluation[] {
        return this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension?.[axisKey] || [];
    }

    getDomainLabel(domainCode: string): string {
        return `PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.${domainCode}`;
    }

}

