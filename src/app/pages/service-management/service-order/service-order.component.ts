import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import {OaaaServiceCategoryDto} from "../../../core/models/oaaa.service.category.dto";
import {OaaaServiceDto} from "../types/oaaa-service-dto";
import {ServiceManagementService} from "../../../core/services/service-management.service";
import {OaaaServiceCategoryService} from "../../../core/services/oaaa.service.category.service";
import {ToastService} from "../../../core/services/toast-service";

@Component({
    selector: 'app-service-order',
    templateUrl: './service-order.component.html',
    styleUrl: './service-order.component.scss'
})
export class ServiceOrderComponent implements OnInit {

    dto: OaaaServiceCategoryDto = new OaaaServiceCategoryDto();
    serviceList: OaaaServiceDto[] = [];
    columns: any[] = [];
    actions: any[] = [];
    categoryId: string | null = '';


    constructor(private serviceManagementService: ServiceManagementService,
                private oaaaServiceCategory: OaaaServiceCategoryService,
                private toastService: ToastService,
                public translate: TranslateService,
                private route: ActivatedRoute,
                private router: Router) {
        this.prepareGridHeaderCols();
    }

    ngOnInit() {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');

        if (this.categoryId) {
            forkJoin({
                oaaaServiceCategory: this.oaaaServiceCategory.getById(this.categoryId),
                oaaaServices: this.serviceManagementService.listServicesByCategoryId(this.categoryId)
            }).subscribe({
                next: (res) => {
                    this.dto = res.oaaaServiceCategory;
                    this.serviceList = res.oaaaServices;
                },
                error: err => this.handleError(err)
            });
        }
    }

    private prepareGridHeaderCols() {
        this.columns = [
            {
                field: 'serviceCode', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SERVICE_CODE',
                cellStyle: {textAlign: 'center'},
            },
            {
                field: this.translate.currentLang === 'en' ? 'serviceNameEn' : 'serviceNameAr',
                headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SERVICES_NAME',
                cellStyle: {textAlign: 'center'},
            },
            {
                headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.DISPLAYING_STATUS',
                valueGetter: (params: any) =>
                    params.data.displayStatus
                        ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null, // force it to not use default checkbox renderer
                cellStyle: {textAlign: 'center'}
            },
            {
                headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SUBMISSION_STATUS',
                valueGetter: (params: any) =>
                    params.data.applyStatus
                        ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
                        : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
                cellRenderer: null,
                cellStyle: {textAlign: 'center'}
            }
        ];

        this.actions = [
            {
                label: 'up',
                icon: 'ri-arrow-up-fill',
                callback: (row: OaaaServiceCategoryDto) => this.sort(row, 'up')
            },
            {label: 'down', icon: 'ri-arrow-down-fill', callback: (row: OaaaServiceDto) => this.sort(row, 'down')}
        ];
    }

    sort(row: any, mode: string) {
        console.log(row.data)
    }

    handleError(error: any) {
        let message = 'PAGES.COMMON.MESSAGES.';
        /*if (error === 'SERVICE_CATEGORY_HAS_CHILD') {
            message = 'PAGES.SERVICE_CATEGORY_MANAGEMENT.MESSAGES.' + error;
        } else {*/
        message += error;
        // }
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
