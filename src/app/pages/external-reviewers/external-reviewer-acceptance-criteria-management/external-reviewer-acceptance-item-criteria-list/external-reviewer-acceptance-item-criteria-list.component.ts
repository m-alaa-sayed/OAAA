import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ModalConfirmComponent} from "../../../../shared/app-modal-confirm/modal-confirm.component";
import {ToastService} from "../../../../core/services/toast-service";
import {
    ExternalReviewersAcceptanceCriteriaManagemenService
} from "../../services/external-reviewers-acceptance-criteria-managemen.service";
import {
    ExternalReviewerAcceptanceItemCriteriaDetailsComponent
} from "../external-reviewer-acceptance-item-criteria-details/external-reviewer-acceptance-item-criteria-details.component";
import {CriterionSubCriteria} from "../../types/acceptance-criteria/criterion-sub-criteria";
import {CriterionItem} from "../../types/acceptance-criteria/criterion-item";
import { GridReorderService } from 'src/app/core/services/grid-reorder.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-external-reviewers-acceptance-item-criteria-list',
    templateUrl: './external-reviewer-acceptance-item-criteria-list.component.html',
    styleUrl: './external-reviewer-acceptance-item-criteria-list.component.scss'
})
export class ExternalReviewerAcceptanceItemCriteriaListComponent implements OnInit, OnChanges, OnDestroy {

    @Input() module: 'CSEQA' | 'CHEQA' | 'OQF' = 'CHEQA';
    @Input() items: CriterionItem[] = [];
    @Input() criterionId?: number;
    @Input() subCriteriaId?: number;
    @Input() cartTitle?: string = '';
    @Input() isEditMode: boolean = false;

    @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() hideItemComponentEvent: EventEmitter<any> = new EventEmitter<any>();

    columns: any[] = [];
    actions: any[] = [];

    changedItemsOrder: {id: any, index: number}[] = [];
    originalItemsOrder: CriterionItem[] = [];
    draggable: boolean = false;
    
    private destroy$ = new Subject<void>();

    constructor(
        private criteriaManagementService: ExternalReviewersAcceptanceCriteriaManagemenService,
        public translate: TranslateService,
        private toastService: ToastService,
        private gridReorderService: GridReorderService,
        private modalService: NgbModal) {
        this.columns = [
            {
                field: 'nameAr',
                width: 360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.ITEM_NAME_AR'
            },
            {
                field: 'nameEn',
                width: 360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.ITEM_NAME_EN'
            },
            {
                field: 'type',
                width: 320,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.FIELD_TYPE',
                valueFormatter: (params: any) =>
                    params.value === 'NUMERIC' ?
                        this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.NUMERIC')
                        : this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MULTIPLE_CHOICE'),
            },
            {
                field: 'maxScore',
                headerName: this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.FINAL_GRADE')
            },
            {
                headerName: this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MANDATORY'),
                valueGetter: (params: any) =>
                    params.data.required === true ?
                        this.translate.instant('PAGES.COMMON.LABELS.YES')
                        : this.translate.instant('PAGES.COMMON.LABELS.NO'),
                cellRenderer: null,
                cellStyle: { textAlign: 'center' }
            },
            {
                field: 'status',
                headerName: this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.ITEM_STATUS'),
                valueFormatter: (params: any) =>
                    params.value === 'ACTIVE' ?
                        this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null,
                cellStyle: { textAlign: 'center' }
            }
        ];

    }

