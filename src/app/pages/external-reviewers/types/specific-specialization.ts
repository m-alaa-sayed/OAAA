import { GeneralSpecialization } from "./general-specialization";

export interface SpecificSpecialization {

    id?: number;
    code?: string;
    nameEn?: string;
    nameAr?: string;
    generalSpecializationId?: number;
    generalSpecialization?: GeneralSpecialization;
}