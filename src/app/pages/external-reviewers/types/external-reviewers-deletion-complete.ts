import { ExternalReviewerDeletionRequest } from "./external-reviewer-deletion-request";
import { ExternalReviewerTrainingResultRequest } from "./external-reviewer-training-result-request";

export interface ExternalReviewersDeletionComplete {

    externalReviewerDeletionRequestDto?: ExternalReviewerDeletionRequest;
    action?: string;
    comment?: string;
    taskId?: string;
}