import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {FormVisitDetailsTabComponent} from './tabs/form-visit-details-tab/form-visit-details-tab.component';
import {
    StrengthsImprovementAnalysisTabComponent
} from './tabs/strengths-improvement-analysis-tab/strengths-improvement-analysis-tab.component';
import {
    PerformanceEvaluationTabComponent
} from './tabs/performance-evaluation-tab/performance-evaluation-tab.component';
import {VisitFormWizardService} from '../../service/visit-form-wizard.service';
import {VisitFormService} from '../../service/visit-form.service';

@Component({
    selector: 'visit-form-request-details',
    templateUrl: './visit-form-request-details.component.html',
    styleUrl: './visit-form-request-details.component.scss'
})
export class VisitFormRequestDetailsComponent implements OnInit {
    id: any;
    infoId: any;
    taskId: any = null;
    requestObject: any;
    visitFormRequestInfo: any;
    isReturnForEdit: boolean = false;
    mainRequestData: any;
    showTabs: boolean = false;
    title: string = '';
    isSubmitted: boolean = false;
    type: any;
    breadcrumbTitle = "";
    breadcrumb = "";
    visitDetailsTabInputs = new Map<string, any>();
    strengthsImprovementTabInputs = new Map<string, any>();
    performanceEvaluationStepComponentTabInputs = new Map<string, any>();

    isTeamMember: boolean = true;
    visitData: any;
    navigateParam: any;

    constructor(private route: ActivatedRoute,
                private visitFormWizardService: VisitFormWizardService,
                private toastService: ToastService,
                public translate: TranslateService,
                private commonService: CommonService,
                private visitFormService: VisitFormService,
                private router: Router,
                private authService: AuthService
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state !== undefined) {
            this.navigateParam = navigation.extras.state as {
                visitData: any
            }
            this.visitData = this.navigateParam.visitData;
        }
    }

    tabs: TabItem[] = [
        {
            labelAr: 'تفاصيل الزيارة الصفية',
            labelEn: 'Form Visit Details',
            component: FormVisitDetailsTabComponent,
            inputs: this.visitDetailsTabInputs
        },
        {
            labelAr: 'تقييم الأداء',
            labelEn: 'Performance Evaluation',
            component: PerformanceEvaluationTabComponent,
            inputs: this.performanceEvaluationStepComponentTabInputs
        },
        {
            labelAr: ' تحليل نقاط القوة وفرص التحسين',
            labelEn: 'Analysis of Strengths and Improvement Opportunities',
            component: StrengthsImprovementAnalysisTabComponent,
            inputs: this.strengthsImprovementTabInputs
        }
    ];

    ngOnInit(): void {
        const currentUserRoles: string[] = this.authService.getUserClaim()?.roles ?? [];
        this.isTeamMember = currentUserRoles?.includes('TM');
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
            this.getVisitFormRequestInfoByRequestId(this.id);
        });

    }

    handleTitles() {
        this.title = `MENUITEMS.MENU.${this.type}_FORM_VIEW`;
        this.breadcrumbTitle = `MENUITEMS.MENU.${this.type}_FORM`;
        this.breadcrumb = `MENUITEMS.MENU.${this.type}_FORM_MANAGEMENT`;
    }

    getVisitFormRequestInfoByRequestId(id: number) {
        this.visitFormService.getVisitFormRequestInfoByRequestId(id).subscribe({
            next: (response) => {
                this.visitFormRequestInfo = response.data;
                this.requestObject = this.visitFormRequestInfo.request;
                this.loadData();
                this.showTabs = true;
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    loadData() {
        this.type = this.visitFormRequestInfo.type;
        if (this.type == 'GENERAL_EVIDENCE') {
            this.tabs = [];
            this.tabs = [
                {
                    labelAr: 'تفاصيل الإستمارة العامة للأدلة',
                    labelEn: 'General Evidence Form Details',
                    component: FormVisitDetailsTabComponent,
                    inputs: this.visitDetailsTabInputs
                },
                {
                    labelAr: 'التفاصيل والخلاصة',
                    labelEn: 'Details and Summary',
                    component: StrengthsImprovementAnalysisTabComponent,
                    inputs: this.strengthsImprovementTabInputs
                },
                {
                    labelAr: 'تحليل نقاط القوة وفرص التحسين',
                    labelEn: 'Analysis of Strengths and Improvement Opportunities',
                    component: PerformanceEvaluationTabComponent,
                    inputs: this.performanceEvaluationStepComponentTabInputs
                }
            ];
        }
        this.handleTitles();
        this.preparedMainRequestData();

        this.visitDetailsTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);
        this.visitDetailsTabInputs.set('visitData', this.visitData);

        this.strengthsImprovementTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);
        const canEdit = this.visitFormRequestInfo.requestStatus.includes('RETURN_FOR_EDIT') && this.taskId;
        this.strengthsImprovementTabInputs.set('canEdit', canEdit);

        this.performanceEvaluationStepComponentTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);
        this.performanceEvaluationStepComponentTabInputs.set('isTeamMember', this.isTeamMember);

        this.isReturnForEdit = this.visitFormRequestInfo.requestStatus.includes('RETURN_FOR_EDIT');
        this.performanceEvaluationStepComponentTabInputs.set('isReturnForEdit', this.isReturnForEdit);
    }

    preparedMainRequestData() {
        this.mainRequestData = {
            formDate: this.visitFormRequestInfo.createdOn,
            formCode: this.visitFormRequestInfo.formCode,
            status: this.visitFormRequestInfo.formStatus,
        };
    }

    showValidationMessage(message: string) {
        scrollTo(0, 0);
        this.isSubmitted = true;
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

    submit(event: any): void {
        const action = event.action;
        const request$ = this.isReturnForEdit
            ? this.visitFormService.reSubmitVisitFormRequestInfo(this.type, this.visitFormRequestInfo, event.comment, action)
            : this.visitFormService.completeVisitFormRequestInfo(this.type, this.visitFormRequestInfo, event.comment, action);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {
                        requestApplicationNo: this.requestObject.applicationNo,
                        action
                    }
                });
            },
            error: (error) => {
                const msgKey = 'PAGES.COMMON.MESSAGES.' + error;
                this.toastService.show(this.translate.instant(msgKey), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

}
