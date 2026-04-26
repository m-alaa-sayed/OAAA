import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {QualityAssuranceFollowUpFormService} from '../../service/quality-assurance-follow-up-form.service';
import {BaseModal} from 'src/app/shared/base-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Permission} from 'src/app/core/enum/permission';
import {LanguageUtil} from "../../../../core/util/language.util";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-quality-assurance-follow-up-form-list',
    templateUrl: './quality-assurance-follow-up-form-list.component.html',
    styleUrl: './quality-assurance-follow-up-form-list.component.scss'
})
export class QualityAssuranceFollowUpFormListComponent extends BaseModal implements OnInit {
    protected readonly history = history;

    list: any[] = [];
    columns: any[] = [];
    actions: any[] = [];
    visitData: any;
    selectedRow: any;

    pageTitle: string = 'MENUITEMS.MENU.EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS';
    pageTitleAr: string = 'MENUITEMS.MENU.EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS';
    pageTitleEn: string = 'MENUITEMS.MENU.EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS';
    isReport: boolean = false;
    reportId: number | null = null;
    reportCode: string | null = null;

    @ViewChild('delete') deleteTemplate!: TemplateRef<any>;
    protected readonly Permission = Permission;

    constructor(
        public translate: TranslateService,
        public override modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private qualityAssuranceFormService: QualityAssuranceFollowUpFormService) {
        super(modalService);
    }

    ngOnInit(): void {
        this.isReport = Boolean(this.history.state?.isReport);
        if (this.isReport) {
            this.pageTitleAr = this.history.state?.pageTitleAr;
            this.pageTitleEn = this.history.state?.pageTitleEn;
            this.pageTitle = LanguageUtil.isArabic ? this.pageTitleAr : this.pageTitleEn;
            this.reportId = this.history.state?.reportId;
            this.reportCode = this.history.state?.reportCode;
        }
        this.prepareGridHeaderCols();
        this.getQaFollowUpFormSubmissionDtoList();
    }

    getQaFollowUpFormSubmissionDtoList(): void {
        this.qualityAssuranceFormService.getQaFollowUpFormSubmissionDtoList().subscribe({
            next: ({data}) => {
                const list = data ?? [];
                this.list = this.isReport ? list.filter(({status}) => status !== 'PENDING') : list;
            },
            error: (error) =>
                this.toastService.show(
                    this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
                    {classname: 'bg-danger text-white', autohide: false}
                )
        });
    }

    //-- prepare grid cols
    private prepareGridHeaderCols() {
        const t = (k: string) => this.translate.instant(k);
        this.columns = [
            {
                field: 'scheduledSchoolVisit.selfEvaluationDocumentNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.SELF_EVALUATION_DOCUMENT_NUMBER',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.nameAr' : 'scheduledSchoolVisit.school.nameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_NAME',

            },
            {
                field: 'scheduledSchoolVisit.school.type',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_TYPE',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.scheduledSchoolVisit.school.type);
                }
            },
            {
                field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.governorate.nameAr' : 'scheduledSchoolVisit.school.governorate.nameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.GOVERNORATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.wilayat.nameAr' : 'scheduledSchoolVisit.school.wilayat.nameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.WILAYAH',

            },
            {
                field: 'scheduledSchoolVisit.school.studentsNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.NUMBER_OF_STUDENTS',

            },
            {
                field: 'scheduledSchoolVisit.school.gender',
                headerName: 'PAGES.VISIT_FORM.LABELS.GENDER',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.scheduledSchoolVisit.school.gender.toUpperCase());
                }
            },
            {
                field: 'scheduledSchoolVisit.school.classes',
                headerName: 'PAGES.VISIT_FORM.LABELS.GRADES',

            },
            {
                field: 'scheduledSchoolVisit.visitNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHEDULE_NUMBER',

            },
            {
                field: 'scheduledSchoolVisit.planNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.PLAN_NUMBER',
            },
            {
                field: 'applicationNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.FORM_NUMBER',

            },
            {
                field: 'createdOn',
                headerName: 'PAGES.VISIT_FORM.LABELS.DATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'user.fullNameAr' : 'user.fullNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SUBMITTED_BY',

            },
            {
                field: 'status',
                headerName: 'PAGES.VISIT_FORM.LABELS.STATUS',
                valueGetter: (params: any) => {
                    return t('PAGES.QUALITY_ASSURANCE.LABELS.' + params.data.status);
                }
            }
        ];

        const download = {
            label: t('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-printer-fill',
            callback: ({data}: any) => this.downloadReport(data),
        };

        const details = {
            label: t('PAGES.COMMON.LABELS.DETAILS'),
            icon: 'ri-eye-fill',
            callback: (row: any) => this.openDetails(row),
        };

        const deleteQaFrom = {
            label: t('PAGES.COMMON.LABELS.DELETE'),
            icon: 'ri-delete-bin-fill',
            callback: (row: any) => this.openDeletePop(row)
        }

        this.actions = this.isReport ? [download] : [details, deleteQaFrom];
    }

    downloadReport(row: any) {
        // if(!row.formStatus || row.formStatus === 'PROCESSING'){
        //     this.showErrorMessage('PAGES.VISIT_FORM.MESSAGES.REPORT_NOT_AVAILABLE');
        //     return;
        // }
        this.qualityAssuranceFormService.downloadReport(row.id).subscribe({
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

    openDetails(row: any) {
        if (row.data.status == 'PENDING') {
            this.router.navigate(['/jawda/school-performance/quality-assurance-form/creation', row.data.scheduledSchoolVisitId, row.data.id],
                {state: {visitData: this.qualityAssuranceFormService.prepareVisitData(row.data.scheduledSchoolVisit)}})
        } else {
            this.router.navigate(['/jawda/school-performance/quality-assurance-form/details', row.data.scheduledSchoolVisitId, row.data.id],
                {state: {visitData: this.qualityAssuranceFormService.prepareVisitData(row.data.scheduledSchoolVisit)}})
        }
    }

    openDeletePop(row: any) {
        if (row.data.status == 'PENDING') {
            this.selectedRow = row;
            this.modalService.open(this.deleteTemplate, {
                backdrop: 'static',
                centered: true
            });
        } else {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.QA_FOLLOW_UP_FORM_SUBMISSION_DELETE_ERROR'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
        }
    }

    removeForm(row: any) {
        this.qualityAssuranceFormService.deleteQualityAssuranceForm(row.data.id).subscribe({
            next: () => {
                this.close();
                this.getQaFollowUpFormSubmissionDtoList();
            },
            error: (error) => {
                this.close();
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            },
        });
    }

    addNewForm() {
        this.router.navigate(['/jawda/school-performance/quality-assurance-form/select']);
    }

}

