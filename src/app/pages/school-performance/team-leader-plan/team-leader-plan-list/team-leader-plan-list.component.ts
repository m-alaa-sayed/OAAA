import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {TeamLeaderPlanService} from '../../service/team-leader-plan.service';
import {VisitPlanOverview} from '../../types/visit-plan-overview';
import {Permission} from "../../../../core/enum/permission";
import {LanguageUtil} from "../../../../core/util/language.util";

@Component({
    selector: 'team-leader-plan-list',
    templateUrl: './team-leader-plan-list.component.html',
    styleUrl: './team-leader-plan-list.component.scss'
})
export class TeamLeaderPlanListComponent implements OnInit {

    protected readonly Permission = Permission;

    visitPlanOverviewList: VisitPlanOverview[] = [];
    columns: any[] = [];
    actions: any[] = [];

    isReport: boolean = false;
    pageTitle: string = 'MENUITEMS.MENU.TEAM_LEADER_PLAN';

    constructor(
        public translate: TranslateService,
        private router: Router,
        private teamLeaderPlanService: TeamLeaderPlanService,
        public toastService: ToastService) {
        this.isReport = Boolean(history.state?.isReport);
        if (this.isReport) this.pageTitle = LanguageUtil.isArabic ? history.state?.pageTitleAr : history.state?.pageTitleEn;
    }

    ngOnInit(): void {
        this.prepareGridHeaderCols();
        this.getCurrentPlansOverview();
    }

    private getCurrentPlansOverview(): void {
        this.teamLeaderPlanService.getCurrentPlansOverview().subscribe({
            next: (res) => this.visitPlanOverviewList = res.data || [],
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    //-- prepare grid cols
    private prepareGridHeaderCols() {
        const t = (k: string) => this.translate.instant(k);
        this.columns = [
            {
                field: 'selfEvaluationDocumentNumber',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.SELF_EVALUATION_DOC_NUMBER',
                width: 170

            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolNameAr' : 'schoolNameEn',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.SCHOOL_NAME',

            },
            {
                field: 'schoolType',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.TYPE',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.schoolType);
                },

            },
            {
                field: this.translate.currentLang === 'ar' ? 'schoolGovernorateAr' : 'schoolGovernorateEn',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GOVERNORATE',

            },
            {
                field: this.translate.currentLang === 'ar' ? 'wilayatAr' : 'wilayatEn',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.WILAYAT',

            },
            {
                field: 'numberOfStudents',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.NUMBER_OF_STUDENTS',

            },
            {
                field: 'studentsGender',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GENDER',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.studentsGender);
                },

            },
            {
                field: 'grades',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GRADES',

            },
            {
                field: 'visitNumber',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.SCHEDULE_NUMBER',

            },
            {
                field: 'planNumber',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.PLAN_NUMBER',

            },
            {
                field: 'planSubmissionDate',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.PLAN_SUBMISSION_DATE',
                width: 170,
                valueFormatter: (params: any) => {
                    if (!params.value) return '';
                    const date = new Date(params.value);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }

            },
            {
                field: 'planStatus',
                headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.PLAN_STATUS',
                valueGetter: (params: any) => {
                    return t('PAGES.COMMON.LABELS.' + params.data.planStatus);
                },
            },

        ];

        const download = {
            label: t('PAGES.COMMON.LABELS.EXPORT'),
            icon: 'ri-printer-fill',
            callback: ({data}: any) => this.downloadReport(data),
        };

        const details = {
            label: 'details',
            icon: 'ri-eye-fill',
            callback: (row: any) => this.openDetails(row)

        };

        this.actions = this.isReport ? [download] : [details, download];
    }

    addNewPlan() {
        this.router.navigate(['/jawda/school-performance/team-leader-plan/school-selection']);
    }

    openDetails(row: any) {
        if (row.data.requestId) {
            this.router.navigate(['/jawda/school-performance/team-leader-plan/request-details', row.data.requestId]);
        } else {
            this.router.navigate(['/jawda/school-performance/team-leader-plan/creation', row.data.id]);
        }
    }

    private downloadReport(row: any) {
        this.teamLeaderPlanService.downloadReport(row.id).subscribe({
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
