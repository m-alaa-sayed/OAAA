import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { hasPermissionGuard } from "../../core/guards/has-permission.guard";
import { Permission } from "../../core/enum/permission";
import {
  ExternalReviewerRegistrationSettingsComponent
} from "./external-reviewer-registration-settings/external-reviewer-registration-settings.component";
import {
  ExternalReviewerRegistrationRequestCreationComponent
} from "./external-reviewer-registration-service/external-reviewer-registration-request-creation/external-reviewer-registration-request-creation.component";
import {
  ExternalReviewerAcceptanceCriteriaManagementComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-criteria-management.component";
import {
  ExternalReviewerAcceptanceSubCriteriaListComponent
} from "./external-reviewer-acceptance-criteria-management/external-reviewer-acceptance-sub-criteria-list/external-reviewer-acceptance-sub-criteria-list.component";
import {
  ExternalReviewerRegistrationRequestDetailsComponent
} from './external-reviewer-registration-service/external-reviewer-registration-request-details/external-reviewer-registration-request-details.component';
import {
  ExternalReviewersInterviewResultComponent
} from "./external-reviewers-interview-result/external-reviewers-interview-result.component";
import { ExternalReviewerRegistrationRequestsComponent } from './external-reviewer-registration-requests/external-reviewer-registration-requests.component';
import { ExternalReviewersManagementComponent } from './external-reviewers-management/external-reviewers-management.component';
import { ExternalReviewerDetailsComponent } from './external-reviewers-management/external-reviewer-details/external-reviewer-details.component';
import { ExternalReviewerCandidatesComponent } from './external-reviewers-candidates/external-reviewers-candidates.component';
import { ExternalReviewerCandidatesDetailsComponent } from './external-reviewers-candidates-details/external-reviewers-candidates-details.component';
import { NewOrderTrainingResultsComponent } from './external-reviewers-training-results-request/new-order-training-results/new-order-training-results.component';
import { TrainingResultsComponent } from './external-reviewers-training-results-request/training-results/training-results.component';
import { ExternalReviewersWithdrawalRequestCreationComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-request-creation/external-reviewers-withdrawal-request-creation.component';
import { ExternalReviewersWithdrawalRequestDetailsComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-request-details/external-reviewers-withdrawal-request-details.component';
import { ExternalReviewersWithdrawalRequestsListComponent } from './external-reviewer-withdrawal-service/external-reviewers-withdrawal-requests-list/external-reviewers-withdrawal-requests-list.component';
import { TrainingResultsRequestComponent } from './external-reviewers-training-results-request/training-results-request/training-results-request.component';
import { DeletionResultComponent } from './external-reviewers-deletion-request/deletion-result/deletion-result.component';
import { NewOrderDeletionComponent } from './external-reviewers-deletion-request/new-order-deletion/new-order-deletion.component';
import { DeletionRequestComponent } from './external-reviewers-deletion-request/deletion-request/deletion-request.component';

const routes: Routes = [
  {
    path: "external-reviewer-register-settings/:module",
    component: ExternalReviewerRegistrationSettingsComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [Permission.CSEQA_ER_registration_settings_MANAGE,
      Permission.CHEQA_ER_registration_settings_VIEW_ALL,
      Permission.OQF_ER_registration_settings_VIEW_ALL
      ]
    },
  },
  {
    path: "external-reviewer-register-settings/:module/view/:version",
    component: ExternalReviewerRegistrationSettingsComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [Permission.CSEQA_ER_registration_settings_MANAGE,
      Permission.CHEQA_ER_registration_settings_VIEW_ALL,
      Permission.OQF_ER_registration_settings_VIEW_ALL  
      ]
    },
  },
  {
    path: 'external-reviewer-acceptance-criteria-management/:module',
    component: ExternalReviewerAcceptanceCriteriaManagementComponent
  }, 
  {
    path: 'external-reviewers-acceptance-sub-criteria-list/:module/:criterionId',
    component: ExternalReviewerAcceptanceSubCriteriaListComponent
  },
  {
    path: 'external-reviewers-acceptance-sub-criteria-list/:module/:criterionId/:versionId',
    component: ExternalReviewerAcceptanceSubCriteriaListComponent
  },
  {
    path: 'external-reviewer-registration-service',
    children: [
      {
        path: 'creation/:module',
        component: ExternalReviewerRegistrationRequestCreationComponent
      },
      {
        path: 'request-details/:id',
        component: ExternalReviewerRegistrationRequestDetailsComponent
      },
      {
        path: 'request-details/:id/:taskId',
        component: ExternalReviewerRegistrationRequestDetailsComponent
      }
    ]
  },
  {
    path: 'external-reviewers-interview-result-list',
    component: ExternalReviewersInterviewResultComponent
  },
  {
    path: 'external-reviewer-registration-requests/:module',
    component: ExternalReviewerRegistrationRequestsComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [
        Permission.CSEQA_ER_Request_VIEW_ALL,
        Permission.CHEQA_ER_Request_VIEW_ALL,
        Permission.OQF_ER_Request_VIEW_ALL
      ]
    }
  },
  {
    path: 'external-reviewers-management/:module',
    component: ExternalReviewersManagementComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [
        Permission.CSEQA_ER_VIEW,
        Permission.CHEQA_ER_VIEW,
        Permission.OQF_ER_VIEW
      ]
    }
  },
  {
    path: 'external-reviewer-details/:id',
    component: ExternalReviewerDetailsComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [
        Permission.CSEQA_ER_VIEW,
        Permission.CHEQA_ER_VIEW,
        Permission.OQF_ER_VIEW
      ]
    }
  },
  {
    path: 'external-reviewers-candidates/:module',
    component: ExternalReviewerCandidatesComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_ALL,
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL,
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_ALL
      ]
    }
  },
  {
    path: 'external-reviewers-candidates-details/:id',
    component: ExternalReviewerCandidatesDetailsComponent,
    canActivate: [hasPermissionGuard],
    data: {
      permissions: [
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_DETAILS,
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_DETAILS,
        Permission.EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_DETAILS
      ]
    }
  },




  {
    path: 'external-reviewers-training-results',
    children: [
      {
        path: 'creation/:module',
        component: TrainingResultsComponent
      },
      {
        path: 'new-order-training-results/:module',
        component: NewOrderTrainingResultsComponent
      },
      {
        path: 'request-details/:id',
        component: TrainingResultsRequestComponent
      },
      {
        path: 'request-details/:id/:taskId',
        component: TrainingResultsRequestComponent
      }
    ]
  },

   {
    path: 'external-reviewers-deletion',
    children: [
      {
        path: 'creation/:module',
        component: DeletionResultComponent
      },
      {
        path: 'new-order-deletion/:module',
        component: NewOrderDeletionComponent
      },
      {
        path: 'request-details/:id',
        component: DeletionRequestComponent
      },
      {
        path: 'request-details/:id/:taskId',
        component: DeletionRequestComponent
      }
    ]
  },

  {
    path: 'external-reviewer-withdraw-service',
    children: [
      {
        path: 'creation/:module',
        component: ExternalReviewersWithdrawalRequestCreationComponent,
        data: {
          permissions: [
            Permission.CSEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST,
            Permission.CHEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST,
            Permission.OQF_External_reviewers_Withdraw_Request_CREATE_REQUEST
          ]
        }
      },
      {
        path: 'request-details/:id',
        component: ExternalReviewersWithdrawalRequestDetailsComponent,
        data: {
          permissions: [
            Permission.CSEQA_ER_Withdraw_Request_VIEW_DETAIL,
            Permission.CHEQA_ER_Withdraw_Request_VIEW_DETAIL,
            Permission.OQF_ER_Withdraw_Request_VIEW_DETAIL
          ]
        }
      },
      {
        path: 'request-details/:id/:taskId',
        component: ExternalReviewersWithdrawalRequestDetailsComponent,
        data: {
          permissions: [
            Permission.CSEQA_ER_Withdraw_Request_VIEW,
            Permission.CHEQA_ER_Withdraw_Request_VIEW,
            Permission.OQF_ER_Withdraw_Request_VIEW
          ]
        }
      },
      {
        path: 'requests/:module',
        component: ExternalReviewersWithdrawalRequestsListComponent,
        data: {
          permissions: [
            Permission.CSEQA_ER_Withdraw_Request_VIEW,
            Permission.CHEQA_ER_Withdraw_Request_VIEW,
            Permission.OQF_ER_Withdraw_Request_VIEW
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalReviewersRoutingModule {
}
