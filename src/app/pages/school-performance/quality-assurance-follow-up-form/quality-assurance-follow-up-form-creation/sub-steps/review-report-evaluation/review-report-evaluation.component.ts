import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';

@Component({
    selector: 'app-review-report-evaluation',
    templateUrl: './review-report-evaluation.component.html',
    styleUrl: './review-report-evaluation.component.scss'
})
export class ReviewReportEvaluationComponent extends BaseStepComponent {
    @Input() qualityAssuranceFormInfo!: QaFollowUpFormSubmission;
    @Input() editable: boolean = true;
    @Input() isSubmitted = false;

    constructor(public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
                protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }

    labels = {
        academicAchievementDomain: 'ACADEMIC_ACHIEVEMENT_DOMAIN',
        personalDevelopmentDomain: 'PERSONAL_DEVELOPMENT_DOMAIN',
        teachingAndAssessmentDomain: 'TEACHING_AND_ASSESSMENT_DOMAIN',
        learningEnvironmentDomain: 'LEARNING_ENVIRONMENT_DOMAIN',
        leadershipAndGovernanceDomain: 'LEADERSHIP_AND_GOVERNANCE_DOMAIN',
        overallSchoolPerformance: 'OVERALL_SCHOOL_PERFORMANCE',
        summaryAlignmentAndConsistency: 'SUMMARY_ALIGNMENT_AND_CONSISTENCY',
        languageQualityInReport: 'LANGUAGE_QUALITY_IN_REPORT'
    };

    ngOnInit() {
        if (!this.qualityAssuranceFormInfo.visitReportEvaluationScores) {
            this.qualityAssuranceFormInfo.visitReportEvaluationScores = {
                academicAchievementDomain: 0,
                personalDevelopmentDomain: 0,
                teachingAndAssessmentDomain: 0,
                learningEnvironmentDomain: 0,
                leadershipAndGovernanceDomain: 0,
                overallSchoolPerformance: 0,
                summaryAlignmentAndConsistency: 0,
                languageQualityInReport: 0,
                notes: ''
            };
        }
    }
}
