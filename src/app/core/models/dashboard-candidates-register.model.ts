export interface DashboardCandidatesRegisterItem {
  name: string;
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

export interface DashboardCandidatesRegisterResponse {
  rows: DashboardCandidatesRegisterItem[];
}
