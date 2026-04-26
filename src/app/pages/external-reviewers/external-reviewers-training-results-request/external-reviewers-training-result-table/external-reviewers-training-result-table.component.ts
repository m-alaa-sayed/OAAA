import {Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ExternalReviewerTrainingResult} from '../../types/ExternalReviewerTrainingResult';
import {CommonService} from 'src/app/core/services/common.service';
import {ModalConfirmComponent} from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import {BaseModal} from 'src/app/shared/base-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {ToastService} from "../../../../core/services/toast-service";

@Component({
    selector: 'app-external-reviewers-training-result-table',
    templateUrl: './external-reviewers-training-result-table.component.html',
    styleUrl: './external-reviewers-training-result-table.component.scss'
})
export class ExternalReviewersTrainingResultTableComponent extends BaseModal implements OnChanges {

    @Input() externalReviewerTrainingResultList: ExternalReviewerTrainingResult[] = [];

    @Input() isEditMode: boolean = true;
    @Input() isGMEditMode: boolean = false;

    @Input() canDelete: boolean = true;

    selectedFile: File | null = null;
    isJustificationEnabled: boolean = false;
    showJustificationErrors = false;



    @Output() deleteTrainingEventEmitter = new EventEmitter<ExternalReviewerTrainingResult>();

    currentTrainingStatusOptions: any[] = [];
    showJustificationsColumn: boolean = false;
    role = 'CSEQAGM';

    //instead of the @Input directly
    viewList: ExternalReviewerTrainingResult[] = [];

    
    // Backup of original training statuses for comparison
    originalTrainingStatuses: Map<any, string> = new Map();


    trainingStatusOptionsForCreate = [
        {value: 'PASSED_TRAINING', label: 'PASSED_TRAINING'},
        {value: 'NOT_PASSED_TRAINING', label: 'NOT_PASSED_TRAINING'}
    ];

    trainingStatusOptionsForEdit = [
        {value: 'PASSED_TRAINING_UNDER_APPROVE', label: 'PASSED_TRAINING'},
        {value: 'NOT_PASSED_TRAINING_UNDER_APPROVE', label: 'NOT_PASSED_TRAINING'}
    ];

    trainingStatusOptions = [
        {value: 'PASSED_TRAINING', label: 'PASSED_TRAINING'},
        {value: 'NOT_PASSED_TRAINING', label: 'NOT_PASSED_TRAINING'},
        {value: 'PASSED_TRAINING_UNDER_APPROVE', label: 'PASSED_TRAINING_UNDER_APPROVE'},
        {value: 'NOT_PASSED_TRAINING_UNDER_APPROVE', label: 'NOT_PASSED_TRAINING_UNDER_APPROVE'}
    ];

    constructor(
        public translate: TranslateService,
        private commonService: CommonService,
        public override modalService: NgbModal,
        private toastService: ToastService
    ) {
        super(modalService);
    }

    ngOnInit() {
        this.updateTrainingStatusOptions();
        this.backupOriginalTrainingStatuses();
    }

    hasValue(v: unknown): boolean {
        return v !== undefined && v !== null && v !== '';
    }
    
    
    ngOnChanges(changes: SimpleChanges) {
        // Backup training statuses whenever the input list changes
        this.backupOriginalTrainingStatuses();

       
        if (changes['isEditMode'] || changes['isGMEditMode']) {
            this.updateTrainingStatusOptions();
        }
    }
    
    backupOriginalTrainingStatuses() {
        this.originalTrainingStatuses.clear();
        this.externalReviewerTrainingResultList.forEach((row, index) => {
            this.originalTrainingStatuses.set(row, row.trainingStatus || '');
        });
    }


    updateTrainingStatusOptions() {
        if (this.isEditMode || this.isGMEditMode) {
            this.currentTrainingStatusOptions = this.trainingStatusOptionsForEdit;
        } else {
            if (this.canDelete) {
                this.currentTrainingStatusOptions = this.trainingStatusOptionsForCreate;
            } else {
                this.currentTrainingStatusOptions = this.trainingStatusOptions;
            }
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


    onFileSelected(row: ExternalReviewerTrainingResult, event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadFile(row);
        }
    }

    uploadFile(row: ExternalReviewerTrainingResult): void {
        if (!this.selectedFile) {
            console.warn('No file selected');
            return;
        }
        const bucket = 'oaaaqa';
        this.commonService.uploadFileToOci(bucket, this.selectedFile)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    row.trainingResultBucketName = data.bucketName;
                    row.trainingResultFileName = data.objectName;
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                        classname: 'bg-danger text-white', autohide: false
                    })
                }
            });
    }


    deleteResult(row: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, {
            backdrop: 'static',
            keyboard: false,
            size: 'sm',
            windowClass: 'with-backdrop'
        });

        modalRef.componentInstance.title = 'حذف السجل';
        modalRef.componentInstance.message = 'هل أنت متأكد من حذف هذا السجل؟';

        modalRef.componentInstance.confirmEvent.subscribe(() => {

            this.deleteTrainingEventEmitter.emit(row);
            // const index = this.savedResultsList.findIndex(item => item.id === row.data.id);
            // if (index !== -1) {
            //   this.savedResultsList.splice(index, 1);
            // }
        });

        modalRef.componentInstance.declineEvent.subscribe(() => {
            console.log('Modal cancelled');
        });
    }


    onTextChange(trainingNotes: string): void {
        const result = limitWords(trainingNotes || '', 250);
        trainingNotes = result.trimmedText;
    }

    onTrainingStatusChange(row: ExternalReviewerTrainingResult, newValue: string): void {
        // initial training status stored in originalTrainingStatuses
        const initial = this.getInitialTrainingStatus(row);
        console.log('Initial:', initial, 'New:', newValue);

        // Check if justification should be enabled based on the new value
        const shouldEnableJustification = newValue !== initial;
        
        // If justification editing is disabled (new value equals initial), clear the justification field
        if (!shouldEnableJustification) {
            row.justification = '';
        }

        // Note: We no longer set a global isJustificationEnabled flag here
        // The justification enablement is now handled per row in the template
    }

    private getInitialTrainingStatus(row: ExternalReviewerTrainingResult): string {
        // Get the initial/original training status for this row from our backup
        return this.originalTrainingStatuses.get(row) || '';
    }

    isJustificationEnabledForRow(row: ExternalReviewerTrainingResult): boolean {
        const initial = this.getInitialTrainingStatus(row);
        const current = row.gmTrainingStatus || '';
        return current !== initial;
    }

    /**
     * Header-level helper: returns true if any row has justification enabled.
     * Used to show the required asterisk in the column header when the field is effectively enabled somewhere.
     */
    hasAnyJustificationEnabled(): boolean {
        const list = this.externalReviewerTrainingResultList || [];
        for (const r of list) {
            if (this.isJustificationEnabledForRow(r)) return true;
        }
        return false;
    }

    validateRequiredJustifications(): { valid: boolean; invalidIndexes: number[] } {
        this.showJustificationErrors = true;

        const invalidIndexes: number[] = (this.externalReviewerTrainingResultList || []).reduce((acc, row, idx) => {
            // Check if justification is required for this specific row
            const justificationRequired = this.isJustificationEnabledForRow(row);
            
            if (justificationRequired) {
                const v = (row?.justification ?? '').toString().trim();
                if (!v.length) acc.push(idx);
            }
            return acc;
        }, [] as number[]);

        return { valid: invalidIndexes.length === 0, invalidIndexes };
    }
}
