export interface SelfEvaluationDocumentSetting {
    id?: number;

    version?: number;

    pledgeTextAr?: string;

    pledgeTextEn?: string;

    submitWeeksBeforeVisit?: number;

    disableSubmissionWeeksBeforeVisit?: number;

    notifyBeforeEvaluationStartDays?: number;

    notifyBeforeEvaluationStartEnabled?: boolean;
}
