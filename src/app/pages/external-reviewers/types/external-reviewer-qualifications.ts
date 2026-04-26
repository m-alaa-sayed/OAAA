import { SystemLookupDto } from "src/app/core/models/system-lookup-dto";
import { SpecificSpecialization } from "./specific-specialization";
import { CseqaGeneralSpecialization } from "./cseqa-general-specialization";
import { CseqaSpecificSpecialization } from "./cseqa-specific-specialization";
import { GeneralSpecialization } from "./general-specialization";

export interface ExternalReviewerQualifications {
    id?: number;
    // private SystemLookupDto degreeObtained;
    degreeObtainedId?: number;
    graduationYear?: number;
    institution?: SystemLookupDto;
    institutionId?: number;
    otherInstitutionName?: string;
    specificSpecialization?: SpecificSpecialization;
    specificSpecializationId?: number;
    // private ExternalReviewersRegistrationRequestInfoDto externalReviewersRegistrationRequestInfo;
    otherGeneralSpecialization?: string;
    otherSpecificSpecialization?: string;

    cseqaGeneralSpecialization?: CseqaGeneralSpecialization;
    cseqaGeneralSpecializationId?: number;
    cseqaSpecificSpecialization?: CseqaSpecificSpecialization;
    cseqaSpecificSpecializationId?: number;
    otherCseqaGeneralSpecialization?: string;
    otherCseqaSpecificSpecialization?: string;

    generalSpecialization?: GeneralSpecialization;
    generalSpecializationId?: number;
}