export interface DashboardOqfChartSeries {
  name?: string;
  data: number[];
}

export interface DashboardOqfCountsRatiosChart {
  categories: string[];
  series: DashboardOqfChartSeries[];
}

export interface DashboardOqfCountPercentage {
  count: number;
  percentage: number;
}

export interface DashboardOqfLocalData {
  omani: DashboardOqfCountPercentage;
  nonOmani: DashboardOqfCountPercentage;
  total: DashboardOqfCountPercentage;
}

export interface DashboardOqfInternationalData {
  total: DashboardOqfCountPercentage;
}

export interface DashboardOqfCountsRatiosTableRow {
  type: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardOqfCountsRatiosResponse {
  local: DashboardOqfLocalData;
  international: DashboardOqfInternationalData;
  grandTotal: DashboardOqfCountPercentage;
  chart: DashboardOqfCountsRatiosChart;
}
