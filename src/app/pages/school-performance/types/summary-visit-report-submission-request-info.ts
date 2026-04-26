import { User } from "src/app/core/models/auth.models";
import { ScheduledSchoolVisit } from "./scheduled-school-visit";
import { Request } from "src/app/shared/types/request";
import { SummaryVisitReportDomainEvaluation } from "./summary-visit-report-domain-evaluation";
import { SummaryVisitReportComment } from "./summary-visit-report-comment";
import { SchoolInfo } from "./school-info";

export interface SummaryVisitReportSubmissionRequestInfo {

    id?: number;
    scheduledSchoolVisitId?: number;
    scheduledSchoolVisit?: ScheduledSchoolVisit;
    user?: User;
    status?: string; // You may need to define this as an enum or string
    otherUpdates?: string;
    overallProfessionalJudgment?: number;
    strengthsAnalysis?: string;
    improvementsAnalysis?: string;
    recommendations?: string;
    requestId?: number;
    request?: Request;

    visitReportApplicationNo?: string;
    summary?: string;
    summaryVisitReportComments?: SummaryVisitReportComment[];
    summaryVisitReportDomainEvaluations?: SummaryVisitReportDomainEvaluation[];

    editableSchoolInfo: SchoolInfo;


}