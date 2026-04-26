import { Component, Input } from '@angular/core';
import { QaFollowUpFormSubmission } from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-before-visit-tab',
  templateUrl: './before-visit-tab.component.html',
  styleUrl: './before-visit-tab.component.scss'
})
export class BeforeVisitTabComponent extends BaseTabComponent {
@Input() qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;

  labels = {
    teamLeadAnalysisOfSelfEvaluation: 'TEAM_LEAD_ANALYSIS_OF_SELF_EVALUATION',
    teamLeadPlan: 'TEAM_LEAD_PLAN',
    introductoryMeeting: 'INTRODUCTORY_MEETING',
    assignedDomainsToMembers: 'ASSIGNED_DOMAINS_TO_MEMBERS',
    assignedSubjectsToMembers: 'ASSIGNED_SUBJECTS_TO_MEMBERS',
    preVisitSurveyAnalysisReceived: 'PRE_VISIT_SURVEY_ANALYSIS_RECEIVED'
  };
  

  ngOnInit(){
    this.qualityAssuranceFormInfo.preVisitFollowUpScores ??= {
      teamLeadAnalysisOfSelfEvaluation: 0,
      teamLeadPlan: 0,
      introductoryMeeting: 0,
      assignedDomainsToMembers: 0,
      assignedSubjectsToMembers: 0,
      preVisitSurveyAnalysisReceived: 0,
    };

  }


  

}

