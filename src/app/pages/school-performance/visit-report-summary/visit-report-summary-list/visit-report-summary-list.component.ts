import { Component, OnInit } from '@angular/core';
import { SummaryVisitReportRequestsOverview } from '../../types/summary-visit-report-requests-overview';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { ExternalReviewVisitReportsService } from '../../service/external-review-visit-reports.service';
import { VisitReportSummaryService } from '../../service/visit-report-summary.service';

@Component({
  selector: 'visit-report-summary-list',
  templateUrl: './visit-report-summary-list.component.html',
  styleUrl: './visit-report-summary-list.component.scss'
})
export class VisitReportSummaryListComponent implements OnInit {

  summaryVisitReportRequestsOverviewList: SummaryVisitReportRequestsOverview[] = [];
  columns: any[] = [];
  actions: any[] = [];

  constructor(public translate: TranslateService,
    private router: Router,
    private visitReportSummaryService: VisitReportSummaryService,
    public toastService: ToastService
  ) { }


  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.getCurrentSummaryReports();
  }



  getCurrentSummaryReports(): void {
    this.visitReportSummaryService.getCurrentSummaryReports().subscribe({
      next: (res) => this.summaryVisitReportRequestsOverviewList = res.data || [],
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  //-- prepare grid cols 
  private prepareGridHeaderCols() {
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
        field: 'reportNumber',
        headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.REPORT_NUMBER',

      },
      {
        field: 'summaryReportNumber',
        headerName: 'PAGES.VISIT_REPORTS_SUMMARY.LABELS.SUMMARY_REPORT_NUMBER',

      },
      {
        field: 'reportSubmissionDate',
        headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.DATE',

      },

      {
        field: 'performanceLevel',
        headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.PERFORMANCE_LEVEL',

      },
      {
        field: 'reportStatus',
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
        callback: (row: any) => this.openDetails(row)

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
    }
    this.router.navigate(['/jawda/school-performance/visit-report-summary/creation', row.data.id || 1]);
  }

}
