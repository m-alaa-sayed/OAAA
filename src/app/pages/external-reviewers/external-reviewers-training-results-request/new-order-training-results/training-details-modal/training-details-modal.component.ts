import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ExternalReviewersRegistrationRequest} from '../../../types/external-reviewers-registration-request';
import {ExternalReviewerTrainingResult} from '../../../types/ExternalReviewerTrainingResult';
import {CommonService} from 'src/app/core/services/common.service';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {ToastService} from "../../../../../core/services/toast-service";

@Component({
  selector: 'app-training-details-modal',
  templateUrl: './training-details-modal.component.html',
  styleUrl: './training-details-modal.component.scss'
})
export class TrainingDetailsModalComponent {
  @ViewChild("submitForm") submitForm?: NgForm;

  @Input() rowData: ExternalReviewersRegistrationRequest = {} as ExternalReviewersRegistrationRequest;
  @Input() title: string = 'PAGES.TRAINING_RESULTS.LABELS.TRAINING_REQUEST_DETAILS';

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() declineEvent: EventEmitter<any> = new EventEmitter<any>();

  // Form data for the second section
  trainingStatus: string = '';
  selectedFile: File | null = null;
  notes: string = '';
  isSubmitting: boolean = false;

  trainingResultBucketName: string = "";
  trainingResultFileName: string = "";


  trainingStatusOptions = [
    { value: 'PASSED_TRAINING_UNDER_APPROVE', label: 'PASSED_TRAINING' },
    { value: 'NOT_PASSED_TRAINING_UNDER_APPROVE', label: 'NOT_PASSED_TRAINING' }
  ];

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService
  ) {
   }


  submit(): void {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      return;
    }

    // Create the complete data object that will be added to the second grid
    const completeRowData: ExternalReviewerTrainingResult = {
      requestId: this.rowData.id,
      externalReviewersRegistrationRequestInfo: this.rowData.externalReviewersRegistrationRequestInfo,
      externalReviewersRegistrationRequestInfoId: this.rowData.externalReviewersRegistrationRequestInfo?.id,
      trainingStatus: this.trainingStatus,
      trainingNotes: this.notes,
      trainingResultBucketName: this.trainingResultBucketName,
      trainingResultFileName: this.trainingResultFileName,
    };


    this.confirmEvent.emit(completeRowData);
    this.activeModal.close(completeRowData);
  }


  cancel(): void {
    this.declineEvent.emit();
    this.activeModal.dismiss('cancel');
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
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false  })
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
}
