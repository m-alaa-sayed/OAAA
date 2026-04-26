import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {DomainStandardsComponent} from '../domain-standards/domain-standards.component';
import {TranslateService} from '@ngx-translate/core';
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {ToastService} from 'src/app/core/services/toast-service';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {Subscription} from "rxjs";
import {Router} from '@angular/router';

@Component({
    selector: 'external-review-results',
    templateUrl: './external-review-results.component.html',
    styleUrl: './external-review-results.component.scss'
})
export class ExternalReviewResultsComponent implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() canEditJudgmentAndJustification: boolean = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() professionalJudgmentChange = new EventEmitter<{
        domain: VisitReportDomainEvaluation,
        judgment: number
    }>();

    @ViewChildren(DomainStandardsComponent) domainStandardsComponents!: QueryList<DomainStandardsComponent>;

    isSubmitting: boolean = false;
    subscription!: Subscription;

    constructor(private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                private toastService: ToastService,
                public translate: TranslateService,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // REMOVED: Validation in creation view for Save action
        // Fields are now only required on Submit, not on Save
        // Validation for Submit is handled in isValid() method in service

        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;

            const emptyFields: string[] = [];

            // Validate all domains in groupedDomainEvaluationDimension
            Object.values(this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension || {}).forEach((domainList: any[]) => {
                domainList.forEach((domain: any) => {
                    // Validate Professional Judgment and Judgment Change Justification for each standard if field is editable
                    if (this.canEditJudgmentAndJustification) {
                        domain.standardEvaluations?.forEach((standardEvaluation: any) => {
                            // Validate Professional Judgment - must be selected (not 0, null, or undefined)
                            const professionalJudgment = standardEvaluation.professionalJudgment;
                            if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                                const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                                const standardCode = standardEvaluation.lkStandard?.code || '';
                                emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.PROFESSIONAL_JUDGMENT')} (${standardCode})`);
                            }

                            // Validate Judgment Change Justification if judgments differ
                            const systemJudgment = standardEvaluation.systemJudgment;
                            if (systemJudgment != null && professionalJudgment != null && 
                                systemJudgment !== professionalJudgment) {
                                const judgmentChangeJustification = (standardEvaluation.judgmentChangeJustification || '').trim();
                                if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                                    const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                                    const standardCode = standardEvaluation.lkStandard?.code || '';
                                    emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.JUDGMENT_CHANGE_JUSTIFICATIONS')} (${standardCode})`);
                                }
                            }
                        });
                    }

                    // Validate Strengths Analysis
                    const strengthsAnalysis = (domain.strengthsAnalysis || '').trim();
                    if (!strengthsAnalysis || strengthsAnalysis === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_STRENGTHS')}`);
                    }

                    // Validate Improvements Analysis
                    const improvementsAnalysis = (domain.improvementsAnalysis || '').trim();
                    if (!improvementsAnalysis || improvementsAnalysis === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_IMPROVEMENT_AREAS')}`);
                    }

                    // Validate Domain Summary
                    const domainSummary = (domain.domainSummary || '').trim();
                    if (!domainSummary || domainSummary === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.DOMAIN_SUMMARY.LABELS.DOMAIN_SUMMARY')}`);
                    }
                });
            });

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

    next() {
        // Check if we're in creation view - skip validation for Next action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // REMOVED: Validation in creation view for Next action
        // Fields are now only required on Submit, not on Next
        // Validation for Submit is handled in isValid() method in service

        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;

            const emptyFields: string[] = [];

            // Validate all domains in groupedDomainEvaluationDimension
            Object.values(this.visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension || {}).forEach((domainList: any[]) => {
                domainList.forEach((domain: any) => {
                    // Validate Strengths Analysis
                    const strengthsAnalysis = (domain.strengthsAnalysis || '').trim();
                    if (!strengthsAnalysis || strengthsAnalysis === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_STRENGTHS')}`);
                    }

                    // Validate Improvements Analysis
                    const improvementsAnalysis = (domain.improvementsAnalysis || '').trim();
                    if (!improvementsAnalysis || improvementsAnalysis === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_IMPROVEMENT_AREAS')}`);
                    }

                    // Validate Domain Summary
                    const domainSummary = (domain.domainSummary || '').trim();
                    if (!domainSummary || domainSummary === '') {
                        const domainLabel = this.translate.instant('PAGES.COMMON.LABELS.' + domain.domain);
                        emptyFields.push(`${domainLabel} - ${this.translate.instant('PAGES.DOMAIN_SUMMARY.LABELS.DOMAIN_SUMMARY')}`);
                    }
                });
            });

            // If there are empty fields, show error message and PREVENT NEXT
            if (emptyFields.length > 0) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                this.isSubmitting = false;
                return; // PREVENT NEXT - DO NOT EMIT nextEvent
            }
            this.isSubmitting = false;
        }

        // Only emit nextEvent if validation passed
        this.nextEvent.emit();
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.professionalJudgmentChange.emit(event);
    }

    get isSchoolCommentEditable(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }

    /*    checkAllJustificationFields(): boolean {
            let allValid = true;
            this.domainStandardsComponents.forEach(comp => {
                if (!comp.validate()) {
                    allValid = false;
                }
            });
            if (!allValid) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), { classname: 'bg-danger text-white', autohide: false });
                scrollTo(0, 0);
                return false;
            }
            return true;
        }*/
}
