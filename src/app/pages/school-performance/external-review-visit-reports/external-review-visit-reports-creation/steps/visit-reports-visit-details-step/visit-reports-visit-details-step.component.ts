import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReviewVisitReportsWizaredService } from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'visit-reports-visit-details-step',
  templateUrl: './visit-reports-visit-details-step.component.html',
  styleUrl: './visit-reports-visit-details-step.component.scss'
})
export class VisitReportsVisitDetailsStepComponent extends BaseStepComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
  @Input() isEditMode: boolean = false;
  @Input() showSaveBtn: boolean = true;

  constructor(public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
    protected override router: Router) {
    super(externalReviewVisitReportsWizaredService, router);
  }

}
