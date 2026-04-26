export interface DashboardEqaActivityItem {
  activityIdentifier: string;
  activityNameEn: string;
  activityNameAr: string;
  omani: number;
  nonOmani: number;
  intlR1: number;
  intlR2: number;
  intlR3: number;
  intlTotal: number;
  total: number;
}

export interface DashboardEqaActivitiesResponse {
  rows: DashboardEqaActivityItem[];
}
