export interface DashboardOqfSpecializationDistributionRow {
  code: string;
  nameEn: string;
  nameAr: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  grandTotal: number;
}

export interface DashboardOqfSpecializationDistributionTotals {
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  grandTotal: number;
}

export interface DashboardOqfSpecializationDistributionChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfSpecializationDistributionChart {
  categories: string[];
  series: DashboardOqfSpecializationDistributionChartSeries[];
}

export interface DashboardOqfSpecializationDistributionResponse {
  rows: DashboardOqfSpecializationDistributionRow[];
  totals: DashboardOqfSpecializationDistributionTotals;
  chart: DashboardOqfSpecializationDistributionChart;
}