export interface BasicSchoolInfo {
    id: string;
    schoolCode: string;
    arSchoolName: string;
    enSchoolName: string;
    schoolType: string;
    studentGender: string;
    address: string;
    governorate: string;
    wilayat: string;
    village: string;
    email: string;
    website: string;
    tel1: string;
    buildDate: string;
    schoolStartYear: string;
    isSpecialClass: string;
    schoolOperatingHours: string;
    governorateId: number;
    wilayatId: number;
}

export interface ContactInfo {
    mainPhone: string;
    fax: string;
    email: string;
    alternatePhone: string;
}

export interface PrincipalInfo {
    principalName: string;
    assistantPrincipal1: string;
    assistantPrincipal2: string;
    principalPhone: string;
    principalEmail: string;
    assistantPrincipal1Phone: string;
    assistantPrincipal1Email: string;
    assistantPrincipal2Phone: string;
    assistantPrincipal2Email: string;
}

export interface GradeLevels {
    kg: boolean;
    grade1: boolean;
    grade2: boolean;
    grade3: boolean;
    grade4: boolean;
    grade5: boolean;
    grade6: boolean;
    grade7: boolean;
    grade8: boolean;
    grade9: boolean;
    grade10: boolean;
    grade11: boolean;
    grade12: boolean;
}

export interface ContactDetails {
    id?: number;
    name: string;
    email: string;
    phone: string;
}

export interface AdditionalInfo {
    schoolVision: string;
    schoolMission: string;
    specialPrograms: string;
    isSpecialNeeds: boolean;
    totalStudents: number;
    totalTeachers: number;
    establishmentHistory: string;
    lastInspectionDate: string;
    accreditationStatus: string;
    schoolStatus: string;
}

export interface SchoolSchedule {
    startTime: string;
    endTime: string;
    workingDays: string[];
    totalHoursPerWeek: number;
}

export interface StudentCountByGender {
    males: number;
    females: number;
    total: number;
}

export interface StudentCountByStage {
    stage1to4: number;
    stage5to8: number;
    stage9to12: number;
}

export interface GradeData {
    rowNumber?: number;
    grade?: number;
    educationalStage: string;
    classesPerGrade?: string;
    averageDensityPerClass?: string;
    maleStudents?: number;
    femaleStudents?: number;
    totalStudents?: number;
    averageStudentsPerClass?: number;
}

export interface StudentRatios {
    studentToTeacherRatio: number;
    nonOmaniStudentsRatio: number;
    maleStudentsRatio: number;
    femaleStudentsRatio: number;
    averageStudentsPerClass: number;
}

export interface AdministrativeStaff {
    category: string;
    departmentHeads: number;
    firstTeachers: number;
    supervisors: number;
    specialists: number;
    technicians: number;
    teachers: number;
    notes: string;
}

export interface SubjectTeachers {
    teacherType: string;
    islamicEducation: number;
    arabicLanguage: number;
    englishLanguage: number;
    mathematics: number;
    sciences: number;
    others: number;
    notes: string;
}

export interface TeachingStaffRatios {
    teacherToStudentRatio: number;
    teachingEnvironmentProgressRate: number;
}

export interface TeachingStaffMember {
    category: string;
    directorsAndAssistants: number;
    departmentHeads: number;
    firstTeachers: number;
    teachers: number;
    technicians: number;
    specialists: number;
    supervisors: number;
    others: number;
    notes: string;
}

export interface SubjectTeachersData {
    subject: string;
    approvedTeachers: number | null;
    currentTeachers: number | null;
    newTeachers?: number | null;
    shortageSeniorTeachers?: number | null;
    shortageRegularTeachers?: number | null;
    deficitSeniorTeachers?: number | null;
    deficitRegularTeachers?: number | null;
    total?: number | null;
    isSpecialRow?: boolean;
    isPercentageRow?: boolean;
    notesRow?: boolean;
    notes?: string | { [key: string]: string };
    percentageValue?: number;
}

export interface StaffMember {
    id?: number;
    name: string;
    nationality: string;
    educationalQualification: string;
    jobRole: string;
    classesTeaching: string;
    totalExperience: number;
    schoolExperience: number;
}


