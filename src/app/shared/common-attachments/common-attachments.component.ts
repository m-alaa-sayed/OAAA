import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseModal } from '../base-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalReviewerAttachments } from 'src/app/pages/external-reviewers/types/external-reviewer-attachments';
import { CommonService } from "../../core/services/common.service";
import { TranslateService } from '@ngx-translate/core';
import { UserState } from 'src/app/core/states/user.state';
import { User } from 'src/app/core/models/auth.models';
import { limitWords } from '../utils/word-utils';
import {ToastService} from "../../core/services/toast-service";
import { Permission } from 'src/app/core/enum/permission';

@Component({
    selector: 'app-common-attachments',
    templateUrl: './common-attachments.component.html',
    styleUrl: './common-attachments.component.scss'
})
export class CommonAttachmentsComponent extends BaseModal {


    attachmentObject: ExternalReviewerAttachments = {} as ExternalReviewerAttachments;

    @Input() attachmentList !: ExternalReviewerAttachments[];
    @Input() isEditMode: boolean = true;
    @Output() attachmentAddEventEmitter = new EventEmitter<ExternalReviewerAttachments>();
    @Output() attachmentRemoveEventEmitter = new EventEmitter<number>();
    @Input() showResponsibleData : boolean = true;
    @Input() permissionsList : Permission[] = [];

    selectedFileName: any;
    selectedFile: File | null = null;

    currentUser!: User;


    currentPage = 1;
    itemsPerPage = 5; // Or any number you want

    constructor(
        public override modalService: NgbModal,
        public commonService: CommonService,
        public translate: TranslateService,
        private toastService: ToastService
    ) {
        super(modalService);
        UserState.getUserState().subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
    }


    get paginatedList() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.attachmentList.slice(startIndex, startIndex + this.itemsPerPage);
    }

    // Optional: Get total pages
    get totalPages(): number {
        return Math.ceil(this.attachmentList.length / this.itemsPerPage);
    }


    removeRow(index: number) {
        this.attachmentRemoveEventEmitter.emit(index);
    }

    cancelAttachment() {
        this.attachmentObject = {};
        this.close();
    }

    addAttachment() {
        if (!this.attachmentList) {
            this.attachmentList = [];
        }
        this.attachmentAddEventEmitter.emit(this.attachmentObject);
        this.attachmentObject = {};
        this.close();
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
                    this.attachmentObject.fileBucketName = response.data.bucketName;
                    this.attachmentObject.fileName = response.data.objectName;

                    this.selectedFileName = response.data.objectName;
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                        classname: 'bg-danger text-white', autohide: false
                    })
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


    isAttachmentInvalid(): boolean {
        const { fileNameEn, fileNameAr, fileBucketName } = this.attachmentObject;
        return !fileNameEn?.trim() || !fileNameAr?.trim() || !fileBucketName?.trim();
    }

    onTextChange(): void {
        const result = limitWords(this.attachmentObject.notes || '', 250);
        this.attachmentObject.notes = result.trimmedText;
    }

}
