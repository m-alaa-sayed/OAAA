import {RequestUser} from "../../../../core/models/request-user";
import {ExternalReviewInterviewResultInfo} from "./external-review-interview-result-info";

export interface ExternalReviewersInterviewRegistrationInfo {
    externalReviewerRegistrationRequestInfoId?: number;
    userId?: number;
    user?: RequestUser;
    mainSpecializationAr: string;
    mainSpecializationEn: string;
    requestType: string;
    registrationStatus: string;
    externalReviewInterviewResult: ExternalReviewInterviewResultInfo;
}