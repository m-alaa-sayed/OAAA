import {Component, Input} from '@angular/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';

@Component({
    selector: 'overall-school-performance-tab',
    templateUrl: './overall-school-performance-tab.component.html',
    styleUrl: './overall-school-performance-tab.component.scss'
})
export class OverallSchoolPerformanceTabComponent extends BaseTabComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

    @Input() isEditMode: boolean = false;
    @Input() importedDomainSummary: any[] = [];
    @Input() canEditJudgmentAndJustification: boolean = false;
    @Input() schoolView: boolean = false;
    @Input() showAttachments: boolean = true;
}
