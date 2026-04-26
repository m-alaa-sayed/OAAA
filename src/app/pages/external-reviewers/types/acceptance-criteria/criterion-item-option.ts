export interface CriterionItemOption {
    id?: number;
    nameEn: string;
    nameAr: string;
    score?: number;
    // Used to toggle inline edit mode
    editable?: boolean;
    // Used to store original data before editing
    _backup?: CriterionItemOption;
}