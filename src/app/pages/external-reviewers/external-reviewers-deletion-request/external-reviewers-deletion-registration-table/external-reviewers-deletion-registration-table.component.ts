import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseModal } from 'src/app/shared/base-modal';
import { NgForm } from '@angular/forms';
import { ExternalReviewerDeletion } from '../../types/ExternalReviewerDeletion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { DeletionDetailsModelComponent } from '../new-order-deletion/deletion-details-model/deletion-details-model.component';
import { ExternalReviewersDeletionService } from '../../services/external-reviewers-deletion.service';
import { calculateAge } from 'src/app/shared/utils/calculateAge';

@Component({
  selector: 'external-reviewers-deletion-registration-table',
  templateUrl: './external-reviewers-deletion-registration-table.component.html',
  styleUrl: './external-reviewers-deletion-registration-table.component.scss'
})
export class ExternalReviewersDeletionRegistrationTableComponent extends BaseModal implements OnInit {

  @Input() serviceCode: string = "";
 @Input() module: string = "";
  @Input() externalReviewersList: any[] = [];
  @Input() externalReviewerDeletionList: ExternalReviewerDeletion[] = [];
  @Input() filteredExternalReviewersList: any[] = [];

  @ViewChild("submitForm") submitForm?: NgForm;


  @Output() erDeletionObjectEventEmitter = new EventEmitter<ExternalReviewerDeletion>();

  selectedExternalReviewers: any[] = [];
  columns: any[] = [];
  actions: any;
  notes: string = '';

  deletionStatus: string| null = "REMOVED_UNDER_APPROVE";
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    public override modalService: NgbModal,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService,
    private externalReviewersDeletionService :ExternalReviewersDeletionService
  ) {
    super(modalService);
  }


  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.filterErReviewList();
  }


  private prepareGridHeaderCols() {
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

    this.actions = [
      { label: 'عرض', icon: 'ri-eye-fill', callback: (row: any) => this.openDetails(row) }
    ];
  }



  private filterErReviewList() {
    this.filteredExternalReviewersList = this.externalReviewersList?.filter(erxternalReviewer =>
      !this.externalReviewerDeletionList?.some(result =>
        result.externalReviewer != erxternalReviewer?.id
      )
    );
  }


  openDetails(row: any) {
 
     this.externalReviewersDeletionService.validate(row.data.id).subscribe({
            next: (res) => {              
               this.openTemplate(row);
            },
            error: (error) => {              
                this.toastService.show(this.translate.instant('PAGES.ER_DELETION.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
  }

  openTemplate(row:any){
      const modalRef = this.modalService.open(DeletionDetailsModelComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      windowClass: 'with-backdrop'
    });

    modalRef.componentInstance.rowData = row.data;
    modalRef.componentInstance.title = 'تفاصيل طلب الحذف';

    modalRef.componentInstance.confirmEvent.subscribe((completeRowData: ExternalReviewerDeletion) => {
      // Add the completed training result to the second grid
      if (completeRowData) {
        this.erDeletionObjectEventEmitter.emit(completeRowData);
      }
    });

    modalRef.componentInstance.declineEvent.subscribe(() => {
      console.log('Modal cancelled');
    });

  }

  OnExternalReviewersSelectChange(selectedExternalReviewers: any[]) {
    this.selectedExternalReviewers = selectedExternalReviewers;
  }


  addToList() {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      return;
    }

    this.selectedExternalReviewers.forEach((row) => {
      const completeRowData: ExternalReviewerDeletion = {
        requestId: row.id,
        externalReviewer: row,
        externalReviewerId: row?.id,
        deletionStatus: this.deletionStatus ?? null,
        deletionNotes: this.notes
      };

      this.erDeletionObjectEventEmitter.emit(completeRowData);
      // Optionally filter this row from another list
      this.filteredExternalReviewersList = this.filteredExternalReviewersList.filter(
        item => item.id !== row.id
      );
    });

    this.close();
    this.resetValue();
  }

  cancel() {
    this.close();
    this.resetValue();
  }


  onTextChange(): void {
    const result = limitWords(this.notes || '', 250);
    this.notes = result.trimmedText;
  }

  private resetValue() {
    this.isSubmitting = false;
    this.notes = '';
    this.deletionStatus = '';

  }

}
