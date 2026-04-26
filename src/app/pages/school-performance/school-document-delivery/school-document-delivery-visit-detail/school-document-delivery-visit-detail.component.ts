import {Component, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../core/services/toast-service";
import {SchoolDocumentDeliveryService} from "../../service/school-document-delivery.service";
import {BaseModal} from "../../../../shared/base-modal";
import {SchoolDocumentDelivery} from "../../types/school-document-delivery";
import {LanguageUtil} from "../../../../core/util/language.util";
import {SchoolDocumentDeliveryItem} from "../../types/school-document-delivery-item";
import {ScheduledSchoolVisit} from "../../types/scheduled-school-visit";
import {User} from "../../../../core/models/auth.models";

@Component({
    selector: 'app-school-document-delivery-visit-detail',
    templateUrl: './school-document-delivery-visit-detail.component.html',
    styleUrl: './school-document-delivery-visit-detail.component.scss'
})
export class SchoolDocumentDeliveryVisitDetailComponent extends BaseModal implements OnInit {

    protected readonly LanguageUtil = LanguageUtil;
    action?: string;
    scheduledSchoolVisitId: any;
    isDataLoaded = false;
    canUpdateDocuments = false;
    dto: SchoolDocumentDelivery = {
        id: null as unknown as number,
        requestId: null as unknown as number,
        scheduledSchoolVisitId: null as unknown as number,
        scheduledSchoolVisit: null as unknown as ScheduledSchoolVisit,
        schoolDocumentDeliveryItems: [],
        createdBy: null as unknown as number,
        user: null as unknown as User,
        createdOn: null as unknown as string,
        updatedBy: null as unknown as number,
        updatedOn: null as unknown as string
    };

    constructor(modalService: NgbModal,
                public translate: TranslateService,
                public router: Router,
                public route: ActivatedRoute,
                public toastService: ToastService,
                private schoolDocumentDeliveryService: SchoolDocumentDeliveryService) {
        super(modalService);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            this.getSchoolDocumentDeliveryRequestInfoByScheduledSchoolVisitId();
        });
    }

    getSchoolDocumentDeliveryRequestInfoByScheduledSchoolVisitId() {
        this.schoolDocumentDeliveryService.getSchoolDocumentDeliveryRequestInfoByScheduledSchoolVisitId(this.scheduledSchoolVisitId)
            .subscribe({
                next: (res) => {
                    this.loadScreenData(res);
                },
                error: (error) => this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                })
            });
    }

    updateSchoolDocumentDeliveryItems(schoolDocumentDeliveryItems: SchoolDocumentDeliveryItem[]) {
        this.dto.schoolDocumentDeliveryItems = schoolDocumentDeliveryItems;
    }

    save(action: string) {
        this.isDataLoaded = true;
        this.schoolDocumentDeliveryService.saveSchoolDocumentDeliveryRequestInfo(this.dto, action)
            .subscribe({
                next: (response) => {
                    this.close();
                    if (action === 'SAVE') {
                        this.toastService.show(
                            this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                                classname: 'bg-success text-white',
                                delay: 3000
                            }
                        );
                        this.loadScreenData(response);
                        // this.router.navigate(['/jawda/school-performance/school-document-delivery/detail', this.scheduledSchoolVisitId]);
                    } else {
                        this.router.navigate(['/jawda/success-page'], {
                            state: {requestApplicationNo: response.applicationNo, action: action}
                        });
                    }
                },
                error: (error) => this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                })
            });
    }

    loadScreenData(res: any) {
        this.dto = res;
        this.canUpdateDocuments = !this.schoolDocumentDeliveryService.validateScheduledSchoolVisitStatus(this.dto.scheduledSchoolVisit) && !this.dto.requestId;
        if (!this.dto.schoolDocumentDeliveryItems) {
            this.dto.schoolDocumentDeliveryItems = [];
        }
        this.isDataLoaded = true;
    }
    openConfirmationModal(content: any): void {
        if (this.dto.schoolDocumentDeliveryItems.length === 0) {
            this.toastService.show(this.translate.instant('PAGES.SCHOOL_DOCUMENT_DELIVERY.MESSAGES.SCHOOL_DOCUMENT_DELIVERY_ITEMS_ERROR'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            return;
        }
        this.open(content);
    }
}