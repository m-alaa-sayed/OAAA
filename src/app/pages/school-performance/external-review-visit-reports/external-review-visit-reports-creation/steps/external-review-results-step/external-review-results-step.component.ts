import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {
    OverallSchoolPerformanceComponent
} from "../../components/overall-school-performance/overall-school-performance.component";

import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {
    OnJudgmentChangeUtilsService
} from "../../../../../../shared/domain-evaluation/on-judgment-change-utils.service";

@Component({
    selector: 'external-review-results-step',
    templateUrl: './external-review-results-step.component.html',
    styleUrl: './external-review-results-step.component.scss'
})
export class ExternalReviewResultsStepComponent extends BaseStepComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Output() professionalJudgmentChange = new EventEmitter<{ domain: any, judgment: number }>();
    @Input() canEditJudgmentAndJustification: boolean = false;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                public onJudgmentChangeUtilsService: OnJudgmentChangeUtilsService,
                protected override router: Router) {
        super(externalReviewVisitReportsWizaredService, router);
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.onJudgmentChangeUtilsService.notifyJudgmentChange(event);
    }
}
