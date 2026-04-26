import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewerRequestService} from '../services/external-reviewer-request.service';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {ColumnFilterService} from '../../../shared/services/column-filter.service';
import {ReportService} from "../../../shared/report/services/report.service";
import {LanguageUtil} from "../../../core/util/language.util";
import {Permission} from "../../../core/enum/permission";
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'external-reviewer-registration-requests',
  templateUrl: './external-reviewer-registration-requests.component.html',
  styleUrls: ['./external-reviewer-registration-requests.component.scss']
})
export class ExternalReviewerRegistrationRequestsComponent implements OnInit {
  protected readonly Permission = Permission;
  permissionViewErUserReport!: Permission;

  module!: string;
  pageTitleKey = '';
  requestList: any[] = [];
  columns: any[] = [];
  actions: any[] = [];
  columnFilterOptions: { [key: string]: string[] } = {};

    constructor(private router: Router,
              private route: ActivatedRoute,
              private toastService: ToastService,
              private translate: TranslateService,
              private reviewerService: ExternalReviewerRequestService,
              private columnFilterService: ColumnFilterService,
              private reportService: ReportService,
              private authService: AuthService

            ) {
    this.prepareGridColumns();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.module = params.get('module')!;

      this.permissionViewErUserReport = this.module === 'CSEQA'
        ? Permission.VIEW_CSEQA_ER_USERS_REPORT
        : this.module === 'CHEQA' ? Permission.VIEW_CHEQA_ER_USERS_REPORT
        : Permission.VIEW_OQF_ER_USERS_REPORT;

      this.pageTitleKey = `PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.TITLES.${this.module}`;
      this.fetchRequests();
      this.loadStatusOptions();
    });
  }

  fetchRequests(): void {
    this.reviewerService.getRequestsByModule(this.module).subscribe({
      next: (res: any) => this.requestList = res.data || [],
      error: () =>
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING'), { classname: 'bg-danger text-white', autohide: false })
    });
  }

  openDetails(row: any, mode: string) {
    const serviceCode = row.data?.oaaaService?.serviceCode;
    this.router.navigate([AppConstants.SERVICE_REQUEST_DETAILS[serviceCode as keyof typeof AppConstants.SERVICE_REQUEST_DETAILS], row.data.requestId]);
  }

  private prepareGridColumns(): void {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    this.columns = [
      {
        field: 'request.applicationNo',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.REQUEST_NUMBER',
        valueGetter: (params: any) => params.data.request?.applicationNo ?? ''
      },
      {
        field: 'request.requestDate',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.REQUEST_DATE',
        valueGetter: (params: any) => params.data.request?.requestDate ?? ''
      },
      {
        field: 'request.oaaaService.serviceName',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.REQUEST_TYPE',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.request?.oaaaService?.serviceNameEn ?? ''
            : params.data.request?.oaaaService?.serviceNameAr ?? ''
      },
      {
        field: 'user.fullName',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.FULL_NAME',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.user?.fullNameEn ?? ''
            : params.data.user?.fullNameAr ?? ''
      },
      {
        field: 'user.insideOman',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.ID_TYPE',
        valueGetter: (params: any) =>
          params.data.user?.insideOman
            ? this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.INSIDE_OMAN')
            : this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.OUTSIDE_OMAN')
      },
      {
        field: 'user.nationality',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.NATIONALITY',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.user?.nationality?.countryNameEn ?? ''
            : params.data.user?.nationality?.countryNameAr ?? ''
      },
      {
        field: 'idNumber',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.ID_NUMBER',
        valueGetter: (params: any) => {
          const user = params.data.user;
          return user?.insideOman ? user?.civilNo ?? '' : user?.passportNo ?? '';
        }
      },
      {
        field: 'qualification.degreeObtained',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.HIGHEST_DEGREE',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.qualification?.degreeObtained?.lookupValueEn ?? ''
            : params.data.qualification?.degreeObtained?.lookupValueAr ?? ''
      },
      {
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.MAIN_SPECIALIZATION',
        valueGetter: (params: any) => {
          const q = params.data.qualification;
          const module = params.data.module;

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
        field: 'user.email',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.EMAIL',
        valueGetter: (params: any) => params.data.user?.email ?? ''
      },
      {
        field: 'user.mobileNo',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.MOBILE',
        valueGetter: (params: any) => params.data.user?.mobileNo ?? ''
      },
      {
        field: 'registrationStatus',
        headerName: 'PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.STATUS',
        valueGetter: (params: any) => {
          const status = params.data.registrationStatus;
          if (this.module === 'CSEQA' && status === 'MET') {
            return this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`);
          }
          return this.translate.instant(`PAGES.COMMON.LABELS.${status}`);
        }
      }
    ];

    this.actions = [
      {
        label: 'details',
        icon: 'ri-eye-fill',
        callback: (row: any) => this.openDetails(row, 'view'),
        show: () => this.module === 'CSEQA' 
        ? userPermissions.includes(Permission.CSEQA_ER_Registration_Request_VIEW_DETAIL) 
        : this.module === 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Registration_Request_VIEW_DETAIL) 
        : this.module === 'OQF' ? userPermissions.includes(Permission.OQF_ER_Registration_Request_VIEW_DETAIL) : false
      }
    ];
  }

  private loadStatusOptions(): void {
    // Use the shared service with API call for CSEQA module
    const apiCall = this.module === 'CSEQA' ? this.reviewerService.getStatusOptions() : undefined;
    
    this.columnFilterService.setupStatusFilterOptions(this.module, 'registrationStatus', apiCall)
      .subscribe(filterOptions => {
        this.columnFilterOptions = filterOptions;
      });
  }
  
    downloadExcelReport() {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const yyyy = now.getFullYear();
        const formatted = `${dd}-${mm}-${yyyy}`;

        this.reportService.downloadExcelReport({
            lang: LanguageUtil.lang,
            reportCode: "CSEQA_ER_USERS_REPORT",
            module: 'CSEQA',
            fileNameParams: {
                "DATE": formatted
            }
        }).subscribe({
            next: value => this.downloadFile(value.data),
            error: err => this.showErrorMessage('PAGES.COMMON.MESSAGES.' + err)
        });
    }
     private showErrorMessage(message: string) {
        scrollTo(0, 0);
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

     private downloadFile(fileDto: any) {
        const dataUri = 'data:application/pdf;base64,' + fileDto.file;
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = dataUri;
        a.download = fileDto.fileName;
        a.click();
        window.URL.revokeObjectURL(dataUri);
    }
    
}
