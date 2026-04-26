import { OaaaServiceConditionsDto } from "./oaaa-service-conditions-dto";
import { OaaaServiceExecutionStepDto } from "./oaaa-service-execution-step-dto";
import { OaaaServiceRequiredDocumentsDto } from "./oaaa-service-required-documents-dto";

export interface OaaaServiceDto {
     id?: number;
     serviceCode?: string;
     serviceNameAr?: string;
     serviceNameEn?: string;
     serviceDescriptionAr?: string;
     serviceDescriptionEn?: string;
     displayInCatalogue?: number;
     displayInHome?: number;
     serviceDisplayOrder?: number;
     conditionsAr?: string;
     conditionsEn?: string;
     feesDescAr?: string;
     feesDescEn?: string;
     serviceSlaAr?: string;
     serviceSlaEn?: string;
     customerServiceNumber?: string;
     status?: boolean;
     userManualUrl?: string;
     userManualFileBucketName: string;
     userManualFileObjectName: string;
     showUserManual?: boolean;
     // External Reviewer Policy fields
     erPolicyUrl?: string;
     externalReviewerPolicyArabicBucketName: string;
     externalReviewerPolicyArabicFileName: string;
     externalReviewerPolicyEnglishBucketName: string;
     externalReviewerPolicyEnglishFileName: string;

     serviceCategoryId?: number;
     externalService?: boolean;  // service type
     applyStatus?: true;  // submission status
     displayStatus?: true;
     categoryNameAr?: string;
     categoryNameEn?: string;
     oaaaServiceExecutionSteps: OaaaServiceExecutionStepDto[];
     oaaaServiceConditions: OaaaServiceConditionsDto[];
     oaaaServiceRequiredDocuments: OaaaServiceRequiredDocumentsDto[];
     createdBy?: number;
     createdOn?: Date;
     updatedBy?: string;
     updatedOn?: Date;
     customerServiceWorkingTimeAr ?: string;
     customerServiceWorkingTimeEn ?: string;
}