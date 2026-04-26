import { User } from "src/app/core/models/auth.models";

export interface ReviewTeamAssignmentRequestInfo {
  id?: number;
  scheduledSchoolVisitId: number;
  userId?: number;
  user?: User;
  assignmentStatus?: string;
  participationStatus?: string;
  role?: string;
  hasConflict?: boolean;
  conflictReason?: string;
}