import {Injectable} from '@angular/core';
import {BaseWizardService} from 'src/app/shared/wizard-template/base-wizard.service';
import {VisitReportSubmissionRequestInfo} from '../types/visit-report-submission-request-info';
import {VisitReportRequest} from '../types/visit-report-request';
import {ExternalReviewVisitReportsService} from './external-review-visit-reports.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Permission} from 'src/app/core/enum/permission';
import {AuthService} from "../../../core/services/auth.service";
import {BehaviorSubject} from "rxjs";
import {VisitReportDomainEvaluation} from "../types/visit-report-domain-evaluation";

@Injectable({
    providedIn: 'root'
})
export class ExternalReviewVisitReportsWizaredService extends BaseWizardService {

    private visitReportSubmissionDataSubject = new BehaviorSubject<boolean>(false);
    public visitReportSubmissionData$ = this.visitReportSubmissionDataSubject.asObservable();

    constructor(public toastService: ToastService,
                public translate: TranslateService,
                private router: Router,
                private authService: AuthService,
                private externalReviewVisitReportsService: ExternalReviewVisitReportsService) {
        super();
    }

    protected submit(formData: any) {
    }

    getCancelUrl(): string {
        return "/jawda/school-performance/external-review-visit-reports/list";
    }

    saveTempObject(reportSubmissionRequestInfo: VisitReportSubmissionRequestInfo) {
        // Skip all validation for Save action - allow saving with empty fields
        // Validation will only happen on Submit/Approve/Return for Edit/Send to Proofreader/Send to GM via isValid() method
        // This applies to both creation view and request-details view

        Object.values(reportSubmissionRequestInfo.groupedDomainEvaluationDimension || {}).forEach((domainList: any[]) => {
            domainList.forEach(domain => {
                if (domain.standardEvaluations) {
                    domain.standardEvaluations.forEach((standard: any) => {
                        if (standard.systemJudgment === standard.professionalJudgment) {
                            standard.judgmentChangeJustification = null;
                        }
                    });
                }
            });
        });

        // REMOVED: Validation in creation view for Save action
        // Fields are now only required on Submit, not on Save
        // Validation for Submit is handled in isValid() method

        // Ensure school data is properly set before sending
        const school = reportSubmissionRequestInfo.scheduledSchoolVisit?.school;
        if (school) {
            // ALWAYS set wilayaId from wilayat object if wilayat exists (override any existing value)
            if (school.wilayat?.id !== undefined && school.wilayat?.id !== null) {
                school.wilayaId = school.wilayat.id;
            }
            // ALWAYS set governmentId from governorate object if governorate exists (override any existing value)
            if (school.governorate?.id !== undefined && school.governorate?.id !== null) {
                school.governmentId = school.governorate.id;
            }
        }


        const visitReportRequest: VisitReportRequest = {
            action: "SAVE",
            reportSubmissionRequestInfoDto: reportSubmissionRequestInfo
        };


        this.externalReviewVisitReportsService.handleVisitReportRequest(visitReportRequest).subscribe({
            next: (response) => {
                // Show success message with longer delay to ensure user sees it
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                    classname: 'bg-success text-white',
                    delay: 3000
                });

                // Determine current view type
                const currentUrl = this.router.url;
                const isCreationView = currentUrl.includes('/external-review-visit-reports/creation');
                const isRequestDetailsView = currentUrl.includes('/external-review-visit-reports/request-details');

                if (isCreationView && response && response.visitReportSubmissionRequestInfoDto?.id) {
                    // Add delay to allow success message to be visible before navigation
                    setTimeout(() => {
                        // Use navigateByUrl with query parameter to force route change and component reload
                        // The query param makes Angular treat it as a different route, triggering ngOnInit again
                        const targetUrl = `/jawda/school-performance/external-review-visit-reports/creation/${response.visitReportSubmissionRequestInfoDto.id}?reload=${Date.now()}`;
                        this.router.navigateByUrl(targetUrl).then(() => {
                            // Clean up: remove query parameter after navigation completes
                            this.router.navigate(
                                ['/jawda/school-performance/external-review-visit-reports/creation', response.visitReportSubmissionRequestInfoDto.id],
                                { replaceUrl: true, queryParams: {} }
                            );
                        });
                    }, 2000); // 2000ms (2 seconds) delay to show the success message before navigation
                } else if (isRequestDetailsView) {
                    // Extract the requestId and uuid from the current URL to preserve them
                    const urlParts = currentUrl.split('/');
                    const requestIdIndex = urlParts.indexOf('request-details');
                    if (requestIdIndex !== -1 && urlParts[requestIdIndex + 1] && urlParts[requestIdIndex + 2]) {
                        const requestId = urlParts[requestIdIndex + 1];
                        const uuid = urlParts[requestIdIndex + 2];
                        // Add a small delay to allow the success message to be visible before navigation
                        setTimeout(() => {
                            // Use navigateByUrl with query parameter to force route change and component reload
                            const targetUrl = `/jawda/school-performance/external-review-visit-reports/request-details/${requestId}/${uuid}?reload=${Date.now()}`;
                            this.router.navigateByUrl(targetUrl).then(() => {
                                // Clean up: remove query parameter after navigation completes
                                this.router.navigate(
                                    ['/jawda/school-performance/external-review-visit-reports/request-details', requestId, uuid],
                                    { replaceUrl: true, queryParams: {} }
                                );
                            });
                        }, 2000); // 2000ms (2 seconds) delay to show the success message before navigation
                    }
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    checkVisitReportPermission(permission: Permission): boolean {
        const userClaim = this.authService.getUserClaim();
        return <boolean>userClaim?.permissions?.includes(permission);
    }

    /**
     * Check if a string (potentially HTML from CKEditor) is empty
     * Removes HTML tags and checks if the text content is empty
     */
    public isHtmlContentEmpty(htmlContent: string | null | undefined): boolean {
        if (!htmlContent) {
            return true;
        }
        const text = String(htmlContent).trim();
        if (!text || text === '') {
            return true;
        }

        // Check for common empty HTML patterns first (before processing)
        const emptyPatterns = [
            /^<p><\/p>$/i,
            /^<p><br><\/p>$/i,
            /^<p><br\/><\/p>$/i,
            /^<p><br\s*\/?><\/p>$/i,
            /^<p>\s*<\/p>$/i,
            /^<p>&nbsp;<\/p>$/i,
            /^<p>\s*&nbsp;\s*<\/p>$/i,
            /^<p><br\s*\/?>\s*&nbsp;\s*<\/p>$/i,
            /^<p>&nbsp;<br\s*\/?><\/p>$/i,
            /^<div><\/div>$/i,
            /^<div><br><\/div>$/i,
            /^<div><br\/><\/div>$/i,
            /^<div>\s*<\/div>$/i,
            /^<div>&nbsp;<\/div>$/i
        ];

        // Check if the entire content matches an empty pattern
        for (const pattern of emptyPatterns) {
            if (pattern.test(text)) {
                return true;
            }
        }

        // Remove all HTML tags
        let textContent = text.replace(/<[^>]*>/g, '');

        // Decode HTML entities using a temporary DOM element
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = textContent;
            textContent = tempDiv.textContent || tempDiv.innerText || '';
        } catch (e) {
            // If DOM parsing fails, continue with regex-based cleaning
            textContent = textContent
                .replace(/&nbsp;/gi, ' ')
                .replace(/&amp;/gi, '&')
                .replace(/&lt;/gi, '<')
                .replace(/&gt;/gi, '>')
                .replace(/&quot;/gi, '"')
                .replace(/&#39;/gi, "'");
        }

        // Remove all types of whitespace characters (spaces, tabs, newlines, non-breaking spaces, etc.)
        textContent = textContent.replace(/[\s\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/g, '');

        // Remove any remaining HTML entities
        const htmlEntityPatterns = ['&nbsp;', '&nbsp', '&amp;', '&lt;', '&gt;', '&quot;', '&#39;', '&#x27;'];
        let cleanedContent = htmlEntityPatterns.reduce((acc, pattern) => {
            return acc.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
        }, textContent);

        // Remove all Unicode whitespace and control characters
        cleanedContent = cleanedContent.replace(/[\u0000-\u001F\u007F-\u009F\u00A0\u2000-\u200B\u2028\u2029\uFEFF]/g, '');

        // Final trim
        cleanedContent = cleanedContent.trim();

        // Check if content is empty after all cleaning
        const isEmpty = !cleanedContent || cleanedContent === '';

        return isEmpty;
    }

    isValid(visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo, schoolView?: boolean, action?: string) {

        // Validate Introduction (otherUpdates) - المقدمة
        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.otherUpdates)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        // Validate Overall School Performance fields - الأداء العام للمدرسة
        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.strengthsAnalysis)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.improvementsAnalysis)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.recommendations)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        // Validate Safety and Security Notes - ملاحظات حول الأمن والسلامة
        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.safetyAndSecurityNotes)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.summaryKeyFindings)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.summaryImprovementsSuggestions)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.summaryFutureEvents)) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        // Validate Professional Judgment - الحكم المهنى
        const professionalJudgment = visitReportSubmissionRequestInfo.overallProfessionalJudgment;
        if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        console.log('✅ Overall Professional Judgment (overallProfessionalJudgment) - الحكم المهنى: OK');

        // Validate Judgment Change Justification if judgments differ - مبررات تغيير الحكم
        const systemJudgment = visitReportSubmissionRequestInfo.overallSystemJudgment;
        const status = visitReportSubmissionRequestInfo.status;
        if (systemJudgment != null && professionalJudgment != null &&
            systemJudgment !== professionalJudgment &&
            status !== 'REPORT_REJECTED' && !schoolView) {
            if (this.isHtmlContentEmpty(visitReportSubmissionRequestInfo.judgmentChangeJustification)) {
                this.showMandatoryFieldErrorMessage();
                return false;
            }
        }

        // Validate all domains - التحقق من جميع المجالات
        // Check if groupedDomainEvaluationDimension exists and has data
        const groupedDomainEvaluationDimension = visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension;
        if (!groupedDomainEvaluationDimension || Object.keys(groupedDomainEvaluationDimension).length === 0) {
            // If groupedDomainEvaluationDimension is empty, check domainEvaluations as fallback
            const domainEvaluations = visitReportSubmissionRequestInfo.domainEvaluations;
            if (!domainEvaluations || domainEvaluations.length === 0) {
                this.showMandatoryFieldErrorMessage();
                return false;
            }
        }

        const learningQuality = groupedDomainEvaluationDimension?.['LEARNING_QUALITY'] || [];
        const schoolProcessQuality = groupedDomainEvaluationDimension?.['SCHOOL_PROCESS_QUALITY'] || [];
        const learningAndSchoolProcessQualityAssurance = groupedDomainEvaluationDimension?.['LEARNING_AND_SCHOOL_PROCESS_QUALITY_ASSURANCE'] || [];

        // If all arrays are empty, it means no domains are available, which is invalid
        if (learningQuality.length === 0 && schoolProcessQuality.length === 0 && learningAndSchoolProcessQualityAssurance.length === 0) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (learningQuality.length > 0 && !this.validateVisitReportDomainEvaluation(learningQuality, 'LEARNING_QUALITY')) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (schoolProcessQuality.length > 0 && !this.validateVisitReportDomainEvaluation(schoolProcessQuality, 'SCHOOL_PROCESS_QUALITY')) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (learningAndSchoolProcessQualityAssurance.length > 0 && !this.validateVisitReportDomainEvaluation(learningAndSchoolProcessQualityAssurance, 'LEARNING_AND_SCHOOL_PROCESS_QUALITY_ASSURANCE')) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        return true;
    }

    showMandatoryFieldErrorMessage() {
        this.visitReportSubmissionDataSubject.next(true);
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
            classname: 'bg-danger text-white',
            autohide: false
        });
        scrollTo(0, 0);
    }

    validateVisitReportDomainEvaluation(domains: VisitReportDomainEvaluation[], domainType?: string): boolean {
        if (!domains || domains.length === 0) {
            return true; // No domains to validate
        }

        // Loop through domains to check required fields
        for (const domain of domains) {
            if (!domain) {
                continue; // Skip null/undefined domains
            }

            // Validate CKEditor required fields (check HTML content)
            if (this.isHtmlContentEmpty(domain.strengthsAnalysis)) {
                return false;
            }

            if (this.isHtmlContentEmpty(domain.improvementsAnalysis)) {
                return false;
            }

            if (this.isHtmlContentEmpty(domain.domainSummary)) {
                return false;
            }

            // Validate Professional Judgment and Judgment Change Justification for each standard
            if (domain.standardEvaluations && domain.standardEvaluations.length > 0) {
                for (const stdEval of domain.standardEvaluations) {
                    if (!stdEval) {
                        continue; // Skip null/undefined standard evaluations
                    }

                    // Validate Professional Judgment - must be selected (not 0, null, or undefined)
                    const professionalJudgment = stdEval.professionalJudgment;
                    if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                        return false;
                    }

                    // Validate Judgment Change Justification if judgments differ
                    const systemJudgment = stdEval.systemJudgment;
                    if (systemJudgment != null && systemJudgment !== undefined &&
                        professionalJudgment != null && professionalJudgment !== undefined &&
                        systemJudgment !== professionalJudgment) {
                        if (this.isHtmlContentEmpty(stdEval.judgmentChangeJustification)) {
                            return false;
                }
                    }
                }
            }
        }

        return true;
    }

}
