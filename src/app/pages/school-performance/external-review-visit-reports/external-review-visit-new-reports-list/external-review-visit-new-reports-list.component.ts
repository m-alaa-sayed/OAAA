import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewVisitReportsService} from '../../service/external-review-visit-reports.service';
import {VisitReportRequestsOverview} from '../../types/visit-report-requests-overview';

@Component({
  selector: 'external-review-visit-new-reports-list',
  templateUrl: './external-review-visit-new-reports-list.component.html',
  styleUrl: './external-review-visit-new-reports-list.component.scss'
})
export class ExternalReviewVisitNewReportsListComponent implements OnInit {

  visitReportRequestsOverviewList: VisitReportRequestsOverview[] = [];
  columns: any[] = [];
  actions: any[] = [];


  constructor(public translate: TranslateService,
    private router: Router,
    private externalReviewVisitReportsService: ExternalReviewVisitReportsService,
    public toastService: ToastService
  ) { }


  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.availableForReporting();
  }

  private availableForReporting(): void {
    this.externalReviewVisitReportsService.availableForReporting().subscribe({
      next: (res) => this.visitReportRequestsOverviewList = res.data || [],
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

      },
      {
        field: 'studentsGender',
        headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.GENDER',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.studentsGender?.toUpperCase());
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
        field: 'visitFrom',
        headerName: 'PAGES.QUALITY_ASSURANCE.LABELS.VISIT_FROM',

      },
      {
        field: 'visitTo',
        headerName: 'PAGES.QUALITY_ASSURANCE.LABELS.VISIT_TO',

      },
      {
        field: 'visitStatus',
        headerName: 'PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.STATUS',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.visitStatus);
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
    this.router.navigate(['/jawda/school-performance/external-review-visit-reports/creation']
      , {
        state: { visitId: row.data.id }
      });
  }

}
