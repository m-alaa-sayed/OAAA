export interface VisitReportEvaluationScores {
  academicAchievementDomain: number;
  personalDevelopmentDomain: number;
  teachingAndAssessmentDomain: number;
  learningEnvironmentDomain: number;
  leadershipAndGovernanceDomain: number;
  overallSchoolPerformance: number;
  summaryAlignmentAndConsistency: number;
  languageQualityInReport: number;
  notes?: string; // Optional, since not marked @NotNull
}
