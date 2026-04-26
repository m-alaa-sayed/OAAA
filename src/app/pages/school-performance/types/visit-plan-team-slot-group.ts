import { User } from "src/app/core/models/auth.models";
import { VisitPlanMemberTask } from "./visit-plan-member-task";

export interface VisitPlanTeamSlotGroup {
  user?: User;
  task?: VisitPlanMemberTask;
}