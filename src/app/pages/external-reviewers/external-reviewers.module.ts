import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalReviewersRoutingModule } from './external-reviewers-routing.module';
import {
    ExternalReviewerRegistrationSettingsComponent
} from "./external-reviewer-registration-settings/external-reviewer-registration-settings.component";
import {
    ExternalReviewerAcceptanceItemCriteriaDetailsComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-item-criteria-details/external-reviewer-acceptance-item-criteria-details.component";
import {
    ExternalReviewerAcceptanceItemCriteriaListComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-item-criteria-list/external-reviewer-acceptance-item-criteria-list.component";
import {
    ExternalReviewerAcceptanceMainCriteriaDetailsComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-main-criteria-details/external-reviewer-acceptance-main-criteria-details.component";
import {
    ExternalReviewerAcceptanceSubCriteriaDetailsComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-sub-criteria-details/external-reviewer-acceptance-sub-criteria-details.component";
import {
    ExternalReviewerAcceptanceCriteriaManagementComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-criteria-management.component";
import { FormsModule } from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { SharedModule } from "../../shared/shared.module";
import { NgbNavModule, NgbPaginationModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import {
    ExternalReviewerRegistrationRequestCreationComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/external-reviewer-registration-request-creation.component";
import {
    ExperienceInformationComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/experience-information/experience-information.component";
import {
    PersonalInfoComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/personal-info/personal-info.component";
import {
    PledgeComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/pledge/pledge.component";
import {
    QualaficationsAndSkillsComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/qualafications-and-skills/qualafications-and-skills.component";
import {
    ExperienceInformationStepComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/steps/experience-information-step/experience-information-step.component";
import {
    PersonalInfoStepComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/steps/personal-info-step/personal-info-step.component";
import {
    PledgeStepComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/steps/pledge-step/pledge-step.component";
import {
    QualaficationsAndSkillsStepComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/steps/qualafications-and-skills-step/qualafications-and-skills-step.component";
import {
    ExternalReviewerAcceptanceSubCriteriaListComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-sub-criteria-list/external-reviewer-acceptance-sub-criteria-list.component";
import { HasPermissionDirective } from 'src/app/core/directives/has-permission.directive';
import {
    ExternalReviewerRegistrationRequestDetailsComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/external-reviewer-registration-request-details.component';
import {
    AcceptanceCriteriaAuditModalComponent
} from './external-reviewer-acceptance-criteria-management/acceptance-criteria-audit-modal/acceptance-criteria-audit-modal.component';
import {
    ExperienceInformationCheqaComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-creation/experience-information-cheqa/experience-information-cheqa.component';
import {
    ExperienceInformationCseqaComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-creation/experience-information-cseqa/experience-information-cseqa.component';
import {
    ExperienceInformationOqfComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-creation/experience-information-oqf/experience-information-oqf.component';
import {
    ExternalReviewerRegistrationRequestActionsComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-actions/external-reviewer-registration-request-actions.component';
import {
    PersonalInfoTabComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/personal-info-tab/personal-info-tab.component';
import {
    QualaficationsAndSkillsTabComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/qualafications-and-skills-tab/qualafications-and-skills-tab.component';
import {
    ExperienceInformationTabComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/experience-information-tab/experience-information-tab.component';
import {
    PledgeTabComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/pledge-tab/pledge-tab.component';
import {
    ExternalReviewersInterviewResultComponent
} from './external-reviewers-interview-result/external-reviewers-interview-result.component';
import {
    ExternalReviewersInterviewResultInfoComponent
} from './external-reviewers-interview-result/external-reviewers-interview-result-info/external-reviewers-interview-result-info.component';
import { InitialCriteriaTabComponent } from './external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/initial-criteria-tab/initial-criteria-tab.component';
import { InitialCriteriaComponent } from './external-reviewer-registration-service/external-reviewer-registration-request-details/initial-criteria/initial-criteria.component';
import { ExternalReviewerRegistrationRequestsComponent } from './external-reviewer-registration-requests/external-reviewer-registration-requests.component';
import { ExternalReviewersManagementComponent } from './external-reviewers-management/external-reviewers-management.component';
import { ExternalReviewerDetailsComponent } from './external-reviewers-management/external-reviewer-details/external-reviewer-details.component';
import { ExternalReviewerFileManagementComponent } from './external-reviewers-files/external-reviewer-file-management/external-reviewer-file-management.component';
import { AvailabilitySettingsTabComponent } from './external-reviewers-files/tabs/availability-settings-tab/availability-settings-tab.component';
import { ExternalReviewerCandidatesComponent } from './external-reviewers-candidates/external-reviewers-candidates.component';
import { ExternalReviewerCandidatesDetailsComponent } from './external-reviewers-candidates-details/external-reviewers-candidates-details.component';
import { NewOrderTrainingResultsComponent } from './external-reviewers-training-results-request/new-order-training-results/new-order-training-results.component';
import { TrainingDetailsModalComponent } from './external-reviewers-training-results-request/new-order-training-results/training-details-modal/training-details-modal.component';
import { TrainingResultsComponent } from './external-reviewers-training-results-request/training-results/training-results.component';
import { ExternalReviewersWithdrawalRequestCreationComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-request-creation/external-reviewers-withdrawal-request-creation.component';
import { ExternalReviewersWithdrawalRequestActionsComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-request-actions/external-reviewers-withdrawal-request-actions.component';
import { ExternalReviewersWithdrawalRequestDetailsComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-request-details/external-reviewers-withdrawal-request-details.component';
import { ExternalReviewersWithdrawalRequestsListComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-requests-list/external-reviewers-withdrawal-requests-list.component';
import { TrainingResultsRequestComponent } from './external-reviewers-training-results-request/training-results-request/training-results-request.component';
import { TrainingResultsRequestActionsComponent } from './external-reviewers-training-results-request/training-results-request-actions/training-results-request-actions.component';
import { ExternalReviewersRegistrationTableComponent } from './external-reviewers-training-results-request/external-reviewers-registration-table/external-reviewers-registration-table.component';
import { ExternalReviewersTrainingResultTableComponent } from './external-reviewers-training-results-request/external-reviewers-training-result-table/external-reviewers-training-result-table.component';
import { DeletionResultComponent } from './external-reviewers-deletion-request/deletion-result/deletion-result.component';
import { NewOrderDeletionComponent } from './external-reviewers-deletion-request/new-order-deletion/new-order-deletion.component';
import { ExternalReviewersDeletionTableComponent } from './external-reviewers-deletion-request/external-reviewers-deletion-table/external-reviewers-deletion-table.component';
import { ExternalReviewersDeletionRegistrationTableComponent } from './external-reviewers-deletion-request/external-reviewers-deletion-registration-table/external-reviewers-deletion-registration-table.component';
import { DeletionDetailsModelComponent } from './external-reviewers-deletion-request/new-order-deletion/deletion-details-model/deletion-details-model.component';
import { DeletionRequestActionsComponent } from './external-reviewers-deletion-request/deletion-request-actions/deletion-request-actions.component';
import { DeletionRequestComponent } from './external-reviewers-deletion-request/deletion-request/deletion-request.component';


@NgModule({
    declarations: [
        ExternalReviewerRegistrationSettingsComponent,
        ExternalReviewerAcceptanceCriteriaManagementComponent,
        ExternalReviewerAcceptanceItemCriteriaDetailsComponent,
        ExternalReviewerAcceptanceItemCriteriaListComponent,
        ExternalReviewerAcceptanceMainCriteriaDetailsComponent,
        ExternalReviewerAcceptanceSubCriteriaDetailsComponent,
        ExternalReviewerRegistrationRequestCreationComponent,
        ExperienceInformationComponent,
        PersonalInfoComponent,
        PledgeComponent,
        QualaficationsAndSkillsComponent,
        ExperienceInformationStepComponent,
        PersonalInfoStepComponent,
        PledgeStepComponent,
        QualaficationsAndSkillsStepComponent,
        ExternalReviewerAcceptanceSubCriteriaListComponent,
        ExternalReviewerRegistrationRequestDetailsComponent,
        AcceptanceCriteriaAuditModalComponent,
        ExperienceInformationCheqaComponent,
        ExperienceInformationCseqaComponent,
        ExperienceInformationOqfComponent,
        ExternalReviewerRegistrationRequestActionsComponent,
        PersonalInfoTabComponent,
        QualaficationsAndSkillsTabComponent,
        ExperienceInformationTabComponent,
        PledgeTabComponent,
        ExternalReviewersInterviewResultComponent,
        ExternalReviewersInterviewResultInfoComponent,
        InitialCriteriaTabComponent,
        InitialCriteriaComponent,
        ExternalReviewerRegistrationRequestsComponent,
        ExternalReviewersManagementComponent,
        ExternalReviewerDetailsComponent,
        ExternalReviewerFileManagementComponent,
        AvailabilitySettingsTabComponent,
        ExternalReviewerCandidatesComponent,
        ExternalReviewerCandidatesDetailsComponent,
        TrainingResultsComponent,
        NewOrderTrainingResultsComponent,
        TrainingDetailsModalComponent,
        ExternalReviewersWithdrawalRequestCreationComponent,
        ExternalReviewersWithdrawalRequestActionsComponent,
        ExternalReviewersWithdrawalRequestDetailsComponent,
        ExternalReviewersWithdrawalRequestsListComponent,
        TrainingResultsRequestComponent,
        TrainingResultsRequestActionsComponent,
        ExternalReviewersRegistrationTableComponent,
        ExternalReviewersTrainingResultTableComponent,
        DeletionResultComponent,
        NewOrderDeletionComponent,
        ExternalReviewersDeletionTableComponent,
        ExternalReviewersDeletionRegistrationTableComponent,
        DeletionDetailsModelComponent,
        DeletionRequestActionsComponent,
        DeletionRequestComponent
    ],
    imports: [
        CommonModule,
        ExternalReviewersRoutingModule,
        FormsModule,
        CKEditorModule,
        SharedModule,
        NgbToastModule,
        NgbPaginationModule,
        HasPermissionDirective,
        NgbNavModule
    ],
    exports: [
        ExternalReviewerFileManagementComponent,
        PersonalInfoComponent
    ]
})
export class ExternalReviewersModule { }
