import { ServiceStep } from "src/app/shared/types/service-step";

export interface RequestDto {
    id?: number;
    requestDate?: string; // ISO format date (e.g. '2025-04-23')
    applicantUserId?: number;
    serviceId?: number;
    applicationNo?: string;
    serviceStepId?: number;
    notes?: string;
    serviceStep? : ServiceStep;
  
    // From OaaaService
    serviceCode?: string;
    serviceNameAr?: string;
    serviceNameEn?: string;
  
    // From ServiceStep
    serviceStepCode?: string;
    serviceStepNameAr?: string;
    serviceStepNameEn?: string;
  }
  