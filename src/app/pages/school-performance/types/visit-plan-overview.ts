export interface VisitPlanOverview {
    id?: number;
    selfEvaluationDocumentNumber?: string;
    schoolName?: string;
    schoolType?: string;
    schoolGovernorate?: string;
    schoolState?: string;
    numberOfStudents?: number;
    studentsGender?: string;
    numberOfClasses?: string;
    visitNumber?: string;
    planNumber?: string;
    planCreationDate?: string; // ISO datetime string
    planStatus?: string;
}
