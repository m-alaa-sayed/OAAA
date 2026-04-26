import {Component, OnInit} from '@angular/core';
import {BaseModal} from "../../../../shared/base-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SchoolDocumentDeliveryService} from "../../service/school-document-delivery.service";
import {SchoolDocumentDeliveryVisitInfo} from "../../types/school-document-delivery-visit-info";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../../core/services/toast-service";
import {LanguageUtil} from "../../../../core/util/language.util";

@Component({
    selector: 'app-school-document-delivery-visit-list',
    templateUrl: './school-document-delivery-visit-list.component.html',
    styleUrl: './school-document-delivery-visit-list.component.scss'
})
export class SchoolDocumentDeliveryVisitListComponent extends BaseModal implements OnInit {

    columns: any[] = [];
    actions: any[] = [];
    visits: SchoolDocumentDeliveryVisitInfo[] = [];
    isReport: boolean = false;
    pageTitle: string = 'PAGES.SCHOOL_DOCUMENT_DELIVERY.LABELS.RECEIVING_DELIVERING_SCHOOL_DOCUMENTS_EVIDENCE';

    constructor(modalService: NgbModal,
                public translate: TranslateService,
                private router: Router,
                private route: ActivatedRoute,
                public toastService: ToastService,
                private schoolDocumentDeliveryService: SchoolDocumentDeliveryService) {
        super(modalService);
        this.isReport = Boolean(history.state?.isReport);
        if (this.isReport) this.pageTitle = LanguageUtil.isArabic ? history.state?.pageTitleAr : history.state?.pageTitleEn;
    }

    ngOnInit(): void {
        this.prepareGridHeaderCols();
        this.schoolDocumentDeliveryService.getVisitDtoList().subscribe({
            next: data => {
                this.visits = data || [];
            }
        });
    }

    openVisit(row: any) {
        if (row.data.currentServiceStepCode === "SCHOOL_DOCUMENT_DELIVERY_WAITING_NEW_DOC") {
            this.router.navigate(['/jawda/school-performance/school-document-delivery/details', row.data.requestId, row.data.taskId]);
        } else {
            this.router.navigate(['/jawda/school-performance/school-document-delivery/detail', row.data.visitId]);
        }
    }

    private prepareGridHeaderCols() {
        const t = (k: string) => this.translate.instant(k);
        this.columns = [
            {
                field: 'selfEvaluationDocumentNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.SELF_EVALUATION_DOCUMENT_NUMBER'
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolNameAr' : 'schoolNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_NAME'
            },
            {
                field: 'schoolType',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_TYPE',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.schoolType);
                }
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolGovernorateNameAr' : 'schoolGovernorateNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.GOVERNORATE'
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolWilayatNameAr' : 'schoolWilayatNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.WILAYAH'
            },
            {field: 'schoolStudentsNumber', headerName: 'PAGES.VISIT_FORM.LABELS.NUMBER_OF_STUDENTS'},
            {
                field: 'schoolGender',
                headerName: 'PAGES.VISIT_FORM.LABELS.GENDER',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.schoolGender.toUpperCase());
                }
            },
            {field: 'schoolClasses', headerName: 'PAGES.VISIT_FORM.LABELS.GRADES'},
            {field: 'visitNumber', headerName: 'PAGES.VISIT_FORM.LABELS.SCHEDULE_NUMBER'},
            {field: 'planNumber', headerName: 'PAGES.VISIT_FORM.LABELS.PLAN_NUMBER'},
            {field: 'visitFrom', headerName: 'PAGES.SCHOOL_DOCUMENT_DELIVERY.LABELS.VISIT_FROM'},
            {field: 'visitTo', headerName: 'PAGES.SCHOOL_DOCUMENT_DELIVERY.LABELS.VISIT_TO'},
            {
                field: 'visitStatus',
                headerName: 'PAGES.SCHOOL_DOCUMENT_DELIVERY.LABELS.VISIT_STATUS',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.visitStatus.toUpperCase());
                }
            }
        ];

        const download = {
            label: t('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-printer-fill',
            callback: ({data}: any) => this.downloadReport(data),
        };

        const selectVisit = {
            label: t('PAGES.COMMON.LABELS.SELECT'),
            icon: 'ri-radio-button-fill',
            callback: (row: any) => this.openVisit(row)
        };

        this.actions = this.isReport ? [download] : [selectVisit, download];
    }

    private downloadReport(row: any) {
        this.schoolDocumentDeliveryService.downloadReport(row.visitId).subscribe({
            next: value => this.downloadFile(value.data),
            error: err => this.showErrorMessage('PAGES.COMMON.MESSAGES.' + err)
        });
    }

    private downloadFile(fileDto: any) {
        const dataUri = 'data:application/pdf;base64,' + fileDto.file;
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = dataUri;
        a.download = fileDto.fileName;
        a.click();
        window.URL.revokeObjectURL(dataUri);
    }

    private showErrorMessage(message: string) {
        scrollTo(0, 0);
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }
}
