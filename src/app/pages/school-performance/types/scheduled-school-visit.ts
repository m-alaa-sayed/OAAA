import {School} from "./school";
import {SchoolSchedulingRequestInfo} from "./school-scheduling-request-info";

export interface ScheduledSchoolVisit {
    id?: number;
    schoolSchedulingRequestInfo?: SchoolSchedulingRequestInfo;
    school?: School;
    assignmentStatus?: string;
    visitNumber?: string;
    planNumber?: string;
    selfEvaluationDocumentNumber?: string;
    selfEvaluationDocumentSubmissionDate?: string;
    suggestedTeamSize?: number;
    suggestedVisitDuration?: number;
    visitFrom?: string;
    visitTo?: string;
    budgetRial?: number;
    visitStatus?: string;
    teamLeaderInfo?: TeamLeaderInfo;
}

export interface TeamLeaderInfo {
    id?: number;
    fullNameAr?: string;
    fullNameEn?: string;
}