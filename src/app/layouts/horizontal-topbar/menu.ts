import {MenuItem} from './menu.model';
import {Permission} from "../../core/enum/permission";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.HOME',
        icon: 'home',
        link: '/jawda/dashboard',
        roles: [],
        permissions: [],
        subItems: []
    },
    {
        id: 2,
        label: 'MENUITEMS.MENU.SERVICE_CATALOGUE',
        icon: 'grid',
        link: '/jawda/service-management/service-catalogue-list',
        roles: [],
        permissions: [],
        subItems: []
    },
    {
        id: 3,
        label: 'MENUITEMS.MENU.SEVICE_MANAGEMENT',
        icon: 'tool',
        procedures: ['SERVICE_MANAGEMENT', 'CATEGORY_MANAGEMENT'],
        roles: ['USER_MANAGEMENT_ADMIN', 'PORTAL_ADMIN'],
        permissions: [Permission.VIEW_SERVICE],
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.MENU.CATEGORY_MANAGEMENT',
                link: '/jawda/service-management/service-category-management-list',
                parentId: 3,
                procedures: ['CATEGORY_MANAGEMENT'],
                roles: [],
                permissions: []
            },
            {
                id: 32,
                label: 'MENUITEMS.MENU.SEVICE_MANAGEMENT',
                link: '/jawda/service-management/service-management-list',
                parentId: 3,
                procedures: ['SERVICE_MANAGEMENT'],
                roles: [],
                permissions: [Permission.VIEW_SERVICE]
            },
            {
                id: 33,
                label: 'MENUITEMS.MENU.USERS_AND_PERMISSIONS_MANAGEMENT',
                link: '/jawda/users-permissions-management',
                parentId: 3,
                roles: ['USER_MANAGEMENT_ADMIN'],
                procedures: ['USERS_AND_PERMISSIONS_MANAGEMENT'],
                permissions: [
                    // Permission.ADMIN_ADD_USER,
                    // Permission.ADMIN_DELETE_USER,
                    // Permission.ADMIN_CHANGE_PASSWORD_FOR_USER,
                    // Permission.ADMIN_GET_ALL_GROUPS,
                    // Permission.ADMIN_GET_ALL_ROLES,
                    // Permission.ADMIN_GET_ALL_PROCEDURES,
                    // Permission.ADMIN_GET_ALL_USERS,
                    // Permission.ADMIN_VIEW_ROLES,
                    // Permission.ADMIN_VIEW_CHANGE_PASSWORD_FOR_USER,
                    // Permission.ADMIN_VIEW_USERS,
                    // Permission.ADMIN_UPDATE_USER,
                    // Permission.ADMIN_ADD_ROLE,
                    // Permission.ADMIN_DELETE_ROLE,
                    // Permission.ADMIN_UPDATE_ROLE
                ]
            },
            {
                id: 34,
                label: 'MENUITEMS.MENU.USER_MANAGEMENT_ADMIN',
                parentId: 3,
                subItems: [
                    {
                        id: 341,
                        label: 'MENUITEMS.MENU.GROUPS',
                        link: '/jawda/user-management-admin',
                        parentId: 34,
                        roles: [],
                        permissions: []
                    },
                    {
                        id: 342,
                        label: 'MENUITEMS.MENU.PERMISSIONS',
                        link: '/jawda/user-management-admin/permissions',
                        parentId: 34,
                        roles: [],
                        permissions: []
                    },
                ],
                roles: ['PORTAL_ADMIN'],
                permissions: []
            }
        ]
    },
    {
        id: 5,
        label: 'MENUITEMS.MENU.CHEQA',
        icon: 'award',
        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CHEQA', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CHEQA', 'EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CHEQA, EXTERNAL_REVIEWERS_CANDIDATES_CHEQA', 'CHEQA_EXTERNAL_REVIEWERS', 'CHEQA_APPROVAL_OF_TRAINING_RESULTS', 'CHEQA_WITHDRAWAL_REQUESTS', 'CHEQA_DELETION_REQUESTS'],
        roles: [],
        permissions: [Permission.CHEQA_ER_Acceptance_CRITERIA_MANAGE,
            Permission.CHEQA_ER_registration_settings_MANAGE,
            Permission.CHEQA_ER_Registration_Request_VIEW_ALL,
            Permission.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL,
            Permission.CHEQA_ER_Request_VIEW_ALL, Permission.CHEQA_ER_VIEW,
            Permission.CHEQA_ER_Training_results_Registration_Request_VIEW_ALL,
            Permission.CHEQA_ER_Training_results_Registration_Request_COMPLETE_TASK,
            Permission.CHEQA_ER_Training_results_Registration_Request_CREATE_REQUEST,
            Permission.CHEQA_ER_Withdraw_Request_VIEW
        ],
        subItems: [
            {
                id: 51,
                label: 'MENUITEMS.MENU.SETTINGS',
                parentId: 5,
                procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CHEQA', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CHEQA'],
                roles: [],
                permissions: [Permission.CHEQA_ER_Acceptance_CRITERIA_MANAGE, Permission.CHEQA_ER_registration_settings_MANAGE],
                subItems: [
                    {
                        id: 511,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWER_REGISTER_SETTINGS_CHEQA',
                        link: '/jawda/external-reviewers/external-reviewer-register-settings/CHEQA',
                        parentId: 51,
                        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CHEQA'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_registration_settings_MANAGE]
                    },
                    {
                        id: 512,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CHEQA',
                        link: '/jawda/external-reviewers/external-reviewer-acceptance-criteria-management/CHEQA',
                        parentId: 51,
                        procedures: ['EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CHEQA'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_Acceptance_CRITERIA_MANAGE]
                    }
                ]
            },
            {
                id: 52,
                parentId: 5,
                label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_MANAGEMENT',
                procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CHEQA, EXTERNAL_REVIEWERS_CANDIDATES_CHEQA', 'CHEQA_EXTERNAL_REVIEWERS', 'CHEQA_APPROVAL_OF_TRAINING_RESULTS', 'CHEQA_WITHDRAWAL_REQUESTS', 'CHEQA_DELETION_REQUESTS'],
                roles: [],
                permissions: [Permission.CHEQA_ER_Request_VIEW_ALL,
                    Permission.CHEQA_ER_Registration_Request_VIEW_ALL,
                    Permission.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL,
                    Permission.CHEQA_ER_VIEW,
                    Permission.CHEQA_ER_Training_results_Registration_Request_VIEW_ALL,
                    Permission.CHEQA_ER_Training_results_Registration_Request_COMPLETE_TASK,
                    Permission.CHEQA_ER_Training_results_Registration_Request_CREATE_REQUEST,
                    Permission.CHEQA_ER_Withdraw_Request_VIEW
                ],
                subItems: [
                    {
                        id: 521,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CHEQA',
                        link: '/jawda/external-reviewers/external-reviewer-registration-requests/CHEQA',
                        procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CHEQA'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_Registration_Request_VIEW_ALL]
                    },
                    {
                        id: 522,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA',
                        link: '/jawda/external-reviewers/external-reviewers-candidates/CHEQA',
                        procedures: ['EXTERNAL_REVIEWERS_CANDIDATES_CHEQA'],
                        roles: [],
                        permissions: [Permission.EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL]
                    },
                    {
                        id: 523,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS',
                        link: '/jawda/external-reviewers/external-reviewers-management/CHEQA',
                        procedures: ['CHEQA_EXTERNAL_REVIEWERS'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_VIEW]
                    },

                    {
                        id: 524,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.APPROVAL_OF_TRAINING_RESULTS',
                        link: '/jawda/external-reviewers/external-reviewers-training-results/creation/CHEQA',
                        procedures: ['CHEQA_APPROVAL_OF_TRAINING_RESULTS'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_Training_results_Registration_Request_VIEW_ALL
                        ]
                    },
                    {
                        id: 525,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.WITHDRAWAL_REQUESTS',
                        link: '/jawda/external-reviewers/external-reviewer-withdraw-service/requests/CHEQA',
                        procedures: ['CHEQA_WITHDRAWAL_REQUESTS'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_Withdraw_Request_VIEW]
                    },
                    {
                        id: 526,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.DELETION_REQUESTS',
                        link: '/jawda/external-reviewers/external-reviewers-deletion/creation/CHEQA',
                        procedures: ['CHEQA_DELETION_REQUESTS'],
                        roles: [],
                        permissions: [Permission.CHEQA_ER_Deletion_Request_VIEW_ALL]
                    }
                ]
            }
        ]
    },

    {
        id: 4,
        label: 'MENUITEMS.MENU.CSEQA_TITLE',
        icon: 'book-open',
        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CSEQA', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CSEQA', 'EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CSEQA', 'EXTERNAL_REVIEWERS_CANDIDATES_CSEQA', 'EXTERNAL_REVIEWERS_INTERVIEW_RESULT', 'CSEQA_EXTERNAL_REVIEWERS', 'CSEQA_APPROVAL_OF_TRAINING_RESULTS', 'CSEQA_WITHDRAWAL_REQUESTS', 'CSEQA_DELETION_REQUESTS'],
        roles: [],
        permissions: [Permission.CSEQA_ER_Acceptance_CRITERIA_MANAGE,
            Permission.CSEQA_ER_Request_VIEW_ALL, Permission.CSEQA_ER_VIEW,
            Permission.CSEQA_ER_Registration_Request_VIEW_ALL,
            Permission.CSEQA_ER_Training_results_Registration_Request_VIEW_ALL,
            Permission.CSEQA_ER_Interview_results_Registration_VIEW,
            Permission.CSEQA_ER_Withdraw_Request_VIEW
        ],
        subItems: [
            {
                id: 41,
                label: 'MENUITEMS.MENU.SETTINGS',
                parentId: 4,
                procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CSEQA', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CSEQA'],
                roles: [],
                permissions: [Permission.CSEQA_ER_Acceptance_CRITERIA_MANAGE],
                subItems: [
                    {
                        id: 411,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWER_REGISTER_SETTINGS_CSEQA',
                        link: '/jawda/external-reviewers/external-reviewer-register-settings/CSEQA',
                        parentId: 41,
                        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_CSEQA'],
                        roles: [],
                        permissions: []
                    },
                    {
                        id: 412,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CSEQA',
                        link: '/jawda/external-reviewers/external-reviewer-acceptance-criteria-management/CSEQA',
                        parentId: 41,
                        procedures: ['EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_CSEQA'],
                        roles: [],
                        permissions: []
                    }
                ]
            },
            {
                id: 42,
                parentId: 4,
                label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_MANAGEMENT',
                procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CSEQA', 'EXTERNAL_REVIEWERS_CANDIDATES_CSEQA', 'EXTERNAL_REVIEWERS_INTERVIEW_RESULT', 'CSEQA_EXTERNAL_REVIEWERS', 'CSEQA_APPROVAL_OF_TRAINING_RESULTS', 'CSEQA_WITHDRAWAL_REQUESTS', 'CSEQA_DELETION_REQUESTS'],
                roles: [],
                permissions: [Permission.CSEQA_ER_Request_VIEW_ALL, Permission.CSEQA_ER_VIEW],
                subItems: [
                    {
                        id: 421,
                        parentId: 42,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CSEQA',
                        link: '/jawda/external-reviewers/external-reviewer-registration-requests/CSEQA',
                        procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_CSEQA'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_Registration_Request_VIEW_ALL]
                    },
                    {
                        id: 422,
                        parentId: 42,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_CANDIDATES_CSEQA',
                        link: '/jawda/external-reviewers/external-reviewers-candidates/CSEQA',
                        procedures: ['EXTERNAL_REVIEWERS_CANDIDATES_CSEQA'],
                        roles: [],
                        permissions: [Permission.EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_ALL]
                    },
                    {
                        id: 423,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_INTERVIEW_RESULT',
                        link: '/jawda/external-reviewers/external-reviewers-interview-result-list',
                        parentId: 42,
                        procedures: ['EXTERNAL_REVIEWERS_INTERVIEW_RESULT'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_Interview_results_Registration_VIEW]
                    },
                    {
                        id: 424,
                        parentId: 42,
                        label: 'MENUITEMS.MENU.APPROVAL_OF_TRAINING_RESULTS',
                        link: '/jawda/external-reviewers/external-reviewers-training-results/creation/CSEQA',
                        procedures: ['CSEQA_APPROVAL_OF_TRAINING_RESULTS'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_Training_results_Registration_Request_VIEW]
                    },
                    {
                        id: 425,
                        parentId: 42,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS',
                        link: '/jawda/external-reviewers/external-reviewers-management/CSEQA',
                        procedures: ['CSEQA_EXTERNAL_REVIEWERS'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_VIEW]
                    },
                    {
                        id: 426,
                        parentId: 42,
                        label: 'MENUITEMS.MENU.WITHDRAWAL_REQUESTS',
                        link: '/jawda/external-reviewers/external-reviewer-withdraw-service/requests/CSEQA',
                        procedures: ['CSEQA_WITHDRAWAL_REQUESTS'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_Withdraw_Request_VIEW]
                    },
                    {
                        id: 427,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.DELETION_REQUESTS',
                        link: '/jawda/external-reviewers-deletion/creation/CSEQA',
                        procedures: ['CSEQA_DELETION_REQUESTS'],
                        roles: [],
                        permissions: [Permission.CSEQA_ER_Deletion_Request_VIEW_ALL]
                    }
                ]
            }
        ]
    },

    {
        id: 6,
        label: 'MENUITEMS.MENU.OQF',
        icon: 'check-circle',
        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_OQF', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_OQF', 'EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_OQF', 'EXTERNAL_REVIEWERS_CANDIDATES_OQF', 'OQF_EXTERNAL_REVIEWERS', 'OQF_APPROVAL_OF_TRAINING_RESULTS', 'OQF_WITHDRAWAL_REQUESTS', 'OQF_DELETION_REQUESTS'],
        roles: [],
        permissions: [Permission.OQF_ER_Acceptance_CRITERIA_MANAGE,
            Permission.OQF_ER_registration_settings_MANAGE,
            Permission.OQF_ER_Request_VIEW_ALL, Permission.OQF_ER_VIEW,
            Permission.OQF_ER_Training_results_Registration_Request_VIEW,
            Permission.OQF_ER_Training_results_Registration_Request_COMPLETE_TASK,
            Permission.OQF_ER_Training_results_Registration_Request_CREATE_REQUEST,
            Permission.OQF_ER_Withdraw_Request_VIEW,
            Permission.OQF_ER_Registration_Request_VIEW
        ],
        subItems: [
            {
                id: 61,
                label: 'MENUITEMS.MENU.SETTINGS',
                parentId: 6,
                procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_OQF', 'EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_OQF'],
                roles: [],
                permissions: [Permission.OQF_ER_Acceptance_CRITERIA_MANAGE, Permission.OQF_ER_registration_settings_MANAGE],
                subItems: [
                    {
                        id: 611,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWER_REGISTER_SETTINGS_OQF',
                        link: '/jawda/external-reviewers/external-reviewer-register-settings/OQF',
                        parentId: 61,
                        procedures: ['EXTERNAL_REVIEWER_REGISTER_SETTINGS_OQF'],
                        roles: [],
                        permissions: [Permission.OQF_ER_registration_settings_MANAGE]
                    },
                    {
                        id: 612,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_OQF',
                        link: '/jawda/external-reviewers/external-reviewer-acceptance-criteria-management/OQF',
                        parentId: 61,
                        procedures: ['EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_OQF'],
                        roles: [],
                        permissions: [Permission.OQF_ER_Acceptance_CRITERIA_MANAGE]
                    }
                ]
            },
            {
                id: 62,
                parentId: 6,
                label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_MANAGEMENT',
                procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_OQF', 'EXTERNAL_REVIEWERS_CANDIDATES_OQF', 'OQF_EXTERNAL_REVIEWERS', 'OQF_APPROVAL_OF_TRAINING_RESULTS', 'OQF_WITHDRAWAL_REQUESTS', 'OQF_DELETION_REQUESTS'],
                roles: [],
                permissions: [Permission.OQF_ER_Request_VIEW_ALL, Permission.OQF_ER_VIEW
                    , Permission.OQF_ER_Registration_Request_VIEW,
                    Permission.OQF_ER_Training_results_Registration_Request_VIEW,
                    Permission.OQF_ER_Training_results_Registration_Request_COMPLETE_TASK,
                    Permission.OQF_ER_Training_results_Registration_Request_CREATE_REQUEST,
                    Permission.OQF_ER_Withdraw_Request_VIEW
                ],
                subItems: [
                    {
                        id: 621,
                        parentId: 62,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_OQF',
                        link: '/jawda/external-reviewers/external-reviewer-registration-requests/OQF',
                        procedures: ['EXTERNAL_REVIEWERS_REGISTRATION_REQUESTS_OQF'],
                        roles: [],
                        permissions: [Permission.OQF_ER_Registration_Request_VIEW]
                    },
                    {
                        id: 622,
                        parentId: 62,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS_CANDIDATES_OQF',
                        link: '/jawda/external-reviewers/external-reviewers-candidates/OQF',
                        procedures: ['EXTERNAL_REVIEWERS_CANDIDATES_OQF'],
                        roles: [],
                        permissions: []
                    },
                    {
                        id: 623,
                        parentId: 62,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEWERS',
                        link: '/jawda/external-reviewers/external-reviewers-management/OQF',
                        procedures: ['OQF_EXTERNAL_REVIEWERS'],
                        roles: [],
                        permissions: [Permission.OQF_ER_VIEW]
                    },
                    {
                        id: 624,
                        parentId: 62,
                        label: 'MENUITEMS.MENU.APPROVAL_OF_TRAINING_RESULTS',
                        link: '/jawda/external-reviewers/external-reviewers-training-results/creation/OQF',
                        procedures: ['OQF_APPROVAL_OF_TRAINING_RESULTS'],
                        roles: [],
                        permissions: [Permission.OQF_ER_Training_results_Registration_Request_VIEW,
                            Permission.OQF_ER_Training_results_Registration_Request_COMPLETE_TASK,
                            Permission.OQF_ER_Training_results_Registration_Request_CREATE_REQUEST
                        ]
                    },
                    {
                        id: 625,
                        parentId: 62,
                        label: 'MENUITEMS.MENU.WITHDRAWAL_REQUESTS',
                        link: '/jawda/external-reviewers/external-reviewer-withdraw-service/requests/OQF',
                        procedures: ['OQF_WITHDRAWAL_REQUESTS'],
                        roles: [],
                        permissions: [Permission.OQF_ER_Withdraw_Request_VIEW]
                    },
                    {
                        id: 626,
                        parentId: 52,
                        label: 'MENUITEMS.MENU.DELETION_REQUESTS',
                        link: '/jawda/external-reviewers/external-reviewers-deletion/creation/OQF',
                        procedures: ['OQF_DELETION_REQUESTS'],
                        roles: [],
                        permissions: [Permission.OQF_ER_Deletion_Request_VIEW_ALL]
                    }
                ]
            }

        ]
    },

    {
        id: 7,
        label: 'MENUITEMS.MENU.SCHOOL_PERFORMANCE',
        icon: 'check-circle',
        procedures: ['SCHOOL_PERFORMANCE_SETTINGS', 'TEAM_LEADER_PLAN_MANAGEMENT', 'SELF_EVALUATION_DOCUMENT', 'CLASSROOM_OBSERVATION_FORM', 'GENERAL_EVIDENCE_FORM', 'DOMAIN_SUMMARIES', 'EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS', 'RECEIVING_DELIVERING_SCHOOL_DOCUMENTS_EVIDENCE', 'EXTERNAL_REVIEW_VISIT_REPORTS', 'CSEQA_REPORTS_LIST'], //'SCHOOL_CONFLICTS'
        roles: [],
        permissions: [Permission.SCHOOL_PERFORMANCE, Permission.VISIT_PLAN_VIEW, Permission.SELF_EVALUATION_DOCUMENT_VIEW,
            Permission.SELF_EVALUATION_DOCUMENT_VIEW_ALL, Permission.GENERAL_EVIDENCE_VISIT_FORM_VIEW_ALL, Permission.CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_ALL,
            Permission.DOMAIN_SUMMARY_VIEW_ALL, Permission.QA_FOLLOW_UP_FORM_VIEW,
            Permission.VISIT_REPORT_VIEW_ALL,
            Permission.VISIT_REPORT_SCHOOL_REVIEW, Permission.CSEQA_REPORT_LIST_VIEW
        ],
        subItems: [
            {
                id: 69,
                parentId: 7,
                label: 'MENUITEMS.MENU.SCHOOL_PERFORMANCE_SETTINGS',
                link: '/jawda/school-performance/settings',
                procedures: ['SCHOOL_PERFORMANCE_SETTINGS'],
                roles: [],
                permissions: [Permission.CSEQA_SCHOOL_PERFORMANCE_SETTING]
            },
            {
                id: 64,
                parentId: 7,
                label: 'MENUITEMS.MENU.TEAM_LEADER_PLAN',
                link: '/jawda/school-performance/team-leader-plan/list',
                procedures: ['TEAM_LEADER_PLAN_MANAGEMENT'],
                roles: [],
                permissions: [Permission.VISIT_PLAN_VIEW]
            },
            {
                id: 63,
                parentId: 7,
                label: 'MENUITEMS.MENU.SELF_EVALUATION_DOCUMENT',
                link: '/jawda/school-performance/self-evaluation-document/list',
                procedures: ['SELF_EVALUATION_DOCUMENT'],
                roles: [],
                permissions: [Permission.SELF_EVALUATION_DOCUMENT_VIEW, Permission.SELF_EVALUATION_DOCUMENT_VIEW_ALL]
            },
            {
                id: 63,
                parentId: 7,
                label: 'MENUITEMS.MENU.CLASSROOM_OBSERVATION_FORM',
                link: '/jawda/school-performance/visit-form/CLASSROOM_OBSERVATION/list',
                procedures: ['CLASSROOM_OBSERVATION_FORM'],
                roles: [],
                permissions: [Permission.CLASSROOM_OBSERVATION_VISIT_FORM_VIEW]

            },
            {
                id: 65,
                parentId: 7,
                label: 'MENUITEMS.MENU.GENERAL_EVIDENCE_FORM',
                link: '/jawda/school-performance/visit-form/GENERAL_EVIDENCE/list',
                procedures: ['GENERAL_EVIDENCE_FORM'],
                roles: [],
                permissions: [Permission.GENERAL_EVIDENCE_VISIT_FORM_VIEW]

            },
            {
                id: 64,
                parentId: 7,
                label: 'MENUITEMS.MENU.DOMAIN_SUMMARIES',
                link: '/jawda/school-performance/domain-summary/list',
                procedures: ['DOMAIN_SUMMARIES'],
                roles: [],
                permissions: []
            },
            {
                id: 66,
                parentId: 7,
                label: 'MENUITEMS.MENU.SCHOOL_PERFORMANCE_EVALUATION_ACTIVITIES',
                procedures: ['EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS', 'RECEIVING_DELIVERING_SCHOOL_DOCUMENTS_EVIDENCE'], //'SCHOOL_CONFLICTS'
                roles: [],
                permissions: [Permission.QA_FOLLOW_UP_FORM_VIEW],
                subItems: [
                    {
                        id: 661,
                        parentId: 66,
                        label: 'MENUITEMS.MENU.EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS',
                        link: '/jawda/school-performance/quality-assurance-form/list',
                        procedures: ['EXTERNAL_REVIEW_QUALITY_ASSURANCE_FORMS'],
                        roles: [],
                        permissions: [Permission.QA_FOLLOW_UP_FORM_VIEW]
                    },
                    {
                        id: 662,
                        parentId: 66,
                        label: 'MENUITEMS.MENU.RECEIVING_DELIVERING_SCHOOL_DOCUMENTS_EVIDENCE',
                        link: '/jawda/school-performance/school-document-delivery/visits',
                        procedures: ['RECEIVING_DELIVERING_SCHOOL_DOCUMENTS_EVIDENCE'],
                        roles: [],
                        permissions: []
                    },
                    {
                        id: 663,
                        parentId: 66,
                        label: 'MENUITEMS.MENU.SCHOOL_CONFLICTS',
                        link: '/jawda/school-performance/school-conflicts',
                        //  procedures: ['SCHOOL_CONFLICTS'],
                        excludeRoles: [],
                        roles: [
                            'CSEQA_OBSERVATION_MONITORING_FORM_VIEW_REPORT',
                            'CSEQAADMIN',
                            'CSEQAAEASVR',
                            'CSEQAAEAVR',
                            'CSEQADME',
                            'CSEQAERDM',
                            'CSEQAGM',
                            'CSEQASDM'
                        ],
                        permissions: []
                    }
                ]
            },
            {
                id: 64,
                parentId: 7,
                label: 'MENUITEMS.MENU.EXTERNAL_REVIEW_VISIT_REPORTS',
                link: '/jawda/school-performance/external-review-visit-reports/list',
                procedures: ['EXTERNAL_REVIEW_VISIT_REPORTS'],
                roles: [],
                permissions: [Permission.VISIT_REPORT_VIEW, Permission.VISIT_REPORT_SCHOOL_REVIEW]
            }/*,
      {
        id: 67,
        parentId: 7,
        label: 'MENUITEMS.MENU.SUMMARY_EXTERNAL_REVIEW_VISIT_REPORTS',
        link: '/jawda/school-performance/visit-report-summary/list',
        roles: [],
        permissions: [Permission.VISIT_REPORT_VIEW]
      }*/,

            {
                id: 68,
                parentId: 7,
                label: 'MENUITEMS.MENU.REPORTS_LIST',
                link: '/jawda/school-performance/reports/CSEQA',
                procedures: ['CSEQA_REPORTS_LIST'],
                roles: [],
                permissions: [Permission.CSEQA_REPORT_LIST_VIEW]
            }
        ]
    },
    // school conflicts menu item added separately
    {
        id: 8,
        label: 'MENUITEMS.MENU.SCHOOL_CONFLICTS',
        link: '/jawda/school-performance/school-conflicts',
        roles: ['EXTERNALUSER'],
        //to ensure no duplication in display of menu item
        excludeRoles: [
            'CSEQA_OBSERVATION_MONITORING_FORM_VIEW_REPORT',
            'CSEQAADMIN',
            'CSEQAAEASVR',
            'CSEQAAEAVR',
            'CSEQADME',
            'CSEQAERDM',
            'CSEQAGM',
            'CSEQASDM'
        ],
        permissions: []
    }
];
