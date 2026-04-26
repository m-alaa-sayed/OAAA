import { RequestAttachment } from "src/app/shared/types/request-attachment";
import { ExternalReviewerDeletion } from "./ExternalReviewerDeletion";

export interface ExternalReviewerDeletionCreate {
    externalReviewerDeletionDtoList?: ExternalReviewerDeletion[];
    requestNotes?: string;
    requestAttachmentList?: RequestAttachment[];
}