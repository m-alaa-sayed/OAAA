export interface DashboardWithdrawalRequestStatusItem {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  intlR1: number;
  intlR2: number;
  intlR3: number;
  intlTotal: number;
  total: number;
}

export interface DashboardWithdrawalRequestsResponse {
  rows: DashboardWithdrawalRequestStatusItem[];
}
