import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchoolPerformanceLayoutComponent} from './school-performance-layout/school-performance-layout.component';
import {GeneralDataComponent} from './tabs/general-data/general-data.component';
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
import {AchievementDistributionComponent} from './tabs/achievement-distribution/achievement-distribution.component';
import {CohortTrackingComponent} from './tabs/cohort-tracking/cohort-tracking.component';

// Import existing components
import {
    SelfEvaluationDocumentListComponent
} from './self-evaluation-document/self-evaluation-document-list/self-evaluation-document-list.component';
import {
    SelfEvaluationDocumentCreationComponent
} from './self-evaluation-document/self-evaluation-document-creation/self-evaluation-document-creation.component';
import {VisitFormListComponent} from './visit-form/visit-form-list/visit-form-list.component';
import {VisitFormManagementComponent} from './visit-form/visit-form-management/visit-form-management.component';
import {TeamLeaderPlanListComponent} from './team-leader-plan/team-leader-plan-list/team-leader-plan-list.component';
import {
    TeamLeaderPlanCreationComponent
} from './team-leader-plan/team-leader-plan-creation/team-leader-plan-creation.component';
import {
    TeamLeaderPlanSchoolSelectionComponent
} from './team-leader-plan/team-leader-plan-school-selection/team-leader-plan-school-selection.component';
import {VisitFormCreationComponent} from './visit-form/visit-form-creation/visit-form-creation.component';
import {
    VisitFormRequestDetailsComponent
} from './visit-form/visit-form-request-details/visit-form-request-details.component';
import {
    ExternalReviewVisitReportsListComponent
} from './external-review-visit-reports/external-review-visit-reports-list/external-review-visit-reports-list.component';
import {
    ExternalReviewVisitReportsCreationComponent
} from './external-review-visit-reports/external-review-visit-reports-creation/external-review-visit-reports-creation.component';
import {DomainSummaryListComponent} from './domain-summary/domain-summary-list/domain-summary-list.component';
import {
    DomainSummaryManagementComponent
} from './domain-summary/domain-summary-management/domain-summary-management.component';
import {
    DomainSummaryCreationComponent
} from './domain-summary/domain-summary-creation/domain-summary-creation.component';
import {
    DomainSummaryRequestDetailsComponent
} from './domain-summary/domain-summary-request-details/domain-summary-request-details.component';
import {
    QualityAssuranceFollowUpFormListComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-list/quality-assurance-follow-up-form-list.component';
import {
    QualityAssuranceFollowUpFormSelectComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-select/quality-assurance-follow-up-form-select.component';
import {
    QualityAssuranceFollowUpFormCreationComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-creation/quality-assurance-follow-up-form-creation.component';
import {
    QualityAssuranceFollowUpFormDetailsComponent
} from './quality-assurance-follow-up-form/quality-assurance-follow-up-form-details/quality-assurance-follow-up-form-details.component';
import {
    TeamLeaderPlanDetailsComponent
} from './team-leader-plan/team-leader-plan-details/team-leader-plan-details.component';
import {
    ExternalReviewVisitNewReportsListComponent
} from './external-review-visit-reports/external-review-visit-new-reports-list/external-review-visit-new-reports-list.component';
import {
    SchoolDocumentDeliveryVisitListComponent
} from "./school-document-delivery/school-document-delivery-visit-list/school-document-delivery-visit-list.component";
import {
    SchoolDocumentDeliveryVisitDetailComponent
} from "./school-document-delivery/school-document-delivery-visit-detail/school-document-delivery-visit-detail.component";
import {
    SchoolDocumentDeliveryRequestDetailsComponent
} from "./school-document-delivery/school-document-delivery-request-details/school-document-delivery-request-details.component";
import {
    ExternalReviewVisitReportsDetailsComponent
} from './external-review-visit-reports/external-review-visit-reports-details/external-review-visit-reports-details.component';
import {
    VisitReportSummaryListComponent
} from './visit-report-summary/visit-report-summary-list/visit-report-summary-list.component';
import {
    VisitReportSummaryDetailsComponent
} from './visit-report-summary/visit-report-summary-details/visit-report-summary-details.component';
import {
    VisitReportSummaryCreationComponent
} from './visit-report-summary/visit-report-summary-creation/visit-report-summary-creation.component';
import {ReportComponent} from "../../shared/report/report.component";
import {hasPermissionGuard} from "../../core/guards/has-permission.guard";
import {Permission} from "../../core/enum/permission";
import { SchoolConflictsComponent } from './school-conflicts/school-conflicts.component';

const routes: Routes = [
    // Self-evaluation document routes
    {
        path: 'self-evaluation-document',
        children: [
            {
                path: 'list',
                component: SelfEvaluationDocumentListComponent
            },
            {
                path: 'creation/:id',
                component: SelfEvaluationDocumentCreationComponent
            }
        ]
    },
    {
        path: 'team-leader-plan',
        children: [
            {
                path: 'list',
                component: TeamLeaderPlanListComponent
            },
            {
                path: 'school-selection',
                component: TeamLeaderPlanSchoolSelectionComponent
            },
            {
                path: 'creation/:id',
                component: TeamLeaderPlanCreationComponent
            },
            {
                path: 'creation',
                component: TeamLeaderPlanCreationComponent
            },
            {
                path: 'request-details/:id',
                component: TeamLeaderPlanDetailsComponent
            },
            {
                path: 'request-details/:id/:taskId',
                component: TeamLeaderPlanDetailsComponent
            },
            {
                path: 'report/list',
                component: TeamLeaderPlanListComponent
            },
        ]
    },
    {
        path: 'visit-form',
        children: [
            {
                path: ':type/list',
                component: VisitFormListComponent
            },
            {
                path: ':type/management/:id',
                component: VisitFormManagementComponent
            },
            {
                path: ':type/creation/:id/:status',
                component: VisitFormCreationComponent
            },
            {
                path: 'details/:id/:taskId',
                component: VisitFormRequestDetailsComponent
            },
            {
                path: 'details/:id',
                component: VisitFormRequestDetailsComponent
            },
            {
                path: ':type/report/list',
                component: VisitFormListComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.CLASSROOM_OBSERVATION_VIEW_REPORT, Permission.GENERAL_EVIDENCE_VIEW_REPORT]
                }
            },
            {
                path: ':type/report/management/:id',
                component: VisitFormManagementComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.CLASSROOM_OBSERVATION_VIEW_REPORT, Permission.GENERAL_EVIDENCE_VIEW_REPORT]
                }
            }
        ]
    },
    // School performance layout with tabs
    {
        path: 'performance-dashboard/:schoolId',
        component: SchoolPerformanceLayoutComponent,
        children: [
            {path: '', redirectTo: 'general-data', pathMatch: 'full'},
            {path: 'general-data', component: GeneralDataComponent},
            {path: 'student-data', component: StudentDataComponent},
            {path: 'teaching-staff', component: TeachingStaffComponent},
            {path: 'staff-data', component: StaffDataComponent},
            {path: 'about-school', component: AboutSchoolComponent},
            {path: 'facilities', component: FacilitiesComponent},
            {path: 'educational-programs', component: EducationalProgramsComponent},
            {path: 'school-activities', component: SchoolActivitiesComponent},
            {path: 'special-needs', component: SpecialNeedsComponent},
            {path: 'gifted-students', component: GiftedStudentsComponent},
            {path: 'national-tests', component: NationalTestsComponent},
            {path: 'academic-achievement', component: AcademicAchievementComponent},
            {path: 'mastery-rates', component: MasteryRatesComponent},
            {path: 'achievement-distribution', component: AchievementDistributionComponent},
            {path: 'cohort-tracking', component: CohortTrackingComponent},
        ]
    },
    // external review visit reports
    {
        path: 'external-review-visit-reports',
        children: [
            {
                path: 'list',
                component: ExternalReviewVisitReportsListComponent
            },
            {
                path: 'new-report',
                component: ExternalReviewVisitNewReportsListComponent
            },
            {
                path: 'creation/:id',
                component: ExternalReviewVisitReportsCreationComponent
            },
            {
                path: 'creation',
                component: ExternalReviewVisitReportsCreationComponent
            },
            {
                path: 'request-details/:id',
                component: ExternalReviewVisitReportsDetailsComponent
            },
            {
                path: 'request-details/:id/:taskId',
                component: ExternalReviewVisitReportsDetailsComponent
            }
        ]
    },
    //-- visit report summary
    // external review visit reports
    {
        path: 'visit-report-summary',
        children: [
            {
                path: 'list',
                component: VisitReportSummaryListComponent
            },

            {
                path: 'creation/:id',
                component: VisitReportSummaryCreationComponent
            },

            {
                path: 'request-details/:id/:taskId',
                component: VisitReportSummaryDetailsComponent
            }
        ]
    },
    // Default redirect
    {path: '', redirectTo: 'self-evaluation-document/list', pathMatch: 'full'},
    {
        path: 'domain-summary',
        children: [
            {
                path: 'list',
                component: DomainSummaryListComponent
            },
            {
                path: 'management/:scheduledSchoolVisitId',
                component: DomainSummaryManagementComponent
            },
            {
                path: 'creation/:domain/:infoId/:scheduledSchoolVisitId',
                component: DomainSummaryCreationComponent
            },
            {
                path: 'creation/:domain/:scheduledSchoolVisitId',
                component: DomainSummaryCreationComponent
            },
            {
                path: 'details/:requestId/:taskId',
                component: DomainSummaryRequestDetailsComponent
            },
            {
                path: 'details/:requestId',
                component: DomainSummaryRequestDetailsComponent
            },
            {
                path: 'report/list',
                component: DomainSummaryListComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.DOMAIN_SUMMARY_VIEW_REPORT, Permission.CSEQA_OBSERVATION_MONITORING_FORM_VIEW_REPORT]
                }
            },
            {
                path: 'report/management/:scheduledSchoolVisitId',
                component: DomainSummaryManagementComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.DOMAIN_SUMMARY_VIEW_REPORT]
                }
            },
        ]
    },
    {
        path: 'quality-assurance-form',
        children: [
            {
                path: 'list',
                component: QualityAssuranceFollowUpFormListComponent
            },
            {
                path: 'select',
                component: QualityAssuranceFollowUpFormSelectComponent
            },
            {
                path: 'creation/:scheduledSchoolVisitId',
                component: QualityAssuranceFollowUpFormCreationComponent
            },
            {
                path: 'creation/:scheduledSchoolVisitId/:id',
                component: QualityAssuranceFollowUpFormCreationComponent
            },
            {
                path: 'details/:scheduledSchoolVisitId/:id',
                component: QualityAssuranceFollowUpFormDetailsComponent
            },
            {
                path: 'report/list',
                component: QualityAssuranceFollowUpFormListComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.QA_FOLLOW_UP_FORM_SUBMISSION_VIEW_REPORT]
                }
            },
        ]
    },
    {
        path: 'school-document-delivery',
        children: [
            {
                path: 'visits',
                component: SchoolDocumentDeliveryVisitListComponent
            },
            {
                path: 'report/list',
                component: SchoolDocumentDeliveryVisitListComponent,
                canActivate: [hasPermissionGuard],
                data: {
                    permissions: [Permission.SCHOOL_DOCUMENT_DELIVERY_VIEW_REPORT]
                }
            },
            {
                path: 'detail/:scheduledSchoolVisitId',
                component: SchoolDocumentDeliveryVisitDetailComponent
            },
            {
                path: 'details/:requestId/:taskId',
                component: SchoolDocumentDeliveryRequestDetailsComponent
            },
            {
                path: 'details/:requestId',
                component: SchoolDocumentDeliveryRequestDetailsComponent
            }
        ]
    },
    {
        path: 'school-conflicts',
        component: SchoolConflictsComponent,
    },
    {
        path: 'reports/:module',
        component: ReportComponent,
        /*
        component: ExternalReviewersManagementComponent,
        canActivate: [hasPermissionGuard],
        data: {
            permissions: [
                Permission.CSEQA_ER_VIEW,
                Permission.CHEQA_ER_VIEW,
                Permission.OQF_ER_VIEW
            ]
        }*/
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchoolPerformanceRoutingModule {
}
