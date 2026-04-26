import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {VisitReportRequestsOverview} from '../../types/visit-report-requests-overview';
import {ExternalReviewVisitReportsService} from '../../service/external-review-visit-reports.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {Permission} from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'external-review-visit-reports-list',
    templateUrl: './external-review-visit-reports-list.component.html',
    styleUrl: './external-review-visit-reports-list.component.scss'
})
export class ExternalReviewVisitReportsListComponent implements OnInit {

    visitReportRequestsOverviewList: VisitReportRequestsOverview[] = [];
    columns: any[] = [];
    actions: any[] = [];

    constructor(public translate: TranslateService,
                private router: Router,
                private externalReviewVisitReportsService: ExternalReviewVisitReportsService,
                public toastService: ToastService,
                private authService: AuthService,
    ) {
    }


    ngOnInit(): void {
        this.prepareGridHeaderCols();
        this.getCurrentReports();
    }

    getCurrentReports(): void {
        this.externalReviewVisitReportsService.getCurrentReports().subscribe({
            next: (res) => this.visitReportRequestsOverviewList = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    //-- prepare grid cols
    private prepareGridHeaderCols() {
        const userPermissions = this.authService.getUserClaim()?.permissions ?? [];

        this.columns = [
            {
                field: 'selfEvaluationDocumentNumber',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SELF_EVALUATION_DOCUMENT_NUMBER',
                width: 170
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolNameAr' : 'schoolNameEn',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHOOL_NAME',
            },
            {
                field: 'schoolType',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.TYPE',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.schoolType);
                },
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolGovernorateAr' : 'schoolGovernorateEn',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.GOVERNORATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'wilayatAr' : 'wilayatEn',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.WILAYAT',

            },
            {
                field: 'numberOfStudents',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.NUMBER_OF_STUDENTS',

            }, {
                field: 'studentsGender',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.GENDER',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.studentsGender);
                },
            },
            {
                field: 'grades',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.GRADES',
                width: 250

            },
            {
                field: 'visitNumber',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHEDULE_NUMBER',

            },
            {
                field: 'planNumber',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.PLAN_NUMBER',

            },
            {
                field: 'reportNumber',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.REPORT_NUMBER',

            },
            {
                field: 'reportSubmissionDate',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.DATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'reporterNameAr' : 'reporterNameEn',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.REPORT_SUBMITTER',

            },
            {
                field: 'performanceLevel',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.PERFORMANCE_LEVEL',

            },
            {
                field: 'visitStatus',
                headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.STATUS',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.reportStatus);
                },
            },

        ];

        this.actions = [
            {
                label: 'details',
                icon: 'ri-eye-fill',
                callback: (row: any) => this.openDetails(row),
                show: () => userPermissions.includes(Permission.VISIT_REPORT_VIEW_DETAILS)

            },
        ];
    }

    openDetails(row: any) {
        if (row.data.reportStatus === 'REPORT_VISIT_CANCELED') {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_VIEWING_REPORT_DUE_TO_VISIT_CANCELLATION'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            return;
        } else if (row.data.reportStatus === 'APPROVED') {
            this.router.navigate(['/jawda/school-performance/external-review-visit-reports/request-details', row.data.requestId || 1]);
            return;
        }
        this.router.navigate(['/jawda/school-performance/external-review-visit-reports/creation', row.data.id || 1]);
    }

    addNewReport() {
        this.router.navigate(['/jawda/school-performance/external-review-visit-reports/new-report']);
    }

    protected readonly Permission = Permission;
}
