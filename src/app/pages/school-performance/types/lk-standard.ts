import { LkIndicator } from "./lk-indicator";

export interface LkStandard {
  id?: number;
  domain?: string;
  code?: string;
  titleAr?: string;
  titleEn?: string;
  order?: number;
  indicators: LkIndicator[];
}