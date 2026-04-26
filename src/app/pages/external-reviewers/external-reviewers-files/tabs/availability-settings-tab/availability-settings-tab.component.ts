import {Component, Input, OnInit} from '@angular/core';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';
import {ExternalReviewer} from '../../../types/external-reviewer';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {CommonService} from 'src/app/core/services/common.service';
import {Audit} from 'src/app/core/models/audit';
import {ExternalReviewerManagementService} from '../../../services/external-reviewer-management.service';
import {ExternalReviewerEventsService} from '../../../services/external-reviewer-events.service';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
    selector: 'app-availability-settings-tab',
    templateUrl: './availability-settings-tab.component.html',
    styleUrl: './availability-settings-tab.component.scss'
})
export class AvailabilitySettingsTabComponent extends BaseTabComponent implements OnInit {

    @Input() externalReviewer !: ExternalReviewer;
    @Input() isEditMode: boolean = false;


    selectedFileName: string | null = null;
    selectedFile: File | null = null;

    auditLogs: Audit[] = [];
    paginatedAuditLogs: Audit[] = [];

    auditPage: number = 1;
    auditPageSize: number = 5;
    auditTotal: number = 0;


    list: any[] = [];

    constructor(
        public translate: TranslateService,
        private commonService: CommonService,
        private externalReviewerManagementService: ExternalReviewerManagementService,
        private externalReviewerEventsService: ExternalReviewerEventsService,
        private toastService: ToastService
    ) {
        super();
    }


    ngOnInit(): void {
        this.externalReviewerEventsService.reviewerUpdated$.subscribe(() => {
            this.externalReviewer.currentIsAvailable = this.externalReviewer.isAvailable;
            this.getAuditLogs(); // or any other function
        });
        this.getAuditLogs();
    }


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
                    this.externalReviewer.availabilityChangeFileBucketName = data.bucketName;
                    this.externalReviewer.availabilityChangeFileName = data.objectName;
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

    getAuditLogs(): void {
        this.externalReviewerManagementService.getAvailabilityAudit(this.externalReviewer.id).subscribe({
            next: (logs) => {
                this.auditLogs = logs.data;
                this.auditTotal = logs.data.length;
                this.paginateLogItems();
            },
            error: (err) => {
                console.error('Failed to load audit logs:', err);
            }
        });
    }


    paginateLogItems() {
        const start = (this.auditPage - 1) * this.auditPageSize;
        const end = start + this.auditPageSize;
        this.paginatedAuditLogs = this.auditLogs.slice(start, end);
    }

    onAuditPageChange(page: number) {
        this.auditPage = page;
        this.paginateLogItems();
    }

    onSave(): void {
        // Perform saving logic here
        console.log('Availability settings saved');
    }


    onTextChange(): void {
        const result = limitWords(this.externalReviewer.availabilityChangeReasons || '', 250);
        this.externalReviewer.availabilityChangeReasons = result.trimmedText;
    }

}
