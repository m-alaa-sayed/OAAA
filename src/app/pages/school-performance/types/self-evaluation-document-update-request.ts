import { SelfEvaluationDocument } from "./self-evaluation-document";

export interface SelfEvaluationDocumentUpdateRequest {
    action?: string;
    selfEvaluationDocument?: SelfEvaluationDocument;
}