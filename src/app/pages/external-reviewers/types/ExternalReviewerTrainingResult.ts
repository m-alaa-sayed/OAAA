import { ExternalReviewersRegistrationRequestInfo } from "./external-reviewers-registration-request-info";

export interface ExternalReviewerTrainingResult {

    id?: number;
    requestId?: number;
    request?:Request;
    externalReviewersRegistrationRequestInfo ?: ExternalReviewersRegistrationRequestInfo;
    externalReviewersRegistrationRequestInfoId?: number;
    trainingStatus?: string;
    trainingNotes?: string;
    trainingResultBucketName?: string;
    trainingResultFileName?: string;
    gmTrainingStatus?: string;
    justification?: string;
}