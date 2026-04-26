import { LkStandard } from "./lk-standard";
import { VisitFormEvaluationComment } from "./visit-form-evaluation-comment";

export interface VisitFormDomainEvaluation {
  id?: number;
  judgment?: number;
  notes?: string;
  standard?: LkStandard;
  standardId?: number;
  needsUpdate?: boolean;
  visitFormEvaluationComments: VisitFormEvaluationComment[];
}