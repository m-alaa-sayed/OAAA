import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewerManagementService} from '../services/external-reviewer-management.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseModal} from 'src/app/shared/base-modal';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import { calculateAge } from 'src/app/shared/utils/calculateAge';
import { ColumnFilterService } from '../../../shared/services/column-filter.service';
import { ExternalReviewerRequestService } from '../services/external-reviewer-request.service';

@Component({
  selector: 'app-external-reviewers-management',
  templateUrl: './external-reviewers-management.component.html',
  styleUrl: './external-reviewers-management.component.scss'
})
export class ExternalReviewersManagementComponent extends BaseModal {
  protected readonly Permission = Permission;

  externalReviewersList: any[] = [];

  module!: string;
  pageTitleKey = '';
  columns: any[] = [];
  actions: any[] = [];
  columnFilterOptions: { [key: string]: string[] } = {};

  action!: string;
  comment!: string;
  selectedExternalReviewId!: number;
  submitted = false;
  title: string = '';
  @ViewChild('decision') decisionTemplate: any;

  selectedExternalReviewers: any[] = [];

  permissionErSendUpdateNotification!: Permission;

  constructor(private route: ActivatedRoute,
    private externalReviewerManagementService: ExternalReviewerManagementService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    public override modalService: NgbModal,
    private columnFilterService: ColumnFilterService,
    private externalReviewerRequestService: ExternalReviewerRequestService
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.module = params.get('module')!;
      this.pageTitleKey = `PAGES.EXTERNAL_REVIEWER.TITLES.${this.module}`;
      
      // Set permission based on module
      this.permissionErSendUpdateNotification = 
        this.module == 'CSEQA' ? Permission.CSEQA_ER_SEND_UPDATE_NOTIFICATION : 
        this.module == 'CHEQA' ? Permission.CHEQA_ER_SEND_UPDATE_NOTIFICATION : 
        Permission.OQF_ER_SEND_UPDATE_NOTIFICATION;
      
      this.prepareGridHeaderCols(); // Re-prepare columns whenever module changes
      this.getExternalReviewersByModule(this.module);

      // Append DELETE action based on permission in (cseqa-oqf) modules
      if (this.hasPermission() && (this.module == 'CSEQA' || this.module == 'OQF')) {
        this.actions.push(
          { label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'), icon: 'ri-delete-bin-6-fill', show: (row: any) => row.data.status != 'REMOVED', callback: (row: any) => this.setAction(row.data.id, "REMOVE") }
        );
      }
    });
  }

  getExternalReviewersByModule(module: any) {
    this.externalReviewerManagementService.getExternalReviewersByModule(module).subscribe({
      next: (response) => {
        this.externalReviewersList = response.data;
        // Create filter options from actual data for CSEQA module only
        this.createFilterOptionsFromData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  private prepareGridHeaderCols() {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    
    // Build base and CHEQA columns immutably to trigger grid change detection
    const baseColumns = [
      {
        field: this.translate.currentLang === 'en' ? 'user.fullNameEn' : 'user.fullNameAr',
        headerName: 'PAGES.COMMON.LABELS.NAME',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.user?.fullNameEn ?? ''
            : params.data.user?.fullNameAr ?? '',
        cellStyle: { textAlign: 'center' },
      },
      {
        field: 'user.insideOman', headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.ID_TYPE',
        valueGetter: (params: any) => {
          const insideOman = params.data.user?.insideOman;
          return insideOman
            ? this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.INSIDE_OMAN')
            : this.translate.instant('PAGES.EXTERNAL_REVIEWERS_REQUEST_LIST.LABELS.OUTSIDE_OMAN');
        },
        cellRenderer: null,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'user.nationality',
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.NATIONALITY',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.user?.nationality?.countryNameEn ?? ''
            : params.data.user?.nationality?.countryNameAr ?? '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'user.civilNo', headerName: 'PAGES.COMMON.LABELS.CIVIL_ID_PASSPORT_NUMBER',
        valueGetter: (params: any) => {
          const user = params.data.user;
          if (!user) return '';
          return user.insideOman ? user.civilNo ?? '' : user.passportNo ?? '';
        },
        cellRenderer: null,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: this.translate.currentLang === 'en' ? 'user.country.countryNameEn' : 'user.country.countryNameAr',
        headerName: 'PAGES.COMMON.LABELS.COUNTRY_OF_RESIDENCE',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.user?.country?.countryNameEn ?? ''
            : params.data.user?.country?.countryNameAr ?? '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field:this.translate.currentLang === 'en' ? 'user.city.cityNameEn' : 'user.city.cityNameAr',
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.CITY',
        valueGetter: (params: any) =>{
           const user = params.data.user;
          if (!user) return '';
          return user.insideOman ?   this.translate.currentLang === 'en'
            ? params.data.user?.wilayat?.nameEn ?? ''
            : params.data.user?.wilayat?.nameAr ??  ''  : 
          
          this.translate.currentLang === 'en'
            ? params.data.user?.city?.cityNameEn ?? ''
            : params.data.user?.city?.cityNameAr ??  '';
        },
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'qualification',
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.HIGHEST_EDUCATIONAL_QUALIFICATION',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.externalReviewersActiveRegistrationRequestInfo?.qualification?.degreeObtained?.lookupValueEn ?? ''
            : params.data.externalReviewersActiveRegistrationRequestInfo?.qualification?.degreeObtained?.lookupValueAr ?? '',
        cellStyle: { textAlign: 'center' },
      },
      {
        field: 'generalSpecialization',
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.MAIN_SPECIALIZATION_NAME',
        valueGetter: (params: any) => {
          const q = params.data.externalReviewersActiveRegistrationRequestInfo?.qualification;

          if (this.module === 'CSEQA') {
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
        },
        cellStyle: { textAlign: 'center' },
      }
      ,
      {
        field: 'user.email',
        headerName: 'PAGES.COMMON.LABELS.EMAIL',
        valueGetter: (params: any) => params.data.user?.email ?? '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'user.mobileNo',
        headerName: 'PAGES.COMMON.LABELS.MOBILE',
        valueGetter: (params: any) => params.data.user?.mobileNo ?? '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'status', headerName: 'PAGES.COMMON.LABELS.STATUS',
        valueGetter: (params: any) => this.translate.instant('PAGES.COMMON.LABELS.' + params.data.status),
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'PAGES.COMMON.LABELS.IS_AVAILABLE',
        valueGetter: (params: any) =>
          params.data.isAvailable
            ? this.translate.instant('PAGES.COMMON.LABELS.YES')
            : this.translate.instant('PAGES.COMMON.LABELS.NO'),
        cellRenderer: null,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'lastDataUpdatedDate', headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.LAST_DATA_UPDATED_DATE',
        valueGetter: (params: any) => params.data.lastDataUpdatedDate ?? '',
        cellStyle: { textAlign: 'center' },
      }
    ];

    const cheqaColumns = [
       {
        field: 'contribution', headerName: 'PAGES.REQUEST_DETAILS.LABELS.CONTRIBUTION',
        valueGetter: (params: any) => params.data.contribution,
        cellRenderer: null,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'user.age',
        headerName: 'PAGES.COMMON.LABELS.AGE',
        valueGetter: (params: any) => 
          params.data.user?.birthDate ? 
          `${calculateAge(params.data.user.birthDate)} ${this.translate.instant('PAGES.COMMON.LABELS.YEARS')}` 
          : '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'user.jobTitle',
        headerName: 'PAGES.COMMON.LABELS.JOB_TITLE',
        valueGetter: (params: any) => params.data.user?.jobTitle ?? '',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: this.translate.currentLang === 'en' ? 'externalReviewersActiveRegistrationRequestInfo?.expertiseAreaList?.narrowField?[0].nameEn' : 'externalReviewersActiveRegistrationRequestInfo?.expertiseAreaList[0]?.narrowField?.nameAr',
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.NARROW_FIELD',
        valueGetter: (params: any) =>
          this.translate.currentLang === 'en'
            ? params.data.externalReviewersActiveRegistrationRequestInfo?.expertiseAreaList[0]?.narrowField?.nameEn ?? ''
            : params.data.externalReviewersActiveRegistrationRequestInfo?.expertiseAreaList[0]?.narrowField?.nameAr ?? '',
        cellStyle: { textAlign: 'center' }
      }, 
      {
        field: 'user.region',
        headerName: 'PAGES.COMMON.LABELS.REGION',
        valueGetter: (params: any) => params.data.user?.region ?? '',
        cellStyle: { textAlign: 'center' }
      }
    ];

    // Assign columns immutably to ensure grid re-renders on module change
    this.columns = this.module === 'CHEQA' ? [...baseColumns, ...cheqaColumns] : [...baseColumns];

    // Reset actions to defaults (DELETE appended conditionally in ngOnInit)
    this.actions = [
      { 
        label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'), 
        icon: 'ri-eye-fill',
        link: (row: any) => `/jawda/external-reviewers/external-reviewer-details/${row.data.id}`, 
        callback: (row: any) => this.openDetails(row.data.id),
        show: () =>  this.module == 'CSEQA' 
        ? userPermissions.includes(Permission.CSEQA_ER_VIEW_DETAILS) 
        : this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_VIEW_DETAILS) 
        : this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_VIEW_DETAILS) : false
      },
      { 
        label: this.translate.instant('PAGES.COMMON.LABELS.ACTIVE'), 
        icon: 'ri-checkbox-circle-fill', 
        callback: (row: any) => this.setAction(row.data.id, "ACTIVE") ,
        show: (row: any) => row.data.status != 'ACTIVE' && row.data.status != 'REMOVED', 
      },
      { 
        label: this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'), 
        icon: 'ri-close-circle-fill', 
        callback: (row: any) => this.setAction(row.data.id, "IN_ACTIVE") ,
        show: (row: any) => row.data.status != 'IN_ACTIVE' && row.data.status != 'WITHDRAW' && row.data.status != 'REMOVED', 
      }
    ];
  }

  openDetails(externalReviewerId: any) {
    this.router.navigate(['/jawda/external-reviewers/external-reviewer-details/', externalReviewerId]);
  }

  deleteExternalReviewer(module: string, externalReviewerId: number, removeReason: string) {
    this.externalReviewerManagementService.deleteExternalReviewer(module, externalReviewerId, removeReason).subscribe({
      next: () => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'), { classname: 'bg-success text-white', delay: 3000 });
        this.getExternalReviewersByModule(module); // refresh list
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  updateReviewerStatus(module: string, externalReviewerId: number, status: string, note: string) {
    this.externalReviewerManagementService.updateExternalReviewerStatus(module, externalReviewerId, status, note).subscribe({
      next: () => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.EDIT_SUCCESS'), { classname: 'bg-success text-white', delay: 3000 });
        this.getExternalReviewersByModule(module); // refresh list
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  updateExternalReviewerNotifications(module: string, note: string, externalReviewerIds: number[]) {
    this.externalReviewerManagementService.updateExternalReviewerNotifications(module, note, externalReviewerIds).subscribe({
      next: () => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SEND_NOTIFICATIONS_SUCCESS'), { classname: 'bg-success text-white', delay: 3000 });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  setAction(id: number, action: any) {
    const actionTitleMap: { [key: string]: string } = {
      REMOVE: 'PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE',
      ACTIVE: 'PAGES.COMMON.LABELS.CONFIRM_ACTIVE_TITLE',
      IN_ACTIVE: 'PAGES.COMMON.LABELS.CONFIRM_IN_ACTIVE_TITLE',
      NOTIFICATIONS: 'PAGES.COMMON.LABELS.CONFIRM_ALERTS_TITLE'
    };

    this.action = action;
    this.selectedExternalReviewId = id;
    this.title = actionTitleMap[action] || '';
    this.open(this.decisionTemplate);
  }


  closePopup() {
    (this.comment = ''), (this.submitted = false);
    this.close();
  }

  sendAction() {
    if (!this.comment && this.action !== 'NOTIFICATIONS') {
      this.submitted = true;
      return;
    }

    switch (this.action) {
      case 'REMOVE':
        this.deleteExternalReviewer(this.module, this.selectedExternalReviewId, this.comment);
        break;

      case 'ACTIVE':
      case 'IN_ACTIVE':
        this.updateReviewerStatus(this.module, this.selectedExternalReviewId, this.action, this.comment);
        break;

      case 'NOTIFICATIONS':
        const selectedIds: number[] = this.selectedExternalReviewers.map(reviewer => reviewer.id);
        this.updateExternalReviewerNotifications(this.module, this.comment, selectedIds);
        break;
    }

    this.closePopup();
  }

  OnExternalReviewersSelectChange(selectedExternalReviewers: any) {
    this.selectedExternalReviewers = selectedExternalReviewers;
  }


  onTextChange(): void {
    const result = limitWords(this.comment || '', 250);
    this.comment = result.trimmedText;
  }



  hasPermission(): boolean {
    const userClaim = this.authService.getUserClaim(); // or from observable
    const userPermissions = userClaim?.permissions ?? [];
    return userPermissions.includes(this.returnCurrentModulePermission());
  }


  private returnCurrentModulePermission(): any {
    switch (this.module) {
      case 'CHEQA':
        return Permission.CHEQA_ER_REMOVE;
      case 'CSEQA':
        return Permission.CSEQA_ER_REMOVE;
      case 'OQF':
        return Permission.OQF_ER_REMOVE;
    }
  }

  private createFilterOptionsFromData(): void {
    // Only create filter options for CSEQA module
    if (this.module !== 'CSEQA') {
      this.columnFilterOptions = {};
      return;
    }

    // Extract unique status values from the actual data
    const uniqueStatuses = [...new Set(
      this.externalReviewersList
        .map(item => item.status)
        .filter(status => status) // Remove null/undefined values
    )];

    // Create translated filter options from actual data
    this.columnFilterOptions = {
      'status': uniqueStatuses.map(status => 
        this.translate.instant('PAGES.COMMON.LABELS.' + status)
      )
    };
  }
}
