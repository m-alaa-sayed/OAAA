import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainSummaryService} from '../../service/domain-summary.service';
import {ReportService} from "../../../../shared/report/services/report.service";
import {LanguageUtil} from "../../../../core/util/language.util";
import {Permission} from "../../../../core/enum/permission";
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'app-domain-summary-management',
    templateUrl: './domain-summary-management.component.html',
    styleUrl: './domain-summary-management.component.scss'
})
export class DomainSummaryManagementComponent implements OnInit {

    protected readonly Permission = Permission;
    protected readonly history = history;

    previousState: any;
    visitData: any;
    domainSummaryListPageTitle: string = 'MENUITEMS.MENU.DOMAIN_SUMMARIES';
    domainSummaryListUrl: string = '/jawda/school-performance/domain-summary/list';
    isReport: boolean = false;
    scheduledSchoolVisitId: any;
    columns: any[] = [];
    actions: any[] = [];
    list: any[] = [];
    reportId: number | null = null;
    reportCode: string | null = null;

    constructor(
        public translate: TranslateService,
        private router: Router,
        public toastService: ToastService,
        private route: ActivatedRoute,
        private reportService: ReportService,
        private authService: AuthService,
        private domainSummaryService: DomainSummaryService
    ) {
        const {
            visitData = null,
            isReport = false,
            reportId = null,
            reportCode = null,
            domainSummaryListPageTitleAr = '',
            domainSummaryListPageTitleEn = ''
        } = history.state ?? {};
        this.visitData = visitData;
        this.isReport = isReport;
        this.reportId = reportId;
        this.reportCode = reportCode;
        this.domainSummaryListPageTitle = LanguageUtil.isArabic ? domainSummaryListPageTitleAr : domainSummaryListPageTitleEn;
        this.domainSummaryListUrl = isReport ? '/jawda/school-performance/domain-summary/report/list' : this.domainSummaryListUrl;
        console.log("DomainSummaryManagementComponent", domainSummaryListPageTitleAr, this.isReport)
        this.previousState = {
            ...history.state,
            pageTitleAr: domainSummaryListPageTitleAr,
            pageTitleEn: domainSummaryListPageTitleEn
        };
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            this.getDomainSummarySubmissionRequestInfoList(this.scheduledSchoolVisitId);
        });
        this.prepareGridHeaderCols();
    }

    getDomainSummarySubmissionRequestInfoList(scheduledSchoolVisitId: any): void {
        this.domainSummaryService.getDomainSummarySubmissionRequestInfoList(scheduledSchoolVisitId).subscribe({
            next: (res) => this.list = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    openDetails(row: any) {
        this.domainSummaryService.validateDomainSummarySubmission(row.data.domain, this.scheduledSchoolVisitId).subscribe({
            next: (res) => {
                if (row.data.requestId == null) {
                    if (row.data.domainSummaryInfoId == null) {
                        this.router.navigate(['/jawda/school-performance/domain-summary/creation', row.data.domain, this.scheduledSchoolVisitId]);
                    } else {
                        this.router.navigate(['/jawda/school-performance/domain-summary/creation', row.data.domain, row.data.domainSummaryInfoId, this.scheduledSchoolVisitId]);
                    }
                } else {
                    this.router.navigate(['/jawda/school-performance/domain-summary/details', row.data.requestId]);
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    navigateToDomainSummaryList() {
        this.router.navigate(['/jawda/school-performance/domain-summary/list'], {state: this.previousState});
    }

    downloadObservationAndMonitoringFormsReport() {
        this.reportService.downloadExcelReport({
            lang: LanguageUtil.lang,
            reportCode: 'CSEQA_OBSERVATION_MONITORING_FORMS',
            module: 'CSEQA',
            params: {scheduledSchoolVisitId: +this.scheduledSchoolVisitId},
            fileNameParams: {
                "schoolName": LanguageUtil.isArabic ? this.visitData.schoolNameAr : this.visitData.schoolNameEn,
                "planNo": this.visitData.planNumber
            }
        }).subscribe({
            next: value => this.downloadFile(value.data),
            error: err => this.showErrorMessage('PAGES.COMMON.MESSAGES.' + err)
        });
    }

    private prepareGridHeaderCols(): void {
        const userPermissions = this.authService.getUserClaim()?.permissions ?? [];

        this.columns = [
            {
                field: 'domain',
                headerName: 'PAGES.DOMAIN_SUMMARY.LABELS.DOMAIN',
                valueGetter: (params: any) => {
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.domain);
                }
            },
            {
                field: this.translate.currentLang === 'ar' ? 'fullNameAr' : 'fullNameEn',
                headerName: 'PAGES.DOMAIN_SUMMARY.LABELS.RESPONSIBLE',

            },
            {
                field: 'role',
                headerName: 'PAGES.DOMAIN_SUMMARY.LABELS.ROLE',
                valueGetter: (params: any) => {
                    const roles: string = params.data.role || '';
                    const parts: string[] = roles
                        .split(',')
                        .map((part: string) => part.trim())
                        .filter((part: string) => part !== '');

                    return parts
                        .map((part: string) => this.translate.instant('PAGES.COMMON.LABELS.' + part))
                        .join(', ');
                }
            },
            {
                field: 'applicationNo',
                headerName: 'PAGES.COMMON.LABELS.APPLICATION_NO',

            },
            {
                field: 'requestDate',
                headerName: 'PAGES.COMMON.LABELS.SUBMISSION_DATE',

            },
            {
                field: 'judgment',
                headerName: 'PAGES.DOMAIN_SUMMARY.LABELS.JUDGMENT',

            },
            {
                field: 'status',
                headerName: 'PAGES.COMMON.LABELS.STATUS',
                valueGetter: (params: any) => {
                    return params.data.status ? this.translate.instant('PAGES.COMMON.LABELS.' + params.data.status) : '';
                }
            }
        ];

        const t = (k: string) => this.translate.instant(k);

        const download = {
            label: t('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-printer-fill',
            callback: ({data}: any) => this.downloadPdfReport(data),
            show: () => userPermissions.includes(Permission.DOMAIN_SUMMARY_EACH_DOMAIN_EXPORT)
        };

        const details = {
            label: t('PAGES.COMMON.LABELS.DETAILS'),
            icon: 'ri-eye-fill',
            callback: (row: any) => this.openDetails(row),
            show: () => userPermissions.includes(Permission.DOMAIN_SUMMARY_EACH_DOMAIN_VIEW)
        };

        this.actions = this.isReport ? (this.reportCode === 'CSEQA_OBSERVATION_MONITORING_FORMS' ? [] : [download]) : [details, download];
    }

    private downloadPdfReport(row: any) {
        if (!row.status) {
            this.showErrorMessage('PAGES.DOMAIN_SUMMARY.MESSAGES.REPORT_NOT_AVAILABLE');
            return;
        }
        this.domainSummaryService.downloadReport(row.domainSummaryInfoId).subscribe({
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



