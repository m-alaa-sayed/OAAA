export interface DashboardOqfJoinRequestsChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfJoinRequestsChart {
  categories: string[];
  series: DashboardOqfJoinRequestsChartSeries[];
}

export interface DashboardOqfJoinRequestsRow {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardOqfJoinRequestsResponse {
  rows: DashboardOqfJoinRequestsRow[];
  chart: DashboardOqfJoinRequestsChart;
}
