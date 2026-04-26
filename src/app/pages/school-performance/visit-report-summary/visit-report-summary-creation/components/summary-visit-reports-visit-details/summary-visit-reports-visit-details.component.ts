import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    SummaryVisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import {VisitReportSummaryWizardService} from "../../../../service/visit-report-summary-wizard.service";
import {ToastService} from "../../../../../../core/services/toast-service";
import {b} from "@fullcalendar/core/internal-common";

@Component({
    selector: 'summary-visit-reports-visit-details',
    templateUrl: './summary-visit-reports-visit-details.component.html',
    styleUrl: './summary-visit-reports-visit-details.component.scss'
})
export class SummaryVisitReportsVisitDetailsComponent implements OnInit {

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

    @Input() showButtons: boolean = true;
    @Input() isEditMode: boolean = true;
    @Input() showSaveBtn: boolean = true;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    introductionEnabled: boolean = false;
    isNext: boolean = false;

    constructor(
        public translate: TranslateService,
        public toastService: ToastService,
        private visitReportSummaryWizardService: VisitReportSummaryWizardService) {
    }

    ngOnInit(): void {
        if (!this.summaryVisitReportSubmissionRequestInfo.status || ['IN_PROGRESS', 'RETURN_FOR_EDIT'].includes(<string>this.summaryVisitReportSubmissionRequestInfo.status)) {
            this.introductionEnabled = true;
        }
    }

    next(event: any): void {
        if (this.introductionEnabled && !this.summaryVisitReportSubmissionRequestInfo.otherUpdates) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            this.isNext = true;
            return;
        }
        this.nextEvent.emit(event);
    }

    save() {
        this.visitReportSummaryWizardService.saveTempObject(this.summaryVisitReportSubmissionRequestInfo).subscribe({
            next: (res) => {
                this.summaryVisitReportSubmissionRequestInfo = res.summaryVisitReportSubmissionRequestInfoDto
            }
        });
    }
}
