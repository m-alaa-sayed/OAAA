import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {QualityAssuranceFollowUpFormService} from '../../service/quality-assurance-follow-up-form.service';
import {QualityAssuranceFollowUpFormWizardService} from '../../service/quality-assurance-follow-up-form-wizard.service';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {QAVisitDetailsTabComponent} from './tabs/visit-details-tab/visit-details-tab.component';
import {BeforeVisitTabComponent} from './tabs/before-visit-tab/before-visit-tab.component';
import {
    DuringAfterVisitComponent
} from '../quality-assurance-follow-up-form-creation/components/during-after-visit/during-after-visit.component';
import {QaFollowUpFormSubmission} from '../../types/qa-follow-up-form-submission';
import {Permission} from "../../../../core/enum/permission";

@Component({
    selector: 'app-quality-assurance-follow-up-form-details',
    templateUrl: './quality-assurance-follow-up-form-details.component.html',
    styleUrl: './quality-assurance-follow-up-form-details.component.scss'
})
export class QualityAssuranceFollowUpFormDetailsComponent implements OnInit {

    protected readonly Permission = Permission;

    id: any;
    infoId: any;
    scheduledSchoolVisitId: any;
    requestObject: any;
    qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;
    mainRequestData: any;
    showTabs: boolean = true;
    isSubmitted: boolean = false;
    //-- inputs
    visitDetailsTabInputs = new Map<string, any>();
    beforeVisitTabInputs = new Map<string, any>();
    duringAfterVisitTabInputs = new Map<string, any>();

    visitData: any;
    navigateParam: any;

    newCommentText: string = '';
    commentList: any[] = [];

    constructor(private route: ActivatedRoute,
                private qualityAssuranceFormService: QualityAssuranceFollowUpFormService,
                private toastService: ToastService,
                public translate: TranslateService,
                private commonService: CommonService,
                private qualityAssuranceFormWizardService: QualityAssuranceFollowUpFormWizardService,
                private router: Router,
                private authService: AuthService
    ) {
    }

    tabs: TabItem[] = [
        {
            labelAr: 'تفاصيل الزيارة ',
            labelEn: 'Visit Details',
            component: QAVisitDetailsTabComponent,
            inputs: this.visitDetailsTabInputs
        },
        {
            labelAr: ' ما قبل الزيارة ',
            labelEn: 'Before the Visit',
            component: BeforeVisitTabComponent,
            inputs: this.beforeVisitTabInputs
        },
        {
            labelAr: 'أثناء وبعد الزيارة',
            labelEn: 'During and After the Visit',
            component: DuringAfterVisitComponent,
            inputs: this.duringAfterVisitTabInputs
        }

    ];

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            this.getQAFormInfoById(this.id);
        });
    }

    getQAFormInfoById(id: number) {
        this.qualityAssuranceFormService.getQualityAssuranceFollowUpFormById(id).subscribe({
            next: (response) => {
                this.qualityAssuranceFormInfo = response.data;
                this.commentList = this.qualityAssuranceFormInfo.qaFollowUpFormComments;
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
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    loadData() {
        this.preparedMainRequestData();
        console.log(this.visitData);
        this.visitDetailsTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.visitDetailsTabInputs.set('visitData', this.visitData);
        this.visitDetailsTabInputs.set('scheduledSchoolVisitId', this.scheduledSchoolVisitId);
        this.beforeVisitTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.duringAfterVisitTabInputs.set('qualityAssuranceFormInfo', this.qualityAssuranceFormInfo);
        this.duringAfterVisitTabInputs.set('showButtons', false);
        this.duringAfterVisitTabInputs.set('editable', false);
        this.duringAfterVisitTabInputs.set('visitFrom', this.visitData.visitFrom);
        this.duringAfterVisitTabInputs.set('visitTo', this.visitData.visitTo);
    }

    preparedMainRequestData() {
        this.mainRequestData = {
            formDate: this.qualityAssuranceFormInfo.createdOn,
            formCode: this.qualityAssuranceFormInfo.applicationNumber,
            status: this.qualityAssuranceFormInfo.status
        };
    }

    addComment() {
        if (!this.newCommentText.trim()) return;

        const newComment: any = {
            comment: this.newCommentText
        };

        this.commentList.push(newComment);
        this.newCommentText = '';
        this.saveComments();
    }

    saveComments(): void {
        this.qualityAssuranceFormService.saveComments(this.commentList, this.qualityAssuranceFormInfo.id).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: 'Save Comments'}
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

