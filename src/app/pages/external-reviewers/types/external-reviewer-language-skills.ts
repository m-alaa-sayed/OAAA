import { SystemLookupDto } from "src/app/core/models/system-lookup-dto";

export interface ExternalReviewerLanguageSkills {

    id?: number;
    languageId?: number;
    language ?: SystemLookupDto;
    proficiencyScore?: number;
    // private ExternalReviewersRegistrationRequestInfoDto externalReviewersRegistrationRequestInfo;
}