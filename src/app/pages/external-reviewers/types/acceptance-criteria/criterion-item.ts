import {CriterionItemOption} from "./criterion-item-option";

export interface CriterionItem {
    id ?: number;
    criterionId?: number;
    subCriteriaId?: number;
    nameEn: string;
    nameAr: string;
    status: string;
    required: boolean;
    type: string;
    maxScore?: number | null;
    options: CriterionItemOption[];

    //transient 
    currentValue ?:number;
    currentOptionId ?: number;
    currentNote ?: string;
}