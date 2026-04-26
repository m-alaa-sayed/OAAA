import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchoolPerformanceRoutingModule} from './school-performance-routing.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbCollapseModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {ServiceManagementRoutingModule} from '../service-management/service-management-routing.module';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {
    SelfEvaluationDocumentListComponent
} from './self-evaluation-document/self-evaluation-document-list/self-evaluation-document-list.component';
import {
    SelfEvaluationDocumentCreationComponent
} from './self-evaluation-document/self-evaluation-document-creation/self-evaluation-document-creation.component';
import {
    SelfEvaluationDocumentAttachmentsComponent
} from './self-evaluation-document/self-evaluation-document-creation/components/self-evaluation-document-attachments/self-evaluation-document-attachments.component';
import {
    SelfEvaluationDocumentPledgeComponent
} from './self-evaluation-document/self-evaluation-document-creation/components/self-evaluation-document-pledge/self-evaluation-document-pledge.component';
import {
    SelfEvaluationDocumentSelfEvalComponent
} from './self-evaluation-document/self-evaluation-document-creation/components/self-evaluation-document-self-eval/self-evaluation-document-self-eval.component';
import {
    SelfEvaluationDocumentAttachmentsStepComponent
} from './self-evaluation-document/self-evaluation-document-creation/steps/self-evaluation-document-attachments-step/self-evaluation-document-attachments-step.component';
import {
    SelfEvaluationDocumentPledgeStepComponent
} from './self-evaluation-document/self-evaluation-document-creation/steps/self-evaluation-document-pledge-step/self-evaluation-document-pledge-step.component';
import {
    SelfEvaluationDocumentSchoolInfoStepComponent
} from './self-evaluation-document/self-evaluation-document-creation/steps/self-evaluation-document-school-info-step/self-evaluation-document-school-info-step.component';
import {
    SelfEvaluationDocumentSelfEvalStepComponent
} from './self-evaluation-document/self-evaluation-document-creation/steps/self-evaluation-document-self-eval-step/self-evaluation-document-self-eval-step.component';
import {
    SelfEvaluationDocumentSchoolInfoComponent
} from './self-evaluation-document/self-evaluation-document-creation/components/self-evaluation-document-school-info/self-evaluation-document-school-info.component';
import {VisitFormListComponent} from './visit-form/visit-form-list/visit-form-list.component';
import {VisitFormManagementComponent} from './visit-form/visit-form-management/visit-form-management.component';
import {TeamLeaderPlanListComponent} from './team-leader-plan/team-leader-plan-list/team-leader-plan-list.component';
import {
    TeamLeaderPlanCreationComponent
} from './team-leader-plan/team-leader-plan-creation/team-leader-plan-creation.component';
import {
    TeamLeaderPlanSchoolSelectionComponent
} from './team-leader-plan/team-leader-plan-school-selection/team-leader-plan-school-selection.component';
import {
    TeamLeaderPlanMainDataComponent
} from './team-leader-plan/team-leader-plan-creation/components/team-leader-plan-main-data/team-leader-plan-main-data.component';
import {
    VisitDetailsStepComponent
} from './team-leader-plan/team-leader-plan-creation/steps/visit-details-step/visit-details-step.component';
import {
    ConflictOfInterestDisclosureStepComponent
} from './team-leader-plan/team-leader-plan-creation/steps/conflict-of-interest-disclosure-step/conflict-of-interest-disclosure-step.component';
import {
    SelfEvaluationDocumentAnalysisStepComponent
} from './team-leader-plan/team-leader-plan-creation/steps/self-evaluation-document-analysis-step/self-evaluation-document-analysis-step.component';
import {
    TaskPlanStepComponent
} from './team-leader-plan/team-leader-plan-creation/steps/task-plan-step/task-plan-step.component';
import {
    TeamLeaderAnalysisStepComponent
} from './team-leader-plan/team-leader-plan-creation/steps/team-leader-analysis-step/team-leader-analysis-step.component';
import {VisitFormCreationComponent} from './visit-form/visit-form-creation/visit-form-creation.component';
import {
    TeamLeaderAnalysisComponent
} from './team-leader-plan/team-leader-plan-creation/components/team-leader-analysis/team-leader-analysis.component';
import {
    SelfEvaluationDocumentAnalysisComponent
} from './team-leader-plan/team-leader-plan-creation/components/self-evaluation-document-analysis/self-evaluation-document-analysis.component';
import {
    ConflictOfInterestDisclosureComponent
} from './team-leader-plan/team-leader-plan-creation/components/conflict-of-interest-disclosure/conflict-of-interest-disclosure.component';
import {TaskPlanComponent} from './team-leader-plan/team-leader-plan-creation/components/task-plan/task-plan.component';
import {
    TeamLeadVisitDetailsComponent
} from './team-leader-plan/team-leader-plan-creation/components/team-lead-visit-details/team-lead-visit-details.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {
    TaskPlanTaskComponent
} from './team-leader-plan/team-leader-plan-creation/components/task-plan-task/task-plan-task.component';
import {
    TaskPlanMemberComponent
} from './team-leader-plan/team-leader-plan-creation/components/task-plan-member/task-plan-member.component';
import {
    FormVisitDetailsStepComponent
} from './visit-form/visit-form-creation/steps/form-visit-details-step/form-visit-details-step.component';
import {
    StrengthsImprovementAnalysisStepComponent
} from './visit-form/visit-form-creation/steps/strengths-improvement-analysis-step/strengths-improvement-analysis-step.component';
import {
    PerformanceEvaluationStepComponent
} from './visit-form/visit-form-creation/steps/performance-evaluation-step/performance-evaluation-step.component';
import {
    FormVisitDetailsComponent
} from './visit-form/visit-form-creation/components/form-visit-details/form-visit-details.component';
import {
    StrengthsImprovementAnalysisComponent
} from './visit-form/visit-form-creation/components/strengths-improvement-analysis/strengths-improvement-analysis.component';
import {
    PerformanceEvaluationComponent
} from './visit-form/visit-form-creation/components/performance-evaluation/performance-evaluation.component';
import {
    VisitFormRequestDetailsComponent
} from './visit-form/visit-form-request-details/visit-form-request-details.component';
import {FormMainDataComponent} from './shared/form-main-data/form-main-data.component';
import {
    FormVisitDetailsTabComponent
} from './visit-form/visit-form-request-details/tabs/form-visit-details-tab/form-visit-details-tab.component';
import {
    StrengthsImprovementAnalysisTabComponent
} from './visit-form/visit-form-request-details/tabs/strengths-improvement-analysis-tab/strengths-improvement-analysis-tab.component';
import {
    PerformanceEvaluationTabComponent
} from './visit-form/visit-form-request-details/tabs/performance-evaluation-tab/performance-evaluation-tab.component';
import {
    VisitFormRequestActionsComponent
} from './visit-form/visit-form-request-actions/visit-form-request-actions.component';
import {
    GeneralEvidenceVisitDetailsComponent
} from './visit-form/visit-form-creation/components/general-evidence-visit-details/general-evidence-visit-details.component';
import {
    DetailsAndSummaryComponent
} from './visit-form/visit-form-creation/components/details-and-summary/details-and-summary.component';

