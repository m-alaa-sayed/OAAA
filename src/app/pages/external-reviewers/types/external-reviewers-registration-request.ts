import { Request } from "src/app/shared/types/request";
import { ExternalReviewersRegistrationRequestInfo } from "./external-reviewers-registration-request-info";

export interface ExternalReviewersRegistrationRequest extends Request{
    externalReviewersRegistrationRequestInfo?: ExternalReviewersRegistrationRequestInfo;

}