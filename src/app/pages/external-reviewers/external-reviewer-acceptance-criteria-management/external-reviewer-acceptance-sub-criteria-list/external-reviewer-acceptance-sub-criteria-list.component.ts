import {Component, NgZone, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ModalConfirmComponent} from "../../../../shared/app-modal-confirm/modal-confirm.component";
import {ToastService} from "../../../../core/services/toast-service";
import {CriterionSubCriteria} from "../../types/acceptance-criteria/criterion-sub-criteria";
import {CriterionItem} from "../../types/acceptance-criteria/criterion-item";
import {
    ExternalReviewersAcceptanceCriteriaManagemenService
} from "../../services/external-reviewers-acceptance-criteria-managemen.service";
import {
    ExternalReviewerAcceptanceSubCriteriaDetailsComponent
} from "../external-reviewer-acceptance-sub-criteria-details/external-reviewer-acceptance-sub-criteria-details.component";
import {ActivatedRoute, Router} from "@angular/router";
import { GridReorderService } from 'src/app/core/services/grid-reorder.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Permission } from 'src/app/core/enum/permission';

interface permissionsList {
    VIEW: Permission[],
    ADD: Permission[],
    UPDATE: Permission[],
    DELETE: Permission[],
    PUBLISH: Permission[],
}

@Component({
    selector: 'app-external-reviewers-acceptance-sub-criteria-list',
    templateUrl: './external-reviewer-acceptance-sub-criteria-list.component.html',
    styleUrl: './external-reviewer-acceptance-sub-criteria-list.component.scss'
})
export class ExternalReviewerAcceptanceSubCriteriaListComponent implements OnInit {
    protected readonly Permission = Permission;
   
    columns: any[] = [];
    actions: any[] = [];
    selectedItems: CriterionItem[] = [];
    selectedItemsCartTitle: string = '';
    criterionId?: number;
    versionId?: number;
    selectedSubCriteriaId?: number;
    showSubCriteria: boolean = true;
    showItems: boolean = false;
    isEditMode: boolean = false;
    isPublished: boolean = false;
    module: 'CSEQA' | 'CHEQA' | 'OQF' = 'CHEQA';
    subCriteriaList: CriterionSubCriteria[] = [];
    pageTitle: string = '';
    cartTitle: string = '';

    changedItemsOrder: {id: any, index: number}[] = [];
    originalSubCriteriaOrder: CriterionSubCriteria[] = [];
    draggable = false;

    permissionsList = {
        VIEW: [].filter(Boolean) as Permission[],
        ADD: [].filter(Boolean) as Permission[],
        UPDATE: [].filter(Boolean) as Permission[],
        DELETE: [].filter(Boolean) as Permission[],
        PUBLISH: [].filter(Boolean) as Permission[],
    }

