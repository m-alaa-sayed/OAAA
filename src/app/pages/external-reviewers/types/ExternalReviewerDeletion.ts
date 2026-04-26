import { ExternalReviewer } from "./external-reviewer";
import { ExternalReviewersRegistrationRequestInfo } from "./external-reviewers-registration-request-info";

export interface ExternalReviewerDeletion {

    id?: number;
    requestId?: number;
    request?:Request;
    externalReviewer?: any;
    externalReviewerId?: number;
    deletionStatus?: string | null;
    deletionNotes?: string;
}