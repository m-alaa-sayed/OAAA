import {SchoolSchedulingRequestInfo} from "./school-scheduling-request-info";
import {School} from "./school";

export interface SchoolDocumentDeliveryVisitInfo {
    id: number;
    schoolSchedulingRequestInfo: SchoolSchedulingRequestInfo;
    selfEvaluationDocumentNumber: string | null;
    planNumber: string;
    visitNumber: string;
    school: School;
    assignmentStatus: string;
    suggestedTeamSize: number;
    suggestedVisitDuration: number;
    visitFrom: string;
    visitTo: string;
    budgetRial: number;
    visitStatus: string;
}