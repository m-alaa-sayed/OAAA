import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {
    QualityAssuranceFollowUpFormService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form.service';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'app-before-visit-step',
    templateUrl: './before-visit-step.component.html',
    styleUrl: './before-visit-step.component.scss'
})
export class BeforeVisitStepComponent extends BaseStepComponent {

    @Input() qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;

    labels = {
        teamLeadAnalysisOfSelfEvaluation: 'TEAM_LEAD_ANALYSIS_OF_SELF_EVALUATION',
        teamLeadPlan: 'TEAM_LEAD_PLAN',
        introductoryMeeting: 'INTRODUCTORY_MEETING',
        assignedDomainsToMembers: 'ASSIGNED_DOMAINS_TO_MEMBERS',
        assignedSubjectsToMembers: 'ASSIGNED_SUBJECTS_TO_MEMBERS',
        preVisitSurveyAnalysisReceived: 'PRE_VISIT_SURVEY_ANALYSIS_RECEIVED'
    };

    constructor(public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
                public qualityAssuranceFollowUpFormService: QualityAssuranceFollowUpFormService,
                protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }

    ngOnInit() {
        this.qualityAssuranceFormInfo.preVisitFollowUpScores ??= {
            teamLeadAnalysisOfSelfEvaluation: 0,
            teamLeadPlan: 0,
            introductoryMeeting: 0,
            assignedDomainsToMembers: 0,
            assignedSubjectsToMembers: 0,
            preVisitSurveyAnalysisReceived: 0,
        };
    }

    save() {
        this.qualityAssuranceFollowUpFormService.save(this.qualityAssuranceFormInfo, 'SAVE');
    }
}
