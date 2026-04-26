import { Component, Input } from '@angular/core';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'report-reading-guide-tab',
  templateUrl: './report-reading-guide-tab.component.html',
  styleUrl: './report-reading-guide-tab.component.scss'
})
export class ReportReadingGuideTabComponent extends BaseTabComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

  @Input() isEditMode: boolean = false;

}
