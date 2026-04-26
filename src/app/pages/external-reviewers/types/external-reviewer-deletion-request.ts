import { Request } from "src/app/shared/types/request";
import { ExternalReviewerDeletion } from "./ExternalReviewerDeletion";

export interface ExternalReviewerDeletionRequest extends Request{

    externalReviewerDeletionList: ExternalReviewerDeletion[];
}