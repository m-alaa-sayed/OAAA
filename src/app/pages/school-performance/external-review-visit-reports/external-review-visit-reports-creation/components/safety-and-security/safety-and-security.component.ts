import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {LanguageUtil} from "../../../../../../core/util/language.util";
import {VisitFormDomainEvaluation} from 'src/app/pages/school-performance/types/visit-form-domain-evaluation';
import {LkIndicator} from "../../../../types/lk-indicator";
import {DomainSummaryService} from "../../../../service/domain-summary.service";
import {ImportVisitFormDto, SafetyAndSecurityService} from "../../../services/safety-and-security.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs/operators';
import {Subscription} from "rxjs";

@Component({
    selector: 'safety-and-security',
    templateUrl: './safety-and-security.component.html',
    styleUrl: './safety-and-security.component.scss'
})
export class SafetyAndSecurityComponent implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() importedSafetyForms: any[] = [];
    @Input() showSaveBtn: boolean = true;
    @Input() schoolView: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    @ViewChild("submitForm") submitForm?: NgForm;
    isLoadingForms = false;
    isSubmitting = false;
    subscription!: Subscription;

    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private modalService: NgbModal,
        private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
        public safetyAndSecurityService: SafetyAndSecurityService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;

            const emptyFields: string[] = [];

            // Validate Safety and Security Notes
            const safetyAndSecurityNotes = (this.visitReportSubmissionRequestInfo.safetyAndSecurityNotes || '').trim();
            if (!safetyAndSecurityNotes || safetyAndSecurityNotes === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SAFETY_AND_SECURITY_NOTES'));
                this.submitForm?.controls['safetyAndSecurityNotes']?.markAsTouched();
                this.submitForm?.controls['safetyAndSecurityNotes']?.markAsDirty();
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

        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    protected readonly LanguageUtil = LanguageUtil;

    importForms(content: any) {
        this.modalService.open(content, {size: 'xl'});
    }

    toMultilineText(text?: string): string {
        return (text || '').replace(/(،|؛|\.|!|؟)\s*/g, '$1\n');
    }

    get isEvidenceTabVisible(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        return stepCode !== 'VISIT_REPORT_SCHOOL_REVIEW';
    }

    get isSchoolCommentEditable(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }
}
