import { environment } from "src/environments/environment";

const USER_MANAGEMENT_BASE_URL = `${environment.baseURL}/oaaaqa/user-management`;


export const AppConstants: any = {


    PERSISTED_KEYS: {
        ACCESS_TOKEN: 'ACCESS_TOKEN',
        REMEMBER_ME: 'REMEMBER_ME',
        REGISTERED_USER: 'REGSTERD_USER',
        CURRENT_USER: 'CURRENT_USER',
        CURRENT_TENANT: 'CURRENT_TENANT',
        RESET_PASS: 'RESET_PASSWORD',
        REFRESH_TOKEN: 'REFRESH_TOKEN',
        USER_ROLES: 'USER_ROLES',
        USER_PERMISSIONS: 'USER_PERMISSIONS',
        USER_PROCEDURES: 'USER_PROCEDURES',
        ENCRYPTION_KEY: 'dadsasasdasdadsasdasddas',
    },

    FILE_UPLOAD_DOWNLOAD: {
        BUCKET: "oaaaqa"
    },

    LOOKUP_CODE: {
        TITLE: "TITLE",
        GENDER: "GENDER",
        ORGANIZATION: "ORGANIZATION",
        LANGUAGES: "LANGUAGES",
        HIGHER_EDUCATION_LEVELS: "HIGHER_EDUCATION_LEVELS",
        INSTITUTIONS: "INSTITUTIONS",
        ER_ACTIVITIES: "ER_ACTIVITIES",
        ACTIVE: "ACTIVE",
        EXPERIENCE: "EXPERIENCE",

        ORGANIZATION_OTHER :"Others"
    },
    SERVICE_REQUEST_DETAILS: {
        "CHEQA_EXTERNAL_REVIEWER_REGISTRATION": "/jawda/external-reviewers/external-reviewer-registration-service/request-details",
        "CSEQA_EXTERNAL_REVIEWER_REGISTRATION": "/jawda/external-reviewers/external-reviewer-registration-service/request-details",
        "OQF_EXTERNAL_REVIEWER_REGISTRATION": "/jawda/external-reviewers/external-reviewer-registration-service/request-details",

        "CHEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": "/jawda/external-reviewers/external-reviewers-training-results/request-details",
        "CSEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": "/jawda/external-reviewers/external-reviewers-training-results/request-details",
        "OQF_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": "/jawda/external-reviewers/external-reviewers-training-results/request-details",

        "CHEQA_EXTERNAL_REVIEWER_WITHDRAW": "/jawda/external-reviewers/external-reviewer-withdraw-service/request-details",
        "CSEQA_EXTERNAL_REVIEWER_WITHDRAW": "/jawda/external-reviewers/external-reviewer-withdraw-service/request-details",
        "OQF_EXTERNAL_REVIEWER_WITHDRAW": "/jawda/external-reviewers/external-reviewer-withdraw-service/request-details",

        "CHEQA_EXTERNAL_REVIEWER_REJOIN": '/jawda/external-reviewers/external-reviewer-registration-service/request-details',
        "CSEQA_EXTERNAL_REVIEWER_REJOIN": '/jawda/external-reviewers/external-reviewer-registration-service/request-details',
        "OQF_EXTERNAL_REVIEWER_REJOIN": '/jawda/external-reviewers/external-reviewer-registration-service/request-details',
        "VISIT_FORM_SUBMISSION": '/jawda/school-performance/visit-form/details',
        "LEADER_PLAN_SUBMISSION": '/jawda/school-performance/team-leader-plan/request-details',
        "DOMAIN_SUMMARIES": '/jawda/school-performance/domain-summary/details',
        "SCHOOL_DOCUMENT_DELIVERY_SUBMISSION":'/jawda/school-performance/school-document-delivery/details',
        "VISIT_REPORT_SUBMISSION":'/jawda/school-performance/external-review-visit-reports/request-details',
        "SUMMARY_VISIT_REPORT_SUBMISSION":'/jawda/school-performance/visit-report-summary/request-details',

        "CHEQA_EXTERNAL_REVIEWER_DELETION":'/jawda/external-reviewers/external-reviewers-deletion/request-details',
        "CSEQA_EXTERNAL_REVIEWER_DELETION":'/jawda/external-reviewers/external-reviewers-deletion/request-details',
        "OQF_EXTERNAL_REVIEWER_DELETION":'/jawda/external-reviewers/external-reviewers-deletion/request-details',
    },


    PREVIOUS_REQUEST_DETAILS: {
        "CHEQA_EXTERNAL_REVIEWER_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        "CSEQA_EXTERNAL_REVIEWER_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        "OQF_EXTERNAL_REVIEWER_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,

        "CHEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-training-request`,
        "CSEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-training-request`,
        "OQF_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION": `${environment.baseURL}/oaaaqa/external-reviewers-training-request`,

        "CHEQA_EXTERNAL_REVIEWER_WITHDRAW": `${environment.baseURL}/oaaaqa/external-reviewers-withdraw`,
        "CSEQA_EXTERNAL_REVIEWER_WITHDRAW": `${environment.baseURL}/oaaaqa/external-reviewers-withdraw`,
        "OQF_EXTERNAL_REVIEWER_WITHDRAW": `${environment.baseURL}/oaaaqa/external-reviewers-withdraw`,

        "CHEQA_EXTERNAL_REVIEWER_REJOIN": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        "CSEQA_EXTERNAL_REVIEWER_REJOIN": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        "OQF_EXTERNAL_REVIEWER_REJOIN": `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,

    },
    API: {
        // base url
        baseURL: environment.baseURL,
        CMS_API: `${environment.cmsBaseURL}/api`,
        LOGIN: `${environment.baseURL}/login-management/api/auth/login`,
        REFRESH_TOKEN: `${environment.baseURL}/login-management/api/auth/refresh-token`,
        VERIFY_OTP: `${environment.baseURL}/login-management/api/auth/verify-otp`,
        RESEND_OTP: `${environment.baseURL}/login-management/api/auth/resend-otp`,
        RESET_PASSWORD: `${environment.baseURL}/login-management/api/auth/reset-password`,
        FORGOT_PASSWORD: `${environment.baseURL}/login-management/api/auth/forgot-password`,
        USER: `${environment.baseURL}/login-management/api/users/me`,
        UPDATE_PROFILE: `${environment.baseURL}/login-management/api/users/update-profile`,
        CHANGE_PASSWORD: `${environment.baseURL}/login-management/api/users/change-password`,
        LOGOUT: `${environment.baseURL}/login-management/api/users/logout`,
        TASK_COUNT: `${environment.baseURL}/oaaaqa/task-management/find-tasks-count`,
        TASKS: `${environment.baseURL}/oaaaqa/task-management/find-tasks`,
        INITIATE_REGISTRATION: `${environment.baseURL}/oaaaqa/api/auth/registration/initiation`,
        REGISTRATION_RESEND_OTP: `${environment.baseURL}/oaaaqa/api/auth/registration/otp-resend`,
        REGISTRATION_OTP_VALIDATION: `${environment.baseURL}/oaaaqa/api/auth/registration/otp-validation`,
        GET_ALL_COUNTRIES: `${environment.baseURL}/oaaaqa/api/auth/master-data/get-all-countries`,
        GET_ALL_GOVERNORATES: `${environment.baseURL}/oaaaqa/api/auth/master-data/get-all-governorates`,
        GET_WILAYAT: `${environment.baseURL}/oaaaqa/api/auth/master-data/get-wilayat`,
        GET_CITIES: `${environment.baseURL}/oaaaqa/api/auth/master-data/get-cities`,
        GET_SYSTEM_LOOKUPS: `${environment.baseURL}/oaaaqa/api/auth/master-data/get-system-lookups/`,

        UPLOAD_FILE: `${environment.baseURL}/oaaaqa/api/auth/registration/upload/`,

        // service management
        RETRIEVE_OAAA_SERVICES: `${environment.baseURL}/oaaaqa/services-management/`,
        SERVICES_CATEGORY_MANAGEMENT: `${environment.baseURL}/oaaaqa/services-category-management/`,
        COMPLETE_REGISTRATION: `${environment.baseURL}/oaaaqa/api/auth/registration/completion`,

        // User Management
        USER_MANAGEMENT: {
            BASE: USER_MANAGEMENT_BASE_URL,
            CLIENT_OVERVIEW: `${USER_MANAGEMENT_BASE_URL}/`,
            UPDATE: `${USER_MANAGEMENT_BASE_URL}/update`,
            CHANGE_PASSWORD: `${USER_MANAGEMENT_BASE_URL}/change-password`,
            CHANGE_PASSWORD_HISTORY: `${USER_MANAGEMENT_BASE_URL}/change-password/history`,
            VALIDATE_EMAIL: `${USER_MANAGEMENT_BASE_URL}/validate/email`,
            ADD_USER: `${USER_MANAGEMENT_BASE_URL}/add`,
        },

        USER_MANAGEMENT_ADMIN: {
            PROCEDURE: `${environment.baseURL}/oaaaqa/procedure-management`,
            PERMISSION: `${environment.baseURL}/oaaaqa/permission-management`,
        } ,

        // Admin Role Management
        ROLE_MANAGEMENT_ROLES_OVERVIEW: `${environment.baseURL}/oaaaqa/role-management/overview`,
        ROLE_MANAGEMENT_ROLES_ADD: `${environment.baseURL}/oaaaqa/role-management/add`,
        ROLE_MANAGEMENT_ROLES: `${environment.baseURL}/oaaaqa/role-management`,
        ROLE_MANAGEMENT_PROCEDURES: `${environment.baseURL}/oaaaqa/role-management/procedures`,
        ROLE_MANAGEMENT_VALIDATE_ROLE_NAME: `${environment.baseURL}/oaaaqa/role-management/validate/name`,
        
    
        
       
       //GROUP MANAGEMENT
        ROLE_MANAGEMENT_GROUPS: `${environment.baseURL}/oaaaqa/group-management/`,
        GROUP_MANAGEMENT_INITIATE_ADDING_ROLE: `${environment.baseURL}/oaaaqa/group-management/initiate-adding-role`,
        GROUP_MANAGEMENT_BASIC_INFO_ADDING_USER: `${environment.baseURL}/oaaaqa/group-management/groups-basic-info`,

      

        EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA: `${environment.baseURL}/oaaaqa/api/external-reviewers-acceptance-criteria`,
        EXTERNAL_REVIEWERS_ACCEPTANCE_SUB_CRITERIA: `${environment.baseURL}/oaaaqa/api/external-reviewers-acceptance-sub-criteria`,
        EXTERNAL_REVIEWERS_ACCEPTANCE_ITEMS: `${environment.baseURL}/oaaaqa/api/external-reviewers-acceptance-items`,

        //Account
        EXTERNAL_REVIEWER_SETTINGS: `${environment.baseURL}/oaaaqa/external-reviewers-registration-settings/`,

        // External Reviewer Registration Request
        EXTERNAL_REVIEWER_REGISTRATION_REQUEST: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        EXTERNAL_REVIEWERS_REQUESTS_LIST: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request/requests`,
        EXTERNAL_REVIEWERS_APPROVED_REQUESTS_LIST: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request/approved-requests-list`,
        EXTERNAL_REVIEWERS_STATUS_OPTIONS: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request/status-options`,

        BROAD_FIELDS: `${environment.baseURL}/oaaaqa/broad-fields`,
        NARROW_FIELDS: `${environment.baseURL}/oaaaqa/broad-fields/get-narrow-fields`,
        GENERAL_SPECIALIZATIONS: `${environment.baseURL}/oaaaqa/general-specializations`,
        SPECIFIC_SPECIALIZATIONS: `${environment.baseURL}/oaaaqa/general-specializations/get-specific-specializations`,
        CSEQA_GENERAL_SPECIALIZATIONS: `${environment.baseURL}/oaaaqa/general-specializations/get-cseqa-general-specializations`,
        CSEQA_SPECIFIC_SPECIALIZATIONS: `${environment.baseURL}/oaaaqa/general-specializations/get-cseqa-specific-specializations`,
        EXTERNAL_REVIEWERS_REGISTRATION_REQUEST: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request`,
        EXTERNAL_REVIEWERS_REGISTRATION_REQUEST_COMPLETE: `${environment.baseURL}/oaaaqa/external-reviewers-registration-request/complete/`,
        SERVICE_VALIDATION: `${environment.baseURL}/oaaaqa/service-validation/`,
        ALL_CRITERIA_WITH_CURRENT_VERSIONS: `${environment.baseURL}/oaaaqa/api/external-reviewers-acceptance-criteria`,
        EXTERNAL_REVIEWERS_INTERVIEW_RESULTS_REGISTRATION: `${environment.baseURL}/oaaaqa/external-reviewers-interview-results-registration`,
        EXTERNAL_REVIEWER_MANAGEMENT: `${environment.baseURL}/oaaaqa/external-reviewers-management`,
        EXTERNAL_REVIEWER_MANAGEMENT_BY_ID: `${environment.baseURL}/oaaaqa/external-reviewers-management/get-external-reviewer`,
        EXTERNAL_REVIEWER_FILES: `${environment.baseURL}/oaaaqa/external-reviewers-management/external-reviewer-files`,
        EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST: `${environment.baseURL}/oaaaqa/external-reviewers-withdraw`,
        EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST_COMPLETE: `${environment.baseURL}/oaaaqa/external-reviewers-withdraw/complete/`,

        EXTERNAL_REVIEWERS_TRAINING_REQUEST: `${environment.baseURL}/oaaaqa/external-reviewers-training-request`,
        
        EXTERNAL_REVIEWERS_DELETION_REQUEST: `${environment.baseURL}/oaaaqa/external-reviewers-deletion-request`,
        
        SELF_EVALUATION_DOCUMENTS: `${environment.baseURL}/oaaaqa/cseqa/school-performance/self-evaluation-documents/`,
        SELFE_VALUATION_DOCUMENT_SETTING: `${environment.baseURL}/oaaaqa/cseqa/school-performance/settings/self-evaluation-documents/`,
        FORM_VISIT: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-form/`,
        VISIT_PLAN: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-plan/`,
        DOMAIN_SUMMARY: `${environment.baseURL}/oaaaqa/cseqa/school-performance/domain-summary-submission/`,
        SCHEDULED_SCHOOL_VISIT: `${environment.baseURL}/oaaaqa/cseqa/school-performance/scheduled-school-visit/`,

        AVAILABLE_FOR_PLANNING: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-plan/available-for-planning/`,
        PLAN_DETAILS: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-plan/plan-details/`,
        QUALITY_ASSURANCE_FORM: `${environment.baseURL}/oaaaqa/cseqa/school-performance/qa-follow-up-form-submission/`,
        PLAN_DETAILS_REQUEST: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-plan/plan-details/request/`,
        PLAN_DETAILS_COMPLETE: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-plan/complete/`,
        VISIT_TEAM_MEMBERS: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-review-team-assignment/visit/`,
        SCHOOL_DOCUMENT_DELIVERY: `${environment.baseURL}/oaaaqa/cseqa/school-performance/school-document-delivery/`,
        VISIT_REPORT_SUBMISSION: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/`,
        COMPLETE_VISIT_REPORT: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/complete/`,
        GENERATE_VISIT_REPORT: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/generate-report/`,
        TERMS_AND_CONDITIONS: `${environment.baseURL}/oaaaqa/public/terms/`,
        AVAILABLE_FOR_REPORTING: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/available-for-reporting/`,
        INITIAL_REPORT_VIEW: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/initial-report-view/`,
        REPORT_DETAILS: `${environment.baseURL}/oaaaqa/cseqa/school-performance/visit-report/report-details/`,
        SUMMARY_VISIT_REPORT: `${environment.baseURL}/oaaaqa/cseqa/school-performance/summary-visit-report/`,
        REPORTS: `${environment.baseURL}/oaaaqa/reports/`
    },

    PATTERNS: {
        PASSWORD: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}/,
        EMAIL: /^([a-zA-Z0-9_.\-]+)@[a-zA-Z0-9_.\-]+(\.[a-z0-9\-]+)*(\.[a-zA-Z]{2,3})$/,
        MOBILE: /^\+?[1-9]\d{7,14}$/,
        PHONE: /^\+?[1-9]\d{1,14}$/
    },

    SERVICE_CODES: {
        CHEQA_EXTERNAL_REVIEWER_REGISTRATION: 'CHEQA_EXTERNAL_REVIEWER_REGISTRATION',
        CSEQA_EXTERNAL_REVIEWER_REGISTRATION: 'CSEQA_EXTERNAL_REVIEWER_REGISTRATION',
        OQF_EXTERNAL_REVIEWER_REGISTRATION: 'OQF_EXTERNAL_REVIEWER_REGISTRATION',
        CHEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION: 'CHEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION',
        CSEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION: 'CSEQA_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION',
        OQF_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION: 'OQF_EXTERNAL_REVIEWER_TRAINING_RESULTS_REGISTRATION',
        CHEQA_EXTERNAL_REVIEWER_WITHDRAW: 'CHEQA_EXTERNAL_REVIEWER_WITHDRAW',
        CSEQA_EXTERNAL_REVIEWER_WITHDRAW: 'CSEQA_EXTERNAL_REVIEWER_WITHDRAW',
        OQF_EXTERNAL_REVIEWER_WITHDRAW: 'OQF_EXTERNAL_REVIEWER_WITHDRAW',
        CHEQA_EXTERNAL_REVIEWER_REJOIN: 'CHEQA_EXTERNAL_REVIEWER_REJOIN',
        CSEQA_EXTERNAL_REVIEWER_REJOIN: 'CSEQA_EXTERNAL_REVIEWER_REJOIN',
        OQF_EXTERNAL_REVIEWER_REJOIN: 'OQF_EXTERNAL_REVIEWER_REJOIN',
    },
};

AppConstants.REJOIN_SERVICES = [
    AppConstants.SERVICE_CODES.CHEQA_EXTERNAL_REVIEWER_REJOIN,
    AppConstants.SERVICE_CODES.CSEQA_EXTERNAL_REVIEWER_REJOIN,
    AppConstants.SERVICE_CODES.OQF_EXTERNAL_REVIEWER_REJOIN
]
