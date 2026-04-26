import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgForm } from "@angular/forms";
import { OaaaServiceCategoryDto } from "../../../core/models/oaaa.service.category.dto";
import { ToastService } from "../../../core/services/toast-service";
import { OaaaServiceCategoryService } from "../../../core/services/oaaa.service.category.service";
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
    selector: 'service-category-management-details',
    templateUrl: './service-category-management-details.component.html',
    styleUrl: './service-category-management-details.component.scss'
})
export class ServiceCategoryManagementDetailsComponent implements OnInit {

    id?: any;
    edit: boolean = false;
    dto: OaaaServiceCategoryDto = new OaaaServiceCategoryDto();
    @ViewChild("submitForm") submitForm?: NgForm;

    constructor(
        public translate: TranslateService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router,
        private oaaaServiceCategory: OaaaServiceCategoryService) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.route.queryParams.subscribe(params => {
            this.edit = params['mode'] !== 'view';
            if (this.id) {
                this.oaaaServiceCategory.getById(this.id).subscribe({
                    next: data => {
                        this.dto = data;
                    },
                    error: err => {
                        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
                    }
                })
            }
        });
    }

    save() {
        if (this.submitForm?.submitted && this.submitForm?.invalid)
            return;
        if (this.id) {
            this.oaaaServiceCategory.edit(this.dto).subscribe({
                next: data => {
                    this.cancel();
                },
                error: err => {
                    this.handleError(err);
                }
            });
        } else {
            this.oaaaServiceCategory.add(this.dto).subscribe({
                next: data => {
                    this.cancel();
                },
                error: err => {
                    this.handleError(err);
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/jawda/service-management/service-category-management-list']);
    }

    handleError(error: any) {
        let message = 'PAGES.COMMON.MESSAGES.';
        if (error === 'SERVICE_CATEGORY_NAME_FOUND') {
            message = 'PAGES.SERVICE_CATEGORY_MANAGEMENT.MESSAGES.' + error;
        } else {
            message += error;
        }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }

    onTextChange(obj: any, field: string, value: string): void {
        const result = limitWords(value || '', 250);
        obj[field] = result.trimmedText;
    }
}
