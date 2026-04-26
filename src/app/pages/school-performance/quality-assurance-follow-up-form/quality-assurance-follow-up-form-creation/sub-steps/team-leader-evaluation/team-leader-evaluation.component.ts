import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {QualityAssuranceFollowUpFormService} from "../../../../service/quality-assurance-follow-up-form.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-team-leader-evaluation',
    templateUrl: './team-leader-evaluation.component.html',
    styleUrl: './team-leader-evaluation.component.scss'
})
export class TeamLeaderEvaluationComponent extends BaseStepComponent {
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
        leadershipPresence: 'LEADERSHIP_PRESENCE',
        taskDistributionAndFollowUp: 'TASK_DISTRIBUTION_AND_FOLLOW_UP',
        schoolDataUnderstandingAndAnalysis: 'SCHOOL_DATA_UNDERSTANDING_AND_ANALYSIS',
        communicationWithSchool: 'COMMUNICATION_WITH_SCHOOL',
        respectAndProfessionalism: 'RESPECT_AND_PROFESSIONALISM',
        effectiveParticipation: 'EFFECTIVE_PARTICIPATION',
        meetingManagement: 'MEETING_MANAGEMENT',
        taskManagement: 'TASK_MANAGEMENT',
        overallLeaderPerformance: 'OVERALL_LEADER_PERFORMANCE'
    };

    ngOnInit() {
        this.subscription = this.qualityAssuranceFollowUpFormService.submitFormData$.subscribe(message => this.isSubmitted = message);
        if (!this.qualityAssuranceFormInfo.teamLeaderEvaluationScores) {
            this.qualityAssuranceFormInfo.teamLeaderEvaluationScores = {
                leadershipPresence: 0,
                taskDistributionAndFollowUp: 0,
                schoolDataUnderstandingAndAnalysis: 0,
                communicationWithSchool: 0,
                respectAndProfessionalism: 0,
                effectiveParticipation: 0,
                meetingManagement: 0,
                taskManagement: 0,
                overallLeaderPerformance: 0,
                strengthsAnalysis: '',
                improvementsAnalysis: '',
                notes: ''
            };
        }
    }
}
