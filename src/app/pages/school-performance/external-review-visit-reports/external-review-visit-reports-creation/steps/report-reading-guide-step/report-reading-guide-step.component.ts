import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReviewVisitReportsWizaredService } from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'report-reading-guide-step',
  templateUrl: './report-reading-guide-step.component.html',
  styleUrl: './report-reading-guide-step.component.scss'
})
export class ReportReadingGuideStepComponent extends BaseStepComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
  @Input() showSaveBtn: boolean = true;
  constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
    protected override router: Router) {
    super(externalReviewVisitReportsWizaredService, router);
  }

}
