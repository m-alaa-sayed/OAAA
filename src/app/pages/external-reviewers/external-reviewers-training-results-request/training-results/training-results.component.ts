import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExternalReviewersTrainingService} from '../../services/external-reviewers-training.service';
import {ExternalReviewerTrainingResultRequest} from '../../types/external-reviewer-training-result-request';
import {ToastService} from 'src/app/core/services/toast-service';
import {getServiceCodeByModule} from 'src/app/shared/utils/module-service-map';
import {Permission} from 'src/app/core/enum/permission';
import {ColumnFilterService} from '../../../../shared/services/column-filter.service';
import {ExternalReviewerRequestService} from '../../services/external-reviewer-request.service';

@Component({
  selector: 'app-training-results',
  templateUrl: './training-results.component.html',
  styleUrl: './training-results.component.scss'
})
export class TrainingResultsComponent implements OnInit {
  externalReviewerTrainingResultRequestList: ExternalReviewerTrainingResultRequest[] = [];
  columns: any[] = [];
  actions: any;
  serviceCode: string = "";
  module: string = "";
  columnFilterOptions: { [key: string]: string[] } = {};

    protected readonly Permission = Permission;
  


  constructor(
    public translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private externalReviewersTrainingService: ExternalReviewersTrainingService,
    private columnFilterService: ColumnFilterService,
    private externalReviewerRequestService: ExternalReviewerRequestService
  ) {
    this.module = this.route.snapshot.paramMap.get('module') || '';
    this.serviceCode = getServiceCodeByModule(this.module) || "";
  }

  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.getPreviousRequest();
  }

  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'applicationNo',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICATION_NO',
        cellStyle: { textAlign: 'center' },
        width: 250
      },
      {
        field: 'requestDate',
        headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.REQUEST_DATE',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'applicantUser.fullNameAr',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICANT_USER',
        cellStyle: { textAlign: 'center' },
        width: 200
      },
      {
        field: 'applicantUser.email',
        headerName: 'PAGES.COMMON.LABELS.EMAIL',
        cellStyle: { textAlign: 'center' },
          width: 200
      },
      {
        field: 'externalReviewerTrainingResultList.length',
        headerName: 'PAGES.TRAINING_RESULTS.LABELS.NUMBER_OF_CANDIDATES',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'status',
        headerName: 'PAGES.COMMON.LABELS.STATUS',
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          // Try to get raw status first, then fall back to translated names
          const rawStatus = params.data.serviceStep?.status;
          if (rawStatus) {
            // Use consistent translation logic like other components
            if (this.module === 'CSEQA' && rawStatus === 'MET') {
              return this.translate.instant('PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA');
            }
            return this.translate.instant('PAGES.COMMON.LABELS.' + rawStatus);
          }
          // Fallback to pre-translated names from API
          return this.translate.currentLang === 'ar'
            ? params.data.serviceStep?.stepNameAr ?? ''
            : params.data.serviceStep?.stepNameEn ?? '';
        }
      }
    ];

    this.actions = [
      { label: 'تفاصيل', icon: 'ri-eye-fill', callback: (row: any) => this.openDetails(row, 'view') }
    ];
  }

  private getPreviousRequest() {
    this.externalReviewersTrainingService.getPreviousRequest(this.serviceCode).subscribe({
      next: (response) => {
        this.externalReviewerTrainingResultRequestList = response.data;
        // Create filter options from actual data for CSEQA module only
        this.createFilterOptionsFromData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  openDetails(row: any, mode: string) {
   this.router.navigate(['/jawda/external-reviewers-training-results/request-details', row.data.id]);
  }

  navigateToNewOrder() {
    this.router.navigate(['/jawda/external-reviewers-training-results/new-order-training-results', this.module]);
  }

  private createFilterOptionsFromData(): void {
    // Only create filter options for CSEQA module
    if (this.module !== 'CSEQA') {
      this.columnFilterOptions = {};
      return;
    }

    // Extract unique status values from the actual data
    const uniqueStatuses = [...new Set(
      this.externalReviewerTrainingResultRequestList
        .map(item => {
          // Try to get raw status first for translation consistency
          const rawStatus = (item as any).serviceStep?.status;
          if (rawStatus) {
            return rawStatus;
          }
          // Fallback to using the translated name as identifier
          return this.translate.currentLang === 'ar' 
            ? (item as any).serviceStep?.stepNameAr 
            : (item as any).serviceStep?.stepNameEn;
        })
        .filter(status => status) // Remove null/undefined values
    )];

    // Create filter options - if we have raw status, translate it; otherwise use as-is
    this.columnFilterOptions = {
      'status': uniqueStatuses.map(status => {
        // Check if this looks like a raw status code (uppercase, underscores)
        if (status && /^[A-Z_]+$/.test(status)) {
          // Handle special CSEQA case
          if (this.module === 'CSEQA' && status === 'MET') {
            return this.translate.instant('PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA');
          }
          return this.translate.instant('PAGES.COMMON.LABELS.' + status);
        }
        // Already translated, use as-is
        return status;
      })
    };
  }
}
