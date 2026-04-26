import { LkStandard } from "./lk-standard";

export interface DomainSummaryEvaluation {
  id?: number;

  standardId?: number;

  standard?: LkStandard;

  judgment?: number;
}
