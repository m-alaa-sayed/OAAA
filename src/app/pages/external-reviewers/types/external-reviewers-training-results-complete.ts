import { ExternalReviewerTrainingResultRequest } from "./external-reviewer-training-result-request";

export interface ExternalReviewersTrainingResultsComplete {

    externalReviewerTrainingResultRequestDto?: ExternalReviewerTrainingResultRequest;
    action?: string;
    comment?: string;
    taskId?: string;
}