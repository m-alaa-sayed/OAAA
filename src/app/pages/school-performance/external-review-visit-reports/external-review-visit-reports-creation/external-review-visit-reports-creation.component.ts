import {Component, OnInit} from '@angular/core';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {AuthService} from 'src/app/core/services/auth.service';
import {
    VisitReportsVisitDetailsStepComponent
} from './steps/visit-reports-visit-details-step/visit-reports-visit-details-step.component';
import {
    OverallSchoolPerformanceStepComponent
} from './steps/overall-school-performance-step/overall-school-performance-step.component';
import {
    ExternalReviewResultsStepComponent
} from './steps/external-review-results-step/external-review-results-step.component';
import {SafetyAndSecurityStepComponent} from './steps/safety-and-security-step/safety-and-security-step.component';
import {AppendicesStepComponent} from './steps/appendices-step/appendices-step.component';
import {ReportReadingGuideStepComponent} from './steps/report-reading-guide-step/report-reading-guide-step.component';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewVisitReportsService} from '../../service/external-review-visit-reports.service';
import {VisitReportSubmissionRequestInfo} from '../../types/visit-report-submission-request-info';
import {ImportDomainSummaryFormsService} from "../services/import-domain-summary-forms.service";
import {SafetyAndSecurityService} from "../services/safety-and-security.service";
import {VisitReportDocumentDownloaderService} from "../services/visit-report-document-downloader.service";
import {SummaryVisitReportComponent} from "./components/summary-visit-report/summary-visit-report.component";
import {SummaryVisitReportStepComponent} from "./steps/summary-visit-report-step/summary-visit-report-step.component";
import {ReportDownloaderEvent} from "./components/report-document-downloader/report-document-downloader.component";
import { Permission } from 'src/app/core/enum/permission';

@Component({
    selector: 'external-review-visit-reports-creation',
    templateUrl: './external-review-visit-reports-creation.component.html',
    styleUrl: './external-review-visit-reports-creation.component.scss'
})
export class ExternalReviewVisitReportsCreationComponent implements OnInit {

    visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

    id !: number;
    visitId !: number;
    showSteps: boolean = false;
    schoolView: boolean = false;

    visitReportsVisitDetailsStepInputs = new Map<string, any>();
    overallSchoolPerformanceStepInputs = new Map<string, any>();
    summaryVisitReportInputs = new Map<string, any>();
    externalReviewResultsStepInputs = new Map<string, any>();
    safetyAndSecurityStepInputs = new Map<string, any>();
    appendicesStepInputs = new Map<string, any>();
    readonlyeportReadingGuideStepInputs = new Map<string, any>();
    mainRequestData: any;


