export enum SubjectEnum {
    Arabic = 'اللغة العربية',
    Math = 'الرياضيات',
    Science = 'العلوم',
    English = 'اللغة الإنجليزية',
    Other = 'اخرى'
}

// export enum VisitDayEnum {
//   First = 'اليوم الأول',
//   Second = 'اليوم الثاني',
//   Third = 'اليوم الثالث',
//   fourth = 'اليوم الرابع',
//   fifth = 'اليوم الخامس'
// }
export interface VisitDayEnum {
    code: string;
    valueAr: string;
    valueEn: string;
}

export const visitDays: VisitDayEnum[] = [
    {
        code: 'first',
        valueAr: ' اليوم الأول',
        valueEn: 'First Day'
    },
    {
        code: 'second',
        valueAr: 'اليوم الثاني',
        valueEn: 'Second Day'
    },
    {
        code: 'third',
        valueAr: 'اليوم الثالث',
        valueEn: 'Third Day'
    },
    {
        code: 'fourth',
        valueAr: 'اليوم الرابع',
        valueEn: 'Fourth Day'
    },
    {
        code: 'fifth',
        valueAr: 'اليوم الخامس',
        valueEn: 'Fifth Day'
    },
    {
        code: 'sixth',
        valueAr: 'اليوم السادس',
        valueEn: 'Sixth Day'
    },
    {
        code: 'seventh',
        valueAr: 'اليوم السابع',
        valueEn: 'Seventh Day'
    },
    {
        code: 'eighth',
        valueAr: 'اليوم الثامن',
        valueEn: 'Eighth Day'
    },
    {
        code: 'ninth',
        valueAr: 'اليوم التاسع',
        valueEn: 'Ninth Day'
    },
    {
        code: 'tenth',
        valueAr: 'اليوم العاشر',
        valueEn: 'Tenth Day'
    }
];

export enum GradeEnum {
    Grade1 = '1',
    Grade2 = '2',
    Grade3 = '3',
    Grade4 = '4',
    Grade5 = '5',
    Grade6 = '6',
    Grade7 = '7',
    Grade8 = '8',
    Grade9 = '9',
    Grade10 = '10',
    Grade11 = '11',
    Grade12 = '12'
}

export enum PeriodEnum {
    Period1 = '1',
    Period2 = '2',
    Period3 = '3',
    Period4 = '4',
    Period5 = '5',
    Period6 = '6',
    Period7 = '7',
    Period8 = '8'
}

export enum ActivityTypesEnum {
    INTERVIEW = 'INTERVIEW',
    MONITORING_STUDENT = 'MONITORING_STUDENT',
    MEETING_MINUTES = 'MEETING_MINUTES',
    DATA_ANALYSIS = 'DATA_ANALYSIS',
    FACILITY_INSPECTION = 'FACILITY_INSPECTION',
    STUDENT_WORK_ANALYSIS = 'STUDENT_WORK_ANALYSIS',
    MORNING_ASSEMBLY = 'MORNING_ASSEMBLY',
    OTHER = 'OTHER'
}
