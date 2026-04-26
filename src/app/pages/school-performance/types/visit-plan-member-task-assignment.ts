import { VisitPlanMemberTask } from "./visit-plan-member-task";

export interface VisitPlanMemberTaskAssignment {
    id ?: number | null;
    visitLeaderPlanRequestInfoId ?: number | null;
    reviewTeamAssignmentRequestInfoId ?: number;
    taskAssignmentDate ?: string; // ISO string format (e.g., '2025-07-13')
    memberTasks ?: VisitPlanMemberTask[];
    memberNameAr?: string;
    memberNameEn?: string;
    role?: string;

}