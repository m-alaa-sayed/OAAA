import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {FormVisitDetailsStepComponent} from './steps/form-visit-details-step/form-visit-details-step.component';
import {
    PerformanceEvaluationStepComponent
} from './steps/performance-evaluation-step/performance-evaluation-step.component';
import {
    StrengthsImprovementAnalysisStepComponent
} from './steps/strengths-improvement-analysis-step/strengths-improvement-analysis-step.component';
import {VisitFormService} from '../../service/visit-form.service';
import {VisitFormRequestInfo} from '../../types/visit-form-request-info';

@Component({
    selector: 'visit-form-creation',
    templateUrl: './visit-form-creation.component.html',
    styleUrl: './visit-form-creation.component.scss'
})
export class VisitFormCreationComponent implements OnInit {
    visitFormRequestInfo: VisitFormRequestInfo = {} as VisitFormRequestInfo;
    visitData: any;
    id: any;
    status: any;
    type: any;
    showTabs: boolean = false;
    title = "";
    breadcrumbTitle = "";
    breadcrumb = "";
    navigateParam: any;

    //-- inputs
    visitDetailsTabInputs = new Map<string, any>();
    strengthsImprovementTabInputs = new Map<string, any>();
    performanceEvaluationStepComponentTabInputs = new Map<string, any>();

    steps: StepItem[] = [
        {
            labelAr: 'تفاصيل الزيارة الصفية',
            labelEn: 'Form Visit Details',
            component: FormVisitDetailsStepComponent,
            inputs: this.visitDetailsTabInputs
        },
        {
            labelAr: 'تقييم الأداء',
            labelEn: 'Performance Evaluation',
            component: PerformanceEvaluationStepComponent,
            inputs: this.performanceEvaluationStepComponentTabInputs
        },
        {
            labelAr: ' تحليل نقاط القوة وفرص التحسين',
            labelEn: 'Analysis of Strengths and Improvement Opportunities',
            component: StrengthsImprovementAnalysisStepComponent,
            inputs: this.strengthsImprovementTabInputs
        }
    ];

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private router: Router,
        private visitFormService: VisitFormService) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state !== undefined) {
            this.navigateParam = navigation.extras.state as {
                visitData: any
            }
            this.visitData = this.navigateParam.visitData;

        }
    }


    ngOnInit(): void {
        if (this.visitData) {
            this.visitFormService.setVisitData(this.visitData);
        } else {
            this.visitData = this.visitFormService.getVisitData();
        }
        this.route.paramMap.subscribe(params => {
            this.type = params.get('type') || '';
            if (this.type == 'GENERAL_EVIDENCE') {
                this.steps = [];
                this.steps = [
                    {
                        labelAr: 'تفاصيل الإستمارة العامة للأدلة',
                        labelEn: 'General Evidence Form Details',
                        component: FormVisitDetailsStepComponent,
                        inputs: this.visitDetailsTabInputs
                    },
                    {
                        labelAr: 'التفاصيل والخلاصة',
                        labelEn: 'Details and Summary',
                        component: StrengthsImprovementAnalysisStepComponent,
                        inputs: this.strengthsImprovementTabInputs
                    },
                    {
                        labelAr: 'تحليل نقاط القوة وفرص التحسين',
                        labelEn: 'Analysis of Strengths and Improvement Opportunities',
                        component: PerformanceEvaluationStepComponent,
                        inputs: this.performanceEvaluationStepComponentTabInputs
                    }
                ];
            }
            this.id = params.get('id');
            this.status = params.get('status');
            this.title = `MENUITEMS.MENU.${this.type}_FORM_ADD`;
            this.breadcrumbTitle = `MENUITEMS.MENU.${this.type}_FORM`;
            this.breadcrumb = `MENUITEMS.MENU.${this.type}_FORM_MANAGEMENT`;

            this.visitFormRequestInfo.type = this.type;
            this.visitFormRequestInfo.scheduledSchoolVisitId = this.visitData.scheduledSchoolVisitId;
            if (this.status == 'PROCESSING') {
                this.getVisitFormRequestInfoByInfoId(this.id);
            } else {
                this.loadData();
            }

        });
    }

    getVisitFormRequestInfoByInfoId(id: number) {
        this.visitFormService.getVisitFormRequestInfoByInfoId(id).subscribe({
            next: (response) => {
                this.visitFormRequestInfo = response.data;
                this.loadData();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    private loadData() {
        //--- add main object to steps
        this.visitDetailsTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);
        this.visitDetailsTabInputs.set('visitData', this.visitData);
        this.strengthsImprovementTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);
        this.performanceEvaluationStepComponentTabInputs.set('visitFormRequestInfo', this.visitFormRequestInfo);

        this.showTabs = true;

    }

}
