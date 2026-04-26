import { User } from "src/app/core/models/auth.models";
import { RequestDto } from "../../user-tasks/model/request-dto";
import { ScheduledSchoolVisit } from "./scheduled-school-visit";
import { VisitPlanConflictOfInterest } from "./visit-plan-conflict-of-interest";
import { VisitPlanLeaderAnalyses } from "./visit-plan-leader-analyses";
import { VisitPlanDomainResponsibility } from "./visit-plan-domain-responsibility";
import { VisitPlanMemberTaskAssignment } from "./visit-plan-member-task-assignment";
import { ReviewTeamAssignmentRequestInfo } from "./review-team-assignment-request-info";
import { VisitPlanTeamSlotGroup } from "./visit-plan-team-slot-group";
import { SchoolInfo } from "./school-info";

export interface VisitPlanRequestInfo {
  createdOn?: string; // ISO string, from LocalDateTime
  id?: number;
  requestId?: number;
  request?: RequestDto;
  scheduledSchoolVisitId?: number;
  scheduledSchoolVisit?: ScheduledSchoolVisit;
  preliminaryVisitPeriodFrom?: string; // ISO string, from LocalDate
  preliminaryVisitPeriodTo?: string;   // ISO string, from LocalDate
  status?: string;
  domainResponsibilities?: VisitPlanDomainResponsibility[];
  taskAssignments?: VisitPlanMemberTaskAssignment[];
  reviewTeamAssignments?: ReviewTeamAssignmentRequestInfo[];
  leaderAnalyses?: VisitPlanLeaderAnalyses;
  user?: User;
  slotGroups: Record<string, VisitPlanTeamSlotGroup[]>;

  editableSchoolInfo ?: SchoolInfo;
}