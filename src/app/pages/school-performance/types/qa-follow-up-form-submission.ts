import { User } from "src/app/store/Authentication/auth.models";
import { ScheduledSchoolVisit } from "./scheduled-school-visit";
import { PreVisitFollowUpScores } from "./pre-visit-follow-up-scores";
import { DuringVisitFollowUpScores } from "./during-visit-follow-up-scores";
import { SchoolPreparednessScores } from "./school-preparedness-scores";
import { TeamEvaluationScores } from "./team-evaluation-scores";
import { TeamLeaderEvaluationScores } from "./team-leader-evaluation-scores";
import { VisitReportEvaluationScores } from "./visit-report-evaluation-scores";
import { QaFollowUpFormComment } from "./qa-follow-up-form-comment";

export interface QaFollowUpFormSubmission {
  id: number;
  applicationNumber:string;
  scheduledSchoolVisitId: number;
  scheduledSchoolVisit?: ScheduledSchoolVisit;
  status?: string;
  qaReviewTeamFeedback: string;
  preVisitFollowUpScores?: PreVisitFollowUpScores;
  duringVisitFollowUpScores?: DuringVisitFollowUpScores;
  schoolPreparednessScores?: SchoolPreparednessScores;
  teamEvaluationScores?: TeamEvaluationScores;
  teamLeaderEvaluationScores?: TeamLeaderEvaluationScores;
  visitReportEvaluationScores?: VisitReportEvaluationScores;
  qaFollowUpFormComments: QaFollowUpFormComment[];
  createdBy?: number;
  user?: User;
  createdOn?: string; 
  updatedBy?: number;
  updatedOn?: string; 
}
