import { CriterionSubCriteria } from "./criterion-sub-criteria";

export interface CriterionVersion {
    id?: number;
    criterionId?: number;
    version?: number;
    nameEn: string;
    nameAr: string;
    status: string;
    versionNotes: string;
    subCriteriaList: CriterionSubCriteria[];
    isPublished: boolean;

    //-- transient
    totalRequiredScore?: number;
}