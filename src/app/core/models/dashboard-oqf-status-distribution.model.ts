export interface DashboardOqfStatusDistributionChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfStatusDistributionChart {
  categories: string[];
  series: DashboardOqfStatusDistributionChartSeries[];
}

export interface DashboardOqfStatusDistributionRow {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardOqfStatusDistributionResponse {
  rows: DashboardOqfStatusDistributionRow[];
  chart: DashboardOqfStatusDistributionChart;
}