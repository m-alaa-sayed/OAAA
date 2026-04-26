import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
    selector: 'visit-reports-visit-details',
    templateUrl: './visit-reports-visit-details.component.html',
    styleUrl: './visit-reports-visit-details.component.scss'
})
export class VisitReportsVisitDetailsComponent implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    introductionEnabled: boolean = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    isSubmitting = false;

    constructor(public translate: TranslateService,
                private toastService: ToastService,
                public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService) {
    }

    ngOnInit(): void {
        /*if (!this.visitReportSubmissionRequestInfo.status || ['IN_PROGRESS', 'RETURN_FOR_EDIT'].includes(this.visitReportSubmissionRequestInfo.status)) {
            this.introductionEnabled = true;
        }*/
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    next() {
        this.nextEvent.emit()
    }
}
