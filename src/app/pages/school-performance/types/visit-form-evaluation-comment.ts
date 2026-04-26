export interface VisitFormEvaluationComment {
  id?: number;
  comment: string;
  createdBy?: number;
  user?:any;
  createdOn?: string; 
  parentCommentId?: number;
  visitFormEvaluationComments: VisitFormEvaluationComment[];
}