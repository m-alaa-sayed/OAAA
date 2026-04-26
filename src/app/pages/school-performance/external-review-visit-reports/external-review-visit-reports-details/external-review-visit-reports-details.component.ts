import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {AppendicesTabComponent} from './tabs/appendices-tab/appendices-tab.component';
import {
    ExternalReviewResultsTabComponent
} from './tabs/external-review-results-tab/external-review-results-tab.component';
import {
    OverallSchoolPerformanceTabComponent
} from './tabs/overall-school-performance-tab/overall-school-performance-tab.component';
import {ReportReadingGuideTabComponent} from './tabs/report-reading-guide-tab/report-reading-guide-tab.component';
import {SafetyAndSecurityTabComponent} from './tabs/safety-and-security-tab/safety-and-security-tab.component';
import {
    VisitReportsVisitDetailsTabComponent
} from './tabs/visit-reports-visit-details-tab/visit-reports-visit-details-tab.component';
import {SchoolCommentsTabComponent} from './tabs/school-comments-tab/school-comments-tab.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewVisitReportsService} from '../../service/external-review-visit-reports.service';
import {VisitReportCompletionRequest} from '../../types/visit-report-completion-request';
import {ImportDomainSummaryFormsService} from "../services/import-domain-summary-forms.service";
import {SafetyAndSecurityService} from "../services/safety-and-security.service";
import {VisitReportDocumentDownloaderService} from "../services/visit-report-document-downloader.service";
import {AuthService} from "../../../../core/services/auth.service";
import {Permission} from "../../../../core/enum/permission";
import {
    SummaryVisitReportStepComponent
} from "../external-review-visit-reports-creation/steps/summary-visit-report-step/summary-visit-report-step.component";
import {SummaryVisitReportTabComponent} from "./tabs/summary-visit-report-tab/summary-visit-report-tab.component";
import {
    ReportDownloaderEvent
} from "../external-review-visit-reports-creation/components/report-document-downloader/report-document-downloader.component";
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExternalReviewVisitReportsActionsComponent} from "../external-review-visit-reports-actions/external-review-visit-reports-actions.component";

@Component({
    selector: 'external-review-visit-reports-details',
    templateUrl: './external-review-visit-reports-details.component.html',
    styleUrl: './external-review-visit-reports-details.component.scss'
})
export class ExternalReviewVisitReportsDetailsComponent implements OnInit, OnDestroy {

    id: string | null = '';
    taskId: any = null;
    requestObject: any;
    mainRequestData: any;
    showTabs: boolean = false;
    isSubmitted: boolean = false;


    // tabs input map
    visitReportsVisitDetailsTabInputs = new Map<string, any>();
    overallSchoolPerformanceTabInputs = new Map<string, any>();
    summaryVisitReportTabInputs = new Map<string, any>();
    externalReviewResultsTabInputs = new Map<string, any>();
    safetyAndSecurityTabInputs = new Map<string, any>();
    appendicesTabInputs = new Map<string, any>();
    readonlyeportReadingGuideTabInputs = new Map<string, any>();
    schoolCommentsTabInputs = new Map<string, any>();
    private routeSubscription?: Subscription;
    private queryParamsSubscription?: Subscription;

    // tabs
    tabs: TabItem[] = [

        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: VisitReportsVisitDetailsTabComponent,
            inputs: this.visitReportsVisitDetailsTabInputs
        },
        {
            labelAr: 'الأداء العام للمدرسة',
            labelEn: 'Overall School Performance',
            component: OverallSchoolPerformanceTabComponent,
            inputs: this.overallSchoolPerformanceTabInputs
        },
        {
            labelAr: 'نتائج المراجعة الخارجية',
            labelEn: 'External Review Results',
            component: ExternalReviewResultsTabComponent,
            inputs: this.externalReviewResultsTabInputs
        },
        {
            labelAr: 'الأمن والسلامة',
            labelEn: 'Safety and Security',
            component: SafetyAndSecurityTabComponent,
            inputs: this.safetyAndSecurityTabInputs
        },
        {
            labelAr: 'تقرير الزيارة المختصر',
            labelEn: 'Summary visit report',
            component: SummaryVisitReportTabComponent,
            inputs: this.summaryVisitReportTabInputs
        },

