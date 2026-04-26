import { ExternalReviewerAttachments } from "./external-reviewer-attachments";

export interface ExternalReviewersWithdrawalRequestInfo {

    id?: number;
    userId?: number;
    requestId?: number;
    externalReviewerId?: number;
    module?: string;
    withdrawJustification:string;
    dataManagementEmployerRecommendation:string;
    dataManagementEmployerRecommendationNotes:string;
    supportDepartmentManagerRecommendation:string;
    supportDepartmentManagerRecommendationNotes:string;
    externalReviewWithdrawAttachments:ExternalReviewerAttachments[];
    serviceCode:string;

}