import { RequestAttachment } from "src/app/shared/types/request-attachment";
import { ExternalReviewerTrainingResult } from "./ExternalReviewerTrainingResult";

export interface ExternalReviewerTrainingResultCreate {
    externalReviewerTrainingResultDtoList?: ExternalReviewerTrainingResult[];
    requestNotes?: string;
    requestAttachmentList?: RequestAttachment[];
}