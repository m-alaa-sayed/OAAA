import { VisitReportSubmissionRequestInfo } from "./visit-report-submission-request-info";

export interface VisitReportRequest {
  action: string;
  reportSubmissionRequestInfoDto: VisitReportSubmissionRequestInfo;
}