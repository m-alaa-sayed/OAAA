export interface DashboardCseqaChartSeries {
  name: string;
  data: number[];
}

export interface DashboardCseqaChart {
  categories: string[];
  series: DashboardCseqaChartSeries[];
}

export interface DashboardCseqaCountRatioValue {
  count: number;
  percentage: number;
}

export interface DashboardCseqaLocalCountsRatios {
  omani: DashboardCseqaCountRatioValue;
  nonOmani: DashboardCseqaCountRatioValue;
  total: DashboardCseqaCountRatioValue;
}

export interface DashboardCseqaInternationalCountsRatios {
  total: DashboardCseqaCountRatioValue;
}

export interface DashboardCseqaCountsRatiosResponse {
  local: DashboardCseqaLocalCountsRatios;
  international: DashboardCseqaInternationalCountsRatios;
  grandTotal: DashboardCseqaCountRatioValue;
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaStatusDistributionItem {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardCseqaStatusDistributionResponse {
  rows: DashboardCseqaStatusDistributionItem[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaYearComparisonItem {
  type: string;
  detail: string;
  previousYearCount: number;
  currentYearCount: number;
  difference: number;
  differencePercentage: number | null;
}

export interface DashboardCseqaYearComparisonResponse {
  rows: DashboardCseqaYearComparisonItem[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaSpecializationDistributionRow {
  code: string;
  nameEn: string;
  nameAr: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  grandTotal: number;
}

export interface DashboardCseqaSpecializationDistributionTotals {
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  grandTotal: number;
}

export interface DashboardCseqaSpecializationDistributionResponse {
  rows: DashboardCseqaSpecializationDistributionRow[];
  totals: DashboardCseqaSpecializationDistributionTotals;
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaCountryDistributionRow {
  countryNameEn: string;
  countryNameAr: string;
  count: number;
}

export interface DashboardCseqaCountryDistributionResponse {
  rows: DashboardCseqaCountryDistributionRow[];
  totalCount: number;
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaActivitiesParticipationRow {
  activityIdentifier: string;
  activityNameEn: string;
  activityNameAr: string;
  omani: number;
  nonOmani: number;
  international: number;
  total: number;
}

export interface DashboardCseqaActivitiesParticipationResponse {
  rows: DashboardCseqaActivitiesParticipationRow[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaJoinRequestsByStatusRow {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardCseqaJoinRequestsByStatusResponse {
  rows: DashboardCseqaJoinRequestsByStatusRow[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaWithdrawalRequestsByStatusRow {
  status: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardCseqaWithdrawalRequestsByStatusResponse {
  rows: DashboardCseqaWithdrawalRequestsByStatusRow[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaNationalityDistributionRow {
  nationalityNameEn: string;
  nationalityNameAr: string;
  local: number;
  international: number;
  total: number;
}

export interface DashboardCseqaNationalityDistributionResponse {
  rows: DashboardCseqaNationalityDistributionRow[];
  totalCount: number;
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaGovernorateWilayatDistributionWilayat {
  wilayatId: number;
  wilayatNameEn: string;
  wilayatNameAr: string;
  count: number;
}

export interface DashboardCseqaGovernorateWilayatDistributionGovernorate {
  governorateId: number;
  governorateNameEn: string;
  governorateNameAr: string;
  total: number;
  wilayats: DashboardCseqaGovernorateWilayatDistributionWilayat[];
}

export interface DashboardCseqaGovernorateWilayatDistributionResponse {
  governorates: DashboardCseqaGovernorateWilayatDistributionGovernorate[];
}

export interface DashboardCseqaTeamLeaderEvaluationDistributionRow {
  rating: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardCseqaTeamLeaderEvaluationDistributionResponse {
  rows: DashboardCseqaTeamLeaderEvaluationDistributionRow[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaQaEvaluationDistributionRow {
  rating: string;
  omani: number;
  nonOmani: number;
  localTotal: number;
  international: number;
  total: number;
}

export interface DashboardCseqaQaEvaluationDistributionResponse {
  rows: DashboardCseqaQaEvaluationDistributionRow[];
  chart: DashboardCseqaChart;
}

export interface DashboardCseqaCandidatesRegisterRow {
  nameEn: string;
  nameAr: string;
  idType: string;
  idNumber: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  highestQualification: string;
  mainSpecialization: string;
  requestType: string;
  email: string;
  mobileNumber: string;
  status: string;
}

export interface DashboardCseqaCandidatesRegisterResponse {
  rows: DashboardCseqaCandidatesRegisterRow[];
}

export interface DashboardCseqaReviewersRegisterRow {
  nameEn: string;
  nameAr: string;
  idType: string;
  idNumber: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  highestQualification: string;
  mainSpecialization: string;
  email: string;
  mobileNumber: string;
  status: string;
  isAvailable: boolean;
  lastDataUpdatedDate: string;
  eqaContributions: number;
  age: number;
  jobTitle: string;
  narrowField: string;
  region: string;
}

export interface DashboardCseqaReviewersRegisterResponse {
  rows: DashboardCseqaReviewersRegisterRow[];
}