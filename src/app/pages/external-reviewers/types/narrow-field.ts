import { BroadField } from "./broad-field";

export interface NarrowField {
    id?: number;
    code?: string;
    nameEn?: string;
    nameAr?: string;
    broadFieldId?: number;
    broadField?: BroadField
}