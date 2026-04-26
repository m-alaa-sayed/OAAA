export interface DashboardOqfEqaActivitiesRow {
  activityIdentifier: string;
  activityNameEn: string;
  activityNameAr: string;
  omani: number;
  nonOmani: number;
  international: number;
  total: number;
}

export interface DashboardOqfEqaActivitiesChartSeries {
  name: string;
  data: number[];
}

export interface DashboardOqfEqaActivitiesChart {
  categories: string[];
  series: DashboardOqfEqaActivitiesChartSeries[];
}

export interface DashboardOqfEqaActivitiesResponse {
  rows: DashboardOqfEqaActivitiesRow[];
  chart: DashboardOqfEqaActivitiesChart;
}
