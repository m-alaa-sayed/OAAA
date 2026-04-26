import { SummaryVisitReportSubmissionRequestInfo } from "./summary-visit-report-submission-request-info";

export interface SummaryVisitReportCompletionRequest {

    summaryVisitReportSubmissionRequestInfoDto?: SummaryVisitReportSubmissionRequestInfo;
    action?: string;
    comment?: string;
    taskId?: string;
}