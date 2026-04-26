export interface DashboardOqfEmployerDistributionRow {
  employerNameEn: string;
  employerNameAr: string;
  traineesCount: number;
  passersCount: number;
}

export interface DashboardOqfEmployerDistributionChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfEmployerDistributionResponse {
  rows: DashboardOqfEmployerDistributionRow[];
  totalCount: number;
  chart: {
    categories: string[];
    series: DashboardOqfEmployerDistributionChartSeries[];
  };
}