import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {merge, of, Subject} from 'rxjs';
import {catchError, mergeMap, filter, takeUntil} from 'rxjs/operators';

import {Criterion} from '../types/acceptance-criteria/criterion';
import {CriterionVersion} from '../types/acceptance-criteria/criterion-version';
import {
    ExternalReviewerAcceptanceCriterionAttachment
} from '../types/acceptance-criteria/external-reviewer-acceptance-criterion-attachment';
import {
    ExternalReviewersAcceptanceCriteriaManagemenService
} from '../services/external-reviewers-acceptance-criteria-managemen.service';
import {ToastService} from '../../../core/services/toast-service';
import {ModalConfirmComponent} from '../../../shared/app-modal-confirm/modal-confirm.component';
import {
    ExternalReviewerAcceptanceMainCriteriaDetailsComponent
} from './external-reviewer-acceptance-main-criteria-details/external-reviewer-acceptance-main-criteria-details.component';
import { GridReorderService } from 'src/app/core/services/grid-reorder.service';

@Component({
    selector: 'app-external-reviewer-acceptance-criteria-management',
    templateUrl: './external-reviewer-acceptance-criteria-management.component.html',
    styleUrl: './external-reviewer-acceptance-criteria-management.component.scss'
})
export class ExternalReviewerAcceptanceCriteriaManagementComponent implements OnInit, OnDestroy {

    module: 'CSEQA' | 'CHEQA' | 'OQF' = 'CHEQA';
    pageTitle: string = '';
    columns: any[] = [];
    actions: any[] = [];
    dtos: Criterion[] = [];
    attachments: ExternalReviewerAcceptanceCriterionAttachment[] = [];

    changedItemsOrder: {id: any, index: number}[] = [];
    originalCriterionOrder: Criterion[] = [];
    draggable = false;

    private destroy$ = new Subject<void>();

