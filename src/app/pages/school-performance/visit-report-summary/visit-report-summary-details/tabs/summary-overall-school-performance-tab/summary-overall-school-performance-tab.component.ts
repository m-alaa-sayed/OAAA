import {Component, Input} from '@angular/core';
import {
    SummaryVisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';

@Component({
    selector: 'summary-overall-school-performance-tab',
    templateUrl: './summary-overall-school-performance-tab.component.html',
    styleUrl: './summary-overall-school-performance-tab.component.scss'
})
export class SummaryOverallSchoolPerformanceTabComponent extends BaseTabComponent {

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

    @Input() isEditMode: boolean = false;
}