// New school performance layout and tab components
import {SchoolPerformanceLayoutComponent} from './school-performance-layout/school-performance-layout.component';
import {GeneralDataComponent} from './tabs/general-data/general-data.component';
import {ContactAddModalComponent} from '../../shared/contact-add-modal/contact-add-modal.component';
import {StudentDataComponent} from './tabs/student-data/student-data.component';
import {TeachingStaffComponent} from './tabs/teaching-staff/teaching-staff.component';
import {StaffDataComponent} from './tabs/staff-data/staff-data.component';
import {AboutSchoolComponent} from './tabs/about-school/about-school.component';
import {FacilitiesComponent} from './tabs/facilities/facilities.component';
import {EducationalProgramsComponent} from './tabs/educational-programs/educational-programs.component';
import {SchoolActivitiesComponent} from './tabs/school-activities/school-activities.component';
import {SpecialNeedsComponent} from './tabs/special-needs/special-needs.component';
import {GiftedStudentsComponent} from './tabs/gifted-students/gifted-students.component';
import {NationalTestsComponent} from './tabs/national-tests/national-tests.component';
import {AcademicAchievementComponent} from './tabs/academic-achievement/academic-achievement.component';
import {MasteryRatesComponent} from './tabs/mastery-rates/mastery-rates.component';
import {AddSubjectModalComponent} from '../../shared/add-subject-modal/add-subject-modal.component';
import {AchievementDistributionComponent} from './tabs/achievement-distribution/achievement-distribution.component';
import {CohortTrackingComponent} from './tabs/cohort-tracking/cohort-tracking.component';
import {
    ExternalReviewVisitReportsCreationComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/external-review-visit-reports-creation.component';
import {
    ExternalReviewVisitReportsListComponent
} from './external-review-visit-reports/external-review-visit-reports-list/external-review-visit-reports-list.component';
import {
    AppendicesStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/appendices-step/appendices-step.component';
import {
    VisitReportsVisitDetailsStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/visit-reports-visit-details-step/visit-reports-visit-details-step.component';
import {
    SafetyAndSecurityStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/safety-and-security-step/safety-and-security-step.component';
import {
    ReportReadingGuideStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/report-reading-guide-step/report-reading-guide-step.component';
import {
    OverallSchoolPerformanceStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/overall-school-performance-step/overall-school-performance-step.component';
import {
    ExternalReviewResultsStepComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/steps/external-review-results-step/external-review-results-step.component';
import {
    AppendicesComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/appendices/appendices.component';
import {
    ExternalReviewResultsComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/external-review-results/external-review-results.component';
import {
    OverallSchoolPerformanceComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/overall-school-performance/overall-school-performance.component';
import {
    ReportReadingGuideComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/report-reading-guide/report-reading-guide.component';
import {
    SafetyAndSecurityComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/safety-and-security/safety-and-security.component';
import {
    VisitReportsVisitDetailsComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/visit-reports-visit-details/visit-reports-visit-details.component';
import {DomainSummaryActionsComponent} from './domain-summary/domain-summary-actions/domain-summary-actions.component';
import {
    DomainSummaryCreationComponent
} from './domain-summary/domain-summary-creation/domain-summary-creation.component';
import {DomainSummaryListComponent} from './domain-summary/domain-summary-list/domain-summary-list.component';
import {
    DomainSummaryManagementComponent
} from './domain-summary/domain-summary-management/domain-summary-management.component';
import {
    DomainSummaryRequestDetailsComponent
} from './domain-summary/domain-summary-request-details/domain-summary-request-details.component';
import {TeamleadCohortTrackingComponent} from './tabs/teamlead-cohort-tracking/teamlead-cohort-tracking.component';
import {
    DomainJudgmentComponent
} from './domain-summary/domain-summary-creation/domain-judgment/domain-judgment.component';
import {
    DomainSummaryStrengthsImprovementAnalysisComponent
} from './domain-summary/domain-summary-creation/domain-summary-strengths-improvement-analysis/domain-summary-strengths-improvement-analysis.component';
import {
    QualityAssuranceFollowUpFormCreationComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/quality-assurance-follow-up-form-creation.component';
import {
    QualityAssuranceFollowUpFormDetailsComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-details/quality-assurance-follow-up-form-details.component';
import {
    QualityAssuranceFollowUpFormListComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-list/quality-assurance-follow-up-form-list.component';
import {
    QualityAssuranceFollowUpFormSelectComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-select/quality-assurance-follow-up-form-select.component';
import {
    BeforeVisitStepComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/steps/before-visit-step/before-visit-step.component';
import {
    DuringAfterVisitStepComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/steps/during-after-visit-step/during-after-visit-step.component';
import {VisitDetailsComponent} from './shared/visit-details/visit-details.component';
import {
    QualityAssuranceVisitDetailsStepComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/steps/visit-details-step/visit-details-step.component';
import {
    FormationOfReviewVisitTeamComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/components/formation-of-review-visit-team/formation-of-review-visit-team.component';
import {
    TeamLeaderPlanDetailsComponent
} from './team-leader-plan/team-leader-plan-details/team-leader-plan-details.component';
import {
    ConflictOfInterestDisclosureTabComponent
} from './team-leader-plan/team-leader-plan-details/tabs/conflict-of-interest-disclosure-tab/conflict-of-interest-disclosure-tab.component';
import {
    SelfEvaluationDocumentAnalysisTabComponent
} from './team-leader-plan/team-leader-plan-details/tabs/self-evaluation-document-analysis-tab/self-evaluation-document-analysis-tab.component';
import {
    TaskPlanTabComponent
} from './team-leader-plan/team-leader-plan-details/tabs/task-plan-tab/task-plan-tab.component';
import {
    TeamLeaderAnalysisTabComponent
} from './team-leader-plan/team-leader-plan-details/tabs/team-leader-analysis-tab/team-leader-analysis-tab.component';
import {
    VisitDetailsTabComponent
} from './team-leader-plan/team-leader-plan-details/tabs/visit-details-tab/visit-details-tab.component';
import {
    TeamLeaderPlanActionsComponent
} from './team-leader-plan/team-leader-plan-actions/team-leader-plan-actions.component';
import {HasPhaseTaskPipe} from './team-leader-plan/has-phase-task.pipe';
import {
    ScoreTableComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/components/score-table/score-table.component';
import {
    DuringAfterVisitComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/components/during-after-visit/during-after-visit.component';
import {
    FollowUpDuringVisitComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/sub-steps/follow-up-during-visit/follow-up-during-visit.component';
import {
    SchoolReadinessComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/sub-steps/school-readiness/school-readiness.component';
import {
    TeamPerformanceEvaluationComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/sub-steps/team-performance-evaluation/team-performance-evaluation.component';
import {
    TeamLeaderEvaluationComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/sub-steps/team-leader-evaluation/team-leader-evaluation.component';
import {
    ReviewReportEvaluationComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/sub-steps/review-report-evaluation/review-report-evaluation.component';
import {
    BeforeVisitTabComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-details/tabs/before-visit-tab/before-visit-tab.component';
import {
    DuringAfterVisitTabComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-details/tabs/during-after-visit-tab/during-after-visit-tab.component';
import {
    QAVisitDetailsTabComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-details/tabs/visit-details-tab/visit-details-tab.component';
import {
    EvidenceCollectionFormsStatisticsComponent
} from './tabs/evidence-collection-forms-statistics/evidence-collection-forms-statistics.component';
import {
    DomainStandardsComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/components/domain-standards/domain-standards.component';
import {
    ExternalReviewVisitNewReportsListComponent
} from './external-review-visit-reports/external-review-visit-new-reports-list/external-review-visit-new-reports-list.component';
import {
    SchoolDocumentDeliveryVisitListComponent
} from './school-document-delivery/school-document-delivery-visit-list/school-document-delivery-visit-list.component';
import {
    SchoolDocumentDeliveryVisitDetailComponent
} from './school-document-delivery/school-document-delivery-visit-detail/school-document-delivery-visit-detail.component';
import {SchoolInformationComponent} from './shared/school-information/school-information.component';
import {
    ScheduledSchoolVisitInfoComponent
} from './shared/scheduled-school-visit-info/scheduled-school-visit-info.component';
import {HasPermissionDirective} from 'src/app/core/directives/has-permission.directive';
import {
    DocumentDeliveryItemListComponent
} from './school-document-delivery/school-document-delivery-visit-detail/components/document-delivery-item-list/document-delivery-item-list.component';
import {
    SchoolDocumentDeliveryRequestDetailsComponent
} from './school-document-delivery/school-document-delivery-request-details/school-document-delivery-request-details.component';
import {
    SchoolDocumentDeliveryActionsComponent
} from './school-document-delivery/school-document-delivery-actions/school-document-delivery-actions.component';
import {AuditModelComponent} from './shared/audit-model/audit-model.component';
import {StepActionButtonsComponent} from './shared/step-action-buttons/step-action-buttons.component';
import {
    ExternalReviewVisitReportsDetailsComponent
} from './external-review-visit-reports/external-review-visit-reports-details/external-review-visit-reports-details.component';
import {
    VisitReportsVisitDetailsTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/visit-reports-visit-details-tab/visit-reports-visit-details-tab.component';
import {
    SafetyAndSecurityTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/safety-and-security-tab/safety-and-security-tab.component';
import {
    ReportReadingGuideTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/report-reading-guide-tab/report-reading-guide-tab.component';
import {
    OverallSchoolPerformanceTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/overall-school-performance-tab/overall-school-performance-tab.component';
import {
    ExternalReviewResultsTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/external-review-results-tab/external-review-results-tab.component';
import {
    AppendicesTabComponent
} from './external-review-visit-reports/external-review-visit-reports-details/tabs/appendices-tab/appendices-tab.component';
import {
    ExternalReviewVisitReportsActionsComponent
} from './external-review-visit-reports/external-review-visit-reports-actions/external-review-visit-reports-actions.component';
import {
    VisitReportSummaryCreationComponent
} from './visit-report-summary/visit-report-summary-creation/visit-report-summary-creation.component';
import {
    VisitReportSummaryListComponent
} from './visit-report-summary/visit-report-summary-list/visit-report-summary-list.component';
import {
    VisitReportSummaryDetailsComponent
} from './visit-report-summary/visit-report-summary-details/visit-report-summary-details.component';
import {
    SummaryVisitReportsVisitDetailsStepComponent
} from './visit-report-summary/visit-report-summary-creation/steps/summary-visit-reports-visit-details-step/summary-visit-reports-visit-details-step.component';
import {
    SummaryOverallSchoolPerformanceStepComponent
} from './visit-report-summary/visit-report-summary-creation/steps/summary-overall-school-performance-step/summary-overall-school-performance-step.component';
import {
    SummaryAppendicesStepComponent
} from './visit-report-summary/visit-report-summary-creation/steps/summary-appendices-step/summary-appendices-step.component';
import {
    SummaryAppendicesComponent
} from './visit-report-summary/visit-report-summary-creation/components/summary-appendices/summary-appendices.component';
import {
    SummaryOverallSchoolPerformanceComponent
} from './visit-report-summary/visit-report-summary-creation/components/summary-overall-school-performance/summary-overall-school-performance.component';
import {
    SummaryVisitReportsVisitDetailsComponent
} from './visit-report-summary/visit-report-summary-creation/components/summary-visit-reports-visit-details/summary-visit-reports-visit-details.component';
import {
    SummaryVisitReportsVisitDetailsTabComponent
} from './visit-report-summary/visit-report-summary-details/tabs/summary-visit-reports-visit-details-tab/summary-visit-reports-visit-details-tab.component';
import {
    SummaryOverallSchoolPerformanceTabComponent
} from './visit-report-summary/visit-report-summary-details/tabs/summary-overall-school-performance-tab/summary-overall-school-performance-tab.component';
import {
    SummaryAppendicesTabComponent
} from './visit-report-summary/visit-report-summary-details/tabs/summary-appendices-tab/summary-appendices-tab.component';
import {
    VisitReportSummaryActionsComponent
} from './visit-report-summary/visit-report-summary-actions/visit-report-summary-actions.component';
import {TaskType} from './team-leader-plan/task-type.pipe';
import {TaskActivity} from './team-leader-plan/task-activity.pipe';
import {
    ImportVisitFormsComponent
} from './domain-summary/domain-summary-creation/domain-summary-strengths-improvement-analysis/import-visit-forms/import-visit-forms.component';
import {
    ReportDocumentDownloaderComponent
} from "./external-review-visit-reports/external-review-visit-reports-creation/components/report-document-downloader/report-document-downloader.component";
import {
    SummaryVisitReportComponent
} from "./external-review-visit-reports/external-review-visit-reports-creation/components/summary-visit-report/summary-visit-report.component";
import {
    SummaryVisitReportStepComponent
} from "./external-review-visit-reports/external-review-visit-reports-creation/steps/summary-visit-report-step/summary-visit-report-step.component";
import {
    SummaryVisitReportTabComponent
} from "./external-review-visit-reports/external-review-visit-reports-details/tabs/summary-visit-report-tab/summary-visit-report-tab.component";

@NgModule({
    declarations: [
        SelfEvaluationDocumentListComponent,
        SelfEvaluationDocumentCreationComponent,
        SelfEvaluationDocumentAttachmentsStepComponent,
        SelfEvaluationDocumentPledgeStepComponent,
        SelfEvaluationDocumentSchoolInfoStepComponent,
        SelfEvaluationDocumentSelfEvalStepComponent,
        SelfEvaluationDocumentPledgeComponent,
        SelfEvaluationDocumentSelfEvalComponent,
        SelfEvaluationDocumentAttachmentsComponent,
        SelfEvaluationDocumentSchoolInfoComponent,
        VisitFormListComponent,
        VisitFormManagementComponent,
        TeamLeaderPlanListComponent,
        TeamLeaderPlanCreationComponent,
        TeamLeaderPlanSchoolSelectionComponent,
        TeamLeaderPlanMainDataComponent,
        VisitDetailsStepComponent,
        ConflictOfInterestDisclosureStepComponent,
        SelfEvaluationDocumentAnalysisStepComponent,
        TaskPlanStepComponent,
        TeamLeaderAnalysisStepComponent,
        VisitFormCreationComponent,
        VisitDetailsComponent,
        TeamLeadVisitDetailsComponent,
        TeamLeaderAnalysisComponent,
        SelfEvaluationDocumentAnalysisComponent,
        ConflictOfInterestDisclosureComponent,
        TaskPlanComponent,
        TaskPlanTaskComponent,
        TaskPlanMemberComponent,
        FormVisitDetailsStepComponent,
        StrengthsImprovementAnalysisStepComponent,
        PerformanceEvaluationStepComponent,
        FormVisitDetailsComponent,
        StrengthsImprovementAnalysisComponent,
        PerformanceEvaluationComponent,
        VisitFormRequestDetailsComponent,
        FormMainDataComponent,
        FormVisitDetailsTabComponent,
        StrengthsImprovementAnalysisTabComponent,
        PerformanceEvaluationTabComponent,
        VisitFormRequestActionsComponent,
        GeneralEvidenceVisitDetailsComponent,
        DetailsAndSummaryComponent,
        SchoolPerformanceLayoutComponent,
        GeneralDataComponent,
        ContactAddModalComponent,
        StudentDataComponent,
        TeachingStaffComponent,
        StaffDataComponent,
        AboutSchoolComponent,
        FacilitiesComponent,
        EducationalProgramsComponent,
        SchoolActivitiesComponent,
        SpecialNeedsComponent,
        GiftedStudentsComponent,
        NationalTestsComponent,
        AcademicAchievementComponent,
        MasteryRatesComponent,
        AddSubjectModalComponent,
        AchievementDistributionComponent,
        CohortTrackingComponent,
        ExternalReviewVisitReportsCreationComponent,
        ExternalReviewVisitReportsListComponent,
        AppendicesStepComponent,
        VisitReportsVisitDetailsStepComponent,
        SafetyAndSecurityStepComponent,
        ReportReadingGuideStepComponent,
        OverallSchoolPerformanceStepComponent,
        ExternalReviewResultsStepComponent,
        AppendicesComponent,
        VisitReportsVisitDetailsComponent,
        SafetyAndSecurityComponent,
        ReportReadingGuideComponent,
        OverallSchoolPerformanceComponent,
        ExternalReviewResultsComponent,
        DomainSummaryActionsComponent,
        DomainSummaryCreationComponent,
        DomainSummaryListComponent,
        DomainSummaryManagementComponent,
        DomainSummaryRequestDetailsComponent,
        TeamleadCohortTrackingComponent,
        DomainJudgmentComponent,
        DomainSummaryStrengthsImprovementAnalysisComponent,
        QualityAssuranceFollowUpFormCreationComponent,
        QualityAssuranceFollowUpFormDetailsComponent,
        QualityAssuranceFollowUpFormListComponent,
        QualityAssuranceFollowUpFormSelectComponent,
        QualityAssuranceVisitDetailsStepComponent,
        BeforeVisitStepComponent,
        DuringAfterVisitStepComponent,
        FormationOfReviewVisitTeamComponent,
        TeamLeaderPlanDetailsComponent,
        VisitDetailsTabComponent,
        TeamLeaderAnalysisTabComponent,
        TaskPlanTabComponent,
        SelfEvaluationDocumentAnalysisTabComponent,
        ConflictOfInterestDisclosureTabComponent,
        TeamLeaderPlanActionsComponent,
        HasPhaseTaskPipe,
        TaskType,
        TaskActivity,
        ScoreTableComponent,
        DuringAfterVisitComponent,
        FollowUpDuringVisitComponent,
        SchoolReadinessComponent,
        TeamPerformanceEvaluationComponent,
        TeamLeaderEvaluationComponent,
        ReviewReportEvaluationComponent,
        BeforeVisitTabComponent,
        DuringAfterVisitTabComponent,
        QAVisitDetailsTabComponent,
        EvidenceCollectionFormsStatisticsComponent,
        DomainStandardsComponent,
        ExternalReviewVisitNewReportsListComponent,
        SchoolDocumentDeliveryVisitListComponent,
        SchoolDocumentDeliveryVisitDetailComponent,
        SchoolInformationComponent,
        ScheduledSchoolVisitInfoComponent,
        DocumentDeliveryItemListComponent,
        SchoolDocumentDeliveryRequestDetailsComponent,
        SchoolDocumentDeliveryActionsComponent,
        AuditModelComponent,
        StepActionButtonsComponent,
        ExternalReviewVisitReportsDetailsComponent,
        VisitReportsVisitDetailsTabComponent,
        SafetyAndSecurityTabComponent,
        ReportReadingGuideTabComponent,
        OverallSchoolPerformanceTabComponent,
        ExternalReviewResultsTabComponent,
        AppendicesTabComponent,
        ExternalReviewVisitReportsActionsComponent,
        VisitReportSummaryCreationComponent,
        VisitReportSummaryListComponent,
        VisitReportSummaryDetailsComponent,
        SummaryVisitReportsVisitDetailsStepComponent,
        SummaryOverallSchoolPerformanceStepComponent,
        SummaryAppendicesStepComponent,
        SummaryVisitReportsVisitDetailsComponent,
        SummaryOverallSchoolPerformanceComponent,
        SummaryAppendicesComponent,
        SummaryVisitReportsVisitDetailsTabComponent,
        SummaryOverallSchoolPerformanceTabComponent,
        SummaryAppendicesTabComponent,
        SummaryVisitReportComponent,
        SummaryVisitReportStepComponent,
        SummaryVisitReportTabComponent,
        VisitReportSummaryActionsComponent,
        ImportVisitFormsComponent
    ],
    imports: [
        CommonModule,
        SchoolPerformanceRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ServiceManagementRoutingModule,
        TranslateModule,
        NgbPaginationModule,
        CKEditorModule,
        NgSelectModule,
        NgbAccordionModule,
        NgbCollapseModule,
        HasPermissionDirective,
        ReportDocumentDownloaderComponent
    ]
})
export class SchoolPerformanceModule {
}
