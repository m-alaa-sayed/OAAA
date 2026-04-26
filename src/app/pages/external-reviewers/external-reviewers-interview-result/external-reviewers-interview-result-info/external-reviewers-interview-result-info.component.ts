import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "../../../../core/services/toast-service";
import {NgForm} from "@angular/forms";
import {CommonService} from "../../../../core/services/common.service";
import {ExternalReviewersInterviewResultService} from "../../services/external-reviewers-interview-result.service";
import {
    ExternalReviewersInterviewRegistrationInfo
} from "../../types/external-reviewers-interview-result/external-reviewers-interview-registration-info";
import {
    ExternalReviewInterviewResultInfo
} from "../../types/external-reviewers-interview-result/external-review-interview-result-info";
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
    selector: 'app-external-reviewers-interview-result-info',
    templateUrl: './external-reviewers-interview-result-info.component.html',
    styleUrl: './external-reviewers-interview-result-info.component.scss'
})
export class ExternalReviewersInterviewResultInfoComponent implements OnInit {

    @ViewChild("submitForm") submitForm?: NgForm;

    interviewRegistrationInfo: ExternalReviewersInterviewRegistrationInfo = this.getEmptyDto();
    dto: ExternalReviewInterviewResultInfo = {
        interviewStatus: '',
        interviewResultFileName: ''
    };
    selectedFile: File | null = null;

    @Input() set inputDto(value: ExternalReviewersInterviewRegistrationInfo | null) {
        this.interviewRegistrationInfo = value ?? this.getEmptyDto();
    }

    @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() declineEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private modalService: NgbModal,
        private interviewResultService: ExternalReviewersInterviewResultService,
        public translate: TranslateService,
        private toastService: ToastService,
        public activeModal: NgbActiveModal,
        private commonService: CommonService
    ) {
    }

    ngOnInit(): void {
        if (this.interviewRegistrationInfo && !this.interviewRegistrationInfo.externalReviewInterviewResult)
            this.interviewRegistrationInfo.externalReviewInterviewResult = {
                interviewStatus: '',
                interviewResultFileName: ''
            }
        this.interviewRegistrationInfo.externalReviewInterviewResult.externalReviewerRegistrationRequestInfoId = this.interviewRegistrationInfo.externalReviewerRegistrationRequestInfoId;
        this.dto = { ...this.interviewRegistrationInfo.externalReviewInterviewResult };
    }

    get isArabic() {
        return this.translate.currentLang === 'ar';
    }

    confirm(): void {
        if (this.submitForm?.submitted && this.submitForm?.invalid)
            return;
        this.interviewResultService.submitExternalReviewersInterviewResultsRegistration(this.dto).subscribe({
            next: () => {
                this.handleSuccess('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY');
                this.confirmEvent.emit(this.interviewRegistrationInfo);
                this.activeModal.close();
            },
            error: err => this.handleError(err)
        });
    }

    decline(): void {
        this.declineEvent.emit();
        this.activeModal.close();
    }


    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const maxSize = 8 * 1024 * 1024; // 8 MB
        const isValidType = allowedTypes.includes(file.type);
        const isValidSize = file.size <= maxSize;
        if (!isValidType || !isValidSize) {
            input.value = '';
            this.handleError(!isValidType ? 'FILE_TYPES_NOT_VALID' : 'FILE_SIZE_EXCEEDS');
            return;
        }
        this.dto.interviewResultFileName = file.name;
        this.selectedFile = file;
        this.uploadFile();
    }

    downloadUploadedFile(objectName?: string, bucketName?: string): void {
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

    private uploadFile(): void {
        if (!this.selectedFile) {
            console.warn('No file selected');
            return;
        }
        const bucket = 'oaaaqa';
        this.commonService.uploadFileToOci(bucket, this.selectedFile)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    this.dto.interviewResultBucketName = data.bucketName;
                    this.dto.interviewResultFileName = data.objectName;
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false })
                }
            });
    }

    private getEmptyDto(): ExternalReviewersInterviewRegistrationInfo {
        return {
            mainSpecializationAr: '',
            mainSpecializationEn: '',
            requestType: '',
            registrationStatus: '',
            user: {
                mobileNo: '',
                civilNo: '',
                fullNameAr: '',
                fullNameEn: '',
                jobTitle: '',
                email: '',
                title: '',
                birthDate: '',
                organization: '',
                phoneNo: '',
                streetAddress: '',
                state:'',
                zipCode:'',
                passportNo: '',
                passportBucketName: '',
                passportFileName: '',
                city: {
                    cityNameAr: '',
                    cityNameEn: '',
                    country: {
                        countryNameAr: '',
                        countryNameEn: '',
                        countryCode: ''
                    }
                }
            },
            externalReviewInterviewResult: {
                interviewStatus: '',
                interviewResultFileName: '',
            }
        };
    }

    private handleError(error: any) {
        let generalMessage = 'PAGES.COMMON.MESSAGES.GENERAL_ERROR';
        let message = 'PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.MESSAGES.' + error;
        if (this.translate.instant(message) === message) {
            message = generalMessage;
        }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white', autohide: false
        });
    }

    private handleSuccess(successMsg: string) {
        this.toastService.show(this.translate.instant(successMsg), {
            classname: 'bg-success text-white',
            delay: 3000
        });
    }


    onTextChange(): void {
        const result = limitWords(this.dto.interviewNotes || '', 250);
        this.dto.interviewNotes = result.trimmedText;
    }
}
