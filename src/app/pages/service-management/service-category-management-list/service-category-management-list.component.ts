import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OaaaServiceCategorySearchDto } from "../../../core/models/oaaa.service.category.search.dto";
import { OaaaServiceCategoryDto } from "../../../core/models/oaaa.service.category.dto";
import { OaaaServiceCategoryService } from "../../../core/services/oaaa.service.category.service";
import { ModalConfirmComponent } from "../../../shared/app-modal-confirm/modal-confirm.component";
import { OaaaServiceDto } from "../types/oaaa-service-dto";
import { ToastService } from "../../../core/services/toast-service";
import { Permission } from "../../../core/enum/permission";
import { AuthService } from "../../../core/services/auth.service";


@Component({
    selector: 'service-category-management-list',
    templateUrl: './service-category-management-list.component.html',
    styleUrl: './service-category-management-list.component.scss'
})
export class ServiceCategoryManagementListComponent implements OnInit {
    protected readonly Permission = Permission;

    columns: any[] = [];
    actions: any[] = [];
    addPageUrl = '/jawda/service-management/service-category-management-details';
    searchDto: OaaaServiceCategorySearchDto = new OaaaServiceCategorySearchDto();
    categoryList: OaaaServiceCategoryDto[] = [];
    @ViewChild("searchForm") searchForm?: NgForm;

    constructor(
        public translate: TranslateService,
        public toastService: ToastService,
        private router: Router,
        private modalService: NgbModal,
        private authService: AuthService,
        private oaaaServiceCategory: OaaaServiceCategoryService) {
        this.prepareGridHeaderCols();
    }

    ngOnInit(): void {
        this.search();
    }

    search() {
        this.searchDto.displayStatusList = [];

        if (this.searchForm?.value.displayStatusActive) {
            this.searchDto.displayStatusList.push(true);
        }

        if (this.searchForm?.value.displayStatusInactive) {
            this.searchDto.displayStatusList.push(false);
        }

        if (this.searchForm?.value.categoryName) {
            this.searchDto.categoryName = this.searchForm.value.categoryName;
        }
        this.oaaaServiceCategory.search(this.searchDto).subscribe({
            next: data => {
                this.categoryList = data;
            },
            error: error => {
            }
        });
    }

    reset() {
        this.searchDto.displayStatusList = [];
        this.searchDto.categoryName = '';
        this.oaaaServiceCategory.search(this.searchDto).subscribe({
            next: data => {
                this.categoryList = data;
            },
            error: error => {
            }
        });
    }

    private prepareGridHeaderCols() {
        this.columns = [
          
            {
                field: this.translate.currentLang === 'ar' ? 'categoryNameAr' : 'categoryNameEn',
                headerName: 'PAGES.SERVICE_CATEGORY_MANAGEMENT.LABELS.CATEGORY_NAME',
                width: 600
            },
            {
                headerName: 'PAGES.SERVICE_CATEGORY_MANAGEMENT.LABELS.DISPLAYING_STATUS',
                valueGetter: (params: any) =>
                    params.data.displayStatus
                        ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null,
                cellStyle: { textAlign: 'center' },
                width: 500
            }

        ];

        this.actions = [
            {
                label: 'edit',
                icon: 'ri-pencil-fill text-info',
                callback: (row: OaaaServiceCategoryDto) => this.openDetails(row, 'edit'),
                show: () => this.authService.getUserClaim()?.permissions?.includes(Permission.EDIT_SERVICE_CATEGORY)
            },
            {
                label: 'details',
                icon: 'ri-eye-fill',
                callback: (row: OaaaServiceCategoryDto) => this.openDetails(row, 'view'),
                show: () => this.authService.getUserClaim()?.permissions?.includes(Permission.VIEW_SERVICE_CATEGORY)
            },
            {
                label: 'delete',
                icon: 'ri-delete-bin-fill text-danger',
                callback: (row: OaaaServiceDto) => this.openDeleteModal(row),
                show: () => this.authService.getUserClaim()?.permissions?.includes(Permission.DELETE_SERVICE_CATEGORY)
            }
        ];
    }

    openDetails(row: any, mode: string) {
        this.router.navigate([this.addPageUrl, row.data.id], { queryParams: { mode: mode } });
    }

    addNewCategory() {
        this.router.navigate([this.addPageUrl]);
    }

    async openDeleteModal(row: any) {
        const title = this.translate.instant("PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE");
        const message = this.translate.instant("PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE");
        
        ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
            if (confirmed) {
                this.oaaaServiceCategory.deleteById(row.data.id).subscribe({
                    next: data => {
                        this.handleSuccess();
                        this.search();
                    },
                    error: error => {
                        this.handleError(error);
                    }
                });
            }
        });
    }

    handleError(error: any) {
        let message = 'PAGES.COMMON.MESSAGES.';
        if (error === 'SERVICE_CATEGORY_HAS_CHILD') {
            message = 'PAGES.SERVICE_CATEGORY_MANAGEMENT.MESSAGES.' + error;
        } else {
            message += error;
        }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }

    handleSuccess() {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'), {
            classname: 'bg-success text-white',
            delay: 3000
        });
    }
}
