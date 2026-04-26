import {Component, Input} from '@angular/core';
import {BaseTabComponent} from "../../../../../../shared/tabs-template/base-tab.component";
import {VisitReportSubmissionRequestInfo} from "../../../../types/visit-report-submission-request-info";

@Component({
    selector: 'app-summary-visit-report-tab',
    templateUrl: './summary-visit-report-tab.component.html',
    styleUrl: './summary-visit-report-tab.component.scss'
})
export class SummaryVisitReportTabComponent extends BaseTabComponent {
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() schoolView: boolean = false;
}
