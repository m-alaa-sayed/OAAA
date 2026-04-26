import { VisitReportSubmissionRequestInfo } from "./visit-report-submission-request-info";

export interface VisitReportComment {
    id?: number;
    comment?: string;
    section?: string;
    createdBy?: number;
    createdOn?: string; // LocalDateTime → ISO string
    visitReportSubmissionRequestInfo?: VisitReportSubmissionRequestInfo;
    parentComment?: VisitReportComment;
    replies?: VisitReportComment[];
}