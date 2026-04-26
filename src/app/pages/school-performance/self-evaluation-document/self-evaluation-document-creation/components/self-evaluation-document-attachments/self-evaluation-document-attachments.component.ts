import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from 'src/app/core/services/common.service';
import {SelfEvaluationDocumentCleanerService} from 'src/app/core/services/self-evaluation-document-cleaner.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {SelfEvaluationDocumentService} from 'src/app/pages/school-performance/service/self-evaluation-document.service';
import {SelfEvaluationAttachment} from 'src/app/pages/school-performance/types/self-evaluation-attachment';
import {SelfEvaluationDocument} from 'src/app/pages/school-performance/types/self-evaluation-document';
import {
    SelfEvaluationDocumentUpdateRequest
} from 'src/app/pages/school-performance/types/self-evaluation-document-update-request';
import {BaseModal} from 'src/app/shared/base-modal';

@Component({
  selector: 'self-evaluation-document-attachments',
  templateUrl: './self-evaluation-document-attachments.component.html',
  styleUrl: './self-evaluation-document-attachments.component.scss'
})
export class SelfEvaluationDocumentAttachmentsComponent extends BaseModal implements OnInit {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() showButtons: boolean = true;

  @Output() saveEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();


  selectedFiles: { [key: string]: File } = {};
  selectedFileNames: { [key: string]: string } = {};

  isSubmitting: boolean = false;
  isEditable: boolean = false;


  constructor(
    public translate: TranslateService,
    public commonService: CommonService,
    private router: Router,
    private toastService: ToastService,
    private cleaner: SelfEvaluationDocumentCleanerService,
    private selfEvaluationDocumentService: SelfEvaluationDocumentService,
    public override modalService: NgbModal) {
    super(modalService);
  }

  ngOnInit(): void {
    if (!this.selfEvaluationDocument.selfEvaluationRequiredFiles) {
      this.selfEvaluationDocument.selfEvaluationRequiredFiles = {};
    }
    this.selfEvaluationDocument.selfEvaluationRequiredFiles.selfEvaluationDocumentId = this.selfEvaluationDocument.id;

    this.isEditable = this.selfEvaluationDocument.status != 'SUBMITTED';
  }


  onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[field] = file;
      this.uploadFile(field);
    }
  }

  uploadFile(field: string): void {
    const file = this.selectedFiles[field];
    if (!file) {
      console.warn('No file selected for', field);
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, file).subscribe({
      next: (response) => {
        const data = response.data;
        this.selectedFileNames[field] = data.objectName;

        this.assignUploadedFile(field, data.bucketName, data.objectName);
      },
      error: (error) => {
        console.error(`Error uploading file for ${field}:`, error);
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



  private assignUploadedFile(field: string, bucketName: string, objectName: string): void {
    const fieldMapping: { [key: string]: { bucketKey: string; fileKey: string } } = {
      schoolPlanFileName: { bucketKey: 'schoolPlanBucketName', fileKey: 'schoolPlanFileName' },
      weeklyScheduleFileName: { bucketKey: 'weeklyScheduleBucketName', fileKey: 'weeklyScheduleFileName' },
      buildingLayoutFileName: { bucketKey: 'buildingLayoutBucketName', fileKey: 'buildingLayoutFileName' },
      dailyTimetableFileName: { bucketKey: 'dailyTimetableBucketName', fileKey: 'dailyTimetableFileName' },
      moeApprovalFileName: { bucketKey: 'moeApprovalBucketName', fileKey: 'moeApprovalFileName' },
      privateLicenseFileName: { bucketKey: 'privateLicenseBucketName', fileKey: 'privateLicenseFileName' },
    };

    const keys = fieldMapping[field];
    if (keys) {
      (this.selfEvaluationDocument.selfEvaluationRequiredFiles as any)[keys.bucketKey] = bucketName;
      (this.selfEvaluationDocument.selfEvaluationRequiredFiles as any)[keys.fileKey] = objectName;
    } else {
      console.warn('No mapping found for field:', field);
    }
  }


  validateForm(content: any) {
    this.isSubmitting = true;
    const validateSchoolInfo = this.selfEvaluationDocumentService.validateSchoolInfo(this.selfEvaluationDocument.editableSchoolInfo);
    if(validateSchoolInfo != 'VALID'){
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.'+validateSchoolInfo), { classname: 'bg-danger text-white', delay: 6000 });
      scrollTo(0, 0);
      return
    }
    if (!this.validateAllFilesUploaded()) {
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
      scrollTo(0, 0);
      return
    }
    this.open(content);
  }



  submit() {
    this.close();
    const cleanSelfEvaluationDocument = this.cleaner.removeAverageRows(this.selfEvaluationDocument);
    const request: SelfEvaluationDocumentUpdateRequest = {
      action: 'SUBMIT',
      selfEvaluationDocument: cleanSelfEvaluationDocument
    };
    this.selfEvaluationDocumentService.updateSelfEvaluationDocument(this.selfEvaluationDocument.id, request).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data, action: 'SUBMIT' }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  addAttchment(attachmentObject: SelfEvaluationAttachment) {
    if (!this.selfEvaluationDocument.selfEvaluationAttachments) {
      this.selfEvaluationDocument.selfEvaluationAttachments = []
    }
    this.selfEvaluationDocument.selfEvaluationAttachments.push(attachmentObject);
  }

  removeAttchment(index: number) {
    this.selfEvaluationDocument.selfEvaluationAttachments?.splice(index, 1);
  }


  validateAllFilesUploaded(): boolean {
    const files = this.selfEvaluationDocument?.selfEvaluationRequiredFiles;
    const schoolType = this.selfEvaluationDocument?.scheduledSchoolVisit?.school?.type;

    if (!files) return false;

    const requiredFilesPresent =
      !!files.schoolPlanFileName &&
      !!files.weeklyScheduleFileName &&
      !!files.buildingLayoutFileName &&
      !!files.dailyTimetableFileName;

    const privateFilesPresent =
      schoolType !== 'PRIVATE' ||
      (!!files.moeApprovalFileName && !!files.privateLicenseFileName);

    return requiredFilesPresent && privateFilesPresent;
  }
}
