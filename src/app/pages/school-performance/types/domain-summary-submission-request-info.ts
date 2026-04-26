import { RequestDto } from "../../user-tasks/model/request-dto";
import { DomainSummaryEvaluation } from "./domain-summary-evaluation";
import { ScheduledSchoolVisit } from "./scheduled-school-visit";


export class DomainSummarySubmissionRequestInfo {
  id?: number;

  requestId?: number;

  request?: RequestDto;

  scheduledSchoolVisitId?: number; 

  scheduledSchoolVisit?: ScheduledSchoolVisit;

  domain?: string; 

  status?: string;

  judgment?: number;

  strengthsAnalysis?: string = ''; 

  improvementsAnalysis?: string = ''; 

  domainSummary?: string = ''; 

  domainSummaryEvaluations?: DomainSummaryEvaluation[];
}





