import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {QualityAssuranceFollowUpFormService} from '../../service/quality-assurance-follow-up-form.service';
import {QualityAssuranceVisitDetailsStepComponent} from './steps/visit-details-step/visit-details-step.component';
import {BeforeVisitStepComponent} from './steps/before-visit-step/before-visit-step.component';
import {DuringAfterVisitStepComponent} from './steps/during-after-visit-step/during-after-visit-step.component';
import {QaFollowUpFormSubmission} from '../../types/qa-follow-up-form-submission';

@Component({
    selector: 'app-quality-assurance-follow-up-form-creation',
    templateUrl: './quality-assurance-follow-up-form-creation.component.html',
    styleUrl: './quality-assurance-follow-up-form-creation.component.scss'
})
export class QualityAssuranceFollowUpFormCreationComponent implements OnInit {

    protected readonly history = history;

    id: any;
    visitData: any;
    navigateParam: any;
    showTabs: boolean = false;
    scheduledSchoolVisitId: any;
    qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;

    //-- inputs
    visitDetailsTabInputs = new Map<string, any>();
    beforeVisitTabInputs = new Map<string, any>();
    duringAfterVisitTabInputs = new Map<string, any>();

    steps: StepItem[] = [
        {
            labelAr: 'تفاصيل الزيارة ',
            labelEn: 'Visit Details',
            component: QualityAssuranceVisitDetailsStepComponent,
            inputs: this.visitDetailsTabInputs
        },
        {
            labelAr: 'ما قبل الزيارة',
            labelEn: 'Before the Visit',
            component: BeforeVisitStepComponent,
            inputs: this.beforeVisitTabInputs
        },
        {
            labelAr: 'أثناء وبعد الزيارة',
            labelEn: 'During and After the Visit',
            component: DuringAfterVisitStepComponent,
            inputs: this.duringAfterVisitTabInputs
        }
    ];

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private router: Router,
        private qualityAssuranceFormService: QualityAssuranceFollowUpFormService) {
    }

    ngOnInit(): void {
        this.qualityAssuranceFormService.submitFormSubject.next(false);
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            if (this.id) {
                this.getQualityAssuranceFollowUpFormById(this.id);
            } else {
                this.qualityAssuranceFormInfo.scheduledSchoolVisitId = this.scheduledSchoolVisitId;
                this.visitData = this.history.state.visitData;
                this.loadData();
            }
        });
    }

    getQualityAssuranceFollowUpFormById(id: number) {
        this.qualityAssuranceFormService.getQualityAssuranceFollowUpFormById(id).subscribe({
            next: (response) => {
                this.qualityAssuranceFormInfo = response.data;
                const scheduledSchoolVisit = this.qualityAssuranceFormInfo.scheduledSchoolVisit;
                this.visitData = {
                    visitNumber: scheduledSchoolVisit?.visitNumber,
                    planNumber: scheduledSchoolVisit?.planNumber,
                    visitFrom: scheduledSchoolVisit?.visitFrom,
                    visitTo: scheduledSchoolVisit?.visitTo,
                    schoolNameAr: scheduledSchoolVisit?.school?.nameAr,
                    schoolNameEn: scheduledSchoolVisit?.school?.nameEn,
                    schoolCode: scheduledSchoolVisit?.school?.code,
                    principalName: scheduledSchoolVisit?.school?.principalName,
                    schoolType: scheduledSchoolVisit?.school?.type,
                    phone: scheduledSchoolVisit?.school?.phone,
                    studentsGender: scheduledSchoolVisit?.school?.gender,
                    schoolGovernorateAr: scheduledSchoolVisit?.school?.governorate?.nameAr,
                    schoolGovernorateEn: scheduledSchoolVisit?.school?.governorate?.nameEn,
                    wilayatAr: scheduledSchoolVisit?.school?.wilayat?.nameAr,
                    wilayatEn: scheduledSchoolVisit?.school?.wilayat?.nameEn,
                    village: scheduledSchoolVisit?.school?.village,
                    grades: scheduledSchoolVisit?.schoolSchedulingRequestInfo?.grades,
                    scheduledSchoolVisitId: this.qualityAssuranceFormInfo.scheduledSchoolVisitId,
                    selfEvaluationDocumentNumber: scheduledSchoolVisit?.selfEvaluationDocumentNumber
                }
                this.loadData();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    private loadData() {
        //--- add main object to steps
        this.visitDetailsTabInputs.set('visitData', this.visitData);
        this.visitDetailsTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.visitDetailsTabInputs.set('scheduledSchoolVisitId', this.scheduledSchoolVisitId);

        this.beforeVisitTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);

        this.duringAfterVisitTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.duringAfterVisitTabInputs.set('visitFrom', this.visitData?.visitFrom);
        this.duringAfterVisitTabInputs.set('visitTo', this.visitData?.visitTo);

        this.showTabs = true;
    }
}