    constructor(
        private criteriaManagementService: ExternalReviewersAcceptanceCriteriaManagemenService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private toastService: ToastService,
        private ngZone: NgZone,
        private gridReorderService: GridReorderService,
        private authService: AuthService,
        public translate: TranslateService) {
        this.columns = [
            {
                field: 'nameAr',
                width:360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.SUBCATEGORY_NAME_AR'
            },
            {
                field: 'nameEn',
                width:360,
                headerName: 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.SUBCATEGORY_NAME_EN'
            },
            {
                field: 'status', headerName: 'PAGES.COMMON.LABELS.STATUS',
                width:320,
                valueFormatter: (params: any) =>
                    params.value === 'ACTIVE' ?
                        this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null,
                cellStyle: {textAlign: 'center'}
            }
        ];
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.module = (params.get('module') as 'CSEQA' | 'CHEQA' | 'OQF') || 'CSEQA';
            this.pageTitle = this.getPageTitleByModule(this.module);

            this.permissionsList = {
                VIEW: [
                    this.module == 'CSEQA' && Permission.CSEQA_ER_Acceptance_CRITERIA_VIEW, 
                    this.module == 'CHEQA' && Permission.CHEQA_ER_Acceptance_CRITERIA_VIEW,
                    this.module == 'OQF' && Permission.OQF_ER_Acceptance_CRITERIA_VIEW].filter(Boolean) as Permission[],
                ADD: [
                    this.module == 'CSEQA' && Permission.CSEQA_ER_Acceptance_CRITERIA_ADD, 
                    this.module == 'CHEQA' && Permission.CHEQA_ER_Acceptance_CRITERIA_ADD, 
                    this.module == 'OQF' && Permission.OQF_ER_Acceptance_CRITERIA_ADD].filter(Boolean) as Permission[],
                UPDATE: [
                    this.module == 'CSEQA' && Permission.CSEQA_ER_Acceptance_CRITERIA_UPDATE,
                    this.module == 'CHEQA' && Permission.CHEQA_ER_Acceptance_CRITERIA_UPDATE, 
                    this.module == 'OQF' && Permission.OQF_ER_Acceptance_CRITERIA_UPDATE].filter(Boolean) as Permission[],
                DELETE: [
                    this.module == 'CSEQA' && Permission.CSEQA_ER_Acceptance_CRITERIA_DELETE, 
                    this.module == 'CHEQA' && Permission.CHEQA_ER_Acceptance_CRITERIA_DELETE, 
                    this.module == 'OQF' && Permission.OQF_ER_Acceptance_CRITERIA_DELETE].filter(Boolean) as Permission[],
                PUBLISH: [
                    this.module == 'CSEQA' && Permission.CSEQA_ER_Acceptance_CRITERIA_PUBLISH, 
                    this.module == 'CHEQA' && Permission.CHEQA_ER_Acceptance_CRITERIA_PUBLISH, 
                    this.module == 'OQF' && Permission.OQF_ER_Acceptance_CRITERIA_PUBLISH].filter(Boolean) as Permission[]
            }

            this.criterionId = this.parseRouteParam(params.get('criterionId'));
            this.versionId = this.parseRouteParam(params.get('versionId'));
            this.isEditMode = !this.versionId;

            if (!this.isEditMode) {
                this.getCriterionByIdAndVersionId();
            } else {
                this.getCriterionById();
            }
            this.actions = this.buildActions();
        });
    }

    async openSubCriteriaDetails(dto: CriterionSubCriteria | null) {
        const modalRef = this.modalService.open(ExternalReviewerAcceptanceSubCriteriaDetailsComponent, {
            backdrop: 'static',
            keyboard: true,
            windowClass: 'width-800-90-modal with-backdrop'
        });
        modalRef.componentInstance.title =
            this.translate.instant(dto?.id ? 'PAGES.COMMON.LABELS.EDIT' : 'PAGES.COMMON.LABELS.ADD') + ' '
            + this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_SUBCATEGORIES_INFO');
        modalRef.componentInstance.isEditMode = this.isEditMode;
        modalRef.componentInstance.criterionId = this.criterionId;
        modalRef.componentInstance.inputDto = dto;
        modalRef.componentInstance.confirmEvent.subscribe(async (data: CriterionSubCriteria) => {
            this.saveSubCriteriaDto(data);
        });
    }

    async openDeleteModal(id: number) {
        const title = this.translate.instant("PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE");
        const message = this.translate.instant("PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE");

        ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
            if (confirmed) {
                this.deleteSubCriteria(id);
            }
        });
    }

    saveSubCriteriaDto(subCriteriaDto: CriterionSubCriteria) {
        if (subCriteriaDto.id) {
            console.log('---------- if updateSubCriteriaDto if ----------');
            this.criteriaManagementService.updateSubCriterion(subCriteriaDto).subscribe({
                next: data => {
                    this.getCriterionById();
                    this.hideItemComponent();
                    this.handleSuccess('PAGES.COMMON.MESSAGES.EDIT_SUCCESS');
                },
                error: error => this.handleError(error)
            })
        }
        else{

            console.log('---------- else saveSubCriteriaDto ----------');
            this.criteriaManagementService.createSubCriterion(subCriteriaDto).subscribe({
                next: data => {
                    this.getCriterionById();
                    this.hideItemComponent();
                    this.handleSuccess('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY');
                },
                error: error => this.handleError(error)
            })
        }
    }

    deleteSubCriteria(subCriteriaId: any) {
        this.criteriaManagementService.deleteSubCriterion(subCriteriaId, this.criterionId).subscribe({
            next: data => {
                this.getCriterionById();
                this.handleSuccess('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY');
            },
            error: error => this.handleError(error)
        });
    }

    previous() {
        this.router.navigate(['/jawda/external-reviewers/external-reviewer-acceptance-criteria-management', this.module]);
    }

    publish() {
        console.log('---------- Pushed ----------');
        this.criteriaManagementService.publishVersion(this.module, this.versionId).subscribe({
            next: data => {
                this.handleSuccess('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY');
                this.previous();
            },
            error: error => this.handleError(error)
        });


    }

    hideItemComponent() {
        this.showSubCriteria = true;
        this.showItems = false;
        this.selectedSubCriteriaId = undefined;
        this.selectedItems = [];
    }

    private handleError(error: any) {
        let generalMessage = 'PAGES.COMMON.MESSAGES.GENERAL_ERROR';
        let message = 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.MESSAGES.' + error;
        if (this.translate.instant(message) === message) {
            message = generalMessage;
        }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white', autohide: false });
    }

    private handleSuccess(successMsg: string) {
        this.toastService.show(this.translate.instant(successMsg), {
            classname: 'bg-success text-white',
            delay: 3000
        });
    }

    private isArabicLang() {
        return this.translate.currentLang === 'ar';
    }

    private parseRouteParam(param: string | null): number | undefined {
        return param ? +param : undefined;
    }

    private getPageTitleByModule(module: string): string {
        const baseKey = 'PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.PAGE_TITLE_';
        return this.translate.instant(`${baseKey}${module}`);
    }

    private buildActions(): any[] {
        const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
        const manageItemsAction = {
            label: this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MANAGE_ITEMS'),
            icon: 'ri-settings-3-fill',
            callback: (row: any) => {
                this.ngZone.run(() => {
                    this.showSubCriteria = false;
                    this.showItems = true;
                    this.selectedItems = row.data.items;
                    this.selectedSubCriteriaId = row.data.id;
                    this.selectedItemsCartTitle =
                        this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.ITEMS_INFO') +
                        ' - ' +
                        (this.isArabicLang() ? row.data.nameAr : row.data.nameEn);
                });
            },
            show: () => this.module == 'CSEQA' 
                    ? userPermissions.includes(Permission.CSEQA_ER_Acceptance_CRITERIA_VIEW) 
                    : this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Acceptance_CRITERIA_VIEW) 
                    : this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_Acceptance_CRITERIA_VIEW) : false
        };

        if (!this.isEditMode) {
            return [
                {
                    label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
                    icon: 'ri-eye-line',
                    callback: (row: any) => this.openSubCriteriaDetails(row.data),
                    show: () => this.module == 'CSEQA' 
                        ? userPermissions.includes(Permission.CSEQA_ER_Acceptance_CRITERIA_VIEW) 
                        : this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Acceptance_CRITERIA_VIEW) 
                        : this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_Acceptance_CRITERIA_VIEW) : false
                },
                manageItemsAction
            ];
        }

        return [
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
                icon: 'ri-pencil-fill',
                callback: (row: any) => this.openSubCriteriaDetails(row.data),
                show: () => this.module == 'CSEQA' 
                    ? userPermissions.includes(Permission.CSEQA_ER_Acceptance_CRITERIA_UPDATE) 
                    : this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Acceptance_CRITERIA_UPDATE) 
                    : this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_Acceptance_CRITERIA_UPDATE) : false
            },
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
                icon: 'ri-delete-bin-fill text-danger',
                callback: (row: any) => this.openDeleteModal(row.data.id),
                show: () => this.module == 'CSEQA' 
                    ? userPermissions.includes(Permission.CSEQA_ER_Acceptance_CRITERIA_DELETE) 
                    : this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Acceptance_CRITERIA_DELETE) 
                    : this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_Acceptance_CRITERIA_DELETE) : false
            },
            manageItemsAction
        ];
    }

    private getCriterionById(): void {
        this.criteriaManagementService.getCriterionById(this.module, this.criterionId).subscribe({
            next: result => {
                console.log('---------- getCriterionById result ----------');
                console.log(result);

                this.subCriteriaList = result.latestVersion.subCriteriaList;
                this.versionId = result.latestVersion.id;
                this.isPublished = result.latestVersion.isPublished;
                this.cartTitle =
                    this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_SUBCATEGORIES_INFO') +
                    ' - ' +
                    (this.isArabicLang() ? result.latestVersion.nameAr : result.latestVersion.nameEn);
            },
            error: error => this.handleError(error)
        });
    }

    private getCriterionByIdAndVersionId(): void {
        this.criteriaManagementService.getCriterionByIdAndVersionId(this.module, this.criterionId, this.versionId).subscribe({
            next: result => {
                const version = result.requestedVersion;
                this.subCriteriaList = version.subCriteriaList;
                this.isPublished = result.requestedVersion.isPublished;
                this.cartTitle =
                    this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.LABELS.MAIN_CATEGORY_SUBCATEGORIES_INFO') +
                    ' - ' +
                    (this.isArabicLang() ? version.nameAr : version.nameEn) +
                    ' - ' +
                    this.translate.instant('PAGES.COMMON.LABELS.VERSION') +
                    ' ' +
                    version.version;
            },
            error: error => this.handleError(error)
        });
    }

    changeDraggableState() {
        if (!this.draggable) {
            // Store original order before enabling drag mode
            this.originalSubCriteriaOrder = [...this.subCriteriaList];
            console.log('Original order stored:', this.originalSubCriteriaOrder);
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

        this.gridReorderService.updateItemsOrder({ module: this.module, items: this.changedItemsOrder, type: 'SUB_CRITERIA', parentId: this.versionId || null }).subscribe({
            next: () => {
                this.draggable = false;
                this.changedItemsOrder = [];
                this.originalSubCriteriaOrder = [];
                this.handleSuccess('PAGES.COMMON.MESSAGES.CHANGES_SAVED_SUCCESSFULLY');
            },
            error: (error) => this.handleError(error)
        });
    }

    cancelNewOrder() {
        console.log('Cancelled order change.');

        // Restore the original order
        if (this.originalSubCriteriaOrder.length > 0) {
            this.subCriteriaList = [...this.originalSubCriteriaOrder];
            console.log('Original order restored:', this.subCriteriaList);
        }

        // Reset state
        this.draggable = false;
        this.changedItemsOrder = [];
        this.originalSubCriteriaOrder = [];
    }

    // private hasPermission(action: keyof permissionsList): boolean {
    //     const required = this.permissionsList?.[action];
    //     if (!required || required.length === 0) {
    //         return false;
    //     }
    //     const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    //     return required.some((permission) => userPermissions.includes(permission));
    // }
}
