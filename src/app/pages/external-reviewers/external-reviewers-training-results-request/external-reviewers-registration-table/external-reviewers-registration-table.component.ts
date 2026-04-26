import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExternalReviewersRegistrationRequest} from '../../types/external-reviewers-registration-request';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {BaseModal} from 'src/app/shared/base-modal';
import {ExternalReviewerTrainingResult} from '../../types/ExternalReviewerTrainingResult';
import {
    TrainingDetailsModalComponent
} from '../new-order-training-results/training-details-modal/training-details-modal.component';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {CommonService} from 'src/app/core/services/common.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-external-reviewers-registration-table',
  templateUrl: './external-reviewers-registration-table.component.html',
  styleUrl: './external-reviewers-registration-table.component.scss'
})
export class ExternalReviewersRegistrationTableComponent extends BaseModal implements OnInit {

  @Input() serviceCode: string = "";

  @Input() externalReviewersRegistrationRequestList: ExternalReviewersRegistrationRequest[] = [];
  @Input() externalReviewerTrainingResultList: ExternalReviewerTrainingResult[] = [];
  @Input() filteredExternalReviewersRegistrationRequestList: ExternalReviewersRegistrationRequest[] = [];

  @ViewChild("submitForm") submitForm?: NgForm;


  @Output() erTrainingResultObjectEventEmitter = new EventEmitter<ExternalReviewerTrainingResult>();

  selectedExternalReviewersRegistrationRequest: ExternalReviewersRegistrationRequest[] = [];
  columns: any[] = [];
  actions: any;
  notes: string = '';

  trainingStatus: string = '';
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  trainingResultBucketName: string = "";
  trainingResultFileName: string = "";



  trainingStatusOptions = [
    { value: 'PASSED_TRAINING_UNDER_APPROVE', label: 'PASSED_TRAINING' },
    { value: 'NOT_PASSED_TRAINING_UNDER_APPROVE', label: 'NOT_PASSED_TRAINING' }
  ];

  constructor(
    public override modalService: NgbModal,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService
  ) {
    super(modalService);
  }


  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.filterErReviewRegistrationList();
  }


  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'applicantUser.fullNameAr',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICANT_USER',
        width: 150
      },
      {
        field: 'applicationNo',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICATION_NO',
        width: 200
      },
      {
        field: 'applicantUser.city.country.countryNameAr',
        headerName: 'PAGES.COMMON.LABELS.COUNTRY_OF_RESIDENCE',
      },
      {
        headerName: 'PAGES.EXTERNAL_REVIEWER.LABELS.MAIN_SPECIALIZATION',
        valueGetter: (params: any) => {
          const q = params.data.externalReviewersRegistrationRequestInfo?.qualification;
          const module = params.data.externalReviewersRegistrationRequestInfo?.module;

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
        field: this.translate.currentLang == 'en' ? 'oaaaService.serviceNameEn' :
          'oaaaService.serviceNameAr',
        headerName: 'PAGES.COMMON.LABELS.REQUEST_TYPE',
      },
      {
        field: 'applicantUser.email',
        headerName: 'PAGES.COMMON.LABELS.EMAIL',
        width: 200
      },
      {
        field: 'applicantUser.phoneNo',
        headerName: 'PAGES.CREATE_ACCOUNT.LABELS.PHONE_NUMBER',
      }
    ];

    this.actions = [
      { label: 'عرض', icon: 'ri-eye-fill', callback: (row: any) => this.openDetails(row) }
    ];
  }



  private filterErReviewRegistrationList() {
    this.filteredExternalReviewersRegistrationRequestList = this.externalReviewersRegistrationRequestList?.filter(request =>
      !this.externalReviewerTrainingResultList?.some(result =>
        result.externalReviewersRegistrationRequestInfoId != request.externalReviewersRegistrationRequestInfo?.id
      )
    );
  }


  openDetails(row: any) {
    const modalRef = this.modalService.open(TrainingDetailsModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      windowClass: 'with-backdrop'
    });

    modalRef.componentInstance.rowData = row.data;
    modalRef.componentInstance.title = 'تفاصيل طلب التدريب';

    modalRef.componentInstance.confirmEvent.subscribe((completeRowData: ExternalReviewerTrainingResult) => {
      // Add the completed training result to the second grid
      if (completeRowData) {
        this.erTrainingResultObjectEventEmitter.emit(completeRowData);
      }
    });

    modalRef.componentInstance.declineEvent.subscribe(() => {
      console.log('Modal cancelled');
    });
  }


  OnExternalReviewersSelectChange(selectedExternalReviewersRegistrationRequest: ExternalReviewersRegistrationRequest[]) {
    this.selectedExternalReviewersRegistrationRequest = selectedExternalReviewersRegistrationRequest;
  }


  addToList() {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      return;
    }

    this.selectedExternalReviewersRegistrationRequest.forEach((row) => {
      const completeRowData: ExternalReviewerTrainingResult = {
        requestId: row.id,
        externalReviewersRegistrationRequestInfo: row.externalReviewersRegistrationRequestInfo,
        externalReviewersRegistrationRequestInfoId: row?.externalReviewersRegistrationRequestInfo?.id,
        trainingStatus: this.trainingStatus,
        trainingNotes: this.notes,
        trainingResultBucketName: this.trainingResultBucketName,
        trainingResultFileName: this.trainingResultFileName,
      };

      this.erTrainingResultObjectEventEmitter.emit(completeRowData);
      // Optionally filter this row from another list
      this.filteredExternalReviewersRegistrationRequestList = this.filteredExternalReviewersRegistrationRequestList.filter(
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



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      console.warn('No file selected');
      return;
    }
    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedFile)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.trainingResultBucketName = data.bucketName;
          this.trainingResultFileName = data.objectName;
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false })
        }
      });
  }


  downloadUploadedFile(objectName: any, bucketName: any): void {
    if (!objectName || !bucketName) {
      console.warn('Missing file data');
      return;
    }

    this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
      .subscribe({
        next: (res) => {
          const downloadUrl = res.data;

          fetch(downloadUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('File download failed.');
              }
              return response.blob();
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = objectName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            })
            .catch(err => {
              console.error('Download via blob failed:', err);
            });
        },
        error: (err) => {
          console.error('Download failed:', err);
        }
      });
  }

  onTextChange(): void {
    const result = limitWords(this.notes || '', 250);
    this.notes = result.trimmedText;
  }

  private resetValue() {
    this.isSubmitting = false;
    this.notes = '';
    this.trainingStatus = '';
    this.trainingResultBucketName = '';
    this.trainingResultFileName = '';
  }

}
