import { LkStandard } from "./lk-standard";
import { VisitReportDomainEvaluation } from "./visit-report-domain-evaluation";

export interface VisitReportStandardEvaluation {
  id?: number;
  standardId?: number;
  professionalJudgment?: number;
  systemJudgment ?: number;
  judgmentChangeJustification?: string;
  createdOn?: string; // LocalDateTime → ISO string
  updatedOn?: string; // LocalDateTime → ISO string
  lkStandard: LkStandard;
}

