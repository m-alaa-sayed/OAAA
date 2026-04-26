import { VisitPlanRequestInfo } from "./visit-plan-request-info";

export interface VisitPlanProcessCompletionRequest {

    visitPlanRequestInfoDto?: VisitPlanRequestInfo;
    action?: string;
    comment?: string;
    taskId?: string;
}