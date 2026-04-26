import { RequestUser } from "src/app/core/models/request-user";
import { ScheduledSchoolVisit } from "./scheduled-school-visit";
import { SelfEvaluationAttachment } from "./self-evaluation-attachment";
import { SelfEvaluationDomain } from "./self-evaluation-domain";
import { SchoolInfo } from "./school-info";
import { SelfEvaluationRequiredFiles } from "./self-evaluation-required-files";

export interface SelfEvaluationDocument {
    id: number;
    documentNumber?: string;
    scheduledSchoolVisitId?: number;
    scheduledSchoolVisit?: ScheduledSchoolVisit;
    status?: string;
    submittedBy?: number;
    userSubmitted?: RequestUser;
    submissionDate?: string; // ISO date format: 'YYYY-MM-DD'
    editableSchoolInfoUuid?: string; // UUID as string
    pledgeAccepted?: boolean;
    evaluationStartDate?: string; // ISO date
    evaluationEndDate?: string;   // ISO date

    selfEvaluationAttachments?: SelfEvaluationAttachment[];

    selfEvaluationDomains?: SelfEvaluationDomain[];

    selfEvaluationRequiredFiles?: SelfEvaluationRequiredFiles;

    editableSchoolInfo: SchoolInfo;
}
