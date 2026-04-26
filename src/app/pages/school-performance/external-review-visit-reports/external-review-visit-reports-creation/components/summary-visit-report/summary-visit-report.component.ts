import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { UiSwitchModule } from "ngx-ui-switch";
import { VisitReportSubmissionRequestInfo } from "../../../../types/visit-report-submission-request-info";
import { ToastService } from "../../../../../../core/services/toast-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
    ExternalReviewVisitReportsWizaredService
} from "../../../../service/external-review-visit-reports-wizared.service";
import { SafetyAndSecurityService } from "../../../services/safety-and-security.service";
import { Subscription } from "rxjs";
import { LanguageUtil } from "../../../../../../core/util/language.util";

@Component({
    selector: 'app-summary-visit-report',
    templateUrl: './summary-visit-report.component.html',
    styleUrl: './summary-visit-report.component.scss'
})
export class SummaryVisitReportComponent implements OnInit {
    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() schoolView: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    // @ViewChild("submitForm") submitForm?: NgForm;
    // isLoadingForms = false;
    isSubmitting = false;
    subscription!: Subscription;

    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private modalService: NgbModal,
        private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
        public safetyAndSecurityService: SafetyAndSecurityService
    ) {
    }

    ngOnInit(): void {
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }
    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        // COMMENTED OUT - Validation disabled
        /*
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;

            const emptyFields: string[] = [];

            // Validate Summary Key Findings
            const summaryKeyFindings = (this.visitReportSubmissionRequestInfo.summaryKeyFindings || '').trim();
            if (!summaryKeyFindings || summaryKeyFindings === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SUMMARY_KEY_FINDINGS'));
            }

            // Validate Summary Improvements Suggestions
            const summaryImprovementsSuggestions = (this.visitReportSubmissionRequestInfo.summaryImprovementsSuggestions || '').trim();
            if (!summaryImprovementsSuggestions || summaryImprovementsSuggestions === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SUMMARY_IMPROVEMENTS_SUGGESTIONS'));
            }

            // If there are empty fields, show error message and PREVENT POST REQUEST
            if (emptyFields.length > 0) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                this.isSubmitting = false;
                return; // PREVENT POST REQUEST - DO NOT CALL saveTempObject
            }
            this.isSubmitting = false; // Reset submitting flag after successful validation
        }
        */

        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }
    protected readonly LanguageUtil = LanguageUtil;
}
