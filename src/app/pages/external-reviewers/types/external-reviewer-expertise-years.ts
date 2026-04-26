import { SystemLookupDto } from "src/app/core/models/system-lookup-dto";

export interface ExternalReviewerExpertiseYears {

    id ?: number;
    employeeId?: number;
    employee?: SystemLookupDto;
    externalReviewersRegistrationRequestInfoId?: number;
    academicYearFrom?: Date; // Use ISO date string (e.g., '2023-09-01')
    academicYearTo?: Date;
    duration?: number;
}