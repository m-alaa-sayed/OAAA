import {CriterionItem} from "./criterion-item";

export interface CriterionSubCriteria {
    id?: number;
    criterionId?: number;
    nameEn: string;
    nameAr: string;
    status: string;
    items: CriterionItem[];
}