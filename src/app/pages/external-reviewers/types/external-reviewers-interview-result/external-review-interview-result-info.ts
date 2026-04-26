import {RequestUser} from "../../../../core/models/request-user";

export interface ExternalReviewInterviewResultInfo {
    id?: number;
    externalReviewerRegistrationRequestInfoId?: number;
    interviewStatus?: string;
    interviewNotes?: string;
    interviewResultBucketName?: string;
    interviewResultFileName?: string;
}