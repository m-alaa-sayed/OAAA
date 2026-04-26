import { VisitReportSubmissionRequestInfo } from "./visit-report-submission-request-info";

export interface VisitReportCompletionRequest {
    visitReportSubmissionRequestInfoDto?: VisitReportSubmissionRequestInfo;
    action?: string;
    comment?: string;
    taskId?: string;
}