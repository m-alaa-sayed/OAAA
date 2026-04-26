
export interface VisitForm {
    id?: number;
    documentNumber?: string;
    schoolSchedulingRequestInfoId?: number;
    // schoolSchedulingRequestInfo?: SchoolSchedulingRequestInfo;
    schoolId?: number;
    // school?: School;
    status?: string;
    submittedBy?: number;
    // userSubmitted?: RequestUser;
    submissionDate?: string; 
    editableSchoolInfoUuid?: string; // UUID as string
    pledgeAccepted?: boolean;
    evaluationStartDate?: string; // ISO date
    evaluationEndDate?: string;   // ISO date
}