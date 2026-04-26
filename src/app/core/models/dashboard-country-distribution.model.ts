export interface DashboardCountryDistributionItem {
  countryNameEn: string;
  countryNameAr: string;
  count: number;
}

export interface DashboardCountryDistributionResponse {
  rows: DashboardCountryDistributionItem[];
  totalCount: number;
}
