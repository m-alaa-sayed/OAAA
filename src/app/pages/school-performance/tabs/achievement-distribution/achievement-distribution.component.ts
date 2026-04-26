import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CategoryTotal, GradeAchievements, GradesData, SchoolInfo, SubjectAchievement } from '../../types/school-info';
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';
import { ToastService } from 'src/app/core/services/toast-service';

interface AchievementCategory {
  count: number;
  percentage: number;
}

// interface SubjectAchievement {
//   name: string;
//   totalStudents: number;
//   excellent: AchievementCategory;
//   veryGood: AchievementCategory;
//   good: AchievementCategory;
//   acceptable: AchievementCategory;
//   weak: AchievementCategory;
//   failed?: AchievementCategory;
//   needsHelp?: AchievementCategory;
//   isAverageRow?: boolean;
//   totalRow?: boolean;
// }

// interface AchievementGrade {
//   name: string;
//   level: number;
//   open: boolean;
//   notApplicable: boolean;
//   subjects: SubjectAchievement[];
// }


@Component({
  selector: 'app-achievement-distribution',
  templateUrl: './achievement-distribution.component.html',
  styleUrls: ['./achievement-distribution.component.scss']
})
export class AchievementDistributionComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable : boolean = true;
  //grades: AchievementGrade[] = [];

  constructor(
    public translate: TranslateService,
    public toastService: ToastService,

  ) { }

  ngOnInit(): void {
    //this.initializeGrades();
    if(!this.schoolInfo.gradesData){
      this.schoolInfo.gradesData = [];
    }
    this.initializeCalculations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['schoolInfo'] && changes['schoolInfo'].currentValue) {
    //   this.initializeGrades();
    // }
  }

  // private initializeGrades(): void {
  //   this.schoolInfo.gradesData = [
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.FIRST') || 'الصف الأول',
  //       level: 1,
  //       open: true,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(60)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.SECOND') || 'الصف الثاني',
  //       level: 2,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(58)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.THIRD') || 'الصف الثالث',
  //       level: 3,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(55)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.FOURTH') || 'الصف الرابع',
  //       level: 4,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(52)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.FIVE') || 'الصف الخامس',
  //       level: 5,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(50)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.SIX') || 'الصف السادس',
  //       level: 6,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(48)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.SEVEN') || 'الصف السابع',
  //       level: 7,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(45)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.EIGHT') || 'الصف الثامن',
  //       level: 8,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(42)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.NINE') || 'الصف التاسع',
  //       level: 9,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(40)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.TEN') || 'الصف العاشر',
  //       level: 10,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(38)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.ELEVEN') || 'الصف الحادي عشر',
  //       level: 11,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(35)
  //     },
  //     {
  //       name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ACHIEVEMENT_DISTRIBUTION.GRADES.TWELVE') || 'الصف الثاني عشر',
  //       level: 12,
  //       open: false,
  //       notApplicable: false,
  //       subjects: this.createGradeSubjects(32)
  //     }
  //   ];
  // }

  private createGradeSubjects(baseStudentCount: number): SubjectAchievement[] {
    return [
      // Core Subjects
      this.createSubjectData('التربية الإسلامية', baseStudentCount),
      this.createSubjectData('اللغة العربية', baseStudentCount),
      this.createSubjectData('اللغة الإنجليزية', baseStudentCount),

      // Mathematics Section
      this.createSubjectData('الرياضيات الأساسية', baseStudentCount),
      this.createSubjectData('الرياضيات المتقدمة', baseStudentCount),
      this.createSubjectData('متوسط الرياضيات', baseStudentCount, true),

      // Science Section
      this.createSubjectData('الفيزياء', baseStudentCount),
      this.createSubjectData('الكيمياء', baseStudentCount),
      this.createSubjectData('الاحياء', baseStudentCount),
      this.createSubjectData('علوم (تقانة/بيئة)', baseStudentCount),
      this.createSubjectData('متوسط العلوم', baseStudentCount, true),

      // Social Studies Section
      this.createSubjectData('التاريخ', baseStudentCount),
      this.createSubjectData('الجغرافيا', baseStudentCount),
      this.createSubjectData('الدراسات الاجتماعية', baseStudentCount),
      this.createSubjectData('متوسط الدراسات الاجتماعية', baseStudentCount, true),

      // Total Row
      this.createSubjectData('المجموع', baseStudentCount, false, true)
    ];
  }

  private initializeCalculations(): void {
    // Calculate averages and totals for all grades on startup
    this.schoolInfo.gradesData.forEach(grade => {
      this.updateAverageRows(grade);
      this.updateTotalRow(grade);
      this.updateTotals(grade);
    });

    
  }

  private createSubjectData(name: string, totalStudents: number, isAverageRow: boolean = false, totalRow: boolean = false): SubjectAchievement {
    // Generate realistic distribution based on the screenshot
    const excellentCount = Math.floor(totalStudents * 0.8); // 80% as shown in screenshot
    const veryGoodCount = Math.floor(totalStudents * 0.1); // 10%
    const goodCount = Math.floor(totalStudents * 0.1); // 10%
    const acceptableCount = 0; // 0% as shown
    const weakCount = 0; // 0% as shown

    return {
      name,
      totalStudents,
      excellent: {
        count: excellentCount,
        percentage: Math.round((excellentCount / totalStudents) * 100)
      },
      veryGood: {
        count: veryGoodCount,
        percentage: Math.round((veryGoodCount / totalStudents) * 100)
      },
      good: {
        count: goodCount,
        percentage: Math.round((goodCount / totalStudents) * 100)
      },
      acceptable: {
        count: acceptableCount,
        percentage: Math.round((acceptableCount / totalStudents) * 100)
      },
      weak: {
        count: weakCount,
        percentage: Math.round((weakCount / totalStudents) * 100)
      },
      isAverageRow,
      totalRow
    };
  }

  // Toggle the open/closed state of a grade panel
  toggleGradePanel(index: number): void {
    this.schoolInfo.gradesData[index].open = !this.schoolInfo.gradesData[index].open;
  }

  // Handle subject data changes
  onSubjectDataChange(grade: GradesData, subject: SubjectAchievement): void {
    this.updateTotals(grade);
    if (!this.checkSumOfGrades(subject)) {
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.CONTENT.TOTAL_STUDENTS_LESS_THAN_GRADES'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }

    // Update all percentages when total students change
    if (subject.totalStudents && subject.totalStudents > 0) {
      subject.excellent.percentage = Math.round((subject.excellent.count / subject.totalStudents) * 100);
      subject.veryGood.percentage = Math.round((subject.veryGood.count / subject.totalStudents) * 100);
      subject.good.percentage = Math.round((subject.good.count / subject.totalStudents) * 100);
      subject.acceptable.percentage = Math.round((subject.acceptable.count / subject.totalStudents) * 100);
      subject.weak.percentage = Math.round((subject.weak.count / subject.totalStudents) * 100);
    }

    // Update averages and total if this is not an average or total row
    if (!subject.isAverageRow && !subject.totalRow) {
      this.updateAverageRows(grade);
      this.updateTotalRow(grade);
    }
    
  }

  // inInputDataChage(subject: SubjectAchievement, category: keyof Pick<SubjectAchievement, 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak'>){
  //    if (!this.checkSumOfGrades(subject)) {
  //     this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.CONTENT.TOTAL_STUDENTS_LESS_THAN_GRADES'), { classname: 'bg-danger text-white', autohide: false });
  //     subject[category].count  = 0;
  //     return;
  //   }
  // }

  private checkSumOfGrades(subject: SubjectAchievement) {
    const sumOfGrades =
      subject.excellent.count +
      subject.veryGood.count +
      subject.good.count +
      subject.acceptable.count +
      subject.weak.count;

    // Validation: Total students should not be less than the sum of grades
    if (subject.totalStudents < sumOfGrades) {
      return false;
    }
    return true
  }

  // Handle achievement data changes (count changes)
  onAchievementDataChange(grade: GradesData, subject: SubjectAchievement, category: keyof Pick<SubjectAchievement, 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak'>): void {
    this.updateTotals(grade);
    if (!this.checkSumOfGrades(subject)) {
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.CONTENT.TOTAL_STUDENTS_LESS_THAN_GRADES'), { classname: 'bg-danger text-white', autohide: false });
     // subject[category].count  = 0;
      return;
    }
    // Auto-calculate percentage when count changes
    if (subject.totalStudents && subject.totalStudents > 0) {
      subject[category].percentage = Math.round((subject[category].count / subject.totalStudents) * 100);
    }

    // Update averages and total if this is not an average or total row
    if (!subject.isAverageRow && !subject.totalRow) {
      this.updateAverageRows(grade);
      this.updateTotalRow(grade);
    }
    
  }

  // Handle percentage changes (removed since percentage fields are now disabled and auto-calculated)
  // onPercentageChange method removed - percentages are now auto-calculated from counts

  // Update average rows for subject groups
  private updateAverageRows(grade: GradesData): void {
    // Update Mathematics average
    this.updateSubjectGroupAverage(grade,
      ['الرياضيات الأساسية', 'الرياضيات المتقدمة'],
      'متوسط الرياضيات');

    // Update Science average
    this.updateSubjectGroupAverage(grade,
      ['الفيزياء', 'الكيمياء', 'الاحياء', 'علوم (تقانة/بيئة)'],
      'متوسط العلوم');

    // Update Social Studies average
    this.updateSubjectGroupAverage(grade,
      ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية'],
      'متوسط الدراسات الاجتماعية');
  }

  // Update average for a specific subject group
  private updateSubjectGroupAverage(grade: GradesData, subjectNames: string[], averageName: string): void {
    const subjects = grade.subjects.filter(s => subjectNames.includes(s.name));
    const averageSubject = grade.subjects.find(s => s.name === averageName);

    if (subjects.length > 0 && averageSubject) {
      const validSubjects = subjects.filter(s =>
        s.totalStudents !== undefined &&
        s.excellent.count !== undefined &&
        s.veryGood.count !== undefined &&
        s.good.count !== undefined &&
        s.acceptable.count !== undefined &&
        s.weak.count !== undefined
      );

      if (validSubjects.length > 0) {
        // Calculate average total students
        const totalStudents = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0) / validSubjects.length
        );

        // Calculate average counts
        const excellentCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.excellent.count || 0), 0) / validSubjects.length
        );
        const veryGoodCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.veryGood.count || 0), 0) / validSubjects.length
        );
        const goodCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.good.count || 0), 0) / validSubjects.length
        );
        const acceptableCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.acceptable.count || 0), 0) / validSubjects.length
        );
        const weakCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.weak.count || 0), 0) / validSubjects.length
        );

        // Update average subject
        averageSubject.totalStudents = totalStudents;
        averageSubject.excellent.count = excellentCount;
        averageSubject.veryGood.count = veryGoodCount;
        averageSubject.good.count = goodCount;
        averageSubject.acceptable.count = acceptableCount;
        averageSubject.weak.count = weakCount;

        // Calculate percentages
        if (totalStudents > 0) {
          averageSubject.excellent.percentage = Math.round((excellentCount / totalStudents) * 100);
          averageSubject.veryGood.percentage = Math.round((veryGoodCount / totalStudents) * 100);
          averageSubject.good.percentage = Math.round((goodCount / totalStudents) * 100);
          averageSubject.acceptable.percentage = Math.round((acceptableCount / totalStudents) * 100);
          averageSubject.weak.percentage = Math.round((weakCount / totalStudents) * 100);
        }
      }
    }
  }

  // Update total row for the grade
  private updateTotalRow(grade: GradesData): void {
    const totalSubject = grade.subjects.find(s => s.totalRow);
    const coreSubjects = grade.subjects.filter(s =>
      !s.isAverageRow &&
      !s.totalRow &&
      s.totalStudents !== undefined &&
      s.excellent.count !== undefined
    );

    if (totalSubject && coreSubjects.length > 0) {
      // Calculate totals
      const totalStudents = coreSubjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0);
      const excellentCount = coreSubjects.reduce((sum, s) => sum + (s.excellent.count || 0), 0);
      const veryGoodCount = coreSubjects.reduce((sum, s) => sum + (s.veryGood.count || 0), 0);
      const goodCount = coreSubjects.reduce((sum, s) => sum + (s.good.count || 0), 0);
      const acceptableCount = coreSubjects.reduce((sum, s) => sum + (s.acceptable.count || 0), 0);
      const weakCount = coreSubjects.reduce((sum, s) => sum + (s.weak.count || 0), 0);

      // Update total subject
      totalSubject.totalStudents = totalStudents;
      totalSubject.excellent.count = excellentCount;
      totalSubject.veryGood.count = veryGoodCount;
      totalSubject.good.count = goodCount;
      totalSubject.acceptable.count = acceptableCount;
      totalSubject.weak.count = weakCount;

      // Calculate percentages
      if (totalStudents > 0) {
        totalSubject.excellent.percentage = Math.round((excellentCount / totalStudents) * 100);
        totalSubject.veryGood.percentage = Math.round((veryGoodCount / totalStudents) * 100);
        totalSubject.good.percentage = Math.round((goodCount / totalStudents) * 100);
        totalSubject.acceptable.percentage = Math.round((acceptableCount / totalStudents) * 100);
        totalSubject.weak.percentage = Math.round((weakCount / totalStudents) * 100);
      }
    }
  }

  // Calculate total count across all grades for a specific achievement category
  getTotalCountAllGrades(category: keyof Pick<SubjectAchievement, 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak'>): number {
    return this.schoolInfo.gradesData
      .filter(grade => !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s[category].count !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject[category].count || 0), 0
        );
        return total + gradeTotal;
      }, 0);
  }

  // Calculate total percentage across all grades for a specific achievement category
  getTotalPercentageAllGrades(category: keyof Pick<SubjectAchievement, 'excellent' | 'veryGood' | 'good' | 'acceptable' | 'weak'>): number {
    const totalCount = this.getTotalCountAllGrades(category);
    const totalStudents = this.getTotalStudentsAllGrades();
    return totalStudents > 0 ? Math.round((totalCount / totalStudents) * 100 * 100) / 100 : 0;
  }

  // Calculate total students across all grades (excluding average and total rows)
  getTotalStudentsAllGrades(): number {
    return this.schoolInfo.gradesData
      .filter(grade => !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s.totalStudents !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject.totalStudents || 0), 0
        );
        return total + gradeTotal;
      }, 0);
  }

  // Calculate total needs help count across all grades (grades 1-4)
  getTotalNeedsHelpAllGrades(): number {
    return this.schoolInfo.gradesData
      .filter(grade => grade.level <= 4 && !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s.weak.count !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject.weak.count || 0), 0
        );
        return total + gradeTotal;
      }, 0);
  }

  // Calculate total needs help percentage across all grades (grades 1-4)
  getTotalNeedsHelpPercentageAllGrades(): number {
    const totalNeedsHelp = this.getTotalNeedsHelpAllGrades();
    const totalStudentsGrades1to4 = this.schoolInfo.gradesData
      .filter(grade => grade.level <= 4 && !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s.totalStudents !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject.totalStudents || 0), 0
        );
        return total + gradeTotal;
      }, 0);
    
    return totalStudentsGrades1to4 > 0 ? Math.round((totalNeedsHelp / totalStudentsGrades1to4) * 100 * 100) / 100 : 0;
  }

  // Calculate total failed count across all grades (grades 5-12)
  getTotalFailedAllGrades(): number {
    return this.schoolInfo.gradesData
      .filter(grade => grade.level >= 5 && !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s.weak.count !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject.weak.count || 0), 0
        );
        return total + gradeTotal;
      }, 0);
  }

  // Calculate total failed percentage across all grades (grades 5-12)
  getTotalFailedPercentageAllGrades(): number {
    const totalFailed = this.getTotalFailedAllGrades();
    const totalStudentsGrades5to12 = this.schoolInfo.gradesData
      .filter(grade => grade.level >= 5 && !grade.notApplicable)
      .reduce((total, grade) => {
        const coreSubjects = grade.subjects.filter(s =>
          !s.isAverageRow &&
          !s.totalRow &&
          s.totalStudents !== undefined
        );
        const gradeTotal = coreSubjects.reduce((gradeSum, subject) =>
          gradeSum + (subject.totalStudents || 0), 0
        );
        return total + gradeTotal;
      }, 0);
    
    return totalStudentsGrades5to12 > 0 ? Math.round((totalFailed / totalStudentsGrades5to12) * 100 * 100) / 100 : 0;
  }

  // Get all subjects totals for the combined table
  getAllSubjectsTotals(): SubjectAchievement[] {
    const allSubjectsTotals: SubjectAchievement[] = [];
    
    // Get all unique subject names from all grades (excluding average rows and total rows)
    const subjectNames = new Set<string>();
    this.schoolInfo.gradesData
      .filter(grade => !grade.notApplicable)
      .forEach(grade => {
        grade.subjects.forEach(subject => {
          if (!subject.isAverageRow && !subject.totalRow) {
            subjectNames.add(subject.name);
          }
        });
      });

    // Calculate totals for each subject across all grades
    subjectNames.forEach(subjectName => {
      const subjectsWithName = this.schoolInfo.gradesData
        .filter(grade => !grade.notApplicable)
        .map(grade => grade.subjects.find(s => s.name === subjectName))
        .filter(s => s !== undefined) as SubjectAchievement[];

      if (subjectsWithName.length > 0) {
        const totalStudents = subjectsWithName.reduce((sum, s) => sum + (s.totalStudents || 0), 0);
        const excellentCount = subjectsWithName.reduce((sum, s) => sum + (s.excellent.count || 0), 0);
        const veryGoodCount = subjectsWithName.reduce((sum, s) => sum + (s.veryGood.count || 0), 0);
        const goodCount = subjectsWithName.reduce((sum, s) => sum + (s.good.count || 0), 0);
        const acceptableCount = subjectsWithName.reduce((sum, s) => sum + (s.acceptable.count || 0), 0);
        const weakCount = subjectsWithName.reduce((sum, s) => sum + (s.weak.count || 0), 0);

        // Split weak count into failed (grades 5-12) and needs help (grades 1-4)
        const failedCount = this.schoolInfo.gradesData
          .filter(g => g.level >= 5 && !g.notApplicable)
          .map(g => g.subjects.find(s => s.name === subjectName))
          .filter(s => s !== undefined)
          .reduce((sum, s) => sum + (s!.weak.count || 0), 0);

        const needsHelpCount = this.schoolInfo.gradesData
          .filter(g => g.level <= 4 && !g.notApplicable)
          .map(g => g.subjects.find(s => s.name === subjectName))
          .filter(s => s !== undefined)
          .reduce((sum, s) => sum + (s!.weak.count || 0), 0);

        // Calculate percentages
        const excellentPercentage = totalStudents > 0 ? Math.round((excellentCount / totalStudents) * 100) : 0;
        const veryGoodPercentage = totalStudents > 0 ? Math.round((veryGoodCount / totalStudents) * 100) : 0;
        const goodPercentage = totalStudents > 0 ? Math.round((goodCount / totalStudents) * 100) : 0;
        const acceptablePercentage = totalStudents > 0 ? Math.round((acceptableCount / totalStudents) * 100) : 0;
        const weakPercentage = totalStudents > 0 ? Math.round((weakCount / totalStudents) * 100) : 0;
        const failedPercentage = totalStudents > 0 ? Math.round((failedCount / totalStudents) * 100) : 0;
        const needsHelpPercentage = totalStudents > 0 ? Math.round((needsHelpCount / totalStudents) * 100) : 0;

        allSubjectsTotals.push({
          name: subjectName,
          totalStudents: totalStudents,
          excellent: {
            count: excellentCount,
            percentage: excellentPercentage
          },
          veryGood: {
            count: veryGoodCount,
            percentage: veryGoodPercentage
          },
          good: {
            count: goodCount,
            percentage: goodPercentage
          },
          acceptable: {
            count: acceptableCount,
            percentage: acceptablePercentage
          },
          weak: {
            count: weakCount,
            percentage: weakPercentage
          },
          failed: {
            count: failedCount,
            percentage: failedPercentage
          },
          needsHelp: {
            count: needsHelpCount,
            percentage: needsHelpPercentage
          }
        });
      }
    });

    // Add subject group averages
    const mathSubjects = ['الرياضيات الأساسية', 'الرياضيات المتقدمة'];
    const scienceSubjects = ['الفيزياء', 'الكيمياء', 'الاحياء', 'علوم (تقانة/بيئة)'];
    const socialSubjects = ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية'];

    // Add Math Average
    this.addSubjectGroupAverage(allSubjectsTotals, mathSubjects, 'متوسط الرياضيات', true);
    
    // Add Science Average
    this.addSubjectGroupAverage(allSubjectsTotals, scienceSubjects, 'متوسط العلوم', true);
    
    // Add Social Studies Average
    this.addSubjectGroupAverage(allSubjectsTotals, socialSubjects, 'متوسط الدراسات الاجتماعية', true);

    // Add Overall Total
    this.addOverallTotal(allSubjectsTotals);

    return allSubjectsTotals;
  }

  // Helper method to add subject group averages
  private addSubjectGroupAverage(allSubjectsTotals: SubjectAchievement[], subjectNames: string[], averageName: string, isAverageRow: boolean): void {
    const groupSubjects = allSubjectsTotals.filter(s => subjectNames.includes(s.name));
    
    if (groupSubjects.length > 0) {

      const totalStudentsSubjects = groupSubjects.filter(s => (s.totalStudents || 0) > 0);
      const totalStudents = totalStudentsSubjects.length > 0
        ? Math.round(totalStudentsSubjects.reduce((sum: number, s: any) => sum + s.totalStudents, 0) / totalStudentsSubjects.length)
        : 0;

        const excellentSubjects = groupSubjects.filter(s => (s.excellent.count || 0) > 0);
        const excellentCount = excellentSubjects.length > 0
          ? Math.round(excellentSubjects.reduce((sum: number, s: any) => sum + (s.excellent.count || 0), 0) / excellentSubjects.length)
          : 0;

        const veryGoodSubjects = groupSubjects.filter(s => (s.veryGood.count || 0) > 0);
        const veryGoodCount = veryGoodSubjects.length > 0
          ? Math.round(veryGoodSubjects.reduce((sum: number, s: any) => sum + (s.veryGood.count || 0), 0) / veryGoodSubjects.length)
          : 0;

        const goodSubjects = groupSubjects.filter(s => (s.good.count || 0) > 0);
        const goodCount = goodSubjects.length > 0
          ? Math.round(goodSubjects.reduce((sum: number, s: any) => sum + (s.good.count || 0), 0) / goodSubjects.length)
          : 0;

        const acceptableSubjects = groupSubjects.filter(s => (s.acceptable.count || 0) > 0);
        const acceptableCount = acceptableSubjects.length > 0
          ? Math.round(acceptableSubjects.reduce((sum: number, s: any) => sum + (s.acceptable.count || 0), 0) / acceptableSubjects.length)
          : 0;

        const weakSubjects = groupSubjects.filter(s => (s.weak.count || 0) > 0);
        const weakCount = weakSubjects.length > 0
          ? Math.round(weakSubjects.reduce((sum: number, s: any) => sum + (s.weak.count || 0), 0) / weakSubjects.length)
          : 0;

        const failedSubjects = groupSubjects.filter(s => (s.failed?.count || 0) > 0);
        const failedCount = failedSubjects.length > 0
          ? Math.round(failedSubjects.reduce((sum: number, s: any) => sum + (s.failed?.count || 0), 0) / failedSubjects.length)
          : 0;

        const needsHelpSubjects = groupSubjects.filter(s => (s.needsHelp?.count || 0) > 0);
        const needsHelpCount = needsHelpSubjects.length > 0
          ? Math.round(needsHelpSubjects.reduce((sum: number, s: any) => sum + (s.needsHelp?.count || 0), 0) / needsHelpSubjects.length)
          : 0;

      // Calculate percentages
      const excellentPercentage = totalStudents > 0 ? Math.round((excellentCount / totalStudents) * 100) : 0;
      const veryGoodPercentage = totalStudents > 0 ? Math.round((veryGoodCount / totalStudents) * 100) : 0;
      const goodPercentage = totalStudents > 0 ? Math.round((goodCount / totalStudents) * 100) : 0;
      const acceptablePercentage = totalStudents > 0 ? Math.round((acceptableCount / totalStudents) * 100) : 0;
      const weakPercentage = totalStudents > 0 ? Math.round((weakCount / totalStudents) * 100) : 0;
      const failedPercentage = totalStudents > 0 ? Math.round((failedCount / totalStudents) * 100) : 0;
      const needsHelpPercentage = totalStudents > 0 ? Math.round((needsHelpCount / totalStudents) * 100) : 0;

      allSubjectsTotals.push({
        name: averageName,
        totalStudents: totalStudents,
        excellent: {
          count: excellentCount,
          percentage: excellentPercentage
        },
        veryGood: {
          count: veryGoodCount,
          percentage: veryGoodPercentage
        },
        good: {
          count: goodCount,
          percentage: goodPercentage
        },
        acceptable: {
          count: acceptableCount,
          percentage: acceptablePercentage
        },
        weak: {
          count: weakCount,
          percentage: weakPercentage
        },
        failed: {
          count: failedCount,
          percentage: failedPercentage
        },
        needsHelp: {
          count: needsHelpCount,
          percentage: needsHelpPercentage
        },
        isAverageRow: isAverageRow
      });
    }
  }

  // Add overall total across all subjects
  private addOverallTotal(allSubjectsTotals: SubjectAchievement[]): void {
    const coreSubjects = allSubjectsTotals.filter(s => !s.isAverageRow && !s.totalRow);
    
    if (coreSubjects.length > 0) {
      const totalStudents = coreSubjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0);
      const excellentCount = coreSubjects.reduce((sum, s) => sum + (s.excellent.count || 0), 0);
      const veryGoodCount = coreSubjects.reduce((sum, s) => sum + (s.veryGood.count || 0), 0);
      const goodCount = coreSubjects.reduce((sum, s) => sum + (s.good.count || 0), 0);
      const acceptableCount = coreSubjects.reduce((sum, s) => sum + (s.acceptable.count || 0), 0);
      const weakCount = coreSubjects.reduce((sum, s) => sum + (s.weak.count || 0), 0);
      const failedCount = coreSubjects.reduce((sum, s) => sum + (s.failed?.count || 0), 0);
      const needsHelpCount = coreSubjects.reduce((sum, s) => sum + (s.needsHelp?.count || 0), 0);

      // Calculate percentages
      const excellentPercentage = totalStudents > 0 ? Math.round((excellentCount / totalStudents) * 100) : 0;
      const veryGoodPercentage = totalStudents > 0 ? Math.round((veryGoodCount / totalStudents) * 100) : 0;
      const goodPercentage = totalStudents > 0 ? Math.round((goodCount / totalStudents) * 100) : 0;
      const acceptablePercentage = totalStudents > 0 ? Math.round((acceptableCount / totalStudents) * 100) : 0;
      const weakPercentage = totalStudents > 0 ? Math.round((weakCount / totalStudents) * 100) : 0;
      const failedPercentage = totalStudents > 0 ? Math.round((failedCount / totalStudents) * 100) : 0;
      const needsHelpPercentage = totalStudents > 0 ? Math.round((needsHelpCount / totalStudents) * 100) : 0;

      allSubjectsTotals.push({
        name: 'المجموع',
        totalStudents: totalStudents,
        excellent: {
          count: excellentCount,
          percentage: excellentPercentage
        },
        veryGood: {
          count: veryGoodCount,
          percentage: veryGoodPercentage
        },
        good: {
          count: goodCount,
          percentage: goodPercentage
        },
        acceptable: {
          count: acceptableCount,
          percentage: acceptablePercentage
        },
        weak: {
          count: weakCount,
          percentage: weakPercentage
        },
        failed: {
          count: failedCount,
          percentage: failedPercentage
        },
        needsHelp: {
          count: needsHelpCount,
          percentage: needsHelpPercentage
        },
        totalRow: true
      });
    }
  }


  updateTotals(grade: any) {
  // ابحث عن الصف الإجمالي لو موجود
  let totalRow = grade.subjects.find((s: any) => s.totalRow);
   console.log(1111111111111);
   console.log(totalRow);
  // لو مش موجود، أنشئ صف جديد
  if (!totalRow) {
    totalRow = {
      name: 'الإجمالي',
      totalRow: true,
      totalStudents: 0,
      excellent: { count: 0, percentage: 0 },
      veryGood: { count: 0, percentage: 0 },
      good: { count: 0, percentage: 0 },
      acceptable: { count: 0, percentage: 0 },
      weak: { count: 0, percentage: 0 }
    };
    grade.subjects.push(totalRow);
    console.log(1111111111111);
   console.log(grade.subjects);
  }

  // إعادة تعيين القيم للصفر قبل الجمع
  totalRow.totalStudents = 0;
  totalRow.excellent.count = 0;
  totalRow.veryGood.count = 0;
  totalRow.good.count = 0;
  totalRow.acceptable.count = 0;
  totalRow.weak.count = 0;

  // اجمع كل القيم من الصفوف العادية
  grade.subjects.forEach((subject: any) => {
    if (!subject.totalRow) {
      totalRow.totalStudents += subject.totalStudents || 0;
      totalRow.excellent.count += subject.excellent.count || 0;
      totalRow.veryGood.count += subject.veryGood.count || 0;
      totalRow.good.count += subject.good.count || 0;
      totalRow.acceptable.count += subject.acceptable.count || 0;
      totalRow.weak.count += subject.weak.count || 0;
    }
  });

  // حساب النسب المئوية
  if (totalRow.totalStudents > 0) {
    totalRow.excellent.percentage = ((totalRow.excellent.count / totalRow.totalStudents) * 100).toFixed(2);
    totalRow.veryGood.percentage = ((totalRow.veryGood.count / totalRow.totalStudents) * 100).toFixed(2);
    totalRow.good.percentage = ((totalRow.good.count / totalRow.totalStudents) * 100).toFixed(2);
    totalRow.acceptable.percentage = ((totalRow.acceptable.count / totalRow.totalStudents) * 100).toFixed(2);
    totalRow.weak.percentage = ((totalRow.weak.count / totalRow.totalStudents) * 100).toFixed(2);
  } else {
    totalRow.excellent.percentage = '0';
    totalRow.veryGood.percentage = '0';
    totalRow.good.percentage = '0';
    totalRow.acceptable.percentage = '0';
    totalRow.weak.percentage = '0';
  }
}

} 