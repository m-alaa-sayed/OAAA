export interface DomainCategories {
  code: string;
  valueAr: string;
  valueEn: string;
}

export const domains: DomainCategories[] = [
  {
    code: 'ACADEMIC_ACHIEVEMENT',
    valueAr: 'الإنجاز الدراسي',
    valueEn: 'School Achievement'
  },
  {
    code: 'PERSONAL_DEVELOPMENT',
    valueAr: 'النمو الشخصي',
    valueEn: 'Personal Growth'
  },
  {
    code: 'TEACHING_AND_ASSESSMENT',
    valueAr: 'التدريس والتقويم',
    valueEn: 'Teaching and Assessment'
  },
  {
    code: 'LEARNING_ENVIRONMENT',
    valueAr: 'مناخ المدرسة وبيئة التعلم',
    valueEn: 'School Climate and Learning Environment'
  },
  {
    code: 'LEADERSHIP_AND_GOVERNANCE',
    valueAr: 'القيادة والادارةوالحوكمة',
    valueEn: 'Leadership, Management and Governance'
  }
];
