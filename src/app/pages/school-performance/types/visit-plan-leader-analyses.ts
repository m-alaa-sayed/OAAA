import { User } from "src/app/core/models/auth.models";
import { VisitPlanRequestInfo } from "./visit-plan-request-info";

export interface VisitPlanLeaderAnalyses {
  createdBy?: number;
  createdOn?: string; 
  updatedBy?: number;
  updatedOn?: string;
  id?: number;
  visitLeaderPlanRequestInfoId?: number;
  briefAboutSchool?: string;
  basedOnSchoolStatement?: string;
  followUpPriorities?: string;
  additionalEvidence?: string;
  generalNotes?: string;
  user?: User;
  visitPlanRequestInfo?: VisitPlanRequestInfo;
}