import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseModal } from 'src/app/shared/base-modal';
import { ExternalReviewerManagementService } from '../../services/external-reviewer-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ExternalReviewerWithdrawalService } from '../../services/external-reviewer-withdrawal.service';
import { ColumnFilterService } from '../../../../shared/services/column-filter.service';
import { ExternalReviewerRequestService } from '../../services/external-reviewer-request.service';

@Component({
  selector: 'external-reviewers-withdrawal-requests-list',
  templateUrl: './external-reviewers-withdrawal-requests-list.component.html',
  styleUrl: './external-reviewers-withdrawal-requests-list.component.scss'
})
export class ExternalReviewersWithdrawalRequestsListComponent extends BaseModal {

  requestList: any[] = [];

  module!: string;
  pageTitleKey = '';
  columns: any[] = [];
  actions: any;
  columnFilterOptions: { [key: string]: string[] } = {};

  action!: string;
  comment!: string;
  selectedId!: number;
  submitted = false;
  title: string = '';

  private readonly serviceCodeMap: { [key: string]: string } = {
    CHEQA: AppConstants.SERVICE_CODES.CHEQA_EXTERNAL_REVIEWER_WITHDRAW,
    CSEQA: AppConstants.SERVICE_CODES.CSEQA_EXTERNAL_REVIEWER_WITHDRAW,
    OQF: AppConstants.SERVICE_CODES.OQF_EXTERNAL_REVIEWER_WITHDRAW
  };

  constructor(private route: ActivatedRoute,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    public override modalService: NgbModal,
    private externalReviewerWithdrawalService: ExternalReviewerWithdrawalService,
    private columnFilterService: ColumnFilterService,
    private externalReviewerRequestService: ExternalReviewerRequestService
  ) {
    super(modalService);
    this.prepareGridColumns();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.module = params.get('module')!;
      this.pageTitleKey = `PAGES.EXTERNAL_REVIEWERS_WITHDRAW.TITLE.${this.module}`;
      this.fetchRequests();
    });
  }

  fetchRequests(): void {
    const serviceCode = this.serviceCodeMap[this.module];
    this.externalReviewerWithdrawalService.getRequests(serviceCode).subscribe({
      next: (res) => {
        this.requestList = res.data || [];
        // Create filter options from actual data for CSEQA module only
        this.createFilterOptionsFromData();
      },
      error: () =>
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING'), {
          classname: 'bg-danger text-white', autohide: false
        })
    });
  }

  openDetails(row: any, mode: string) {
    const serviceCode = row.data?.oaaaService?.serviceCode;
    this.router.navigate([AppConstants.SERVICE_REQUEST_DETAILS[serviceCode as keyof typeof AppConstants.SERVICE_REQUEST_DETAILS], row.data.id]);
  }

private prepareGridColumns(): void {
  this.columns = [
    {
      field: 'applicationNo',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.REQUEST_NUMBER',
      valueGetter: (params: any) => params.data.applicationNo ?? ''
    },
    {
      field: 'requestDate',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.REQUEST_DATE',
      valueGetter: (params: any) => params.data.requestDate ?? ''
    },
    {
      field: 'applicantUser.fullName',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.FULL_NAME',
      valueGetter: (params: any) =>
        this.translate.currentLang === 'en'
          ? params.data.applicantUser?.fullNameEn ?? ''
          : params.data.applicantUser?.fullNameAr ?? ''
    },
    {
      field: 'applicantUser.insideOman',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.ID_TYPE',
      valueGetter: (params: any) =>
        params.data.applicantUser?.insideOman
          ? this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.INSIDE_OMAN')
          : this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.OUTSIDE_OMAN')
    },
    {
      field: 'applicantUser.nationality',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.NATIONALITY',
      valueGetter: (params: any) =>
        this.translate.currentLang === 'en'
          ? params.data.applicantUser?.nationality?.countryNameEn ?? ''
          : params.data.applicantUser?.nationality?.countryNameAr ?? ''
    },
    {
      field: 'civilNo',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.ID_NUMBER',
      valueGetter: (params: any) => {
        const user = params.data.applicantUser;
        return user?.insideOman ? user?.civilNo ?? '' : user?.passportNo ?? '';
      }
    },
    {
      field: 'externalReviewWithdrawInfo.externalReviewer.externalReviewersActiveRegistrationRequestInfo.qualification.degreeObtained',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.HIGHEST_DEGREE',
      valueGetter: (params: any) =>
        this.translate.currentLang === 'ar'
          ? params.data.externalReviewWithdrawInfo?.externalReviewer?.externalReviewersActiveRegistrationRequestInfo?.qualification?.degreeObtained?.lookupValueAr ?? ''
          : params.data.externalReviewWithdrawInfo?.externalReviewer?.externalReviewersActiveRegistrationRequestInfo?.qualification?.degreeObtained?.lookupValueEn ?? ''
    },
    {
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.MAIN_SPECIALIZATION',
      valueGetter: (params: any) => {
        const q = params.data.externalReviewWithdrawInfo?.externalReviewer?.externalReviewersActiveRegistrationRequestInfo?.qualification;
        const module = params.data.externalReviewWithdrawInfo?.externalReviewer?.externalReviewersActiveRegistrationRequestInfo?.module;

        if (module === 'CSEQA') {
          const other = q?.otherCseqaGeneralSpecialization;
          if (other) return other;

          const general = q?.cseqaGeneralSpecialization;
          return this.translate.currentLang === 'en' ? general?.nameEn ?? '' : general?.nameAr ?? '';
        } else {
          const other = q?.otherGeneralSpecialization;
          if (other) return other;

          const general = q?.specificSpecialization?.generalSpecialization;
          return this.translate.currentLang === 'en' ? general?.nameEn ?? '' : general?.nameAr ?? '';
        }
      }
    },
    {
      field: 'applicantUser.email',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.EMAIL',
      valueGetter: (params: any) => params.data.applicantUser?.email ?? ''
    },
    {
      field: 'applicantUser.mobileNo',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.MOBILE',
      valueGetter: (params: any) => params.data.applicantUser?.mobileNo ?? ''
    },
    {
      field: 'registrationStatus',
      headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.STATUS',
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
        return this.translate.currentLang === 'en'
          ? params.data.serviceStep?.statusNameEn ?? ''
          : params.data.serviceStep?.statusNameAr ?? '';
      }
    }
  ];

  this.actions = [
    {
      label: 'details',
      icon: 'ri-eye-fill',
      callback: (row: any) => this.openDetails(row, 'view')
    }
  ];
}

private createFilterOptionsFromData(): void {
  // Only create filter options for CSEQA module
  if (this.module !== 'CSEQA') {
    this.columnFilterOptions = {};
    return;
  }

  // Extract unique status values from the actual data
  // Since the status is in serviceStep, we need to check both raw status and translated names
  const uniqueStatuses = [...new Set(
    this.requestList
      .map(item => {
        // Try to get raw status first for translation consistency
        const rawStatus = item.serviceStep?.status;
        if (rawStatus) {
          return rawStatus;
        }
        // Fallback to using the translated name as identifier
        return this.translate.currentLang === 'en' 
          ? item.serviceStep?.statusNameEn 
          : item.serviceStep?.statusNameAr;
      })
      .filter(status => status) // Remove null/undefined values
  )];

  // Create filter options - if we have raw status, translate it; otherwise use as-is
  this.columnFilterOptions = {
    'registrationStatus': uniqueStatuses.map(status => {
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

