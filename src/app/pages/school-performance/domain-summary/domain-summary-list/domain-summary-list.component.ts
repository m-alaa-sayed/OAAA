import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainSummaryService} from '../../service/domain-summary.service';
import {LanguageUtil} from "../../../../core/util/language.util";
import {ReportService} from "../../../../shared/report/services/report.service";

@Component({
    selector: 'domain-summary-list',
    templateUrl: './domain-summary-list.component.html',
    styleUrl: './domain-summary-list.component.scss'
})
export class DomainSummaryListComponent implements OnInit {

    protected readonly history = history;

    list: any[] = [];
    columns: any[] = [];
    actions: any[] = [];
    pageTitle: string = 'MENUITEMS.MENU.DOMAIN_SUMMARIES';
    pageTitleAr: string = 'MENUITEMS.MENU.DOMAIN_SUMMARIES';
    pageTitleEn: string = 'MENUITEMS.MENU.DOMAIN_SUMMARIES';
    isReport: boolean = false;
    reportId: number | null = null;
    reportCode: string | null = null;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private reportService: ReportService,
        private domainSummary: DomainSummaryService) {
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
        this.getStartedScheduledSchoolVisitsForAcceptedUser();
    }

    getStartedScheduledSchoolVisitsForAcceptedUser(): void {
        this.domainSummary.getStartedScheduledSchoolVisitsForAcceptedUser().subscribe({
            next: (res) => this.list = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    private prepareGridHeaderCols() {
        this.columns = [
            {
                field: 'selfEvaluationDocumentNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.SELF_EVALUATION_DOCUMENT_NUMBER',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolNameAr' : 'schoolNameEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_NAME',

            },
            {
                field: 'schoolType',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_TYPE',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.schoolType);
                }
            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolGovernorateAr' : 'schoolGovernorateEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.GOVERNORATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'wilayatAr' : 'wilayatEn',
                headerName: 'PAGES.VISIT_FORM.LABELS.WILAYAH',

            },
            {
                field: 'numberOfStudents',
                headerName: 'PAGES.VISIT_FORM.LABELS.NUMBER_OF_STUDENTS',

            }, {
                field: 'studentsGender',
                headerName: 'PAGES.VISIT_FORM.LABELS.GENDER',
                valueGetter: (params: any) => {
                    return params.data.studentsGender ? this.translate.instant('PAGES.COMMON.LABELS.' + params.data.studentsGender.toUpperCase()) : "";
                }

            },
            {
                field: 'grades',
                headerName: 'PAGES.VISIT_FORM.LABELS.GRADES',
            },
            {
                field: 'visitNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.SCHEDULE_NUMBER',
            },
            {
                field: 'planNumber',
                headerName: 'PAGES.VISIT_FORM.LABELS.PLAN_NUMBER',
            },

        ];

        const detailsBtn = {
            label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
            icon: 'ri-eye-fill',
            callback: (row: any) => this.openDetails(row)
        };

        const download = {
            label: this.translate.instant('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-file-download-fill',
            callback: (row: any) => this.downloadExcelReport(row)
        }

        this.actions = this.reportCode === 'CSEQA_OBSERVATION_MONITORING_FORMS' ? [download] : [detailsBtn];
    }

    openDetails(row: any): void {
        const {data} = row;
        const baseUrl = '/jawda/school-performance/domain-summary';
        const path = this.isReport ? `${baseUrl}/report/management` : `${baseUrl}/management`;
        this.router.navigate([path, data.scheduledSchoolVisitId], {
            state: {
                visitData: data,
                domainSummaryListPageTitleAr: this.pageTitleAr,
                domainSummaryListPageTitleEn: this.pageTitleEn, ...(this.isReport && {
                    reportId: this.reportId,
                    reportCode: this.reportCode,
                    isReport: true
                })
            },
        });
    }

    downloadExcelReport(row: any) {
        const {data} = row;
        this.reportService.downloadExcelReport({
            lang: LanguageUtil.lang,
            reportId: this.reportId,
            module: 'CSEQA',
            params: {scheduledSchoolVisitId: data.scheduledSchoolVisitId},
            fileNameParams: {
                "schoolName": LanguageUtil.isArabic ? data.schoolNameAr : data.schoolNameEn,
                "planNo": data.planNumber
            }
        }).subscribe({
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

