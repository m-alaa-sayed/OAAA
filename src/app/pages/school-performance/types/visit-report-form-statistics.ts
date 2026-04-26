import { VisitReportSubmissionRequestInfo } from "./visit-report-submission-request-info";

export interface VisitReportFormStatistics {
  id?: number;
  type?: string;
  subject?: string;
  activityType?: string;
  count?: number;
  visitReportSubmissionRequestInfo?: VisitReportSubmissionRequestInfo;
}