import {Component, Input, OnInit, OnDestroy, SimpleChanges} from '@angular/core';
import {CohortData, SchoolInfo} from '../../types/school-info';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
    selector: 'teamlead-cohort-tracking',
    templateUrl: './teamlead-cohort-tracking.component.html',
    styleUrl: './teamlead-cohort-tracking.component.scss'
})
export class TeamleadCohortTrackingComponent implements OnInit, OnDestroy {

    @Input() schoolInfo!: SchoolInfo;
    @Input() isEditable: boolean = false;
    @Input() submitted = false;

    groupedCohortData: any[] = [];
    years: string[] = [];   // dynamic years
    expandedGrades: Set<string> = new Set();

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
    ) {
        this.initializeExpandedGrades();
        this.schoolInfo = {} as SchoolInfo;
    }

    ngOnInit(): void {
        this.initializeData();
        this.extractYears();
        this.updateGroupedData();

        this.ensureAverageRows();
        this.groupedCohortData.forEach(group => {
            this.years.forEach(year => {
                this.updateSubjectAverages(group.grade, year);
                this.updateAverageForGrade(group.grade, year);
            });
        });

        // Add print event listeners
        this.setupPrintEventListeners();
    }

    ngOnDestroy(): void {
        // Remove print event listeners
        window.removeEventListener('beforeprint', this.onBeforePrint.bind(this));
        window.removeEventListener('afterprint', this.onAfterPrint.bind(this));
    }

    private beforePrintExpandedGrades: Set<string> = new Set();

    private setupPrintEventListeners(): void {
        window.addEventListener('beforeprint', this.onBeforePrint.bind(this));
        window.addEventListener('afterprint', this.onAfterPrint.bind(this));
    }

    private onBeforePrint(): void {
        // Save current expanded state
        this.beforePrintExpandedGrades = new Set(this.expandedGrades);
        // Expand all grades for print
        this.expandAllGrades();
    }

    private onAfterPrint(): void {
        // Restore previous expanded state
        this.expandedGrades = new Set(this.beforePrintExpandedGrades);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['schoolInfo'] && this.schoolInfo) {
            this.initializeData();
            this.extractYears();
            this.updateGroupedData();
            this.groupedCohortData.forEach(group => {
                this.years.forEach(year => {
                    this.updateSubjectAverages(group.grade, year);
                });
            });
        }
    }

    // -------------------
    // INPUT HANDLERS
    // -------------------
    onInputChange(row: any, year: string, value: any) {
        const newValue = value == '' || value == null ? 0 : Number(value);
        row[year] = newValue;

        // Sync with SchoolInfo.cohortData for the corresponding subject/year (skip average rows)
        if (!row.isAverageRow) {
            this.updateSchoolInfoCohortValue(row.grade, row.subject, year, newValue);
        }

        this.updateSubjectAverages(row.grade, year);
        this.updateAverageForGrade(row.grade, year);
    }

    onBlur(row: any, year: string, event: any) {
        if (event.target.value > 100) {
            this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.MAX_100'),
                {classname: 'bg-danger text-white', autohide: false}
            );
            event.target.value = null;
        }
        const newValue = event.target.value == '' || event.target.value == null ? 0 : Number(event.target.value);
        row[year] = newValue;

        // Sync with SchoolInfo.cohortData for the corresponding subject/year (skip average rows)
        if (!row.isAverageRow) {
            this.updateSchoolInfoCohortValue(row.grade, row.subject, year, newValue);
        }

        this.updateSubjectAverages(row.grade, year);
        this.updateAverageForGrade(row.grade, year);
    }

    // Sync a specific cohort value back to the SchoolInfo model
    private updateSchoolInfoCohortValue(grade: string, subject: string, year: string, value: number): void {
        if (!this.schoolInfo) return;
        if (!Array.isArray(this.schoolInfo.cohortData)) this.schoolInfo.cohortData = [] as any;

        const idx = this.schoolInfo.cohortData.findIndex(r => r.grade === grade && r.subject === subject);
        if (idx >= 0) {
            (this.schoolInfo.cohortData[idx] as any)[year] = value;
        }
    }

    private getSubjectRow(grade: string, subject: string) {
        const group = this.groupedCohortData.find(g => g.grade === grade);
        return group?.data.find((r: { subject: string; }) => r.subject === subject);
    }

    // -------------------
    // AVERAGE CALCULATION
    // -------------------
    private updateAverageForGrade(grade: string, year: string): void {
        if (['5th', '6th', '7th', '8th'].includes(grade)) {
            const totalAvg = this.getAverageForGrade(grade, year);
            const totalAvgRow = this.getSubjectRow(grade, 'المتوسط العام');
            if (totalAvgRow) {
                totalAvgRow[year] = totalAvg;
            }
        }

        // For grades 9–12 → update total average row (existing logic)
        if (['9th', '10th', '11th', '12th'].includes(grade)) {
            this.calculateTotalAverage(grade, year);
        }
    }

    private calculateTotalAverage(grade: string, year: string): void {

        const subjectsMapping: { [key: string]: string[] } = {
            'متوسط الرياضيات': ['الرياضيات الأساسية', 'الرياضيات المتقدمة'],
            'متوسط العلوم': ['الفيزياء', 'الكيمياء', 'الاحياء', 'علوم (تقانة/بيئة)', 'العلوم البيئية', 'العلوم والتقانة'],
            'متوسط الدراسات الاجتماعية': ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية', 'التاريخ (الحضارة الاسلامية)'
                , 'الجغرافيا الاقتصادية', 'التاريخ (العالم من حولي)', 'الجغرافيا والتقنيات الحديثة']
        };

        const normalize = (s: string) => (s || '').trim();

        Object.entries(subjectsMapping).forEach(([avgSubject, subjects]) => {
            const groupValues = this.schoolInfo.cohortData
                .filter(r => r.grade === grade && subjects.includes(normalize(r.subject)))
                .map(r => Number(r[year]))
                .filter(v => !isNaN(v) && v > 0) as number[];

            const groupAvg = groupValues.length
                ? Math.round((groupValues.reduce((a, b) => a + b, 0) / groupValues.length) * 10) / 10
                : null;

            const avgRow = this.getSubjectRow(grade, avgSubject);
            if (avgRow && avgRow[year] !== groupAvg) {
                avgRow[year] = groupAvg;
            }
        });

        const excludedSubjects = new Set([
            'المتوسط العام',
            ...Object.values(subjectsMapping).flat().map(s => normalize(s)) // كل المواد الداخلة في المابات
        ]);

        const baseValues = this.schoolInfo.cohortData
            .filter(r => r.grade === grade && !excludedSubjects.has(normalize(r.subject)))
            .map(r => Number(r[year]))
            .filter(v => !isNaN(v)) as number[];

        const partialValues = Object.keys(subjectsMapping)
            .map(k => {
                const row = this.getSubjectRow(grade, k);
                return row ? Number(row[year]) : null;
            })
            .filter(v => v !== null && !isNaN(Number(v))) as number[];

        const allValues = [...baseValues, ...partialValues].filter(v => v > 0);
        const totalAvg = allValues.length
            ? Math.round((allValues.reduce((a, b) => a + b, 0) / allValues.length) * 10) / 10
            : null;

        const totalAvgRow = this.getSubjectRow(grade, 'المتوسط العام');
        if (totalAvgRow && totalAvgRow[year] !== totalAvg) {
            totalAvgRow[year] = totalAvg;
        }
    }

    getAverageForGrade(grade: string, year: string): number {
        const rows = this.schoolInfo.cohortData.filter(r => r.grade === grade && r.subject !== 'المتوسط' && r.subject !== 'المتوسط العام');
        const values = rows.map(r => r[year])?.filter(v => v !== null) as number[];
        if (!values.length) return 0;
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10;
    }

    // -------------------
    // DATA GROUPING
    // -------------------
    private updateGroupedData(): void {
        if (!this.schoolInfo?.cohortData) {
            this.schoolInfo.cohortData = [];
            return;
        }

        const gradeNames: { [key: string]: string } = {
            '5th': 'الخامس',
            '6th': 'السادس',
            '7th': 'السابع',
            '8th': 'الثامن',
            '9th': 'التاسع',
            '10th': 'العاشر',
            '11th': 'الحادي عشر',
            '12th': 'الثاني عشر'
        };

        const grouped: any[] = [];
        const grades = Array.from(new Set(this.schoolInfo.cohortData.map(row => row.grade)));

        grades.forEach(grade => {
            let data = this.schoolInfo.cohortData.filter(row => row.grade === grade);

            // 👉 For 5th–8th add a total average row
            if (['5th', '6th', '7th', '8th'].includes(grade)) {
                const avgRow: CohortData = {
                    grade,
                    subject: 'المتوسط العام',
                    includeInAverage: true,
                    year2021: 0,
                    year2022: 0,
                    year2023: 0,
                    year2024: 0,
                    descriptionProgressOverYears: "",
                    descriptionSubjectProgressByGrades: "",
                    isAverageRow: true,
                    notApplicable: false
                };

                // Fill averages
                this.years.forEach(y => {
                    (avgRow as any)[y] = this.getAverageForGrade(grade, y);
                });

                data = [...data, avgRow];
            }

            grouped.push({
                grade,
                gradeName: gradeNames[grade] || grade,
                data,
            });
        });

        this.groupedCohortData = grouped;
    }


    // -------------------
    // HELPERS
    // -------------------
    private initializeData(): void {
        if (!this.schoolInfo) {
            this.schoolInfo = {} as SchoolInfo;
        }
    }

    private extractYears(): void {
        if (this.schoolInfo?.cohortData?.length > 0) {
            const sample = this.schoolInfo.cohortData[0];
            this.years = Object.keys(sample).filter(k => k.startsWith("year"));
        }
    }

    private initializeExpandedGrades(): void {
        const grades = ['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
        grades.forEach(grade => this.expandedGrades.add(grade));
    }

    toggleGradeExpansion(grade: string): void {
        if (this.expandedGrades.has(grade)) this.expandedGrades.delete(grade);
        else this.expandedGrades.add(grade);
    }

    isGradeExpanded(grade: string): boolean {
        return this.expandedGrades.has(grade);
    }

    expandAllGrades(): void {
        const grades = ['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
        grades.forEach(grade => this.expandedGrades.add(grade));
    }

    collapseAllGrades(): void {
        this.expandedGrades.clear();
    }

    // -------------------
    // PROGRESS OVER YEARS (GRADE-LEVEL) SYNC
    // -------------------
    getGradeProgressText(grade: string): string {
        const entry = this.schoolInfo?.cohortGradeProgresses?.find(e => e.grade === grade);
        return entry?.progressOverYears || '';
    }

    onGradeProgressChange(grade: string, value: string): void {
        if (!this.schoolInfo) return;
        if (!Array.isArray(this.schoolInfo.cohortGradeProgresses)) {
            this.schoolInfo.cohortGradeProgresses = [];
        }

        const existing = this.schoolInfo.cohortGradeProgresses.find(e => e.grade === grade);
        if (existing) {
            existing.progressOverYears = value;
        } else {
            this.schoolInfo.cohortGradeProgresses.push({grade, progressOverYears: value});
        }
    }

    getGroupedCohortData() {
        return this.groupedCohortData;
    }

    // Determine if a grade is marked as not applicable in schoolInfo.gradesData
    isGradeNotApplicable(grade: string): boolean {

        if (!this.schoolInfo || !Array.isArray(this.schoolInfo.gradesData)) return false;
        // Extract numeric part from strings like '5th', '10th'
        const match = grade && grade.match(/\d+/);
        const level = match ? Number(match[0]) : NaN;
        if (isNaN(level)) return false;
        const gd = this.schoolInfo.gradesData.find(g => g.level === level);
        if (gd) return gd.notApplicable;
        return false;
    }

    getTranslatedGradeName(grade: string): string {
        const gradeMap: { [key: string]: string } = {
            '5th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.FIFTH',
            '6th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.SIXTH',
            '7th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.SEVENTH',
            '8th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.EIGHTH',
            '9th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.NINTH',
            '10th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.TENTH',
            '11th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.ELEVENTH',
            '12th': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.GRADES.TWELFTH'
        };
        return gradeMap[grade] || grade;
    }


    private updateSubjectAverages(grade: string, year: string): void {
        const group = this.groupedCohortData.find(g => g.grade === grade);
        if (!group) return;

        const subjectsMapping: { [key: string]: string[] } = {
            'متوسط الرياضيات': ['الرياضيات الأساسية', 'الرياضيات المتقدمة'],
            'متوسط العلوم': ['الفيزياء', 'الكيمياء', 'الاحياء', 'علوم (تقانة/بيئة)'],
            'متوسط الدراسات الاجتماعية': ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية']
        };

        for (const avgSubject of Object.keys(subjectsMapping)) {
            const subSubjects = subjectsMapping[avgSubject];

            const values = group.data
                .filter((r: { subject: string; }) => subSubjects.includes(r.subject))
                .map((r: { [x: string]: any; }) => r[year] ?? 0);

            const avg = values.length ? values.reduce((a: any, b: any) => a + b, 0) / values.length : 0;

            const avgRow = group.data.find((r: { subject: string; }) => r.subject === avgSubject);
            if (avgRow) {
                avgRow[year] = +avg.toFixed(2);
            }
        }
    }


    getTranslatedSubjectName(subject: string): string {
        const subjectMap: { [key: string]: string } = {
            'التربية الإسلامية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ISLAMIC_EDUCATION',
            'اللغة العربية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ARABIC_LANGUAGE',
            'اللغة الإنجليزية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ENGLISH_LANGUAGE',
            'اللغة الفرنسية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.FRENCH_LANGUAGE',
            'الرياضيات': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.MATHEMATICS',
            'الرياضيات البحتة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.PURE_MATHEMATICS',
            'الرياضيات التطبيقية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.APPLIED_MATHEMATICS',
            'الرياضيات الأساسية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.BASIC_MATHEMATICS',
            'الرياضيات المتقدمة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ADVANCED_MATHEMATICS',
            'العلوم': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.SCIENCE',
            'الفيزياء': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.PHYSICS',
            'الكيمياء': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.CHEMISTRY',
            'الاحياء': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.BIOLOGY',
            'العلم والبيئة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ENVIRONMENTAL_SCIENCE',
            'الدراسات الاجتماعية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.SOCIAL_STUDIES',
            'التاريخ': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.HISTORY',
            'الجغرافيا': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.GEOGRAPHY',
            'علم النفس والاجتماع': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.PSYCHOLOGY_SOCIOLOGY',
            'الاقتصاد': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ECONOMICS',
            'الحضارة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.CIVILIZATION',
            'العالم من حولي': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.WORLD_AROUND_ME',
            'الجغرافيا والتقنيات الحديثة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.GEOGRAPHY_MODERN_TECH',
            'العلوم والثقافة': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.SCIENCE_CULTURE',
            'التربية الرياضية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.PHYSICAL_EDUCATION',
            'الفنون': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.ARTS',
            'الفنون التطبيقية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.APPLIED_ARTS',
            'تقنية المعلومات': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.INFORMATION_TECHNOLOGY',
            'التقنية المعلوماتية': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.SUBJECTS.COMPUTER_TECHNOLOGY',
            'المتوسط': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.AVERAGE',
            'المتوسط العام': 'PAGES.SCHOOL_PERFORMANCE.COHORT_TRACKING.TOTAL_AVERAGE'
        };
        return subjectMap[subject] || subject;
    }


    private ensureAverageRows(): void {
        const subjectsMapping: { [key: string]: string[] } = {
            'متوسط الرياضيات': ['الرياضيات الأساسية', 'الرياضيات المتقدمة'],
            'متوسط العلوم': ['الفيزياء', 'الكيمياء', 'الاحياء', 'علوم (تقانة/بيئة)'],
            'متوسط الدراسات الاجتماعية': ['التاريخ (الحضارة الاسلامية)', 'الجغرافيا الاقتصادية', 'الدراسات الاجتماعية']
        };


        this.groupedCohortData.forEach(group => {
            if (['9th', '10th', '11th', '12th'].includes(group.grade)) {
                Object.entries(subjectsMapping).forEach(([avgSubject, subSubjects]) => {
                    const hasAny = group.data.some((r: { subject: string }) => subSubjects.includes(r.subject));

                    if (hasAny) {
                        const exists = group.data.some((r: { subject: string }) => r.subject === avgSubject);
                        if (!exists) {
                            group.data.push({
                                grade: group.grade,
                                subject: avgSubject,
                                isAverageRow: true,
                                includeInAverage: false,
                                ...this.years.reduce((acc, year) => ({...acc, [year]: 0}), {})
                            });
                        }
                    }
                });
            }

            const totalAvgExists = group.data.some((r: { subject: string; }) => r.subject === 'المتوسط العام');
            if (!totalAvgExists) {
                group.data.push({
                    grade: group.grade,
                    subject: 'المتوسط العام',
                    isAverageRow: true,
                    includeInAverage: false,
                    ...this.years.reduce((acc, year) => ({...acc, [year]: 0}), {})
                });
            }
        });
    }


    validateForm(): boolean {
        this.submitted = true; // mark as attempted
        let valid = true;
        for (const group of this.groupedCohortData) {
            for (const row of group.data) {
                if (!row.descriptionProgressOverYears || !row.descriptionSubjectProgressByGrades) {
                    valid = false;
                }
            }
        }

        return valid;
    }
} 