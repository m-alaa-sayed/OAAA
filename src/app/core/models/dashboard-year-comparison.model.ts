export type DashboardComparisonType = 'LOCAL' | 'INTERNATIONAL';

export type DashboardComparisonDetail =
  | 'OMANI'
  | 'NON_OMANI'
  | 'REGION_1'
  | 'REGION_2'
  | 'REGION_3';

export interface DashboardYearComparisonItem {
  type: DashboardComparisonType;
  detail: DashboardComparisonDetail;
  previousYearCount: number;
  currentYearCount: number;
  difference: number;
  differencePercentage: number | null;
}

export interface DashboardYearComparisonResponse {
  rows: DashboardYearComparisonItem[];
}
