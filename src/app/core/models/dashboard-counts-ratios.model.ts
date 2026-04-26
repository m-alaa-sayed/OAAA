export interface DashboardCountRatioValue {
  count: number;
  percentage: number;
}

export interface DashboardLocalCountsRatios {
  omani: DashboardCountRatioValue;
  nonOmani: DashboardCountRatioValue;
  total: DashboardCountRatioValue;
}

export interface DashboardInternationalCountsRatios {
  region1: DashboardCountRatioValue;
  region2: DashboardCountRatioValue;
  region3: DashboardCountRatioValue;
  total: DashboardCountRatioValue;
}

export interface DashboardCountsRatiosResponse {
  local: DashboardLocalCountsRatios;
  international: DashboardInternationalCountsRatios;
  grandTotal: DashboardCountRatioValue;
}
