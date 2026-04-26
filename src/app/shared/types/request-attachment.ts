import { User } from "src/app/core/models/auth.models";

export interface RequestAttachment {
    id?: number;
    requestId?: number;
    fileNameAr?: string;
    fileNameEn?: string;
    fileBucketName?: string;
    fileName?: string;
    isDeleted?: boolean;
    notes?: string;
    user?: User;
}