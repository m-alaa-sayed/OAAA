import { Request } from "src/app/shared/types/request";
import { ExternalReviewerTrainingResult } from "./ExternalReviewerTrainingResult";

export interface ExternalReviewerTrainingResultRequest extends Request{
    externalReviewersRegistrationRequestInfo: any;
    externalReviewerTrainingResultList: ExternalReviewerTrainingResult[];
}