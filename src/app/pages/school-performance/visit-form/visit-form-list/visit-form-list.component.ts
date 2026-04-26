import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {VisitFormService} from '../../service/visit-form.service';
import {LanguageUtil} from "../../../../core/util/language.util";
import { Permission } from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
    selector: 'visit-form-list',
    templateUrl: './visit-form-list.component.html',
    styleUrl: './visit-form-list.component.scss'
})
export class VisitFormListComponent implements OnInit {
    protected readonly Permission = Permission;
    title = '';
    list: any[] = [];
    type: string = "";
    columns: any[] = [];
    actions: any[] = [];
    pageTitle: string = 'MENUITEMS.MENU.DOMAIN_SUMMARIES';
    isReport: boolean = false;
    reportId: number | null = null;
    pageTitleAr = '';
    pageTitleEn = '';

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private authService: AuthService,
        private visitFormService: VisitFormService) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const type = params.get('type') ?? '';
            const {
                isReport = false,
                reportId = null,
                pageTitleAr = '',
                pageTitleEn = ''
            } = history.state ?? {};
            this.type = type;
            this.isReport = isReport;
            this.reportId = reportId;
            this.pageTitleAr = pageTitleAr;
            this.pageTitleEn = pageTitleEn;
            this.title = isReport ? (LanguageUtil.isArabic ? pageTitleAr : pageTitleEn) : `MENUITEMS.MENU.${type}_FORM`;
        });
        this.prepareGridHeaderCols();
        this.getCurrentPlansOverview();
    }

    getCurrentPlansOverview(): void {
        this.visitFormService.getCurrentPlansOverview("APPROVED").subscribe({
            next: (res) => this.list = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    private prepareGridHeaderCols() {
        const userPermissions = this.authService.getUserClaim()?.permissions ?? [];

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
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params?.data?.schoolType);
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
                    return this.translate.instant('PAGES.COMMON.LABELS.' + params?.data?.studentsGender?.toUpperCase());
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

        this.actions = [
            {
                label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
                icon: 'ri-eye-fill',
                callback: (row: any) => this.openDetails(row),
                show: () => this.type == 'GENERAL_EVIDENCE' ? userPermissions.includes(Permission.GENERAL_EVIDENCE_VISIT_FORM_VIEW_DETAILS) : userPermissions.includes(Permission.CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_DETAILS)
            },
        ];
    }

    private openDetails(row: any): void {
        const visitData = row?.data ?? row;
        const scheduledSchoolVisitId = visitData?.scheduledSchoolVisitId;
        const baseUrl = `/jawda/school-performance/visit-form/${this.type}`;
        const path = `${baseUrl}${this.isReport ? '/report' : ''}/management`;
        this.router.navigate([path, scheduledSchoolVisitId], {
            state: {
                visitData,
                visitFormListPageTitleAr: this.pageTitleAr,
                visitFormListPageTitleEn: this.pageTitleEn,
                isReport: this.isReport,
                reportId: this.reportId,
            },
        });
    }
}
