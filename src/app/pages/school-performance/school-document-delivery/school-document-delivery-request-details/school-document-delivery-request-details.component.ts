import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../core/services/toast-service";
import {TranslateService} from "@ngx-translate/core";
import {CommonService} from "../../../../core/services/common.service";
import {AuthService} from "../../../../core/services/auth.service";
import {SchoolDocumentDeliveryService} from "../../service/school-document-delivery.service";
import {SchoolDocumentDelivery} from "../../types/school-document-delivery";
import {SchoolDocumentDeliveryItem} from "../../types/school-document-delivery-item";
import {ScheduledSchoolVisit} from "../../types/scheduled-school-visit";
import {User} from "../../../../core/models/auth.models";
import {Permission} from "../../../../core/enum/permission";

@Component({
    selector: 'app-school-document-delivery-request-details',
    templateUrl: './school-document-delivery-request-details.component.html',
    styleUrl: './school-document-delivery-request-details.component.scss'
})
export class SchoolDocumentDeliveryRequestDetailsComponent implements OnInit {
    isTlUser = false;
    isSchoolUser = false;
    requestId: any;
    infoId: any;
    taskId: any = null;
    requestObject: any;
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
    mainRequestData: any;
    isSubmitted: boolean = false;
    type: any;

    constructor(private route: ActivatedRoute,
                private toastService: ToastService,
                public translate: TranslateService,
                private commonService: CommonService,
                private router: Router,
                private authService: AuthService,
                private schoolDocumentDeliveryService: SchoolDocumentDeliveryService
    ) {
    }

    ngOnInit(): void {
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
        this.route.paramMap.subscribe(params => {
            this.requestId = params.get('requestId');
            this.getSchoolDocumentDeliveryRequestInfoByRequestId();
        });
    }

    getSchoolDocumentDeliveryRequestInfoByRequestId() {
        this.schoolDocumentDeliveryService.getSchoolDocumentDeliveryRequestInfoByRequestId(this.requestId).subscribe({
            next: res => {
                this.isDataLoaded = true;
                this.dto = res.dto;
                this.requestObject = res;
                const stepCode = this.requestObject?.serviceStep?.stepCode;
                const permissions = this.authService.getUserClaim()?.permissions ?? [];

                this.isTlUser = (stepCode === 'SCHOOL_DOCUMENT_DELIVERY_UNDER_TL_REVIEW'
                    || (stepCode === 'SCHOOL_DOCUMENT_DELIVERY_WAITING_NEW_DOC'
                        && permissions.includes(Permission.SCHOOL_DOCUMENT_DELIVERY_VIEW_TL)));

                this.isSchoolUser = (stepCode === 'SCHOOL_DOCUMENT_DELIVERY_UNDER_SCHOOL_REVIEW'
                    || (stepCode === 'SCHOOL_DOCUMENT_DELIVERY_WAITING_NEW_DOC' && !this.isTlUser && permissions.includes(Permission.SCHOOL_DOCUMENT_DELIVERY_VIEW)));
                this.canUpdateDocuments = this.taskId && (this.isTlUser || this.isSchoolUser || stepCode === 'SCHOOL_DOCUMENT_DELIVERY_WAITING_NEW_DOC');
                this.preparedMainRequestData();
            },
            error: err => this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), {
                classname: 'bg-danger text-white',
                autohide: false
            })
        });
    }

    preparedMainRequestData() {
        this.mainRequestData = {
            requestDate: this.requestObject.requestDate,
            applicationNo: this.requestObject.applicationNo,
            stepNameAr: this.requestObject.serviceStep.stepNameAr,
            stepNameEn: this.requestObject.serviceStep.stepNameEn,
            statusNameAr: this.requestObject.serviceStep.statusNameAr,
            statusNameEn: this.requestObject.serviceStep.statusNameEn,
            serviceNameAr: this.requestObject.oaaaService.serviceNameAr,
            serviceNameEn: this.requestObject.oaaaService.serviceNameEn,
        };
    }

    updateSchoolDocumentDeliveryItems(schoolDocumentDeliveryItems: SchoolDocumentDeliveryItem[]) {
        this.dto.schoolDocumentDeliveryItems = schoolDocumentDeliveryItems;
    }

    showValidationMessage() {
        scrollTo(0, 0);
        this.isSubmitted = true;
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }

    submit(event: any): void {
        const sendObject = {
            requestDto: this.requestObject,
            action: event.action,
            comment: event.comment,
            taskId: this.taskId
        };
        this.schoolDocumentDeliveryService.completeSchoolDocumentDeliveryRequestInfo(sendObject).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: event.action}
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }
}
