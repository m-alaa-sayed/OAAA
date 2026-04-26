import { Component, Input } from '@angular/core';
import { SummaryVisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'summary-visit-reports-visit-details-tab',
  templateUrl: './summary-visit-reports-visit-details-tab.component.html',
  styleUrl: './summary-visit-reports-visit-details-tab.component.scss'
})
export class SummaryVisitReportsVisitDetailsTabComponent extends BaseTabComponent {

  @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

  @Input() isEditMode: boolean = true;
}
