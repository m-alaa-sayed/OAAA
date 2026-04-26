import {Component} from '@angular/core';
import {
    SummaryVisitReportsVisitDetailsTabComponent
} from './tabs/summary-visit-reports-visit-details-tab/summary-visit-reports-visit-details-tab.component';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {SummaryAppendicesTabComponent} from './tabs/summary-appendices-tab/summary-appendices-tab.component';
import {
    SummaryOverallSchoolPerformanceTabComponent
} from './tabs/summary-overall-school-performance-tab/summary-overall-school-performance-tab.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {VisitReportSummaryService} from '../../service/visit-report-summary.service';
import {SummaryVisitReportCompletionRequest} from '../../types/summary-visit-Report-completion-request';

@Component({
    selector: 'visit-report-summary-details',
    templateUrl: './visit-report-summary-details.component.html',
    styleUrl: './visit-report-summary-details.component.scss'
})
export class VisitReportSummaryDetailsComponent {

    id: string | null = '';
    taskId: any = null;
    requestObject: any;
    mainRequestData: any;
    showTabs: boolean = false;
    isSubmitted: boolean = false;
    schoolView: boolean = false;
    // tabs input map
    visitReportsVisitDetailsTabInputs = new Map<string, any>();
    overallSchoolPerformanceTabInputs = new Map<string, any>();
    appendicesTabInputs = new Map<string, any>();


    // tabs
    tabs: TabItem[] = [

        {
            labelAr: 'تفاصيل الزيارة',
            labelEn: 'Visit Details',
            component: SummaryVisitReportsVisitDetailsTabComponent,
            inputs: this.visitReportsVisitDetailsTabInputs
        },
        {
            labelAr: 'الأداء العام للمدرسة',
            labelEn: 'Overall School Performance',
            component: SummaryOverallSchoolPerformanceTabComponent,
            inputs: this.overallSchoolPerformanceTabInputs
        }, {
            labelAr: 'الملاحق',
            labelEn: 'Appendices',
            component: SummaryAppendicesTabComponent,
            inputs: this.appendicesTabInputs
        }
    ];


    constructor(private route: ActivatedRoute,
                private visitReportSummaryService: VisitReportSummaryService,
                private toastService: ToastService,
                public translate: TranslateService,
                private router: Router
    ) {
    }


    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
        this.visitReportSummaryService.getReportDetailsByRequestId(this.id, this.taskId).subscribe({
            next: (response) => {
                this.requestObject = response.data;
                this.preparedMainRequestData();
                this.preparedStepsInputs();
                this.showTabs = true;
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });

    }


    preparedStepsInputs() {

        this.visitReportsVisitDetailsTabInputs.set('summaryVisitReportSubmissionRequestInfo', this.requestObject.summaryVisitReportSubmissionRequestInfoDto);
        this.overallSchoolPerformanceTabInputs.set('summaryVisitReportSubmissionRequestInfo', this.requestObject.summaryVisitReportSubmissionRequestInfoDto);
        this.appendicesTabInputs.set('summaryVisitReportSubmissionRequestInfo', this.requestObject.summaryVisitReportSubmissionRequestInfoDto);


        if (['SUMMARY_VISIT_REPORT_RETURN_FOR_EDIT', 'SUMMARY_VISIT_REPORT_PROOFREADER_REVIEW', 'SUMMARY_VISIT_REPORT_QUALITY_FINAL_REVIEW', 'SUMMARY_VISIT_REPORT_QUALITY_INITIAL_REVIEW']
            .includes(this.requestObject.serviceStep.stepCode)) {
            this.visitReportsVisitDetailsTabInputs.set('isEditMode', true);
            this.overallSchoolPerformanceTabInputs.set('isEditMode', true);
            this.appendicesTabInputs.set('isEditMode', true);
        }
        if (this.requestObject.serviceStep.stepCode == 'SUMMARY_VISIT_REPORT_SCHOOL_REVIEW') {
            this.schoolView = true
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
        };
    }


    submit(event: any) {
        const sendObject: SummaryVisitReportCompletionRequest = {
            summaryVisitReportSubmissionRequestInfoDto: this.requestObject.summaryVisitReportSubmissionRequestInfoDto,
            action: event.action,
            comment: event.comment,
            taskId: this.taskId
        };

        this.visitReportSummaryService.completeSummaryVisitReportProcess(sendObject).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: event.action}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }
}
