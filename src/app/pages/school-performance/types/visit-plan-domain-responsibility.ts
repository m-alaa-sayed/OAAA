export interface VisitPlanDomainResponsibility {
  id: number;
  visitLeaderPlanRequestInfoId: number;
  reviewTeamAssignmentRequestInfoId: number;
  domains: string[];
  subjects: string[];
  memberNameAr: string;
  memberNameEn: string;
  role: string;
}