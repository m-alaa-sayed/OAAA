export interface DashboardSpecializationDistributionItem {
  code: string;
  nameEn: string;
  nameAr: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  intlR1: number;
  intlR2: number;
  intlR3: number;
  intlTotal: number;
  grandTotal: number;
}

export interface DashboardSpecializationTotals {
  omani: number;
  nonOmani: number;
  localTotal: number;
  intlR1: number;
  intlR2: number;
  intlR3: number;
  intlTotal: number;
  grandTotal: number;
}

export interface DashboardSpecializationDistributionResponse {
  rows: DashboardSpecializationDistributionItem[];
  totals: DashboardSpecializationTotals;
}
