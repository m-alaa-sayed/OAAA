import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ExternalReviewersRegistrationRequestInfo} from '../../../types/external-reviewers-registration-request-info';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from "../../../../../core/services/common.service";
import {ExternalReviewerValidationService} from '../../../services/external-reviewer-validation.service';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {ToastService} from "../../../../../core/services/toast-service";

@Component({
    selector: 'app-experience-information-oqf',
    templateUrl: './experience-information-oqf.component.html',
    styleUrl: './experience-information-oqf.component.scss'
})
export class ExperienceInformationOqfComponent implements OnInit {


    @ViewChild('oqfForm') oqfForm?: NgForm;

    @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
    @Input() isSubmitting: boolean = false;
    @Input() isEditMode: boolean = true;


    selectedFileName: string | null = null;
    selectedFile: File | null = null;

    constructor(
        public translate: TranslateService,
        private externalReviewerValidationService: ExternalReviewerValidationService,
        private commonService: CommonService,
        private toastService: ToastService
        ) {
    }

    ngOnInit(): void {
        if (!this.externalReviewersRegistrationRequestInfo.oqfExperience) {
            this.externalReviewersRegistrationRequestInfo.oqfExperience = {};
        }

        this.externalReviewerValidationService.externalReviewerRegistrationApprovalData$.subscribe(message => {
            this.isSubmitting = message;
        });
    }


    // upload file
    //--- upload download file functions

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
                    this.externalReviewersRegistrationRequestInfo.oqfExperience.resumeBucketName = response.data.bucketName;
                    this.externalReviewersRegistrationRequestInfo.oqfExperience.resumeFilePath = response.data.objectName;
                    this.selectedFileName = response.data.objectName;
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


    onTextChange(obj: any, field: string, value: string): void {
        const result = limitWords(value || '', 250);
        obj[field] = result.trimmedText;
    }
}