    constructor(
        private criteriaManagementService: ExternalReviewersAcceptanceCriteriaManagemenService,
        private modalService: NgbModal,
        public translate: TranslateService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router,
        private gridReorderService: GridReorderService
    ) {        
        this.columns = [
            {
                field: 'latestVersion.nameAr',
                width:360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_NAME_AR'
            },
            {
                field: 'latestVersion.nameEn',
                width:360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_NAME_EN'
            },
            {
                field: 'latestVersion.status',
                width:320,
                headerName: 'PAGES.COMMON.LABELS.STATUS',
                valueFormatter: (params: any) =>
                    params.value === 'ACTIVE'
                        ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null,
                cellStyle: { textAlign: 'center' }
            }
        ];

        this.actions = [
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
                icon: 'ri-pencil-fill',
                callback: (row: any) => this.openMainCriteriaDetails(row.data.latestVersion, row.data.id)
            },
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
                icon: 'ri-delete-bin-fill text-danger',
                callback: (row: any) => this.openDeleteModal(row.data.id)
            },
            {
                label: this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.SUBCATEGORY'),
                icon: 'ri-settings-3-fill',
                callback: (row: any) => {
                    this.router.navigate(['/jawda/external-reviewers/external-reviewers-acceptance-sub-criteria-list', this.module, row.data.id]);
                }
            }
        ];
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.module = params.get('module') as 'CSEQA' | 'CHEQA' | 'OQF' || 'CSEQA';
            
            this.pageTitle = 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.PAGE_TITLE_'+this.module;
            
            this.loadData();
        });

        // Listen to router navigation events to disable dragging when URL changes
        this.setupDragDisableOnNavigation();
    }

    private setupDragDisableOnNavigation(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.resetDragState());
    }

    private resetDragState(): void {
        if (this.draggable) {
            this.draggable = false;
            this.changedItemsOrder = [];
            this.originalCriterionOrder = [];
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData(): void {
        merge(
            this.loadCriteriaSafely(),
            this.loadAttachmentsSafely()
        ).subscribe();
    }

    private loadCriteriaSafely(): any {
        return this.criteriaManagementService.getAllCriteriaWithLatestVersions(this.module).pipe(
            mergeMap(data => {
                this.dtos = data.map(dto => {
                    dto.latestVersion.criterionId = dto.id;
                    return dto;
                });
                return of(null);
            }),
            catchError(error => {
                console.error('Error loading criterion', error);
                this.dtos = [];
                return of(null);
            })
        );
    }

    private loadAttachmentsSafely(): any {
        return this.criteriaManagementService.getExternalReviewerAcceptanceCriterionAttachments(this.module).pipe(
            mergeMap(attachments => {
                this.attachments = attachments.map((attachment: any) => {
                    return {
                        id: attachment.id,
                        fileNameAr: attachment.attachmentNameAr,
                        fileNameEn: attachment.attachmentNameEn,
                        fileBucketName: attachment.attachmentFileBucketName,
                        fileName: attachment.attachmentFileObjectName,
                        notes: attachment.notes,
                        user: attachment.user
                    }
                });
                return of(null);
            }),
            catchError(error => {
                console.error('Error loading attachments', error);
                this.attachments = [];
                return of(null);
            })
        );
    }

    async openMainCriteriaDetails(dto: CriterionVersion | null, criterionId?: number) {
        const modalRef = this.modalService.open(ExternalReviewerAcceptanceMainCriteriaDetailsComponent, {
            backdrop: 'static',
            keyboard: true,
            windowClass: 'width-800-90-modal with-backdrop'
        });
        modalRef.componentInstance.title =
            this.translate.instant(dto?.id ? 'PAGES.COMMON.LABELS.EDIT' : 'PAGES.COMMON.LABELS.ADD') +
            ' ' +
            this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_INFO');
        modalRef.componentInstance.criterionId = criterionId;
        modalRef.componentInstance.inputDto = dto;
        modalRef.componentInstance.confirmEvent.subscribe(async (data: CriterionVersion) => {
            if (data.id) {
                this.criteriaManagementService.updateCriterion(this.module, data).subscribe({
                    next: () => {
                        this.handleSuccess('PAGES.COMMON.MESSAGES.EDIT_SUCCESS');
                        this.loadCriteriaSafely().subscribe();
                    },
                    error: error => this.handleError(error)
                });
            } else {
                this.criteriaManagementService.createCriterion(this.module, data).subscribe({
                    next: () => {
                        this.handleSuccess('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY');
                        this.loadCriteriaSafely().subscribe();
                    },
                    error: error => this.handleError(error)
                });
            }
        });
    }

    async openDeleteModal(id: number) {
        const title = this.translate.instant('PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE');
        const message = this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE');
        
        ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
            if (confirmed) {
                this.criteriaManagementService.deleteCriterion(this.module, id).subscribe({
                    next: () => {
                        this.handleSuccess('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY');
                        this.loadCriteriaSafely().subscribe();
                    },
                    error: error => this.handleError(error)
                });
            }
        });
    }

    handleError(error: any) {
        let generalMessage = 'PAGES.COMMON.MESSAGES.GENERAL_ERROR';
        let message = 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.MESSAGES.' + error;
        if (this.translate.instant(message) === message) {
            message = generalMessage;
        }
        this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
    }

    handleSuccess(successMsg: string) {
        this.toastService.show(this.translate.instant(successMsg), {
            classname: 'bg-success text-white',
            delay: 3000
        });
    }

    addAttchment(attachement: any): void {
        this.attachments.push(attachement);
        const attachementObj = {
            attachmentNameAr: attachement.fileNameAr,
            attachmentNameEn: attachement.fileNameEn,
            attachmentFileBucketName: attachement.fileBucketName,
            attachmentFileObjectName: attachement.fileName,
            notes: attachement.notes,
            module: this.module,
            user: attachement.user
        }        
        this.criteriaManagementService.addExternalReviewerAcceptanceCriterionAttachment(this.module, attachementObj).subscribe({
            next: () => {
                this.handleSuccess('PAGES.COMMON.MESSAGES.ADD_SUCCESS');
            },
            error: error => this.handleError(error)
        });
    }

    removeAttchment(index: number): void {
        const removed = this.attachments.splice(index, 1)[0];
        if (removed?.id) {
            this.criteriaManagementService.deleteExternalReviewerAcceptanceCriterionAttachment(this.module, removed.id).subscribe({
                next: () => this.handleSuccess('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
                error: err => this.handleError(err)
            });
        }
    }


    prepareNewDocument() {
        return {
            attachmentNameAr: '',
            attachmentNameEn: '',
            attachmentFileBucketName: '',
            attachmentFileObjectName: '',
            notes: '',
            module: this.module,
        };
    }

    changeDraggableState() {
        if (!this.draggable) {
            // Store original order before enabling drag mode
            this.originalCriterionOrder = [...this.dtos];
            console.log('Original order stored:', this.originalCriterionOrder);
        }
        this.draggable = !this.draggable;
    }
    
    receiveNewOrder($event: any) {
        this.changedItemsOrder = $event;
    }

    saveNewOrder() {
        if (this.changedItemsOrder.length === 0) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.NO_CHANGES_TO_SAVE'), {
                classname: 'bg-warning text-white',
                delay: 3000
            });
            return;
        }
        this.gridReorderService.updateItemsOrder({ module: this.module, items: this.changedItemsOrder, type: 'CRITERION', parentId: null }).subscribe({
            next: () => {
                this.draggable = false;
                this.changedItemsOrder = [];
                this.originalCriterionOrder = [];
                this.handleSuccess('PAGES.COMMON.MESSAGES.CHANGES_SAVED_SUCCESSFULLY');
            },
            error: error => {
                this.handleError(error);
            }
        });
    }

    cancelNewOrder() {
        console.log('Cancelled order change.');

        // Restore the original order
        if (this.originalCriterionOrder.length > 0) {
            this.dtos = [...this.originalCriterionOrder];
            console.log('Original order restored:', this.dtos);
        }

        // Reset state
        this.draggable = false;
        this.changedItemsOrder = [];
        this.originalCriterionOrder = [];
    }
}
