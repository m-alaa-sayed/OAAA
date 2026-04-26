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

        const visitReportRequest: VisitReportRequest = {
            action: "SAVE",
            reportSubmissionRequestInfoDto: reportSubmissionRequestInfo
        };
        this.externalReviewVisitReportsService.handleVisitReportRequest(visitReportRequest).subscribe({
            next: (response) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                    classname: 'bg-success text-white',
                    delay: 3000
                });
                // this.router.navigate(['/jawda/school-performance/external-review-visit-reports/creation', response.visitReportSubmissionRequestInfoDto.id]);
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

    isValid(visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo, schoolView?: boolean) {
        if (!visitReportSubmissionRequestInfo.improvementsAnalysis || visitReportSubmissionRequestInfo.improvementsAnalysis.trim() === ''
            || !visitReportSubmissionRequestInfo.recommendations || visitReportSubmissionRequestInfo.recommendations.trim() === ''
            || !visitReportSubmissionRequestInfo.strengthsAnalysis || visitReportSubmissionRequestInfo.strengthsAnalysis.trim() === ''
            || !visitReportSubmissionRequestInfo.safetyAndSecurityNotes || visitReportSubmissionRequestInfo.safetyAndSecurityNotes.trim() === ''
            // || !visitReportSubmissionRequestInfo.summaryKeyFindings || visitReportSubmissionRequestInfo.summaryKeyFindings.trim() === ''
            // || !visitReportSubmissionRequestInfo.summaryImprovementsSuggestions || visitReportSubmissionRequestInfo.summaryImprovementsSuggestions.trim() === ''
            // || !visitReportSubmissionRequestInfo.summaryFutureEvents || visitReportSubmissionRequestInfo.summaryFutureEvents.trim() === ''
        ) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (!this.validateVisitReportDomainEvaluation(visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension?.['LEARNING_QUALITY'] || [])) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        if (!this.validateVisitReportDomainEvaluation(visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension?.['SCHOOL_PROCESS_QUALITY'] || [])) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }
        if (!this.validateVisitReportDomainEvaluation(visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension?.['LEARNING_AND_SCHOOL_PROCESS_QUALITY_ASSURANCE'] || [])) {
            this.showMandatoryFieldErrorMessage();
            return false;
        }

        if (visitReportSubmissionRequestInfo.overallSystemJudgment != visitReportSubmissionRequestInfo.overallProfessionalJudgment && visitReportSubmissionRequestInfo.status != 'REPORT_REJECTED'
            && !schoolView && (!visitReportSubmissionRequestInfo.judgmentChangeJustification || (visitReportSubmissionRequestInfo.judgmentChangeJustification && visitReportSubmissionRequestInfo.judgmentChangeJustification.trim() == ''))) {
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

    validateVisitReportDomainEvaluation(domains: VisitReportDomainEvaluation[]): boolean {
        // this.isSubmitting = true;
        let valid = true;
        // Loop through domains to check required fields
        domains.forEach(domain => {
            // Example: CKEditor required fields
            if (!domain.strengthsAnalysis?.trim()) valid = false;
            if (!domain.improvementsAnalysis?.trim()) valid = false;
            if (!domain.domainSummary?.trim()) valid = false;

            // Example: Check judgment justification condition
            domain.standardEvaluations?.forEach(stdEval => {
                if (
                    stdEval.professionalJudgment !== stdEval.systemJudgment &&
                    (!stdEval.judgmentChangeJustification ||
                        !stdEval.judgmentChangeJustification.trim())
                ) {
                    valid = false;
                }
            });
        });

        return valid;
    }

}
