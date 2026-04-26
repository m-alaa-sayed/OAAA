import { Component, Input } from '@angular/core';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'appendices-tab',
  templateUrl: './appendices-tab.component.html',
  styleUrl: './appendices-tab.component.scss'
})
export class AppendicesTabComponent extends BaseTabComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

  @Input() isEditMode: boolean = false;

}
