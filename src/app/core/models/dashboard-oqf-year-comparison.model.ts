export interface DashboardOqfYearComparisonRow {
  type: string;
  detail: string;
  previousYearCount: number;
  currentYearCount: number;
  difference: number;
  differencePercentage: number;
}

export interface DashboardOqfYearComparisonChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfYearComparisonChart {
  categories: string[];
  series: DashboardOqfYearComparisonChartSeries[];
}

export interface DashboardOqfYearComparisonResponse {
  rows: DashboardOqfYearComparisonRow[];
  chart: DashboardOqfYearComparisonChart;
}
