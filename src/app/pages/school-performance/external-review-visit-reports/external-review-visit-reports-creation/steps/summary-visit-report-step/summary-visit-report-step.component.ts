import {Component, Input} from '@angular/core';
import {BaseStepComponent} from "../../../../../../shared/wizard-template/base-step.component";
import {
    ExternalReviewVisitReportsWizaredService
} from "../../../../service/external-review-visit-reports-wizared.service";
import {Router} from "@angular/router";
import {VisitReportSubmissionRequestInfo} from "../../../../types/visit-report-submission-request-info";
import {SummaryVisitReportComponent} from "../../components/summary-visit-report/summary-visit-report.component";

@Component({
  selector: 'app-summary-visit-report-step',
  templateUrl: './summary-visit-report-step.component.html',
  styleUrl: './summary-visit-report-step.component.scss'
})
export class SummaryVisitReportStepComponent extends BaseStepComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;

    constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                protected override router: Router) {
        super(externalReviewVisitReportsWizaredService, router);
    }
}
