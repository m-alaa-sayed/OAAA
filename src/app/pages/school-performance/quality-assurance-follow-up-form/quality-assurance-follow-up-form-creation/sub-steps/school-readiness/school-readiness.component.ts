import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {Subscription} from "rxjs";
import {QualityAssuranceFollowUpFormService} from "../../../../service/quality-assurance-follow-up-form.service";

@Component({
    selector: 'app-school-readiness',
    templateUrl: './school-readiness.component.html',
    styleUrl: './school-readiness.component.scss'
})
export class SchoolReadinessComponent extends BaseStepComponent {
    @Input() qualityAssuranceFormInfo!: QaFollowUpFormSubmission;
    @Input() editable: boolean = true;

    isSubmitted = false;
    subscription!: Subscription;

    constructor(
        public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
        private qualityAssuranceFollowUpFormService: QualityAssuranceFollowUpFormService,
        protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }

    labels = {
        schoolCooperation: 'SCHOOL_COOPERATION',
        awarenessOfExternalReviewCriteria: 'AWARENESS_OF_EXTERNAL_REVIEW_CRITERIA',
        selfEvaluationImplementation: 'SELF_EVALUATION_IMPLEMENTATION',
        preparationOfSupportingDocuments: 'PREPARATION_OF_SUPPORTING_DOCUMENTS',
        confidentialInfoSharingWithTeam: 'CONFIDENTIAL_INFO_SHARING_WITH_TEAM',
        workspaceReadinessForReviewTeam: 'WORKSPACE_READINESS_FOR_REVIEW_TEAM',
        overallSchoolPreparednessLevel: 'OVERALL_SCHOOL_PREPAREDNESS_LEVEL'
    };

    ngOnInit() {
        this.subscription = this.qualityAssuranceFollowUpFormService.submitFormData$.subscribe(message => this.isSubmitted = message);
        if (!this.qualityAssuranceFormInfo.schoolPreparednessScores) {
            this.qualityAssuranceFormInfo.schoolPreparednessScores = {
                schoolCooperation: 0,
                awarenessOfExternalReviewCriteria: 0,
                selfEvaluationImplementation: 0,
                preparationOfSupportingDocuments: 0,
                confidentialInfoSharingWithTeam: 0,
                workspaceReadinessForReviewTeam: 0,
                overallSchoolPreparednessLevel: 0,
                strengthsAnalysis: '',
                improvementsAnalysis: ''
            };
        }
    }
}
