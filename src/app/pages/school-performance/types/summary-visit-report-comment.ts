export interface SummaryVisitReportComment {
    id?: number;
    comment?: string;
    section?: string;
    createdBy?: number;
    createdOn?: string; // ISO datetime string (e.g., '2025-08-05T14:30:00')
}