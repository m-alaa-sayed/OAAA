import { VisitDomain } from "src/app/core/enum/visit-domain";
import { VisitReportSubmissionRequestInfo } from "./visit-report-submission-request-info";
import { VisitReportStandardEvaluation } from "./visit-report-standard-evaluation";

export interface VisitReportDomainEvaluation {
  id?: number;
  domain?: VisitDomain;
  professionalJudgment?: any;
  systemJudgment?: number;
  strengthsAnalysis?: string;
  improvementsAnalysis?: string;
  domainSummary?: string;
  schoolComments?: string;
  evaluationDimension?: string;
  visitReportSubmissionRequestInfo?: VisitReportSubmissionRequestInfo;
  standardEvaluations?: VisitReportStandardEvaluation[];

}
