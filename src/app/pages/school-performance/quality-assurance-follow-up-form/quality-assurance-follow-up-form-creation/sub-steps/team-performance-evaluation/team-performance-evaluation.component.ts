import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {Subscription} from "rxjs";
import {QualityAssuranceFollowUpFormService} from "../../../../service/quality-assurance-follow-up-form.service";

@Component({
    selector: 'app-team-performance-evaluation',
    templateUrl: './team-performance-evaluation.component.html',
    styleUrl: './team-performance-evaluation.component.scss'
})
export class TeamPerformanceEvaluationComponent extends BaseStepComponent {
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
        reviewProcessUnderstanding: 'REVIEW_PROCESS_UNDERSTANDING',
        coverageOfDomainsAndStandards: 'COVERAGE_OF_DOMAINS_AND_STANDARDS',
        commitmentToSchedule: 'COMMITMENT_TO_SCHEDULE',
        technologyUtilization: 'TECHNOLOGY_UTILIZATION',
        confidentialDocumentation: 'CONFIDENTIAL_DOCUMENTATION',
        communicationAndConfidenceBuilding: 'COMMUNICATION_AND_CONFIDENCE_BUILDING',
        teamCoordination: 'TEAM_COORDINATION',
        documentationAndThematicAnalysis: 'DOCUMENTATION_AND_THEMATIC_ANALYSIS',
        toolManagement: 'TOOL_MANAGEMENT',
        dailyReportingQuality: 'DAILY_REPORTING_QUALITY',
        handlingClassroomObservation: 'HANDLING_CLASSROOM_OBSERVATION',
        overallTeamPerformance: 'OVERALL_TEAM_PERFORMANCE'
    };

    ngOnInit() {
        this.subscription = this.qualityAssuranceFollowUpFormService.submitFormData$.subscribe(message => this.isSubmitted = message);
        if (!this.qualityAssuranceFormInfo.teamEvaluationScores) {
            this.qualityAssuranceFormInfo.teamEvaluationScores = {
                reviewProcessUnderstanding: 0,
                coverageOfDomainsAndStandards: 0,
                commitmentToSchedule: 0,
                technologyUtilization: 0,
                confidentialDocumentation: 0,
                communicationAndConfidenceBuilding: 0,
                teamCoordination: 0,
                documentationAndThematicAnalysis: 0,
                toolManagement: 0,
                dailyReportingQuality: 0,
                handlingClassroomObservation: 0,
                overallTeamPerformance: 0,
                notes: ''
            };
        }
    }
}