export interface AdditionalStaffData {
    numberOfGuards: number;
    numberOfCleaners: number;
    others: number;
}

export interface SchoolAboutData {
    vision: string;
    mission: string;
    strategicGoals: string;
    generalOverview: string;
    majorDevelopments: string;
}

export interface SchoolFacility {
    facilityName: string;
    totalCount: number;
    nonFunctioningCount: number;
    notes: string;
}

export interface EducationalProgram {
    programName: string;
    gradeLevels: string;
    studentCount: number;
    licenseIndicator: boolean;
    attachments: string[];
    bucketName: string;
    objectName: string;
}

export interface SchoolActivity {
    project: string;
    programImplementationTimeframe: string;
    programSupportingActivities: string;
}

export interface SpecialNeedsCategory {
    id: number;
    category: string;
    categoryAr: string;
    categoryEn: string;
    studentCount: number;
    supportPrograms: string;
    deletable: boolean;
}

export interface ChronicDiseasesCategory {
    id: number;
    condition: string;
    conditionAr: string;
    conditionEn: string;
    studentCount: number;
    awarenessProvided: string;
    deletable: boolean;
}

export interface MultipleDisabilitiesCategory {
    id: number;
    category: string;
    categoryAr: string;
    categoryEn: string;
    studentCount: number;
    awarenessProvided: string;
    deletable: boolean;
}

export interface GiftedStudentCategory {
    id: number;
    category: string;
    categoryAr: string;
    categoryEn: string;
    studentCount: number;
    enrichmentPrograms: string;
    deletable: boolean;
}

export interface TestResult {
    subject: string;
    subjectAr: string;
    subjectEn: string;
    year2022SchoolResult?: number;
    year2022NationalAverage?: number;
    year2023SchoolResult?: number;
    year2023NationalAverage?: number;
    year2024SchoolResult?: number;
    year2024NationalAverage?: number;
    participatingStudents?: number;
    totalStudentsRegistered?: number;
}

export interface PerformanceAnalysis {
    grade: string;
    averageScore: number;
    performanceClass: string;
    subjects: SubjectAnalysis[];
}

export interface SubjectAnalysis {
    name: string;
    schoolScore: number;
    nationalScore: number;
    comparisonClass: string;
}

export interface InternationalTest {
    id: string;
    testName: string;
    testNameAr: string;
    testNameEn: string;
    result: string | null;
    participantCount: number;
    schoolManagementApplication: string;
    year: number;
    status: 'completed' | 'pending' | 'not_participated';
    score?: number;
    schoolComments: string;
    grade?: number;
    deletable: boolean;
}

export interface Subject {
    id: string;
    name: string;
}

export interface Grade {
    level: number;
    name: string;
    totalStudents: number;
}

export interface MasteryData {
    mastered: number;
    total: number;
    percentage: number;
}

export interface SubjectMasteryData {
    [gradeLevel: number]: MasteryData;
}

export interface MasteryRates {
    [subjectId: string]: SubjectMasteryData;
}

export interface GridRowData {
    gradeId: number;
    gradeName: string;

    [key: string]: any; // For dynamic subject columns
}

export interface AchievementCategory {
    count: number;
    percentage: number;
}

export interface GradeAchievements {
    excellent: AchievementCategory;
    veryGood: AchievementCategory;
    good: AchievementCategory;
    acceptable: AchievementCategory;
    weak: AchievementCategory;
}

export interface SubjectAchievement {
    name: string;
    totalStudents: number;
    excellent: AchievementCategory;
    veryGood: AchievementCategory;
    good: AchievementCategory;
    acceptable: AchievementCategory;
    weak: AchievementCategory;
    failed?: AchievementCategory;
    needsHelp?: AchievementCategory;
    isAverageRow?: boolean;
    totalRow?: boolean;
}


export interface GradesData {
    name: string;
    level: number;
    totalStudents: number;
    achievements: GradeAchievements;
    open: boolean;
    notApplicable: boolean;
    subjects: SubjectAchievement[];
}

export interface CategoryTotal {
    count: number;
    percentage: number;
}

export interface CohortDataYearCell {
    value: number | null;
    disabled: boolean;
}

