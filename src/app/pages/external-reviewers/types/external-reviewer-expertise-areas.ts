import { BroadField } from "./broad-field";
import { NarrowField } from "./narrow-field";

export interface ExternalReviewerExpertiseAreas {
    id?: number;
    narrowField?: NarrowField;
    narrowFieldId?: number;
    notes?: string;
    boardFieldId?: number;
    boardField?: BroadField;
    otherNarrowFieldEn?: string;
    otherNarrowFieldAr?: string;
    // private ExternalReviewersRegistrationRequestInfoDto externalReviewersRegistrationRequestInfo;
}