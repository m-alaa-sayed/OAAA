export interface SummaryVisitReportRequestsOverview {
    id?: number;
    requestId?: number;
    selfEvaluationDocumentNumber?: string;
    scheduledSchoolVisitId?: number;
    schoolCode?: string;
    schoolNameAr?: string;
    schoolNameEn?: string;
    schoolType?: string;
    schoolGovernorateAr?: string;
    schoolGovernorateEn?: string;
    wilayatAr?: string;
    wilayatEn?: string;
    numberOfStudents?: number;
    studentsGender?: string;
    grades?: string[];
    visitNumber?: string;
    reportNumber?: string;
    reportSubmissionDate?: string; // ISO format string
    performanceLevel?: string;
    reportStatus?: string;
    summaryReportNumber?: string;
}