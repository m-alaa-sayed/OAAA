import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    VisitReportSummaryWizardService
} from 'src/app/pages/school-performance/service/visit-report-summary-wizard.service';
import {
    SummaryVisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'summary-visit-reports-visit-details-step',
    templateUrl: './summary-visit-reports-visit-details-step.component.html',
    styleUrl: './summary-visit-reports-visit-details-step.component.scss'
})
export class SummaryVisitReportsVisitDetailsStepComponent extends BaseStepComponent {

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;
    @Input() showSaveBtn: boolean = true;
    @Input() isEditMode: boolean = true;

    constructor(public visitReportSummaryWizardService: VisitReportSummaryWizardService,
                protected override router: Router) {
        super(visitReportSummaryWizardService, router);
    }
}
