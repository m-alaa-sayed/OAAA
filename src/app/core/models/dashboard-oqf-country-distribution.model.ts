export interface DashboardOqfCountryDistributionChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfCountryDistributionChart {
  categories: string[];
  series: DashboardOqfCountryDistributionChartSeries[];
}

export interface DashboardOqfCountryDistributionRow {
  countryNameEn: string;
  countryNameAr: string;
  count: number;
}

export interface DashboardOqfCountryDistributionResponse {
  rows: DashboardOqfCountryDistributionRow[];
  totalCount: number;
  chart: DashboardOqfCountryDistributionChart;
}
