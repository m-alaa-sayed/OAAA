import {User} from "src/app/core/models/auth.models";
import {Request} from "src/app/shared/types/request";
import {ScheduledSchoolVisit} from "./scheduled-school-visit";
import {SelfEvaluationDocument} from "./self-evaluation-document";
import {VisitReportDomainEvaluation} from "./visit-report-domain-evaluation";
import {VisitReportFormStatistics} from "./visit-report-form-statistics";
import {VisitReportComment} from "./visit-report-comment";
import {SchoolInfo} from "./school-info";

export interface VisitReportSubmissionRequestInfo {
    summaryFutureEvents: any;
    summaryImprovementsSuggestions: any;
    summaryKeyFindings: any;
    summaryApplicationNumber: any;
    id?: number;
    createdOn?: string; // LocalDateTime → ISO string
    user?: User;
    request?: Request;
    scheduledSchoolVisit?: ScheduledSchoolVisit;
    status?: string;
    otherUpdates?: string;
    overallSystemJudgment?: number;
    overallProfessionalJudgment?: number;
    judgmentChangeJustification?: string;
    judgmentChangeAttachmentBucketName?: string;
    judgmentChangeAttachmentFileName?: string;
    strengthsAnalysis?: string;
    improvementsAnalysis?: string;
    recommendations?: string;
    schoolCommentsOnOverallPerformance?: string;
    schoolCommentsOnSafetyAndSecurity?: string;
    safetyAndSecurityNotes?: string;

    domainEvaluations?: VisitReportDomainEvaluation[];
    formStats?: VisitReportFormStatistics[];
    comments?: VisitReportComment[];
    groupedDomainEvaluationDimension?: Record<string, VisitReportDomainEvaluation[]>;
    selfEvaluationDocumentDto?: SelfEvaluationDocument;
    groupedFormsStats?: Record<string, Record<string, number>>;
    attachments?: any[];
    editableSchoolInfo: SchoolInfo;
}