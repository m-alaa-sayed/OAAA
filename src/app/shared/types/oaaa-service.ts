import { OaaaServiceConditionsDto } from "src/app/pages/service-management/types/oaaa-service-conditions-dto";
import { OaaaServiceExecutionStepDto } from "src/app/pages/service-management/types/oaaa-service-execution-step-dto";
import { OaaaServiceRequiredDocumentsDto } from "src/app/pages/service-management/types/oaaa-service-required-documents-dto";


export interface OaaaService {
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
     serviceCategoryId?: number;
     externalService?: boolean;  // service type
     applyStatus?: true;  // submission status
     displayStatus?: true;
     categoryNameAr?: string;
     categoryNameEn?: string;
     module?: string;
     oaaaServiceExecutionSteps: OaaaServiceExecutionStepDto[];
     oaaaServiceConditions: OaaaServiceConditionsDto[];
     oaaaServiceRequiredDocuments: OaaaServiceRequiredDocumentsDto[];
     createdBy?: number;
     createdOn?: Date;
     updatedBy?: string;
     updatedOn?: Date;
     customerServiceWorkingTimeAr?: string;
     customerServiceWorkingTimeEn?: string;
}