export interface CohortData {
    grade: string;
    subject: string;
    year2022: number;
    year2023: number;
    year2024: number;

    [key: string]: any;

    descriptionProgressOverYears: string;
    descriptionSubjectProgressByGrades: string,
    isAverageRow: boolean;
    notApplicable: boolean;
}

export interface CohortGradeProgress {
    grade: string;
    progressOverYears: string;
}

export interface PrivateSchoolInfo {
    ownerName: string;
    ownerNumber: string;
    appliedCurriculum: string;
    internationalProgram: string;
    accreditationBody: string;
    accreditationDate: string;
}

export interface ItqanData {
    name: string;
    open: boolean;
    notApplicable: boolean;
    subjects: ItqanSubjectData[];

}

export interface ItqanSubjectData {
    name: string;
    totalStudents?: number;
    above75Count?: number;
    above75Percent?: number;
    judgment?: string;
    averageRow?: boolean;
    isOtherSubjects?: boolean;
    isOverallJudgmentRow?: boolean;
}

export interface GradesComments {
    grade4Comments?: string
    grade7Comments?: string;
    grade10Comments?: string;

    grade4NotApplicable?: boolean;
    grade7NotApplicable?: boolean;
    grade10NotApplicable?: boolean;
}


export interface SchoolInfo {
    id: string;

    schoolCommentsOnItsInfo: string;
    schoolCommentsOnStudentsInfo: string;
    schoolCommentsOnCountOfStaff: string;

    basicInfo: BasicSchoolInfo;
    contactInfo: ContactInfo;
    principalInfo: PrincipalInfo;
    localSchoolSchedule: SchoolSchedule;
    gradeLevels: GradeLevels;
    additionalInfo: AdditionalInfo;
    contactDetails: ContactDetails[];
    privateSchoolInfo: PrivateSchoolInfo;

    studentCountByGender: StudentCountByGender;
    studentCountByStage: StudentCountByStage;
    studentRatios: StudentRatios;
    averageSchoolDensity:number;
    gradeData: GradeData[];

    administrativeStaffData: AdministrativeStaff[];
    teachingStaffData: TeachingStaffMember[];
    teacherStudentRatio: number;
    teachingStaffTurnoverRate: number;
    subjectTeachersData: SubjectTeachersData[];
    teachingStaffRatios: TeachingStaffRatios;

    staffData: StaffMember[];
    additionalStaffData: AdditionalStaffData;

    schoolAboutData: SchoolAboutData;

    facilitiesData: SchoolFacility[];

    educationalProgramsData: EducationalProgram[];

    schoolActivitiesData: SchoolActivity[];

    specialNeedsData: SpecialNeedsCategory[];

    chronicDiseasesData: ChronicDiseasesCategory[];
    multipleDisabilitiesData: MultipleDisabilitiesCategory[];

    giftedStudentsData: GiftedStudentCategory[];

    grade4TestsData: TestResult[]
    grade7TestsData: TestResult[]
    grade10TestsData: TestResult[]

    internationalTestsData: InternationalTest[];

    subjects: Subject[];
    grades: Grade[];
    masteryRates: MasteryRates;

    // AG Grid properties
    gridRowData: GridRowData[];

    gradesData: GradesData[];

    cohortData: CohortData[];

    cohortGradeProgresses: CohortGradeProgress[];

    itqanData: ItqanData[];

    gradesComments: GradesComments;

    internationalTestsNotApplicable?: boolean;
    //masteryGrades: MasteryGrade[];

    _5thNotApplicable?: boolean;
    _6thNotApplicable?: boolean;
    _7thNotApplicable?: boolean;
    _8thNotApplicable?: boolean;
    _9thNotApplicable?: boolean;
    _10thNotApplicable?: boolean;
    _11thNotApplicable?: boolean;
    _12thNotApplicable?: boolean;


}

// 👇 add this just after the interface
export type NotApplicableKey =
    | '_5thNotApplicable'
    | '_6thNotApplicable'
    | '_7thNotApplicable'
    | '_8thNotApplicable'
    | '_9thNotApplicable'
    | '_10thNotApplicable'
    | '_11thNotApplicable'
    | '_12thNotApplicable';