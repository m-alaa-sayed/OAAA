export interface DashboardReviewersRegisterItem {
  name: string;
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
  isAvailable: boolean | null;
  lastDataUpdatedDate: string | null;
  eqaContributions: number;
  age: number | null;
  jobTitle: string | null;
  narrowField: string | null;
  region: string | null;
}

export interface DashboardReviewersRegisterResponse {
  rows: DashboardReviewersRegisterItem[];
}
