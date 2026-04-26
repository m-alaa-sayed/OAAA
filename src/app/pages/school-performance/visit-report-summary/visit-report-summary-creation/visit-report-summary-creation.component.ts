import {Component, OnInit} from '@angular/core';
import {
    SummaryVisitReportsVisitDetailsStepComponent
} from './steps/summary-visit-reports-visit-details-step/summary-visit-reports-visit-details-step.component';
import {
    SummaryOverallSchoolPerformanceStepComponent
} from './steps/summary-overall-school-performance-step/summary-overall-school-performance-step.component';
import {SummaryAppendicesStepComponent} from './steps/summary-appendices-step/summary-appendices-step.component';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {SummaryVisitReportSubmissionRequestInfo} from '../../types/summary-visit-report-submission-request-info';
import {VisitReportSummaryService} from '../../service/visit-report-summary.service';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
    selector: 'visit-report-summary-creation',
    templateUrl: './visit-report-summary-creation.component.html',
    styleUrl: './visit-report-summary-creation.component.scss'
})
export class VisitReportSummaryCreationComponent implements OnInit {

    summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

    id !: number;
    showSteps: boolean = false;

    visitReportsVisitDetailsStepInputs = new Map<string, any>();
    overallSchoolPerformanceStepInputs = new Map<string, any>();
    appendicesStepInputs = new Map<string, any>();

    steps: StepItem[] = [
        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: SummaryVisitReportsVisitDetailsStepComponent,
            inputs: this.visitReportsVisitDetailsStepInputs
        },
        {
            labelAr: 'الأداء العام للمدرسة',
            labelEn: 'Overall School Performance',
            component: SummaryOverallSchoolPerformanceStepComponent,
            inputs: this.overallSchoolPerformanceStepInputs
        },
        {
            labelAr: 'الملاحق',
            labelEn: 'Appendices',
            component: SummaryAppendicesStepComponent,
            inputs: this.appendicesStepInputs
        }
    ];

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private visitReportSummaryService: VisitReportSummaryService) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
        if (this.id) {
            this.getSummaryReportDetailsById();
        }
    }

    getSummaryReportDetailsById() {
        this.visitReportSummaryService.getSummaryReportDetailsById(this.id).subscribe({
            next: (response) => {
                this.summaryVisitReportSubmissionRequestInfo = response.data;
                this.preparedStepsInputs();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    private preparedStepsInputs() {
        this.showSteps = true;
        this.visitReportsVisitDetailsStepInputs.set('summaryVisitReportSubmissionRequestInfo', this.summaryVisitReportSubmissionRequestInfo);
        this.overallSchoolPerformanceStepInputs.set('summaryVisitReportSubmissionRequestInfo', this.summaryVisitReportSubmissionRequestInfo);
        this.appendicesStepInputs.set('summaryVisitReportSubmissionRequestInfo', this.summaryVisitReportSubmissionRequestInfo);

        if (this.summaryVisitReportSubmissionRequestInfo.request?.id) {
            this.visitReportsVisitDetailsStepInputs.set('showSaveBtn', false);
            this.overallSchoolPerformanceStepInputs.set('showSaveBtn', false);
            this.appendicesStepInputs.set('showSaveBtn', false);

            this.overallSchoolPerformanceStepInputs.set('isEditMode', false);
            this.appendicesStepInputs.set('isEditMode', false);
        } else {
            this.visitReportsVisitDetailsStepInputs.set('showSaveBtn', true);
            this.overallSchoolPerformanceStepInputs.set('showSaveBtn', true);
            this.appendicesStepInputs.set('showSaveBtn', true);

            this.visitReportsVisitDetailsStepInputs.set('isEditMode', true);
            this.overallSchoolPerformanceStepInputs.set('isEditMode', true);
            this.appendicesStepInputs.set('isEditMode', true);
        }
    }
}
