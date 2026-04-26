import { VisitFormAttachment } from "./visit-form-attachment";
import { VisitFormDomainEvaluation } from "./visit-form-domain-evaluation";

export interface VisitFormRequestInfo {
  id?: number;
  requestId?: number;
  scheduledSchoolVisitId?: number;
  type: string;

  actualClassVisitDate: string; 

  subject: string;
  otherSubject: string;
  grade: string;
  className: string;
  lessonTitle: string;

  sessionNumber: number;
  totalStudentsInClass: number;
  absenceCount: number;

  improvementsAnalysis: string;
  strengthsAnalysis: string;

  details: string;
  summary: string;  
 
  activityDate?: string; 
  attendanceCount?: number;
  activityType?: string;
  customActivityName?: string;
  notes?: string;

  formStatus?: String;
  requestStatus?: String;

  isDeleted: boolean;

  createdBy?: number;
  createdOn?: string; 
  updatedBy?: number;
  updatedOn?: string;

  visitFormAttachments: VisitFormAttachment[];
  visitFormDomainEvaluations: VisitFormDomainEvaluation[];
}