    steps: StepItem[] = [
        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: VisitReportsVisitDetailsStepComponent,
            inputs: this.visitReportsVisitDetailsStepInputs
        },
        {
            labelAr: 'الأداء العام للمدرسة',
            labelEn: 'Overall School Performance',
            component: OverallSchoolPerformanceStepComponent,
            inputs: this.overallSchoolPerformanceStepInputs
        },
        {
            labelAr: 'نتائج المراجعة الخارجية',
            labelEn: 'External Review Results',
            component: ExternalReviewResultsStepComponent,
            inputs: this.externalReviewResultsStepInputs
        },
        {
            labelAr: 'الأمن والسلامة',
            labelEn: 'Safety and Security',
            component: SafetyAndSecurityStepComponent,
            inputs: this.safetyAndSecurityStepInputs
        },
        // {
        //     labelAr: 'تقرير الزيارة المختصر',
        //     labelEn: 'Summary visit report',
        //     component: SummaryVisitReportStepComponent,
        //     inputs: this.summaryVisitReportInputs
        // },
        {
            labelAr: 'الملاحق',
            labelEn: 'Appendices',
            component: AppendicesStepComponent,
            inputs: this.appendicesStepInputs
        },
        {
            labelAr: 'مفاتيح قراءة التقرير',
            labelEn: 'Report Reading Guide',
            component: ReportReadingGuideStepComponent,
            inputs: this.readonlyeportReadingGuideStepInputs
        }
    ];


    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        public importDomainSummaryFormsService: ImportDomainSummaryFormsService,
        public safetyAndSecurityService: SafetyAndSecurityService,
        private externalReviewVisitReportsService: ExternalReviewVisitReportsService,
        private visitReportDocumentDownloaderService: VisitReportDocumentDownloaderService,
        private authService: AuthService) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
        if (this.id) {
            this.getReportDetailsById();
        } else {
            const stateData = window.history.state;
            if (stateData?.visitId) {
                this.visitId = stateData?.visitId;
                this.getInitialReportView();
            }
        }

    }


    getReportDetailsById() {
        this.externalReviewVisitReportsService.getReportDetailsById(this.id).subscribe({
            next: (response) => {
                this.visitReportSubmissionRequestInfo = response.data;
                this.preparedMainRequestData();
                this.preparedStepsInputs();
                if (this.authService.getUserClaim()?.permissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW) ) {
                        this.schoolView = true;
                    }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }


    getInitialReportView() {
        this.externalReviewVisitReportsService.getInitialReportView(this.visitId).subscribe({
            next: (response) => {
                this.visitReportSubmissionRequestInfo = response.data;
                this.preparedStepsInputs();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }


    private preparedStepsInputs() {
        this.showSteps = true;
        this.visitReportsVisitDetailsStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.overallSchoolPerformanceStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.summaryVisitReportInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.externalReviewResultsStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.safetyAndSecurityStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.appendicesStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);
        this.readonlyeportReadingGuideStepInputs.set('visitReportSubmissionRequestInfo', this.visitReportSubmissionRequestInfo);

        if (this.visitReportSubmissionRequestInfo.request?.id) {
            this.visitReportsVisitDetailsStepInputs.set('isEditMode', false);
            this.overallSchoolPerformanceStepInputs.set('isEditMode', false);
            this.summaryVisitReportInputs.set('isEditMode', false);
            this.externalReviewResultsStepInputs.set('isEditMode', false);
            this.safetyAndSecurityStepInputs.set('isEditMode', false);
            this.appendicesStepInputs.set('isEditMode', false);
            this.overallSchoolPerformanceStepInputs.set('canEditJudgmentAndJustification', false);
            this.externalReviewResultsStepInputs.set('canEditJudgmentAndJustification', false);

            this.visitReportsVisitDetailsStepInputs.set('showSaveBtn', false);
            this.overallSchoolPerformanceStepInputs.set('showSaveBtn', false);
            this.summaryVisitReportInputs.set('showSaveBtn', false);
            this.externalReviewResultsStepInputs.set('showSaveBtn', false);
            this.safetyAndSecurityStepInputs.set('showSaveBtn', false);
            this.appendicesStepInputs.set('showSaveBtn', false);
            this.readonlyeportReadingGuideStepInputs.set('showSaveBtn', false);
        } else {
            this.visitReportsVisitDetailsStepInputs.set('isEditMode', true);
            this.overallSchoolPerformanceStepInputs.set('isEditMode', true);
            this.summaryVisitReportInputs.set('isEditMode', true);
            this.externalReviewResultsStepInputs.set('isEditMode', true);
            this.safetyAndSecurityStepInputs.set('isEditMode', true);
            this.appendicesStepInputs.set('isEditMode', true);
            this.overallSchoolPerformanceStepInputs.set('canEditJudgmentAndJustification', true);
            this.externalReviewResultsStepInputs.set('canEditJudgmentAndJustification', true);
            this.visitReportsVisitDetailsStepInputs.set('showSaveBtn', true);
            this.overallSchoolPerformanceStepInputs.set('showSaveBtn', true);
            this.summaryVisitReportInputs.set('showSaveBtn', true);
            this.externalReviewResultsStepInputs.set('showSaveBtn', true);
            this.safetyAndSecurityStepInputs.set('showSaveBtn', true);
            this.appendicesStepInputs.set('showSaveBtn', true);
            this.readonlyeportReadingGuideStepInputs.set('showSaveBtn', true);
        }
        this.prepareImportedFormsForDomainAndSafety();
    }

    prepareImportedFormsForDomainAndSafety() {
        if (this.visitReportSubmissionRequestInfo?.scheduledSchoolVisit?.id) {
            this.prepareDomainSummaryForOverAllPerformanceTab(this.visitReportSubmissionRequestInfo?.scheduledSchoolVisit?.id);
            this.prepareSafetyAndSecurityForms(this.visitReportSubmissionRequestInfo?.scheduledSchoolVisit?.id);
        }
    }

    prepareDomainSummaryForOverAllPerformanceTab(visitId: number) {
        this.importDomainSummaryFormsService.importDomainSummaryForms(visitId)
            .subscribe(data => this.overallSchoolPerformanceStepInputs.set('importedDomainSummary', data))
    }

    prepareSafetyAndSecurityForms(visitId: number) {
        console.log('prepareSafetyAndSecurityForms ', visitId);
        this.safetyAndSecurityService.getImportVisitFormsByScheduledSchoolVisitIdAndFormType(visitId, 'GENERAL_EVIDENCE')
            .subscribe(data => {
                this.safetyAndSecurityStepInputs.set('importedSafetyForms', data);
            })
    }

    generateReportDocument(reportDownloaderEvent: ReportDownloaderEvent) {
        this.visitReportDocumentDownloaderService.generateReportDocument(this.visitReportSubmissionRequestInfo, reportDownloaderEvent);
    }

    private preparedMainRequestData() {
        this.mainRequestData = {
            requestDate: this.visitReportSubmissionRequestInfo.request?.requestDate,
            applicationNo: this.visitReportSubmissionRequestInfo.request?.applicationNo,
            stepNameAr: this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepNameAr,
            stepNameEn:this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepNameEn,
            statusNameAr: this.visitReportSubmissionRequestInfo.request?.serviceStep?.statusNameAr,
            statusNameEn: this.visitReportSubmissionRequestInfo.request?.serviceStep?.statusNameEn,
            slaAssigneeRole: this.visitReportSubmissionRequestInfo.request?.slaAssigneeRole?.split(',')
        };
    }
}
