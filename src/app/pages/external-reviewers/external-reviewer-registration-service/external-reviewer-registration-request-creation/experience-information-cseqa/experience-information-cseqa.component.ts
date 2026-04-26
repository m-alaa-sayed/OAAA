import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExternalReviewersRegistrationRequestInfo } from '../../../types/external-reviewers-registration-request-info';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { CommonService } from "../../../../../core/services/common.service";
import { ExternalReviewerSceqaExperienceInformation } from '../../../types/external-reviewer-sceqa-experience-information';
import { ExternalReviewerValidationService } from '../../../services/external-reviewer-validation.service';
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-experience-information-cseqa',
  templateUrl: './experience-information-cseqa.component.html',
  styleUrl: './experience-information-cseqa.component.scss'
})
export class ExperienceInformationCseqaComponent implements OnInit {


  @ViewChild('cseqaForm') cseqaForm?: NgForm;

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() isSubmitting: boolean = false;
  @Input() isEditMode: boolean = true;

  selectedFiles: { [key: string]: File } = {};
  selectedFileNames: { [key: string]: string } = {};



  constructor(
    public translate: TranslateService,
    private externalReviewerValidationService: ExternalReviewerValidationService,
    public commonService: CommonService) {
  }

  ngOnInit(): void {
    if (!this.externalReviewersRegistrationRequestInfo.sceqaExperience) {
      this.externalReviewersRegistrationRequestInfo.sceqaExperience = {};
    }
    this.externalReviewerValidationService.externalReviewerRegistrationApprovalData$.subscribe(message => {
      this.isSubmitting = message;
    });
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

  assignUploadedFile(field: string, bucketName: string, objectName: string): void {
    const target = this.externalReviewersRegistrationRequestInfo.sceqaExperience;

    const fieldMapping: { [key: string]: { bucketKey: string; fileKey: string } } = {
      cv: { bucketKey: 'resumeFileBucketName', fileKey: 'resumeFileName' },
      qualification: { bucketKey: 'degreeCertificateBucketName', fileKey: 'degreeCertificateFileName' },
      id_residence: { bucketKey: 'idCardBucketName', fileKey: 'idCardFileName' },
      english: { bucketKey: 'approvalLetterBucketName', fileKey: 'approvalLetterFileName' },

      //todo need to be checked with BE
      it_skills: { bucketKey: 'personalPhotoBucketName', fileKey: 'personalPhotoFileName' },
      conduct: { bucketKey: 'passportBucketName', fileKey: 'passportFileName' },

      proof: { bucketKey: 'jobTitleProofBucketName', fileKey: 'jobTitleProofFileName' }
    };

    const keys = fieldMapping[field];
    if (keys) {
      (this.externalReviewersRegistrationRequestInfo.sceqaExperience as any)[keys.bucketKey] = bucketName;
      (this.externalReviewersRegistrationRequestInfo.sceqaExperience as any)[keys.fileKey] = objectName;
    } else {
      console.warn('No mapping found for field:', field);
    }
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
    const result = limitWords(this.externalReviewersRegistrationRequestInfo.sceqaExperience.schoolEducationSystemExperience || '', 250);
    this.externalReviewersRegistrationRequestInfo.sceqaExperience.schoolEducationSystemExperience = result.trimmedText;
  }


}