    ngOnInit(): void {
        if (this.isEditMode) {
            this.actions = [
                {
                    label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
                    icon: 'ri-pencil-fill',
                    callback: (row: any) => this.openItemsDetails(row.data)
                }, {
                    label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
                    icon: 'ri-delete-bin-fill text-danger',
                    callback: (row: any) => this.openDeleteModal(row.data.id)
                }
            ];
        }
        else {
            this.actions = [
                {
                    label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
                    icon: 'ri-eye-line',
                    callback: (row: any) => this.openItemsDetails(row.data)
                }
            ];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Reset drag state when subCriteriaId changes
        if (changes['subCriteriaId'] && !changes['subCriteriaId'].firstChange) {
            this.resetDragState();
        }
    }

    private resetDragState(): void {
        if (this.draggable) {
            this.draggable = false;
            this.changedItemsOrder = [];
            this.originalItemsOrder = [];
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async openItemsDetails(dto: CriterionItem | null) {
        const modalRef = this.modalService.open(ExternalReviewerAcceptanceItemCriteriaDetailsComponent, {
            backdrop: 'static',
            keyboard: true,
            windowClass: 'width-800-90-modal with-backdrop'
        });
        modalRef.componentInstance.title =
            this.translate.instant(dto?.id ? 'PAGES.COMMON.LABELS.EDIT' : 'PAGES.COMMON.LABELS.ADD') + ' '
            + this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.ITEMS_INFO');
        modalRef.componentInstance.isEditMode = this.isEditMode;
        modalRef.componentInstance.criterionId = this.criterionId;
        modalRef.componentInstance.subCriteriaId = this.subCriteriaId;
        modalRef.componentInstance.inputDto = dto;
        modalRef.componentInstance.confirmEvent.subscribe(async (data: CriterionItem) => {
            this.saveItem(data);
        });
        modalRef.componentInstance.declineEvent.subscribe(() => {
            console.log('Modal cancelled');
        });
    }

    async openDeleteModal(itemId: number) {
        const title = this.translate.instant("PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE");
        const message = this.translate.instant("PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE");
        
        ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
            if (confirmed) {
                this.deleteItem(itemId);
            }
        });
    }

    getCriterionById() {
        this.criteriaManagementService.getCriterionById(this.module, this.criterionId).subscribe({
            next: result => {
                let subCriteriaList: CriterionSubCriteria[] = result?.latestVersion?.subCriteriaList;
                let selectedSubCriteria: CriterionSubCriteria | undefined =
                    subCriteriaList?.find(sub => sub.id === this.subCriteriaId);
                if (selectedSubCriteria) this.items = selectedSubCriteria?.items;
                else this.items = [];
            }
        });
    }

    saveItem(itemDto: CriterionItem) {
        if (itemDto.id)
            this.criteriaManagementService.updateItem(itemDto).subscribe({
                next: data => {
                    this.getCriterionById();
                    this.handleSuccess('PAGES.COMMON.MESSAGES.EDIT_SUCCESS');
                },
                error: error => this.handleError(error)
            })
        else
            this.criteriaManagementService.createItem(itemDto).subscribe({
                next: data => {
                    this.getCriterionById();
                    this.handleSuccess('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY');
                },
                error: error => this.handleError(error)
            })
    }

    deleteItem(itemId: number) {
        this.criteriaManagementService.deleteItem(itemId, this.criterionId).subscribe({
            next: data => {
                this.getCriterionById();
                this.handleSuccess('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY');
            },
            error: error => this.handleError(error)
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

    changeDraggableState() {
        if (!this.draggable) {
            // Store original order before enabling drag mode
            this.originalItemsOrder = [...this.items];
            console.log('Original order stored:', this.originalItemsOrder);
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

        this.gridReorderService.updateItemsOrder({
            module: this.module,
            items: this.changedItemsOrder,
            type: 'ITEM',
            parentId: this.subCriteriaId || null
        }).subscribe({
            next: () => {
                this.draggable = false;
                this.changedItemsOrder = [];
                this.originalItemsOrder = [];
                this.handleSuccess('PAGES.COMMON.MESSAGES.CHANGES_SAVED_SUCCESSFULLY');
                console.log('Changed Bands order to be saved:', this.changedItemsOrder);
                
            },
            error: (error) => this.handleError(error)
        });
    }
        

    cancelNewOrder() {
        console.log('Cancelled order change.');
        
        // Restore the original order
        if (this.originalItemsOrder.length > 0) {
            this.items = [...this.originalItemsOrder];
            console.log('Original order restored:', this.items);
        }

        // Reset state
        this.draggable = false;
        this.changedItemsOrder = [];
        this.originalItemsOrder = [];
    }
}
