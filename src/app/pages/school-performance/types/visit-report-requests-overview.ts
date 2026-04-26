export interface VisitReportRequestsOverview {
    id: number;
    requestId: number;
    selfEvaluationDocumentNumber: string;
    scheduledSchoolVisitId: number | null;
    schoolCode: string;
    schoolNameAr: string;
    schoolNameEn: string;
    schoolType: string;
    schoolGovernorateAr: string;
    schoolGovernorateEn: string;
    wilayatAr: string;
    wilayatEn: string;
    numberOfStudents: number;
    studentsGender: string;
    grades: string[];
    visitNumber: string;
    planNumber: string;
    reportNumber: string;
    summaryApplicationNumber: string;
    reportSubmissionDate: string; // ISO date string (e.g., '2025-07-23')
    reporterNameAr: string;
    reporterNameEn: string;
    performanceLevel: string;
    reportStatus: string;
    visitStatus: string;
    visitFrom: string; // ISO date string
    visitTo: string;   // ISO date string
}