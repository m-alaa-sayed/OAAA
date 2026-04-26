import {Component, Input} from '@angular/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';

@Component({
    selector: 'visit-reports-visit-details-tab',
    templateUrl: './visit-reports-visit-details-tab.component.html',
    styleUrl: './visit-reports-visit-details-tab.component.scss'
})
export class VisitReportsVisitDetailsTabComponent extends BaseTabComponent {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

    @Input() isEditMode: boolean = false;

}