        {
            labelAr: 'الملاحق',
            labelEn: 'Appendices',
            component: AppendicesTabComponent,
            inputs: this.appendicesTabInputs
        },
        {
            labelAr: 'تعليقات المدرسة',
            labelEn: 'School Comments',
            component: SchoolCommentsTabComponent,
            inputs: this.schoolCommentsTabInputs
        },
        {
            labelAr: 'مفاتيح قراءة التقرير',
            labelEn: 'Report Reading Guide',
            component: ReportReadingGuideTabComponent,
            inputs: this.readonlyeportReadingGuideTabInputs
        }
    ];
    schoolView: boolean = false;


    constructor(private route: ActivatedRoute,
                private externalReviewVisitReportsService: ExternalReviewVisitReportsService,
                private toastService: ToastService,
                public importDomainSummaryFormsService: ImportDomainSummaryFormsService,
                public safetyAndSecurityService: SafetyAndSecurityService,
                public translate: TranslateService,
                public visitReportDocumentDownloaderService: VisitReportDocumentDownloaderService,
                private authService: AuthService,
                private router: Router
    ) {

    }


    ngOnInit(): void {
        // Subscribe to route params to reload data when route changes (including query params)
        this.routeSubscription = this.route.paramMap.pipe(
            map(params => ({
                id: params.get('id'),
                taskId: params.get('taskId') || null
            }))
        ).subscribe(params => {
            this.id = params.id;
            this.taskId = params.taskId;
            this.loadReportDetails();
        });

        // Also subscribe to query params to trigger reload when query params change (e.g., when reload query param is added)
        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            // Only reload if we have an id and the reload query param exists (indicating a forced reload)
            if (this.id && params['reload']) {
                this.loadReportDetails();
            }
        });
    }

    private loadReportDetails(): void {
        this.externalReviewVisitReportsService.getReportDetailsByRequestId(this.id, this.taskId).subscribe({
            next: (response) => {
                this.requestObject = response.data;
                this.preparedMainRequestData();
                this.preparedStepsInputs();
                this.showTabs = true;
                this.prepareImportedFormsForDomainAndSafety();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
    }

    preparedStepsInputs() {
        this.visitReportsVisitDetailsTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.overallSchoolPerformanceTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.summaryVisitReportTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.externalReviewResultsTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.safetyAndSecurityTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.appendicesTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.readonlyeportReadingGuideTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.schoolCommentsTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);

        if (['VISIT_REPORT_RETURN_FOR_EDIT', 'VISIT_REPORT_PROOFREADER_REVIEW', 'VISIT_REPORT_QUALITY_FINAL_REVIEW', 'VISIT_REPORT_QUALITY_INITIAL_REVIEW']
            .includes(this.requestObject.serviceStep.stepCode)) {
            // For VISIT_REPORT_QUALITY_INITIAL_REVIEW, prevent editing of judgment and justification fields
            if (this.requestObject.serviceStep.stepCode === 'VISIT_REPORT_QUALITY_INITIAL_REVIEW' ||
                 this.requestObject.serviceStep.stepCode === 'VISIT_REPORT_QUALITY_FINAL_REVIEW' ||
                 this.requestObject.serviceStep.stepCode === 'VISIT_REPORT_PROOFREADER_REVIEW') {
                this.overallSchoolPerformanceTabInputs.set('canEditJudgmentAndJustification', false);
                this.externalReviewResultsTabInputs.set('canEditJudgmentAndJustification', false);
            } else {
            this.overallSchoolPerformanceTabInputs.set('canEditJudgmentAndJustification', true);
            this.externalReviewResultsTabInputs.set('canEditJudgmentAndJustification', true);
            }
        }

        if (['VISIT_REPORT_RETURN_FOR_EDIT', 'VISIT_REPORT_PROOFREADER_REVIEW', 'VISIT_REPORT_QUALITY_FINAL_REVIEW', 'VISIT_REPORT_QUALITY_INITIAL_REVIEW']
            .includes(this.requestObject.serviceStep.stepCode)) {
            this.visitReportsVisitDetailsTabInputs.set('isEditMode', true);
            this.summaryVisitReportTabInputs.set('isEditMode', true);
            this.safetyAndSecurityTabInputs.set('isEditMode', true);
            this.appendicesTabInputs.set('isEditMode', true);
            this.readonlyeportReadingGuideTabInputs.set('isEditMode', true);

            // For VISIT_REPORT_QUALITY_INITIAL_REVIEW, allow editing of Overall School Performance and External Review Results tabs
            // to enable editing of specific fields: Key Strengths, Key Improvement Areas, and Domain Summary
            this.overallSchoolPerformanceTabInputs.set('isEditMode', true);
            this.externalReviewResultsTabInputs.set('isEditMode', true);
        }

        if (this.requestObject.serviceStep.stepCode == 'VISIT_REPORT_SCHOOL_REVIEW'
            || (this.authService.getUserClaim()?.permissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW) && !this.taskId)) {
            this.schoolView = true;
            // this.tabs = this.tabs.filter((tab: TabItem) => tab.labelEn != 'External Review Results');
            this.overallSchoolPerformanceTabInputs.set('schoolView', this.schoolView);
            this.summaryVisitReportTabInputs.set('schoolView', this.schoolView);
            this.safetyAndSecurityTabInputs.set('schoolView', this.schoolView);
            this.summaryVisitReportTabInputs.set('showAttachments', false);
        }

        // Filter Summary visit report tab - for users with VISIT_REPORT_SCHOOL_REVIEW permission,
        // only show if stepCode is VISIT_REPORT_APPROVED. For other users, always show.
        const hasSchoolReviewPermission = this.authService.getUserClaim()?.permissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        if (hasSchoolReviewPermission && this.requestObject.serviceStep.stepCode !== 'VISIT_REPORT_APPROVED') {
            this.tabs = this.tabs.filter((tab: TabItem) => tab.labelEn !== 'Summary visit report');
        }
    }

    private preparedMainRequestData() {
        this.mainRequestData = {
            requestDate: this.requestObject.requestDate,
            applicationNo: this.requestObject.applicationNo,
            stepNameAr: this.requestObject.serviceStep.stepNameAr,
            stepNameEn: this.requestObject.serviceStep.stepNameEn,
            statusNameAr: this.requestObject.serviceStep.statusNameAr,
            statusNameEn: this.requestObject.serviceStep.statusNameEn,
            slaAssigneeRole: this.requestObject.slaAssigneeRole.split(',')
        };
    }

    showMandatoryFieldErrorMessage() {
        // this.visitReportSubmissionDataSubject.next(true);
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }

    validateBeforeOpen(event: {action: string, content: any}, actionsComponent: ExternalReviewVisitReportsActionsComponent) {
        // Validate required fields before opening confirmation popup
        const visitReportSubmissionRequestInfo = this.requestObject.visitReportSubmissionRequestInfoDto;
        let isValid = true;

        // Check if fields are editable - use isEditMode from tab inputs (same condition as save())
        const isEditMode = this.visitReportsVisitDetailsTabInputs.get('isEditMode') === true;
        const isEditModeOverallSchoolPerformance = this.overallSchoolPerformanceTabInputs.get('isEditMode') === true;
        const isEditModeSafetyAndSecurity = this.safetyAndSecurityTabInputs.get('isEditMode') === true;
        const isEditModeSummaryVisitReport = this.summaryVisitReportTabInputs.get('isEditMode') === true;
        const isEditModeExternalReviewResults = this.externalReviewResultsTabInputs.get('isEditMode') === true;

        // Validate School Info fields - required when fields are editable (same validation as save())
        if (isEditMode === true) {
            const school = visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
            if (!school) {
                isValid = false;
            } else {
                // Validate School Name - check both nameAr and nameEn
                const nameAr = (school.nameAr || '').trim();
                const nameEn = (school.nameEn || '').trim();
                const schoolName = this.translate.currentLang === 'ar' ? nameAr : nameEn;
                if (!schoolName || schoolName === '' || schoolName.trim() === '') {
                    isValid = false;
                }

                // Validate School Code
                const schoolCode = (school.code || '').trim();
                if (!schoolCode || schoolCode === '') {
                    isValid = false;
                }

                // Validate School Type
                if (!school.type || school.type === null || school.type === undefined || school.type === '') {
                    isValid = false;
                }

                // Validate School Gender
                if (!school.gender || school.gender === null || school.gender === undefined || school.gender === '') {
                    isValid = false;
                }

                // Validate Grades
                const schoolClasses = (school.classes || '').trim();
                if (!schoolClasses || schoolClasses === '') {
                    isValid = false;
                }
            }
        }

        // Validate Introduction (المقدمة) - required when field is editable
        if (isEditMode === true) {
            const introduction = (visitReportSubmissionRequestInfo.otherUpdates || '').trim();
            if (!introduction || introduction === '') {
                isValid = false;
            }
        }

        // Validate Overall School Performance fields (when isEditMode is true)
        if (isEditModeOverallSchoolPerformance === true) {
            // Validate Strengths Analysis (أبرز جوانب القوة)
            const strengthsAnalysis = (visitReportSubmissionRequestInfo.strengthsAnalysis || '').trim();
            if (!strengthsAnalysis || strengthsAnalysis === '') {
                isValid = false;
            }

            // Validate Improvements Analysis (أبرز الجوانب التي تحتاج إلى تحسين)
            const improvementsAnalysis = (visitReportSubmissionRequestInfo.improvementsAnalysis || '').trim();
            if (!improvementsAnalysis || improvementsAnalysis === '') {
                isValid = false;
            }

            // Validate Recommendations (التوصيات)
            const recommendations = (visitReportSubmissionRequestInfo.recommendations || '').trim();
            if (!recommendations || recommendations === '') {
                isValid = false;
            }
        }

        // Validate Professional Judgment (الحكم المهنى) and Judgment Change Justification (مبررات تغيير الحكم) - required when field is editable (same validation as save())
        const canEditJudgmentAndJustification = this.overallSchoolPerformanceTabInputs.get('canEditJudgmentAndJustification') === true;
        if (canEditJudgmentAndJustification) {
            // Validate Professional Judgment - must be selected (not 0, null, or undefined)
            const professionalJudgment = visitReportSubmissionRequestInfo.overallProfessionalJudgment;
            if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                isValid = false;
            }

            // Validate Judgment Change Justification - required if professional judgment differs from system judgment
            const systemJudgment = visitReportSubmissionRequestInfo.overallSystemJudgment;
            const status = visitReportSubmissionRequestInfo.status;
            if (systemJudgment != null && professionalJudgment != null &&
                systemJudgment !== professionalJudgment &&
                status !== 'REPORT_REJECTED') {
                const judgmentChangeJustification = (visitReportSubmissionRequestInfo.judgmentChangeJustification || '').trim();
                if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                    isValid = false;
                }
            }
        }

        // Validate External Review Results fields (when isEditMode is true)
        if (isEditModeExternalReviewResults === true) {
            if (visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension) {
                for (const domainList of Object.values(visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension)) {
                    if (Array.isArray(domainList)) {
                        for (const domain of domainList) {
                            if (domain.standardEvaluations && Array.isArray(domain.standardEvaluations)) {
                                for (const standardEvaluation of domain.standardEvaluations) {
                                    const professionalJudgment = standardEvaluation.professionalJudgment;
                                    if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                                        isValid = false;
                                        break;
                                    }
                                    const systemJudgment = standardEvaluation.systemJudgment;
                                    if (systemJudgment != null && professionalJudgment != null &&
                                        systemJudgment !== professionalJudgment) {
                                        const judgmentChangeJustification = (standardEvaluation.judgmentChangeJustification || '').trim();
                                        if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                                            isValid = false;
                                            break;
                                        }
                                    }
                                }
                                if (!isValid) break;
                            }
                        }
                        if (!isValid) break;
                    }
                }
            }
        }

        // Validate Safety and Security Notes (ملاحظات حول الأمن والسلامة) - required when field is editable
        if (isEditModeSafetyAndSecurity === true) {
            const safetyAndSecurityNotes = (visitReportSubmissionRequestInfo.safetyAndSecurityNotes || '').trim();
            if (!safetyAndSecurityNotes || safetyAndSecurityNotes === '') {
                isValid = false;
            }
        }

        // Validate Summary Visit Report fields - required when fields are editable
        // Note: summaryKeyFindings, summaryImprovementsSuggestions, and summaryFutureEvents are intentionally not validated (ignored)
        // All Summary Visit Report fields validation is disabled

        if (!isValid) {
            this.showMandatoryFieldErrorMessage();
            return; // PREVENT OPENING POPUP - DO NOT PROCEED
        }

        // If validation passes, open confirmation popup
        actionsComponent.openConfirmationPopup(event.content);
    }

    submit(event: any) {
        // Validate required fields before submit (same validation as save) - for SUBMIT, APPROVE, RETURN_FOR_EDIT, SEND_TO_PROOFREADER, and SEND_TO_GM actions
        if (event.action === 'SUBMIT' || event.action === 'APPROVE' || event.action === 'RETURN_FOR_EDIT' || event.action === 'SEND_TO_PROOFREADER' || event.action === 'SEND_TO_GM') {
            const visitReportSubmissionRequestInfo = this.requestObject.visitReportSubmissionRequestInfoDto;
            let isValid = true;

            if (!this.requestObject.visitReportSubmissionRequestInfoDto.summaryKeyFindings || this.requestObject.visitReportSubmissionRequestInfoDto.summaryKeyFindings.trim() === ''
                || !this.requestObject.visitReportSubmissionRequestInfoDto.summaryImprovementsSuggestions || this.requestObject.visitReportSubmissionRequestInfoDto.summaryImprovementsSuggestions.trim() === ''
                || !this.requestObject.visitReportSubmissionRequestInfoDto.summaryFutureEvents || this.requestObject.visitReportSubmissionRequestInfoDto.summaryFutureEvents.trim() === ''){
                isValid = false
            }
            // Check if fields are editable - use isEditMode from tab inputs (same condition as save())
            const isEditMode = this.visitReportsVisitDetailsTabInputs.get('isEditMode') === true;
            const isEditModeOverallSchoolPerformance = this.overallSchoolPerformanceTabInputs.get('isEditMode') === true;
            const isEditModeSafetyAndSecurity = this.safetyAndSecurityTabInputs.get('isEditMode') === true;
            const isEditModeSummaryVisitReport = this.summaryVisitReportTabInputs.get('isEditMode') === true;
            const isEditModeExternalReviewResults = this.externalReviewResultsTabInputs.get('isEditMode') === true;

            // Validate School Info fields - required when fields are editable (same validation as save())
            if (isEditMode === true) {
                const school = visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
                if (!school) {
                    isValid = false;
                } else {
                    // Validate School Name - check both nameAr and nameEn
                    const nameAr = (school.nameAr || '').trim();
                    const nameEn = (school.nameEn || '').trim();
                    const schoolName = this.translate.currentLang === 'ar' ? nameAr : nameEn;
                    if (!schoolName || schoolName === '' || schoolName.trim() === '') {
                        isValid = false;
                    }

                    // Validate School Code
                    const schoolCode = (school.code || '').trim();
                    if (!schoolCode || schoolCode === '') {
                        isValid = false;
                    }

                    // Validate School Type
                    if (!school.type || school.type === null || school.type === undefined || school.type === '') {
                        isValid = false;
                    }

                    // Validate School Gender
                    if (!school.gender || school.gender === null || school.gender === undefined || school.gender === '') {
                        isValid = false;
                    }

                    // Validate Grades
                    const schoolClasses = (school.classes || '').trim();
                    if (!schoolClasses || schoolClasses === '') {
                        isValid = false;
                    }
                }
            }

            // Validate Introduction (المقدمة) - required when field is editable
            if (isEditMode === true) {
                const introduction = (visitReportSubmissionRequestInfo.otherUpdates || '').trim();
                if (!introduction || introduction === '') {
                    isValid = false;
                }
            }

            // Validate Overall School Performance fields (when isEditMode is true)
            if (isEditModeOverallSchoolPerformance === true) {
                // Validate Strengths Analysis (أبرز جوانب القوة)
                const strengthsAnalysis = (visitReportSubmissionRequestInfo.strengthsAnalysis || '').trim();
                if (!strengthsAnalysis || strengthsAnalysis === '') {
                    isValid = false;
                }

                // Validate Improvements Analysis (أبرز الجوانب التي تحتاج إلى تحسين)
                const improvementsAnalysis = (visitReportSubmissionRequestInfo.improvementsAnalysis || '').trim();
                if (!improvementsAnalysis || improvementsAnalysis === '') {
                    isValid = false;
                }

                // Validate Recommendations (التوصيات)
                const recommendations = (visitReportSubmissionRequestInfo.recommendations || '').trim();
                if (!recommendations || recommendations === '') {
                    isValid = false;
                }
            }

            // Validate Professional Judgment (الحكم المهنى) and Judgment Change Justification (مبررات تغيير الحكم) - required when field is editable (same validation as save())
            const canEditJudgmentAndJustification = this.overallSchoolPerformanceTabInputs.get('canEditJudgmentAndJustification') === true;
            if (canEditJudgmentAndJustification) {
                // Validate Professional Judgment - must be selected (not 0, null, or undefined)
                const professionalJudgment = visitReportSubmissionRequestInfo.overallProfessionalJudgment;
                if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                    isValid = false;
                }

                // Validate Judgment Change Justification if judgments differ and status is not REPORT_REJECTED
                const systemJudgment = visitReportSubmissionRequestInfo.overallSystemJudgment;
                const status = visitReportSubmissionRequestInfo.status;

                if (systemJudgment != null && professionalJudgment != null &&
                    systemJudgment !== professionalJudgment &&
                    status !== 'REPORT_REJECTED') {
                    const judgmentChangeJustification = (visitReportSubmissionRequestInfo.judgmentChangeJustification || '').trim();
                    if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                        isValid = false;
                    }
                }
            }

            // Validate External Review Results - all domains (when isEditMode is true) - same validation as save()
            if (isEditModeExternalReviewResults === true) {
                Object.values(visitReportSubmissionRequestInfo.groupedDomainEvaluationDimension || {}).forEach((domainList: unknown) => {
                    const domainArray = domainList as any[];
                    domainArray.forEach((domain: any) => {
                        // Validate Professional Judgment and Judgment Change Justification for each standard if field is editable
                        const canEditJudgmentAndJustification = this.externalReviewResultsTabInputs.get('canEditJudgmentAndJustification') === true;
                        if (canEditJudgmentAndJustification) {
                            domain.standardEvaluations?.forEach((standardEvaluation: any) => {
                                // Validate Professional Judgment - must be selected (not 0, null, or undefined)
                                const professionalJudgment = standardEvaluation.professionalJudgment;
                                if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                                    isValid = false;
                                }

                                // Validate Judgment Change Justification if judgments differ
                                const systemJudgment = standardEvaluation.systemJudgment;
                                if (systemJudgment != null && professionalJudgment != null &&
                                    systemJudgment !== professionalJudgment) {
                                    const judgmentChangeJustification = (standardEvaluation.judgmentChangeJustification || '').trim();
                                    if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                                        isValid = false;
                                    }
                                }
                            });
                        }

                        // Validate Strengths Analysis
                        const domainStrengthsAnalysis = (domain.strengthsAnalysis || '').trim();
                        if (!domainStrengthsAnalysis || domainStrengthsAnalysis === '') {
                            isValid = false;
                        }

                        // Validate Improvements Analysis
                        const domainImprovementsAnalysis = (domain.improvementsAnalysis || '').trim();
                        if (!domainImprovementsAnalysis || domainImprovementsAnalysis === '') {
                            isValid = false;
                        }

                        // Validate Domain Summary
                        const domainSummary = (domain.domainSummary || '').trim();
                        if (!domainSummary || domainSummary === '') {
                            isValid = false;
                        }
                    });
                });
            }

            // Validate Safety and Security Notes (ملاحظات حول الأمن والسلامة) - required when field is editable
            if (isEditModeSafetyAndSecurity === true) {
                const safetyAndSecurityNotes = (visitReportSubmissionRequestInfo.safetyAndSecurityNotes || '').trim();
                if (!safetyAndSecurityNotes || safetyAndSecurityNotes === '') {
                    isValid = false;
                }
            }

            // Validate Summary Visit Report fields - required when fields are editable
            // Note: summaryKeyFindings, summaryImprovementsSuggestions, and summaryFutureEvents are intentionally not validated (ignored)
            // All Summary Visit Report fields validation is disabled

            if (!isValid) {
            this.showMandatoryFieldErrorMessage();
                return; // PREVENT SUBMIT - DO NOT PROCEED
            }
        }

        const sendObject: VisitReportCompletionRequest = {
            visitReportSubmissionRequestInfoDto: this.requestObject.visitReportSubmissionRequestInfoDto,
            action: event.action,
            comment: event.comment,
            taskId: this.taskId
        };

        this.externalReviewVisitReportsService.completeVisitPlanProcess(sendObject).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: event.action}
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

    prepareImportedFormsForDomainAndSafety() {
        if (this.requestObject.visitReportSubmissionRequestInfoDto.scheduledSchoolVisit?.id) {
            let visitId = this.requestObject.visitReportSubmissionRequestInfoDto.scheduledSchoolVisit?.id;
            this.prepareDomainSummaryForOverAllPerformanceTab(visitId);
            if (!this.schoolView) this.prepareSafetyAndSecurityForms(visitId);
            else this.safetyAndSecurityTabInputs.set('importedSafetyForms', []);
        }
    }

    prepareDomainSummaryForOverAllPerformanceTab(visitId: number) {
        this.importDomainSummaryFormsService.importDomainSummaryForms(visitId)
            .subscribe(data => this.overallSchoolPerformanceTabInputs.set('importedDomainSummary', data))
    }

    prepareSafetyAndSecurityForms(visitId: number) {
        this.safetyAndSecurityService.getImportVisitFormsByScheduledSchoolVisitIdAndFormType(visitId, 'GENERAL_EVIDENCE')
            .subscribe(data => {
                this.safetyAndSecurityTabInputs.set('importedSafetyForms', data);
            })
    }

    generateReportDocument(reportDownloaderEvent: ReportDownloaderEvent): void {
        this.visitReportDocumentDownloaderService.generateReportDocument(this.requestObject.visitReportSubmissionRequestInfoDto, reportDownloaderEvent);
    }
}
