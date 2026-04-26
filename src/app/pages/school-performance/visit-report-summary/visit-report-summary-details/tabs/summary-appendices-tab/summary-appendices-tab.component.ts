import { Component, Input } from '@angular/core';
import { SummaryVisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'summary-appendices-tab',
  templateUrl: './summary-appendices-tab.component.html',
  styleUrl: './summary-appendices-tab.component.scss'
})
export class SummaryAppendicesTabComponent extends BaseTabComponent{

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;
  
    @Input() isEditMode: boolean = false;
}
