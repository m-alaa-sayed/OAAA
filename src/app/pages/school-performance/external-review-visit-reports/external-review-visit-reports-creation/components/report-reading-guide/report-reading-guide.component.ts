import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    ExternalReviewVisitReportsService
} from 'src/app/pages/school-performance/service/external-review-visit-reports.service';
import {VisitReportRequest} from 'src/app/pages/school-performance/types/visit-report-request';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {BaseModal} from 'src/app/shared/base-modal';
import {
    ExternalReviewVisitReportsWizaredService
} from "../../../../service/external-review-visit-reports-wizared.service";

@Component({
    selector: 'report-reading-guide',
    templateUrl: './report-reading-guide.component.html',
    styleUrl: './report-reading-guide.component.scss'
})
export class ReportReadingGuideComponent extends BaseModal {

    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

    @Input() showButtons: boolean = true;
    @Input() showSaveBtn: boolean = true;

    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();


    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private router: Router,
        private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
        private externalReviewVisitReportsService: ExternalReviewVisitReportsService,
        public override modalService: NgbModal
    ) {
        super(modalService);
    }

    saveAction() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    validate(content: any) {
        if (!this.externalReviewVisitReportsWizaredService.isValid(this.visitReportSubmissionRequestInfo)) return;
        this.open(content);
    }

    submit() {
        this.close();
        const visitReportRequest: VisitReportRequest = {
            action: 'SUBMIT',
            reportSubmissionRequestInfoDto: this.visitReportSubmissionRequestInfo
        };
        this.externalReviewVisitReportsService.handleVisitReportRequest(visitReportRequest).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: response.data, action: 'SUBMIT'}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }
}
