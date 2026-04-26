import {Component} from '@angular/core';
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

@Component({
    selector: 'external-review-visit-reports-details',
    templateUrl: './external-review-visit-reports-details.component.html',
    styleUrl: './external-review-visit-reports-details.component.scss'
})
export class ExternalReviewVisitReportsDetailsComponent {
    protected readonly Permission = Permission;

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
        // {
        //     labelAr: 'تقرير الزيارة المختصر',
        //     labelEn: 'Summary visit report',
        //     component: SummaryVisitReportTabComponent,
        //     inputs: this.summaryVisitReportTabInputs
        // },
        {
            labelAr: 'الملاحق',
            labelEn: 'Appendices',
            component: AppendicesTabComponent,
            inputs: this.appendicesTabInputs
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
        this.id = this.route.snapshot.paramMap.get('id');
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
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

    preparedStepsInputs() {
        this.visitReportsVisitDetailsTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.overallSchoolPerformanceTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.summaryVisitReportTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.externalReviewResultsTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.safetyAndSecurityTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.appendicesTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);
        this.readonlyeportReadingGuideTabInputs.set('visitReportSubmissionRequestInfo', this.requestObject.visitReportSubmissionRequestInfoDto);

        if (['VISIT_REPORT_RETURN_FOR_EDIT'].includes(this.requestObject.serviceStep.stepCode)) {
            this.overallSchoolPerformanceTabInputs.set('canEditJudgmentAndJustification', true);
            this.externalReviewResultsTabInputs.set('canEditJudgmentAndJustification', true);
        }

        if (['VISIT_REPORT_RETURN_FOR_EDIT', 'VISIT_REPORT_PROOFREADER_REVIEW', 'VISIT_REPORT_QUALITY_FINAL_REVIEW', 'VISIT_REPORT_QUALITY_INITIAL_REVIEW']
            .includes(this.requestObject.serviceStep.stepCode)) {
            this.visitReportsVisitDetailsTabInputs.set('isEditMode', true);
            this.overallSchoolPerformanceTabInputs.set('isEditMode', true);
            this.summaryVisitReportTabInputs.set('isEditMode', true);
            this.externalReviewResultsTabInputs.set('isEditMode', true);
            this.safetyAndSecurityTabInputs.set('isEditMode', true);
            this.appendicesTabInputs.set('isEditMode', true);
            this.readonlyeportReadingGuideTabInputs.set('isEditMode', true);

        }

        if (this.requestObject.serviceStep.stepCode == 'VISIT_REPORT_SCHOOL_REVIEW'
            || (this.authService.getUserClaim()?.permissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW) && !this.taskId)) {
            this.schoolView = true;
            this.tabs = this.tabs.filter((tab: TabItem) => tab.labelEn != 'External Review Results');
            this.overallSchoolPerformanceTabInputs.set('schoolView', this.schoolView);
            this.summaryVisitReportTabInputs.set('schoolView', this.schoolView);
            this.safetyAndSecurityTabInputs.set('schoolView', this.schoolView);
            this.summaryVisitReportTabInputs.set('showAttachments', false);
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

    submit(event: any) {
        // if (event.action == 'SUBMIT' && (!this.requestObject.visitReportSubmissionRequestInfoDto.summaryKeyFindings || this.requestObject.visitReportSubmissionRequestInfoDto.summaryKeyFindings.trim() === ''
        //     || !this.requestObject.visitReportSubmissionRequestInfoDto.summaryImprovementsSuggestions || this.requestObject.visitReportSubmissionRequestInfoDto.summaryImprovementsSuggestions.trim() === ''
        //     || !this.requestObject.visitReportSubmissionRequestInfoDto.summaryFutureEvents || this.requestObject.visitReportSubmissionRequestInfoDto.summaryFutureEvents.trim() === '')) {
        //     this.showMandatoryFieldErrorMessage();
        //     return;
        // }
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
