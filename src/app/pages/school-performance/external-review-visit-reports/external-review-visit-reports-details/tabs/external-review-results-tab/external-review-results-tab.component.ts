import {Component, Input} from '@angular/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';
import {VisitReportDomainEvaluation} from "../../../../types/visit-report-domain-evaluation";
import {
    OnJudgmentChangeUtilsService
} from "../../../../../../shared/domain-evaluation/on-judgment-change-utils.service";

@Component({
    selector: 'external-review-results-tab',
    templateUrl: './external-review-results-tab.component.html',
    styleUrl: './external-review-results-tab.component.scss'
})
export class ExternalReviewResultsTabComponent extends BaseTabComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;


    @Input() isEditMode: boolean = false;
    @Input() canEditJudgmentAndJustification: boolean = false;
    constructor(private onJudgmentChangeUtilsService: OnJudgmentChangeUtilsService) {
        super();
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.onJudgmentChangeUtilsService.notifyJudgmentChange(event);
    }

}
