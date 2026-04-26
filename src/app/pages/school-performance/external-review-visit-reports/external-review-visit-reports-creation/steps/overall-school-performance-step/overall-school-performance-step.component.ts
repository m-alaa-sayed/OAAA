import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReviewVisitReportsWizaredService } from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'overall-school-performance-step',
  templateUrl: './overall-school-performance-step.component.html',
  styleUrl: './overall-school-performance-step.component.scss'
})
export class OverallSchoolPerformanceStepComponent extends BaseStepComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
  @Input() canEditJudgmentAndJustification: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() showSaveBtn: boolean = true;
  @Input() importedDomainSummary: any[] = [];
  constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
    protected override router: Router) {
    super(externalReviewVisitReportsWizaredService, router);
  }

}
