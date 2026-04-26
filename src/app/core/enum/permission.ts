export enum Permission {
    /****************************************
     ********** GENERAL PERMISSIONS *********
    ****************************************/

    // SERVICES CATEGORIES MANAGEMENT إدارة تصنيفات الخدمات
    ADD_SERVICE_CATEGORY = "ADD_SERVICE_CATEGORY",
    EDIT_SERVICE_CATEGORY = "EDIT_SERVICE_CATEGORY",
    DELETE_SERVICE_CATEGORY = "DELETE_SERVICE_CATEGORY",
    VIEW_SERVICE_CATEGORY = "VIEW_SERVICE_CATEGORY",

    // SERVICE MANAGEMENT
    VIEW_SERVICE = "VIEW_SERVICE",
    EDIT_SERVICE = "EDIT_SERVICE",
    SERVICE_VIEW_DETAIL = "SERVICE_VIEW_DETAIL",

    // Admin User Management Permissions
    ADMIN_ADD_USER = "ADMIN_ADD_USER",
    ADMIN_CHANGE_PASSWORD_FOR_USER = "ADMIN_CHANGE_PASSWORD_FOR_USER",
    ADMIN_GET_ALL_ROLES = "ADMIN_GET_ALL_ROLES",
    ADMIN_GET_ALL_USERS = "ADMIN_GET_ALL_USERS",
    ADMIN_VIEW_ROLES = "ADMIN_VIEW_ROLES",
    ADMIN_VIEW_USERS = "ADMIN_VIEW_USERS",
    ADMIN_UPDATE_USER = "ADMIN_UPDATE_USER",
    ADMIN_ADD_ROLE = "ADMIN_ADD_ROLE",
    ADMIN_DELETE_ROLE = "ADMIN_DELETE_ROLE",
    ADMIN_UPDATE_ROLE = "ADMIN_UPDATE_ROLE",
    ADMIN_VIEW_USER_ROLE = "ADMIN_VIEW_USER_ROLE",
    ADMIN_DELETE_USER = "ADMIN_DELETE_USER", // NOT used in DB
    ADMIN_GET_ALL_GROUPS = "ADMIN_GET_ALL_GROUPS", // NOT used in DB
    ADMIN_GET_ALL_PROCEDURES = "ADMIN_GET_ALL_PROCEDURES", // NOT used in DB
    ADMIN_VIEW_CHANGE_PASSWORD_FOR_USER = "ADMIN_VIEW_CHANGE_PASSWORD_FOR_USER", // NOT used in DB

    /*===============================================================================================================*/




    /*******************************************************************************/
    /******************************* CSEQA PERMISSIONS *****************************/
    /*******************************************************************************/

    // Training Results Registration    
    CSEQA_ER_Training_results_Registration_Request_VIEW = "CSEQA_ER_Training_results_Registration_Request_VIEW",
    CSEQA_ER_Training_results_Registration_Request_VIEW_ALL = "CSEQA_ER_Training_results_Registration_Request_VIEW_ALL",
    CSEQA_ER_Training_results_Registration_Request_COMPLETE_TASK = "CSEQA_ER_Training_results_Registration_Request_COMPLETE_TASK",
    CSEQA_ER_Training_results_Registration_Request_CREATE_REQUEST = "CSEQA_ER_Training_results_Registration_Request_CREATE_REQUEST",

    // Withdrawal Requests
    CSEQA_ER_Withdraw_Request_VIEW = "CSEQA_ER_Withdraw_Request_VIEW",
    CSEQA_ER_Withdraw_Request_VIEW_DETAIL = "CSEQA_ER_Withdraw_Request_VIEW_DETAIL",
    CSEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST = "CSEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST",
    CSEQA_External_reviewers_Withdraw_Request_COMPLETE_TASK = "CSEQA_External_reviewers_Withdraw_Request_COMPLETE_TASK",
    CSEQA_ER_Withdraw_Request_INITIAL_APPROVAL = "CSEQA_ER_Withdraw_Request_INITIAL_APPROVAL",
    CSEQA_ER_Withdraw_Request_FINAL_APPROVAL = "CSEQA_ER_Withdraw_Request_FINAL_APPROVAL",

    CSEQA_ER_Withdraw_Request_VIEW_ALL = "CSEQA_ER_Withdraw_Request_VIEW_ALL", // NOT used in DB
    CSEQA_ER_Withdraw_Request_VIEW_BASIC = "CSEQA_ER_Withdraw_Request_VIEW_BASIC", // NOT used in DB

    // External Reviewers Deletion
    CSEQA_ER_Deletion_Request_VIEW = "CSEQA_ER_Deletion_Request_VIEW",
    CSEQA_ER_Deletion_Request_COMPLETE_TASK = "CSEQA_ER_Deletion_Request_COMPLETE_TASK",
    CSEQA_ER_Deletion_Request_CREATE_REQUEST = "CSEQA_ER_Deletion_Request_CREATE_REQUEST",
    CSEQA_ER_Deletion_Request_VIEW_ALL = "CSEQA_ER_Deletion_Request_VIEW_ALL",

    // Registration Settings - Center for School Education Quality Assurance
    CSEQA_ER_registration_settings_MANAGE = "CSEQA_ER_registration_settings_MANAGE",
    CSEQA_ER_registration_settings_VIEW_ALL = "CSEQA_ER_registration_settings_VIEW_ALL",
    CSEQA_ER_registration_settings_UPDATE = "CSEQA_ER_registration_settings_UPDATE", // NOT used in DB

    // Management of Standards and Conditions for Accepting ERs in Center for School Education Quality Assurance
    CSEQA_ER_Acceptance_CRITERIA_VIEW = "CSEQA_ER_Acceptance_CRITERIA_VIEW",
    CSEQA_ER_Acceptance_CRITERIA_ADD = "CSEQA_ER_Acceptance_CRITERIA_ADD",
    CSEQA_ER_Acceptance_CRITERIA_UPDATE = "CSEQA_ER_Acceptance_CRITERIA_UPDATE",
    CSEQA_ER_Acceptance_CRITERIA_DELETE = "CSEQA_ER_Acceptance_CRITERIA_DELETE",
    CSEQA_ER_Acceptance_CRITERIA_PUBLISH = "CSEQA_ER_Acceptance_CRITERIA_PUBLISH",
    CSEQA_ER_Acceptance_CRITERIA_MANAGE = "CSEQA_ER_Acceptance_CRITERIA_MANAGE", // NOT used in DB

    // Requests for Joining as an External Reviewer at Center for School Education Quality Assurance
    CSEQA_ER_Registration_Request_VIEW = "CSEQA_ER_Registration_Request_VIEW",
    CSEQA_ER_APPROVE_JOIN_REQUEST = "CSEQA_ER_APPROVE_JOIN_REQUEST",
    CSEQA_ER_Registration_Request_CREATE_REQUEST = "CSEQA_ER_Registration_Request_CREATE_REQUEST",
    CSEQA_ER_Registration_Request_VIEW_ALL = "CSEQA_ER_Registration_Request_VIEW_ALL",
    CSEQA_ER_APPROVE_REJOIN_REQUEST = "CSEQA_ER_APPROVE_REJOIN_REQUEST",
    CSEQA_ER_Registration_Request_VIEW_DETAIL = "CSEQA_ER_Registration_Request_VIEW_DETAIL",

    // Candidates Register as External Reviewers at the Center for School Education Quality Assurance
    EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_ALL = "EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_ALL",
    EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_DETAILS = "EXTERNAL_REVIEWERS_CANDIDATES_CSEQA_VIEW_DETAILS",

    // Register the Results of Personal Interviews for Candidates as External Reviewers
    CSEQA_ER_Interview_results_Registration_VIEW = "CSEQA_ER_Interview_results_Registration_VIEW",
    CSEQA_ER_Interview_results_Registration_VIEW_DETAIL = "CSEQA_ER_Interview_results_Registration_VIEW_DETAIL",
    CSEQA_ER_Interview_results_Registration_SUBMIT = "CSEQA_ER_Interview_results_Registration_SUBMIT",

    // School Performance Evaluation Procedures Settings
    SCHOOL_PERFORMANCE = 'SCHOOL_PERFORMANCE',
    CSEQA_SCHOOL_PERFORMANCE_SETTING = 'CSEQA_SCHOOL_PERFORMANCE_SETTING',

    // Team Leader Plan
    VISIT_PLAN_VIEW = "VISIT_PLAN_VIEW",
    VISIT_PLAN_VIEW_DETAILS = "VISIT_PLAN_VIEW_DETAILS",
    VISIT_PLAN_VIEW_ALL = "VISIT_PLAN_VIEW_ALL",
    VISIT_PLAN_CREATE = "VISIT_PLAN_CREATE",
    VISIT_PLAN_UPDATE = "VISIT_PLAN_UPDATE",
    VISIT_PLAN_REVIEW = "VISIT_PLAN_REVIEW",
    VISIT_PLAN_EXPORT = "VISIT_PLAN_EXPORT",

    // Self-Evaluation Document    
    SELF_EVALUATION_DOCUMENT_VIEW = "SELF_EVALUATION_DOCUMENT_VIEW",
    SELF_EVALUATION_DOCUMENT_VIEW_DETAILS = "SELF_EVALUATION_DOCUMENT_VIEW_DETAILS",
    SELF_EVALUATION_DOCUMENT_VIEW_ALL = "SELF_EVALUATION_DOCUMENT_VIEW_ALL",
    SELF_EVALUATION_DOCUMENT_TEAM_VIEW = 'SELF_EVALUATION_DOCUMENT_TEAM_VIEW',
    SELF_EVALUATION_DOCUMENT_EXPORT = "SELF_EVALUATION_DOCUMENT_EXPORT",
    SELF_EVALUATION_DOCUMENT_EDIT = "SELF_EVALUATION_DOCUMENT_EDIT",

    // Classroom Observation Forms
    CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_TEAM = 'CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_TEAM',
    CLASSROOM_OBSERVATION_VISIT_FORM_DELETE = 'CLASSROOM_OBSERVATION_VISIT_FORM_DELETE',
    CLASSROOM_OBSERVATION_VISIT_FORM_IMPORT = 'CLASSROOM_OBSERVATION_VISIT_FORM_IMPORT',
    CLASSROOM_OBSERVATION_VISIT_FORM_VIEW = "CLASSROOM_OBSERVATION_VISIT_FORM_VIEW",
    CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_DETAILS = "CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_DETAILS",
    CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_ALL = "CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_ALL",
    CLASSROOM_OBSERVATION_VISIT_FORM_CREATE = "CLASSROOM_OBSERVATION_VISIT_FORM_CREATE",
    CLASSROOM_OBSERVATION_VISIT_FORM_REVIEW = "CLASSROOM_OBSERVATION_VISIT_FORM_REVIEW",
    CLASSROOM_OBSERVATION_VISIT_FORM_RETURN_FOR_EDIT = "CLASSROOM_OBSERVATION_VISIT_FORM_RETURN_FOR_EDIT",
    CLASSROOM_OBSERVATION_VIEW_REPORT = "CLASSROOM_OBSERVATION_VIEW_REPORT",
    CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_WITHIN_VISITS = "CLASSROOM_OBSERVATION_VISIT_FORM_VIEW_WITHIN_VISITS", // NOT used in DB
    CLASSROOM_OBSERVATION_VISIT_REPORT_EXPORT = "CLASSROOM_OBSERVATION_VISIT_REPORT_EXPORT", // NOT used in DB

    // General Evidence Forms
    GENERAL_EVIDENCE_VISIT_FORM_VIEW_TEAM = 'GENERAL_EVIDENCE_VISIT_FORM_VIEW_TEAM',
    GENERAL_EVIDENCE_VISIT_FORM_IMPORT = 'GENERAL_EVIDENCE_VISIT_FORM_IMPORT',
    GENERAL_EVIDENCE_VISIT_FORM_VIEW = "GENERAL_EVIDENCE_VISIT_FORM_VIEW",
    GENERAL_EVIDENCE_VISIT_FORM_VIEW_DETAILS = "GENERAL_EVIDENCE_VISIT_FORM_VIEW_DETAILS",
    GENERAL_EVIDENCE_VISIT_FORM_VIEW_ALL = "GENERAL_EVIDENCE_VISIT_FORM_VIEW_ALL",
    GENERAL_EVIDENCE_VISIT_FORM_CREATE = "GENERAL_EVIDENCE_VISIT_FORM_CREATE",
    GENERAL_EVIDENCE_VISIT_FORM_RETURN_FOR_EDIT = "GENERAL_EVIDENCE_VISIT_FORM_RETURN_FOR_EDIT",
    GENERAL_EVIDENCE_VISIT_FORM_VIEW_WITHIN_VISITS = "GENERAL_EVIDENCE_VISIT_FORM_VIEW_WITHIN_VISITS",
    GENERAL_EVIDENCE_VISIT_REPORT_EXPORT = "GENERAL_EVIDENCE_VISIT_REPORT_EXPORT",
    GENERAL_EVIDENCE_VIEW_REPORT = "GENERAL_EVIDENCE_VIEW_REPORT",
    GENERAL_EVIDENCE_VISIT_FORM_REVIEW = "GENERAL_EVIDENCE_VISIT_FORM_REVIEW", // NOT used in DB

    // Domains Summaries
    DOMAIN_SUMMARY_CREATE = 'DOMAIN_SUMMARY_CREATE',
    DOMAIN_SUMMARY_VIEW_REQUEST = 'DOMAIN_SUMMARY_VIEW_REQUEST',
    DOMAIN_SUMMARY_COMPLETE_REQUEST = 'DOMAIN_SUMMARY_COMPLETE_REQUEST',
    DOMAIN_SUMMARY_TEAM_LEAD_VIEW = 'DOMAIN_SUMMARY_TEAM_LEAD_VIEW',
    DOMAIN_SUMMARY_QA_VIEW_ALL = 'DOMAIN_SUMMARY_QA_VIEW_ALL',
    DOMAIN_SUMMARY_VIEW = "DOMAIN_SUMMARY_VIEW",
    DOMAIN_SUMMARY_VIEW_DETAILS = "DOMAIN_SUMMARY_VIEW_DETAILS",
    DOMAIN_SUMMARY_VIEW_ALL = "DOMAIN_SUMMARY_VIEW_ALL",
    DOMAIN_SUMMARY_VIEW_VISITS_LIST = "DOMAIN_SUMMARY_VIEW_VISITS_LIST",
    DOMAIN_SUMMARY_VIEW_DOMAINS_LIST = "DOMAIN_SUMMARY_VIEW_DOMAINS_LIST",
    DOMAIN_SUMMARY_EACH_DOMAIN_VIEW = "DOMAIN_SUMMARY_EACH_DOMAIN_VIEW",
    DOMAIN_SUMMARY_EACH_DOMAIN_EXPORT = "DOMAIN_SUMMARY_EACH_DOMAIN_EXPORT",
    DOMAIN_SUMMARY_EXPORT_EXCEL_FOR_ALL = "DOMAIN_SUMMARY_EXPORT_EXCEL_FOR_ALL",
    DOMAIN_SUMMARY_IMPORT_FROM_FORMS = "DOMAIN_SUMMARY_IMPORT_FROM_FORMS",
    DOMAIN_SUMMARY_VIEW_REPORT = "DOMAIN_SUMMARY_VIEW_REPORT", // NOT used in DB

    // Follow-up Form for Quality Assurance of an External Review Visit
    QA_FOLLOW_UP_FORM_ALL_VIEW = 'QA_FOLLOW_UP_FORM_ALL_VIEW',
    QA_FOLLOW_UP_FORM_VIEW = "QA_FOLLOW_UP_FORM_VIEW",
    QA_FOLLOW_UP_FORM_VIEW_DETAILS = "QA_FOLLOW_UP_FORM_VIEW_DETAILS",
    QA_FOLLOW_UP_FORM_COMMENT = "QA_FOLLOW_UP_FORM_COMMENT",
    QA_FOLLOW_UP_FORM_CREATE = "QA_FOLLOW_UP_FORM_CREATE",
    QA_FOLLOW_UP_FORM_DELETE = "QA_FOLLOW_UP_FORM_DELETE",
    QA_FOLLOW_UP_FORM_SUBMISSION_VIEW_REPORT = "QA_FOLLOW_UP_FORM_SUBMISSION_VIEW_REPORT",
    QA_FOLLOW_UP_FORM_EXPORT_REPORT = "QA_FOLLOW_UP_FORM_EXPORT_REPORT",

    // Forms for Receiving and Delivering School Documents and Evidence
    SCHOOL_DOCUMENT_DELIVERY_VIEW_ALL = 'SCHOOL_DOCUMENT_DELIVERY_VIEW_ALL',
    SCHOOL_DOCUMENT_DELIVERY_CREATE = 'SCHOOL_DOCUMENT_DELIVERY_CREATE',
    SCHOOL_DOCUMENT_DELIVERY_COMPLETE = 'SCHOOL_DOCUMENT_DELIVERY_COMPLETE',
    SCHOOL_DOCUMENT_DELIVERY_VIEW_QA = 'SCHOOL_DOCUMENT_DELIVERY_VIEW_QA',
    SCHOOL_DOCUMENT_DELIVERY_VIEW = "SCHOOL_DOCUMENT_DELIVERY_VIEW",
    SCHOOL_DOCUMENT_DELIVERY_VIEW_DETAILS = "SCHOOL_DOCUMENT_DELIVERY_VIEW_DETAILS",
    SCHOOL_DOCUMENT_DELIVERY_VIEW_TL = "SCHOOL_DOCUMENT_DELIVERY_VIEW_TL",
    SCHOOL_DOCUMENT_DELIVERY_EXPORT = "SCHOOL_DOCUMENT_DELIVERY_EXPORT",
    SCHOOL_DOCUMENT_DELIVERY_VIEW_REPORT = "SCHOOL_DOCUMENT_DELIVERY_VIEW_REPORT", // NOT used in DB

    // Conflict of Interest for All Schools
    CONFLICT_OF_INTEREST_DISCLOSURE = 'CONFLICT_OF_INTEREST_DISCLOSURE',

    // External Review Visit Reports
    EDIT_SCHOOL_INFO_IN_REPORT = 'EDIT_SCHOOL_INFO_IN_REPORT',
    VISIT_REPORT_QUALITY_REVIEW = 'VISIT_REPORT_QUALITY_REVIEW',
    VISIT_REPORT_DELETE = 'VISIT_REPORT_DELETE',
    VISIT_REPORT_GM_REVIEW = 'VISIT_REPORT_GM_REVIEW',
    VISIT_REPORT_CREATE = "VISIT_REPORT_CREATE",
    VISIT_REPORT_VIEW = "VISIT_REPORT_VIEW",
    VISIT_REPORT_VIEW_DETAILS = "VISIT_REPORT_VIEW_DETAILS",
    VISIT_REPORT_VIEW_ALL = "VISIT_REPORT_VIEW_ALL",
    VISIT_REPORT_PROOFREADER = "VISIT_REPORT_PROOFREADER",
    VISIT_REPORT_SCHOOL_VIEW = "VISIT_REPORT_SCHOOL_VIEW",
    VISIT_REPORT_SCHOOL_REVIEW = "VISIT_REPORT_SCHOOL_REVIEW",
    VISIT_REPORT_EXPORT_GLOBAL_WORD_REPORT = "VISIT_REPORT_EXPORT_GLOBAL_WORD_REPORT",
    VISIT_REPORT_EXPORT_GLOBAL_PDF_REPORT = "VISIT_REPORT_EXPORT_GLOBAL_PDF_REPORT",
    VISIT_REPORT_EXPORT_BRIEF_WORD_REPORT = "VISIT_REPORT_EXPORT_BRIEF_WORD_REPORT",
    VISIT_REPORT_EXPORT_BRIEF_PDF_REPORT = "VISIT_REPORT_EXPORT_BRIEF_PDF_REPORT",
    SUMMARY_VISIT_REPORT_CREATE = "SUMMARY_VISIT_REPORT_CREATE",
    SUMMARY_VISIT_REPORT_VIEW = "SUMMARY_VISIT_REPORT_VIEW",
    SUMMARY_VISIT_REPORT_VIEW_ALL = "SUMMARY_VISIT_REPORT_VIEW_ALL",
    SUMMARY_VISIT_REPORT_PROOFREADER = "SUMMARY_VISIT_REPORT_PROOFREADER",
    SUMMARY_VISIT_REPORT_QUALITY_REVIEW = "SUMMARY_VISIT_REPORT_QUALITY_REVIEW",
    SUMMARY_VISIT_REPORT_DELETE = "SUMMARY_VISIT_REPORT_DELETE",
    SUMMARY_VISIT_REPORT_GM_REVIEW = "SUMMARY_VISIT_REPORT_GM_REVIEW",

    // Reports List
    VIEW_TEAM_LEADER_PLAN_REPORT = 'VIEW_TEAM_LEADER_PLAN_REPORT',
    CSEQA_REPORT_LIST_VIEW = "CSEQA_REPORT_LIST_VIEW",
    CSEQA_OBSERVATION_MONITORING_FORM_VIEW_REPORT = "CSEQA_OBSERVATION_MONITORING_FORM_VIEW_REPORT",
    VIEW_CSEQA_ER_USERS_REPORT = "VIEW_CSEQA_ER_USERS_REPORT",

    // External Reviewers
    CSEQA_ER_NOTIFY = 'CSEQA_ER_NOTIFY',
    CSEQA_ER_APPROVE = 'CSEQA_ER_APPROVE',
    CSEQA_ER_Request_VIEW_ALL = "CSEQA_ER_Request_VIEW_ALL",
    CSEQA_ER_VIEW = "CSEQA_ER_VIEW",
    CSEQA_ER_VIEW_DETAILS = "CSEQA_ER_VIEW_DETAILS",
    CSEQA_ER_SEND_UPDATE_NOTIFICATION = "CSEQA_ER_SEND_UPDATE_NOTIFICATION",
    CSEQA_ER_REMOVE = "CSEQA_ER_REMOVE",

    // Team Member Evaluation
    TEAM_MEMBERS_EVALUATION_SAVE_TEAM_MEMBER_EVALUATION = 'TEAM_MEMBERS_EVALUATION_SAVE_TEAM_MEMBER_EVALUATION',
    TEAM_MEMBERS_EVALUATION_GET_TEAM_MEMBERS_OF_SCHEDULED_SCHOOL_VISIT = 'TEAM_MEMBERS_EVALUATION_GET_TEAM_MEMBERS_OF_SCHEDULED_SCHOOL_VISIT',
    TEAM_MEMBERS_EVALUATION_GET_TEAM_MEMBER_EVALUATION_OF_SCHEDULED_SCHOOL_VISIT = 'TEAM_MEMBERS_EVALUATION_GET_TEAM_MEMBER_EVALUATION_OF_SCHEDULED_SCHOOL_VISIT',
    TEAM_MEMBERS_EVALUATION_GET_SCHEDULED_SCHOOL_VISITS = 'TEAM_MEMBERS_EVALUATION_GET_SCHEDULED_SCHOOL_VISITS',

    // Shool management data
    CSEQA_SCHOOL_MANAGEMENT_VIEW = 'CSEQA_SCHOOL_MANAGEMENT_VIEW',
    CSEQA_SCHOOL_MANAGEMENT_VIEW_ALL = 'CSEQA_SCHOOL_MANAGEMENT_VIEW_ALL',
    CSEQA_SCHOOL_EMPLOYEE_VIEW = 'CSEQA_SCHOOL_EMPLOYEE_VIEW',

    // School Scheduling
    SCHOOLS_SCHEDULING_VIEW_LIST = 'SCHOOLS_SCHEDULING_VIEW_LIST',
    SCHOOLS_SCHEDULING_VIEW_APPROVED_LIST = 'SCHOOLS_SCHEDULING_VIEW_APPROVED_LIST',
    SCHOOLS_SCHEDULING_VIEW = 'SCHOOLS_SCHEDULING_VIEW',
    SCHOOLS_SCHEDULING_SUBMIT = 'SCHOOLS_SCHEDULING_SUBMIT',
    SCHOOLS_SCHEDULING_DELETE_DRAFT = 'SCHOOLS_SCHEDULING_DELETE_DRAFT',
    SCHOOLS_SCHEDULING_COMPLETE = 'SCHOOLS_SCHEDULING_COMPLETE',
    SCHOOLS_SCHEDULING_MANAGEMENT = 'SCHOOLS_SCHEDULING_MANAGEMENT',

    /*===============================================================================================================*/



    /*******************************************************************************/
    /******************************* CHEQA PERMISSIONS *****************************/
    /*******************************************************************************/

    // Registration Settings - Center of Higher Education Quality Assurance
    CHEQA_ER_registration_settings_MANAGE = "CHEQA_ER_registration_settings_MANAGE",
    CHEQA_ER_registration_settings_VIEW_ALL = "CHEQA_ER_registration_settings_VIEW_ALL",
    CHEQA_ER_registration_settings_UPDATE = "CHEQA_ER_registration_settings_UPDATE", // its in DB, but it should be removed like CSEQA

    // Management of Standards and Conditions for Accepting ERs in Center of Higher Education Quality Assurance
    CHEQA_ER_Acceptance_CRITERIA_PUBLISH = 'CHEQA_ER_Acceptance_CRITERIA_PUBLISH',
    CHEQA_ER_Acceptance_CRITERIA_VIEW = "CHEQA_ER_Acceptance_CRITERIA_VIEW",
    CHEQA_ER_Acceptance_CRITERIA_MANAGE = "CHEQA_ER_Acceptance_CRITERIA_MANAGE",
    CHEQA_ER_Acceptance_CRITERIA_ADD = "CHEQA_ER_Acceptance_CRITERIA_ADD",
    CHEQA_ER_Acceptance_CRITERIA_UPDATE = "CHEQA_ER_Acceptance_CRITERIA_UPDATE",
    CHEQA_ER_Acceptance_CRITERIA_DELETE = "CHEQA_ER_Acceptance_CRITERIA_DELETE",

    // Requests for Joining as an External Reviewer at Center of Higher Education Quality Assurance
    CHEQA_ER_Registration_Request_VIEW = "CHEQA_ER_Registration_Request_VIEW",
    CHEQA_ER_Registration_Request_VIEW_ALL = "CHEQA_ER_Registration_Request_VIEW_ALL",
    CHEQA_ER_Registration_Request_VIEW_DETAIL = "CHEQA_ER_Registration_Request_VIEW_DETAIL",
    CHEQA_ER_APPROVE_JOIN_REQUEST = "CHEQA_ER_APPROVE_JOIN_REQUEST",
    CHEQA_ER_APPROVE_REJOIN_REQUEST = "CHEQA_ER_APPROVE_REJOIN_REQUEST",
    CHEQA_ER_Registration_Request_CREATE_REQUEST = "CHEQA_ER_Registration_Request_CREATE_REQUEST",

    // Candidates Register as External Reviewers at the Center of Higher Education Quality Assurance
    EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL = "EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_ALL",
    EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_DETAILS = "EXTERNAL_REVIEWERS_CANDIDATES_CHEQA_VIEW_DETAILS",

    // External Reviewers
    CHEQA_ER_NOTIFY = 'CHEQA_ER_NOTIFY',
    CHEQA_ER_APPROVE = 'CHEQA_ER_APPROVE',
    CHEQA_ER_Request_VIEW_ALL = "CHEQA_ER_Request_VIEW_ALL",
    CHEQA_ER_VIEW = "CHEQA_ER_VIEW",
    CHEQA_ER_VIEW_DETAILS = "CHEQA_ER_VIEW_DETAILS",
    CHEQA_ER_SEND_UPDATE_NOTIFICATION = "CHEQA_ER_SEND_UPDATE_NOTIFICATION",
    CHEQA_ER_REMOVE = "CHEQA_ER_REMOVE",

    // External Reviewers Management
    CHEQA_External_reviewers_Request_COMPLETE_TASK = 'CHEQA_External_reviewers_Request_COMPLETE_TASK',
    CHEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST = "CHEQA_External_reviewers_Withdraw_Request_CREATE_REQUEST",
    CHEQA_External_reviewers_Withdraw_Request_COMPLETE_TASK = 'CHEQA_External_reviewers_Withdraw_Request_COMPLETE_TASK',

    // Training Results Registration
    CHEQA_ER_Training_results_Registration_Request_VIEW = "CHEQA_ER_Training_results_Registration_Request_VIEW",
    CHEQA_ER_Training_results_Registration_Request_VIEW_ALL = "CHEQA_ER_Training_results_Registration_Request_VIEW_ALL",
    CHEQA_ER_Training_results_Registration_Request_VIEW_DETAILS = 'CHEQA_ER_Training_results_Registration_Request_VIEW_DETAILS',
    CHEQA_ER_Training_results_Registration_Request_COMPLETE_TASK = "CHEQA_ER_Training_results_Registration_Request_COMPLETE_TASK",
    CHEQA_ER_Training_results_Registration_Request_CREATE_REQUEST = "CHEQA_ER_Training_results_Registration_Request_CREATE_REQUEST",

    // External Reviewers Deletion
    CHEQA_ER_Deletion_Request_COMPLETE_TASK = 'CHEQA_ER_Deletion_Request_COMPLETE_TASK',
    CHEQA_ER_Deletion_Request_CREATE_REQUEST = "CHEQA_ER_Deletion_Request_CREATE_REQUEST",
    CHEQA_ER_Deletion_Request_VIEW_ALL = "CHEQA_ER_Deletion_Request_VIEW_ALL",
    CHEQA_ER_Deletion_Request_VIEW = "CHEQA_ER_Deletion_Request_VIEW",

    // Reports List
    CHEQA_REPORT_LIST_VIEW = "CHEQA_REPORT_LIST_VIEW",
    VIEW_CHEQA_ER_USERS_REPORT = "VIEW_CHEQA_ER_USERS_REPORT", // NOT used in DB

    // Withdrawal Requests
    CHEQA_ER_Withdraw_Request_VIEW_BASIC = "CHEQA_ER_Withdraw_Request_VIEW_BASIC",
    CHEQA_ER_Withdraw_Request_VIEW = "CHEQA_ER_Withdraw_Request_VIEW",
    CHEQA_ER_Withdraw_Request_VIEW_DETAIL = "CHEQA_ER_Withdraw_Request_VIEW_DETAIL",
    CHEQA_ER_Withdraw_Request_INITIAL_APPROVAL = 'CHEQA_ER_Withdraw_Request_INITIAL_APPROVAL',
    CHEQA_ER_Withdraw_Request_FINAL_APPROVAL = 'CHEQA_ER_Withdraw_Request_FINAL_APPROVAL',

    CHEQA_ER_Withdraw_Request_VIEW_ALL = "CHEQA_ER_Withdraw_Request_VIEW_ALL", // NOT used in DB

    /*===============================================================================================================*/


    /*******************************************************************************/
    /******************************* OQF PERMISSIONS *******************************/
    /*******************************************************************************/

    // Registration Settings - Directorate General of the National Qualifications Framework
    OQF_ER_registration_settings_MANAGE = "OQF_ER_registration_settings_MANAGE",
    OQF_ER_registration_settings_VIEW_ALL = "OQF_ER_registration_settings_VIEW_ALL",
    OQF_ER_registration_settings_UPDATE = "OQF_ER_registration_settings_UPDATE",

    // Management of Standards and Conditions for Accepting ERs in Directorate General of the National Qualifications Framework
    OQF_ER_Acceptance_CRITERIA_VIEW = "OQF_ER_Acceptance_CRITERIA_VIEW",
    OQF_ER_Acceptance_CRITERIA_MANAGE = "OQF_ER_Acceptance_CRITERIA_MANAGE",
    OQF_ER_Acceptance_CRITERIA_ADD = "OQF_ER_Acceptance_CRITERIA_ADD",
    OQF_ER_Acceptance_CRITERIA_UPDATE = "OQF_ER_Acceptance_CRITERIA_UPDATE",
    OQF_ER_Acceptance_CRITERIA_DELETE = "OQF_ER_Acceptance_CRITERIA_DELETE",
    OQF_ER_Acceptance_CRITERIA_PUBLISH = 'OQF_ER_Acceptance_CRITERIA_PUBLISH',

    // Requests for Joining as an External Reviewer at Directorate General of the National Qualifications Framework
    OQF_ER_APPROVE_JOIN_REQUEST = 'OQF_ER_APPROVE_JOIN_REQUEST',
    OQF_ER_APPROVE_REJOIN_REQUEST = 'OQF_ER_APPROVE_REJOIN_REQUEST',
    OQF_ER_Registration_Request_CREATE_REQUEST = 'OQF_ER_Registration_Request_CREATE_REQUEST',
    OQF_ER_Registration_Request_VIEW_ALL = "OQF_ER_Registration_Request_VIEW_ALL",
    OQF_ER_Registration_Request_VIEW = "OQF_ER_Registration_Request_VIEW",
    OQF_ER_Registration_Request_VIEW_DETAIL = "OQF_ER_Registration_Request_VIEW_DETAIL",

    // Candidates Register as External Reviewers at the Directorate General of the National Qualifications Framework
    EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_ALL = 'EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_ALL',
    EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_DETAILS = 'EXTERNAL_REVIEWERS_CANDIDATES_OQF_VIEW_DETAILS',

    // External Reviewers
    OQF_ER_NOTIFY = 'OQF_ER_NOTIFY',
    OQF_ER_APPROVE = 'OQF_ER_APPROVE',
    OQF_ER_Request_VIEW_ALL = "OQF_ER_Request_VIEW_ALL",
    OQF_ER_VIEW = "OQF_ER_VIEW",
    OQF_ER_VIEW_DETAILS = "OQF_ER_VIEW_DETAILS",
    OQF_ER_SEND_UPDATE_NOTIFICATION = "OQF_ER_SEND_UPDATE_NOTIFICATION",
    OQF_ER_REMOVE = "OQF_ER_REMOVE",

    // External Reviewers Management
    OQF_External_reviewers_Request_COMPLETE_TASK = 'OQF_External_reviewers_Request_COMPLETE_TASK',
    OQF_External_reviewers_Withdraw_Request_CREATE_REQUEST = "OQF_External_reviewers_Withdraw_Request_CREATE_REQUEST",
    OQF_External_reviewers_Withdraw_Request_COMPLETE_TASK = 'OQF_External_reviewers_Withdraw_Request_COMPLETE_TASK',

    // Training Results Registration
    OQF_ER_Training_results_Registration_Request_VIEW = "OQF_ER_Training_results_Registration_Request_VIEW",
    OQF_ER_Training_results_Registration_Request_COMPLETE_TASK = "OQF_ER_Training_results_Registration_Request_COMPLETE_TASK",
    OQF_ER_Training_results_Registration_Request_CREATE_REQUEST = "OQF_ER_Training_results_Registration_Request_CREATE_REQUEST",
    OQF_ER_Training_results_Registration_Request_VIEW_ALL = 'OQF_ER_Training_results_Registration_Request_VIEW_ALL',
    OQF_ER_Training_results_Registration_Request_VIEW_DETAILS = 'OQF_ER_Training_results_Registration_Request_VIEW_DETAILS',

    // External Reviewers Deletion
    OQF_ER_Deletion_Request_COMPLETE_TASK = 'OQF_ER_Deletion_Request_COMPLETE_TASK',
    OQF_ER_Deletion_Request_CREATE_REQUEST = "OQF_ER_Deletion_Request_CREATE_REQUEST",
    OQF_ER_Deletion_Request_VIEW_ALL = "OQF_ER_Deletion_Request_VIEW_ALL",
    OQF_ER_Deletion_Request_VIEW = "OQF_ER_Deletion_Request_VIEW",

    // Reports List
    OQF_REPORT_LIST_VIEW = "OQF_REPORT_LIST_VIEW",
    VIEW_OQF_ER_USERS_REPORT = "VIEW_OQF_ER_USERS_REPORT", // NOT used in DB

    // Withdrawal Requests
    OQF_ER_Withdraw_Request_VIEW = "OQF_ER_Withdraw_Request_VIEW",
    OQF_ER_Withdraw_Request_VIEW_ALL = "OQF_ER_Withdraw_Request_VIEW_ALL",
    OQF_ER_Withdraw_Request_VIEW_DETAIL = "OQF_ER_Withdraw_Request_VIEW_DETAIL",
    OQF_ER_Withdraw_Request_INITIAL_APPROVAL = "OQF_ER_Withdraw_Request_INITIAL_APPROVAL",
    OQF_ER_Withdraw_Request_FINAL_APPROVAL = "OQF_ER_Withdraw_Request_FINAL_APPROVAL",

    /*===============================================================================================================*/

}
