import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ItqanData, ItqanSubjectData, SchoolInfo } from '../../types/school-info';
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';
import { AddSubjectModalComponent, SubjectData } from '../../../../shared/add-subject-modal/add-subject-modal.component';
import { ToastService } from 'src/app/core/services/toast-service';


@Component({
  selector: 'app-mastery-rates',
  templateUrl: './mastery-rates.component.html',
  styleUrls: ['./mastery-rates.component.scss']
})
export class MasteryRatesComponent implements OnInit {
  // Grades array for collapsible panels
  //grades: MasteryGrade[] = [];
  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = true;


  constructor(
    private modalService: NgbModal,
    public translate: TranslateService,
    private toastService: ToastService,
  ) { }



  ngOnInit(): void {

    if (!this.schoolInfo.itqanData) {
      this.schoolInfo.itqanData = [];
    }

    this.schoolInfo.itqanData?.forEach((itqanItem: ItqanData) => {

      this.addAverageRows(itqanItem);

      itqanItem?.subjects?.forEach((subject: ItqanSubjectData) => {
        this.updateJudgment(subject);
      });

      this.sortSubject(itqanItem?.subjects);
    });

    this.sortItqanDataAscending();

  }

  private sortSubject(subjects: ItqanSubjectData[]) {

    const subjectOrder = [
      'التربية الاسلامية',
      'اللغة العربية',
      'اللغة الانجليزية',
      'الرياضيات',
      'الرياضيات المتقدمة',
      'الرياضيات الأساسية',
      'العلوم',
      'الفيزياء',
      'الكيمياء',
      'الاحياء',
      'العلوم البيئية',
      'العلوم والتقانة',
      'الدراسات الاجتماعية',
      'التاريخ (الحضارة الاسلامية)',
      'التاريخ (العالم من حولي)',
      'الجغرافيا الاقتصادية',
      'الجغرافيا والتقنيات الحديثة',
      'متوسط العلوم',
      'متوسط الرياضيات',
      'متوسط الدراسات',
      'المتوسط العام'
    ];

    subjects.sort((a: any, b: any) => {
      const aIndex = subjectOrder.indexOf(a.name);
      const bIndex = subjectOrder.indexOf(b.name);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

  }


  sortItqanDataAscending(): void {
    const gradeOrder = [
      "الأول", "الثاني", "الثالث", "الرابع", "الخامس",
      "السادس", "السابع", "الثامن", "التاسع",
      "العاشر", "الحادي عشر", "الثاني عشر"
    ];

    this.schoolInfo.itqanData.sort((a, b) => {
      return gradeOrder.indexOf(a.name) - gradeOrder.indexOf(b.name);
    });
  }

  // Get translated subject names
  private getTranslatedSubjectName(key: string): string {
    return this.translate.instant(`PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.SUBJECTS.${key}`);
  }

  // Get translated judgment values
  private getTranslatedJudgment(key: string): string {
    return this.translate.instant(`PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.JUDGMENT_VALUES.${key}`);
  }

  // Toggle the open/closed state of a grade panel
  toggleGradePanel(index: number): void {
    this.schoolInfo.itqanData[index].open = !this.schoolInfo.itqanData[index].open;
  }

  // Check if should show grade body (for print, always show; for screen, check open state)
  shouldShowGradeBody(grade: ItqanData): boolean {
    return grade.open || false;
  }

  // Calculate totals across all grades (excluding not applicable grades)
  getTotalStudentsAllGrades(): number {
    return this.schoolInfo.itqanData
      .filter(grade => !grade.notApplicable)
      .reduce((total, grade) => {
        const nonAverageSubjects = grade.subjects.filter(s => !s.averageRow);
        return total + (nonAverageSubjects.length > 0 ? nonAverageSubjects[0].totalStudents || 0 : 0);
      }, 0);
  }

  getTotalAbove75AllGrades(): number {
    const validGrades = this.schoolInfo.itqanData.filter(grade => !grade.notApplicable);
    if (validGrades.length === 0) return 0;

    const total = validGrades.reduce((sum, grade) => {
      return sum + this.getTotalAbove75ForGrade(grade);
    }, 0);

    return Math.round((total / validGrades.length) * 100) / 100;
  }

  getTotalPercentageAllGrades(): number {
    const validGrades = this.schoolInfo.itqanData.filter(grade => !grade.notApplicable);
      if (validGrades.length === 0) return 0;

      const total = validGrades.reduce((sum, grade) => {
        return sum + this.getTotalPercentageForGrade(grade);
      }, 0);

      return Math.round((total / validGrades.length) * 100) / 100;
  }

  getOverallJudgmentAllGrades(): string {
    const percentage = this.getTotalPercentageAllGrades();
    if (percentage >= 70) return 'متميز';
    if (percentage >= 60) return 'جيد';
    if (percentage >= 50) return 'ملائم';
    if (percentage >= 40) return 'غير ملائم';
    return 'يحتاج إلى تدخل سريع';
  }

  getAllGradesTotals1(): ItqanSubjectData[] {
    const allGradesTotals: ItqanSubjectData[] = [];

    const subjectNames = new Set<string>();
    this.schoolInfo.itqanData
      .filter(grade => !grade.notApplicable)
      .forEach(grade => {
        grade.subjects.forEach(subject => {
          if (!subject.isOtherSubjects && !subject.isOverallJudgmentRow) {
            subjectNames.add(subject.name); 
          }
        });
      });

       subjectNames.forEach(subjectName => {
    let totalAbove75Count = 0;
    let totalAbove75Percent = 0;
    let countGradesWithSubjectData = 0;

    this.schoolInfo.itqanData
      .filter(grade => !grade.notApplicable)
      .forEach(grade => {
        const subject = grade.subjects.find(s => s.name === subjectName);
        if (subject && subject.above75Count && subject.above75Percent) {
          totalAbove75Count += subject.above75Count;
          totalAbove75Percent += subject.above75Percent;
          countGradesWithSubjectData++;
        }
      });
   if (countGradesWithSubjectData > 0) {
      const avgAbove75Count = Math.round(totalAbove75Count / countGradesWithSubjectData);
      const avgAbove75Percent = Math.round(totalAbove75Percent / countGradesWithSubjectData * 100) / 100;

      let judgment = '';
      if (avgAbove75Percent >= 70) judgment = 'متميز';
      else if (avgAbove75Percent >= 60) judgment = 'جيد';
      else if (avgAbove75Percent >= 50) judgment = 'ملائم';
      else if (avgAbove75Percent >= 40) judgment = 'غير ملائم';
      else judgment = 'يحتاج إلى تدخل سريع';

      allGradesTotals.push({
        name: subjectName,
        above75Count: avgAbove75Count,
        above75Percent: avgAbove75Percent,
        judgment
      });
    }
  });

  const otherSubjectsTotal = this.calculateOtherSubjectsTotal();
  if (otherSubjectsTotal) allGradesTotals.push(otherSubjectsTotal);

  this.sortSubject(allGradesTotals);

  return allGradesTotals;
}

  // Get all grades totals for the combined table (excluding not applicable grades)
  getAllGradesTotals(): ItqanSubjectData[] {
    const allGradesTotals: ItqanSubjectData[] = [];

    // Get all unique subject names from applicable grades only (excluding average rows, other subjects, and overall judgment)
    const subjectNames = new Set<string>();
    this.schoolInfo.itqanData
      .filter(grade => !grade.notApplicable)
      .forEach(grade => {
        grade.subjects.forEach(subject => {
          if (!subject.averageRow && !subject.isOtherSubjects && !subject.isOverallJudgmentRow) {
            subjectNames.add(subject.name);
          }
        });
      });

    // Calculate totals for each subject across applicable grades only
    subjectNames.forEach(subjectName => {
      const subjectsWithName = this.schoolInfo.itqanData
        .filter(grade => !grade.notApplicable)
        .map(grade => grade.subjects.find(s => s.name === subjectName))
        .filter(s => s !== undefined) as ItqanSubjectData[];

      if (subjectsWithName.length > 0) {
        const totalStudents = subjectsWithName.reduce((sum, s) => sum + (s.totalStudents || 0), 0);
        const totalAbove75Count = subjectsWithName.reduce((sum, s) => sum + (s.above75Count || 0), 0);
        const totalPercentage = totalStudents > 0 ? Math.round((totalAbove75Count / totalStudents) * 10000) / 100 : 0;

        let judgment = '';
        if (totalPercentage >= 70) judgment = 'متميز';
        else if (totalPercentage >= 60) judgment = 'جيد';
        else if (totalPercentage >= 50) judgment = 'ملائم';
        else if (totalPercentage >= 40) judgment = 'غير ملائم';
        else judgment = 'يحتاج إلى تدخل سريع';

        allGradesTotals.push({
          name: subjectName,
          totalStudents: totalStudents,
          above75Count: totalAbove75Count,
          above75Percent: totalPercentage,
          judgment: judgment
        });
      }
    });

    // Add subject group averages
    const mathSubjects = ['الرياضيات الأساسية', 'الرياضيات المتقدمة'];
    const scienceSubjects = ['الفيزياء', 'الكيمياء', 'الاحياء', 'العلوم البيئية','العلوم والتقانة'];
    const socialSubjects = ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية'];

    // Add Math Average
    this.addGroupAverage(allGradesTotals, mathSubjects, 'متوسط الرياضيات', true);

    // Add Science Average
    this.addGroupAverage(allGradesTotals, scienceSubjects, 'متوسط العلوم', true);

    // Add Social Studies Average
    this.addGroupAverage(allGradesTotals, socialSubjects, 'متوسط الدراسات الاجتماعية', true);

    // Add Other Subjects total
    const otherSubjectsTotal = this.calculateOtherSubjectsTotal();
    if (otherSubjectsTotal) {
      allGradesTotals.push(otherSubjectsTotal);
    }

    this.sortSubject(allGradesTotals);

    return allGradesTotals;
  }

  // Helper method to add group averages
  private addGroupAverage(allGradesTotals: ItqanSubjectData[], subjectNames: string[], averageName: string, averageRow: boolean): void {
    const groupSubjects = allGradesTotals.filter(s => subjectNames.includes(s.name));

    if (groupSubjects.length > 0) {
      // متوسط الطلاب الكلي (totalStudents)
      const studentsWithValue = groupSubjects.filter(s => s.totalStudents);
      const totalStudents = Math.round(
        studentsWithValue.reduce((sum, s) => sum + (s.totalStudents || 0), 0) / studentsWithValue.length
      );

      // متوسط الطلاب اللي جابوا أكثر من 75% (above75Count)
      const countWithValue = groupSubjects.filter(s => s.above75Count);
      const totalCount = Math.round(
        countWithValue.reduce((sum, s) => sum + (s.above75Count || 0), 0)/ countWithValue.length
      );

      // متوسط النسبة المئوية (above75Percent)
      const percentWithValue = groupSubjects.filter(s => s.above75Percent);
      const totalPercentage = percentWithValue.reduce((sum, s) => sum +(s.above75Percent || 0), 0) / percentWithValue.length;

      let judgment = '';
      if (totalPercentage >= 70) judgment = 'متميز';
      else if (totalPercentage >= 60) judgment = 'جيد';
      else if (totalPercentage >= 50) judgment = 'ملائم';
      else if (totalPercentage >= 40) judgment = 'غير ملائم';
      else judgment = 'يحتاج إلى تدخل سريع';

      allGradesTotals.push({
        name: averageName,
        totalStudents: totalStudents,
        above75Count: totalCount,
        above75Percent: Math.round(totalPercentage * 100) / 100,
        judgment: judgment,
        averageRow: averageRow
      });
    }
  }

  // Calculate other subjects total across applicable grades only
  private calculateOtherSubjectsTotal(): ItqanSubjectData | null {
    const otherSubjects = this.schoolInfo.itqanData
      .filter(grade => !grade.notApplicable)
      .map(grade => grade.subjects.find(s => s.isOtherSubjects))
      .filter(s => s !== undefined) as ItqanSubjectData[];

    if (otherSubjects.length > 0) {
      const totalStudents = otherSubjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0);
      const totalAbove75Count = otherSubjects.reduce((sum, s) => sum + (s.above75Count || 0), 0);
      const totalPercentage = totalStudents > 0 ? Math.round((totalAbove75Count / totalStudents) * 10000) / 100 : 0;

      let judgment = '';
      if (totalPercentage >= 70) judgment = 'متميز';
      else if (totalPercentage >= 60) judgment = 'جيد';
      else if (totalPercentage >= 50) judgment = 'ملائم';
      else if (totalPercentage >= 40) judgment = 'غير ملائم';
      else judgment = 'يحتاج إلى تدخل سريع';

      return {
        name: 'مواد أخرى',
        totalStudents: totalStudents,
        above75Count: totalAbove75Count,
        above75Percent: totalPercentage,
        judgment: judgment,
        isOtherSubjects: true
      };
    }

    return null;
  }

  // Calculate overall judgment for all grades in the combined table
  private calculateOverallJudgmentForAllGrades(allGradesTotals: ItqanSubjectData[]): string {
    const coreSubjects = allGradesTotals.filter(s =>
      !s.averageRow &&
      !s.isOtherSubjects &&
      !s.isOverallJudgmentRow &&
      s.above75Percent !== undefined
    );

    if (coreSubjects.length === 0) return 'غير محدد';

    const subjectsWithValue = coreSubjects.filter(subject => subject.above75Percent);

    // مجموع النسب
    const totalPercentage = subjectsWithValue.reduce((sum, subject) => sum + (subject.above75Percent || 0), 0);

    // المتوسط على المواد اللي ليها قيمة فقط
    const averagePercentage = totalPercentage / subjectsWithValue.length;


    if (averagePercentage >= 70) return 'متميز';
    if (averagePercentage >= 60) return 'جيد';
    if (averagePercentage >= 50) return 'ملائم';
    if (averagePercentage >= 40) return 'غير ملائم';
    return 'يحتاج إلى تدخل سريع';
  }

  // Calculate overall judgment for a specific grade
  getGradeOverallJudgment(grade: ItqanData): string {
    const coreSubjects = grade.subjects.filter(s =>
      !s.averageRow &&
      !s.isOtherSubjects &&
      !s.isOverallJudgmentRow &&
      s.above75Percent !== undefined
    );

    if (coreSubjects.length === 0) return 'غير محدد';

    const totalPercentage = coreSubjects.reduce((sum, subject) => sum + (subject.above75Percent || 0), 0);
    const averagePercentage = totalPercentage / coreSubjects.length;

    if (averagePercentage >= 70) return 'متميز';
    if (averagePercentage >= 60) return 'جيد';
    if (averagePercentage >= 50) return 'ملائم';
    if (averagePercentage >= 40) return 'غير ملائم';
    return 'يحتاج إلى تدخل سريع';
  }

  onSubjectCompleted(grade: ItqanData, subject: ItqanSubjectData) {
    if (subject.totalStudents == 0 ||
      (subject.totalStudents && subject.above75Count !== undefined && subject.above75Count > subject.totalStudents)) {
      subject.totalStudents = 0;
      subject.above75Count = 0;
      subject.above75Percent = 0;

      this.updateJudgment(subject);
      // Update average rows if needed
      this.updateAverageRows(grade);

      this.addAverageRows(grade);
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.STUDENTS_MASTERY_CONDITION'), { classname: 'bg-danger text-white', autohide: false });

    }

  }

  // Handle subject data changes (only for total students since percentage and judgment are auto-calculated)
  onSubjectDataChange(grade: ItqanData, subject: ItqanSubjectData): void {
    // Auto-calculate percentage if both totalStudents and above75Count are available
    if (subject.totalStudents && subject.above75Count !== undefined && subject.totalStudents > 0) {
      subject.above75Percent = Math.round((subject.above75Count / subject.totalStudents) * 10000) / 100;
    }
    // Auto-determine judgment based on percentage
    this.updateJudgment(subject);

    // Update average rows if needed
    this.updateAverageRows(grade);

    this.addAverageRows(grade);

  }

  // Handle count input changes for real-time percentage calculation
  onCountChange(grade: ItqanData, subject: ItqanSubjectData, event: any): void {
    let countValue = parseInt(event.target.value) || 0;

    if (countValue > (subject.totalStudents || 0)) {
      countValue = 0;
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.STUDENTS_MASTERY_CONDITION'), { classname: 'bg-danger text-white', autohide: false });
    }

    subject.above75Count = countValue;

    // Auto-calculate percentage if total students is available
    if (subject.totalStudents && subject.totalStudents > 0) {
      subject.above75Percent = Math.round((countValue / subject.totalStudents) * 10000) / 100;
      this.updateJudgment(subject);
    }

    // Update average rows
    this.updateAverageRows(grade);

    this.addAverageRows(grade);
  }

  // Update judgment based on percentage
  private updateJudgment(subject: ItqanSubjectData): void {
    if (subject.above75Percent !== undefined) {
      if (subject.above75Percent >= 70) {
        subject.judgment = this.getTranslatedJudgment('EXCELLENT');
      } else if (subject.above75Percent >= 60) {
        subject.judgment = this.getTranslatedJudgment('GOOD');
      } else if (subject.above75Percent >= 50) {
        subject.judgment = this.getTranslatedJudgment('ACCEPTABLE');
      } else if (subject.above75Percent >= 40) {
        subject.judgment = this.getTranslatedJudgment('INADEQUATE');
      } else {
        subject.judgment = this.getTranslatedJudgment('NEEDS_URGENT_INTERVENTION');
      }
    }
  }

  // Update average rows for subject groups
  private updateAverageRows(grade: ItqanData): void {
    // Update Mathematics average
    this.updateSubjectGroupAverage(grade,
      [this.getTranslatedSubjectName('BASIC_MATHEMATICS'), this.getTranslatedSubjectName('ADVANCED_MATHEMATICS')],
      this.getTranslatedSubjectName('MATHEMATICS_AVERAGE'));

    // Update Science average
    this.updateSubjectGroupAverage(grade,
      [this.getTranslatedSubjectName('PHYSICS'), this.getTranslatedSubjectName('CHEMISTRY'), this.getTranslatedSubjectName('BIOLOGY'), this.getTranslatedSubjectName('ENVIRONMENT_SCIENCE'), this.getTranslatedSubjectName('TECHNOLOGY_SCIENCE')],
      this.getTranslatedSubjectName('SCIENCE_AVERAGE'));

    // Update Social Studies average
    this.updateSubjectGroupAverage(grade,
      [this.getTranslatedSubjectName('HISTORY'), this.getTranslatedSubjectName('GEOGRAPHY'), this.getTranslatedSubjectName('SOCIAL_STUDIES')],
      this.getTranslatedSubjectName('SOCIAL_STUDIES_AVERAGE'));
  }

  // Update average for a specific subject group
  private updateSubjectGroupAverage(grade: ItqanData, subjectNames: string[], averageName: string): void {
    const subjects = grade.subjects.filter(s => subjectNames.includes(s.name));
    const averageSubject = grade.subjects.find(s => s.name === averageName);

    if (subjects.length > 0 && averageSubject) {
       const validSubjects = subjects.filter(s =>
          (s.totalStudents || 0) > 0 &&
          (s.above75Count || 0) > 0 &&
          (s.above75Percent || 0) > 0
        );

      if (validSubjects.length > 0) {
        // Calculate average total students
        const totalStudents = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.totalStudents || 0), 0) / validSubjects.length
        );

        // Calculate average count
        const totalCount = Math.round(
          validSubjects.reduce((sum, s) => sum + (s.above75Count || 0), 0) / validSubjects.length
        );

        // Calculate average percentage
        const totalPercentage =
          validSubjects.reduce((sum, s) => sum + (s.above75Percent || 0), 0) / validSubjects.length;

        // Update average subject
        averageSubject.totalStudents = totalStudents;
        averageSubject.above75Count = totalCount;
        averageSubject.above75Percent = Math.round(totalPercentage * 100) / 100;

        // Determine judgment
        if (averageSubject.above75Percent >= 70) {
          averageSubject.judgment = this.getTranslatedJudgment('EXCELLENT');
        } else if (averageSubject.above75Percent >= 60) {
          averageSubject.judgment = this.getTranslatedJudgment('GOOD');
        } else if (averageSubject.above75Percent >= 50) {
          averageSubject.judgment = this.getTranslatedJudgment('ACCEPTABLE');
        } else if (averageSubject.above75Percent >= 40) {
          averageSubject.judgment = this.getTranslatedJudgment('INADEQUATE');
        } else {
          averageSubject.judgment = this.getTranslatedJudgment('NEEDS_URGENT_INTERVENTION');
        }
      }
    }
  }

  // Button actions (stubs for now)
  onBack(): void {
    // Implement navigation or logic as needed
    window.history.back();
  }

  onAddSubjectToGrade(gradeIndex: number, event: Event): void {
    // Prevent the click from bubbling up to the grade header toggle
    event.stopPropagation();

    // Check if grade is not applicable (disabled)
    if (this.schoolInfo.itqanData[gradeIndex].notApplicable) {
      return; // No action if grade is disabled
    }

    const modalRef = this.modalService.open(AddSubjectModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });

    modalRef.result.then((subjectData: SubjectData) => {
      if (subjectData && this.schoolInfo.itqanData[gradeIndex]) {
        const grade = this.schoolInfo.itqanData[gradeIndex];

        const isDuplicate = grade.subjects.some(s => s.name.trim() === subjectData.arabicName.trim());
          if (isDuplicate) {
            ModalConfirmComponent.openAlert(
              this.modalService,
              `${this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.SUBJECT_ALREADY_EXISTS')}`,
              this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
              'error'
            );
            return; // يخرج بدون إضافة المادة
          }

        // Find the index of "مواد أخرى" to insert before it
        const otherSubjectsIndex = grade.subjects.findIndex(s => s.isOtherSubjects);
        const insertIndex = otherSubjectsIndex !== -1 ? otherSubjectsIndex : grade.subjects.length - 1;

        // Create new subject with default values
        const newSubject: ItqanSubjectData = {
          name: subjectData.arabicName,
          totalStudents: grade.subjects[0]?.totalStudents || 30, // Use same as first subject or default 30
          above75Count: 0,
          above75Percent: 0,
          judgment: this.getTranslatedJudgment('NEEDS_URGENT_INTERVENTION')
        };

        // Insert the new subject
        grade.subjects.splice(insertIndex, 0, newSubject);

        // Show success message
        ModalConfirmComponent.openAlert(
          this.modalService,
          `${this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.SUBJECT_ADDED_SUCCESS')} "${subjectData.arabicName}" ${grade.name}`,
          this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
          'success'
        );
      }
    }).catch(() => {
      // Modal was dismissed/cancelled - no action needed
    });
  }

  onExit(): void {
    // Implement exit logic as needed
    // For now, just go back
    window.history.back();
  }

  // Check if a subject can show delete button (show for all except special rows)
  canDeleteSubject(subject: ItqanSubjectData): boolean {
    // Show delete button for all subjects except average rows, other subjects, and overall judgment rows
    return !subject.averageRow &&
      !subject.isOtherSubjects &&
      !subject.isOverallJudgmentRow;
  }

  // Check if a subject is actually deletable (used in deletion logic)
  private isDeletableSubject(subject: ItqanSubjectData): boolean {
    // Core subjects that should be protected from deletion
    const coreSubjects = [
      this.getTranslatedSubjectName('ISLAMIC_EDUCATION'),
      this.getTranslatedSubjectName('ARABIC_LANGUAGE'),
      this.getTranslatedSubjectName('ENGLISH_LANGUAGE'),
      this.getTranslatedSubjectName('BASIC_MATHEMATICS'),
      this.getTranslatedSubjectName('ADVANCED_MATHEMATICS'),
      this.getTranslatedSubjectName('PHYSICS'),
      this.getTranslatedSubjectName('CHEMISTRY'),
      this.getTranslatedSubjectName('SCIENCE'),
      this.getTranslatedSubjectName('MATH'),
      this.getTranslatedSubjectName('BIOLOGY'),
      this.getTranslatedSubjectName('ENVIRONMENT_SCIENCE'),
      this.getTranslatedSubjectName('TECHNOLOGY_SCIENCE'),
      this.getTranslatedSubjectName('HISTORY'),
      this.getTranslatedSubjectName('GEOGRAPHY'),
      this.getTranslatedSubjectName('SOCIAL_STUDIES')
    ];

    // Can delete if it's not a core subject and not a special row
    return !coreSubjects.includes(subject.name) &&
      !subject.averageRow &&
      !subject.isOtherSubjects &&
      !subject.isOverallJudgmentRow;
  }

  // Delete a subject from a specific grade
  onDeleteSubject(gradeIndex: number, subjectIndex: number, subject: ItqanSubjectData): void {
    // Check if grade is not applicable (disabled)
    if (this.schoolInfo.itqanData[gradeIndex].notApplicable) {
      return; // No action if grade is disabled
    }

    // Check if the subject is actually deletable (core subject protection)
    if (!this.isDeletableSubject(subject)) {
      // Show warning for core subjects
      ModalConfirmComponent.openAlert(
        this.modalService,
        `${this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.CANNOT_DELETE_CORE_SUBJECT')} "${subject.name}"`,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.WARNING'),
        'warning'
      );
      return;
    }

    // Show confirmation dialog using the correct method
    ModalConfirmComponent.openConfirm(
      this.modalService,
      `${this.translate.instant('PAGES.COMMON.LABELS.CONFIRM')} "${subject.name}" ${this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.SUBJECT_DELETED_SUCCESS')} ${this.schoolInfo.itqanData[gradeIndex].name}؟`,
      this.translate.instant('PAGES.COMMON.LABELS.CONFIRM')
    ).then((result) => {
      if (result && this.schoolInfo.itqanData[gradeIndex]) {
        // Remove the subject from the grade
        this.schoolInfo.itqanData[gradeIndex].subjects.splice(subjectIndex, 1);

        // Update average rows after deletion
        this.updateAverageRows(this.schoolInfo.itqanData[gradeIndex]);

        // Show success message
        ModalConfirmComponent.openAlert(
          this.modalService,
          `${this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.SUBJECT_DELETED_SUCCESS')} "${subject.name}" ${this.schoolInfo.itqanData[gradeIndex].name}`,
          this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
          'success'
        );
      }
    }).catch(() => {
      // Modal was dismissed/cancelled - no action needed
    });
  }

  onSave(): void {
    // Implement save logic as needed
    ModalConfirmComponent.openAlert(
      this.modalService,
      this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MASTERY_RATES.DATA_SAVED'),
      this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
      'success'
    );
  }



  // calc per grad
  getTotalStudentsForGrade(grade: ItqanData): number {
    const nonAverageSubjects = grade.subjects.filter(s => !s.averageRow);
    return nonAverageSubjects.reduce((sum, subject) => {
      return sum + (subject.totalStudents || 0);
    }, 0);
  }

  getTotalAbove75ForGrade(grade: ItqanData): number {
    const subjectNames = ['متوسط الرياضيات','متوسط الدراسات','متوسط العلوم','الرياضيات', 'العلوم', 'التربية الاسلامية', 'اللغة العربية', 'اللغة الانجليزية'];
      let total = 0;
      let count = 0;

      grade.subjects.forEach(subject => {
        if (subjectNames.includes(subject.name) && subject.above75Count) { 
          total += subject.above75Count;
          count++;
        }
      });

      if (count === 0) return 0;

      return Math.round((total / count) * 100) / 100;
  }
  

  getTotalPercentageForGrade(grade: ItqanData): number {
      const subjectNames = ['متوسط الرياضيات','متوسط الدراسات','متوسط العلوم','الرياضيات', 'العلوم', 'التربية الاسلامية', 'اللغة العربية', 'اللغة الانجليزية'];
      let total = 0;
      let count = 0;

      grade.subjects.forEach(subject => {
        if (subjectNames.includes(subject.name) && subject.above75Percent) { 
          total += subject.above75Percent;
          count++;
        }
      });

      if (count === 0) return 0;

      return Math.round((total / count) * 100) / 100;
  
  }

  getOverallJudgmentForGrade(grade: ItqanData): string {
    const percentage = this.getTotalPercentageForGrade(grade);
    if (percentage >= 70) return 'متميز';
    if (percentage >= 60) return 'جيد';
    if (percentage >= 50) return 'ملائم';
    if (percentage >= 40) return 'غير ملائم';
    return 'يحتاج إلى تدخل سريع';
  }



  //--- per grade
  private addAverageRows(grade: any): void {
    grade.subjects = grade.subjects.filter((s: any) => !s.averageRow);

    const groups = [
      { name: 'متوسط العلوم', subjects: ['الفيزياء', 'الكيمياء', 'الاحياء', 'العلوم البيئية','العلوم والتقانة'] },
      { name: 'متوسط الرياضيات', subjects: ['الرياضيات الأساسية', 'الرياضيات المتقدمة'] },
      { name: 'متوسط الدراسات', subjects: ['التاريخ', 'الجغرافيا', 'الدراسات الاجتماعية','الجغرافيا والتقنيات الحديثة','الجغرافيا الاقتصادية','التاريخ (العالم من حولي)','التاريخ (الحضارة الاسلامية)'] }
    ];

    groups.forEach(group => {
      const selectedSubjects = grade.subjects.filter((s: any) =>
        group.subjects.includes(s.name)
      );

      if (selectedSubjects.length > 0) {
        const nonZeroSubjects = selectedSubjects.filter(
          (s: any) => (s.totalStudents || 0) > 0 &&
              (s.above75Count || 0) > 0 &&
              (s.above75Percent || 0) > 0
        );

        if (nonZeroSubjects.length > 0) {
          const totalStudents = Math.round(
            nonZeroSubjects.reduce((sum: number, s: any) => sum + s.totalStudents, 0) / nonZeroSubjects.length
          );

          const above75Count = Math.round(
            nonZeroSubjects.reduce((sum: number, s: any) => sum + s.above75Count, 0) / nonZeroSubjects.length
          );

          const above75Percent = Math.round(
            (nonZeroSubjects.reduce((sum: number, s: any) => sum + s.above75Percent, 0) / nonZeroSubjects.length) * 100
          ) / 100;

         const exists = grade.subjects.some((s: any) => s.name === group.name);

        if (!exists) {
          grade.subjects.push({
            name: group.name,
            totalStudents,
            above75Count,
            above75Percent,
            judgment: this.getJudgment(above75Percent),
            averageRow: true
          });}
        }
      }
    });


    //-- المتوسط العام
    // const normalSubjects = grade.subjects.filter((s: any) => !s.isAverageRow);
    // if (normalSubjects.length > 0) {
    //   const totalStudents = Math.round(
    //     normalSubjects.reduce((sum: number, s: any) => sum + (s.totalStudents || 0), 0) /
    //     normalSubjects.length
    //   );

    //   const above75Count = Math.round(
    //     normalSubjects.reduce((sum: number, s: any) => sum + (s.above75Count || 0), 0) /
    //     normalSubjects.length
    //   );

    //   const above75Percent = totalStudents
    //     ? +(above75Count / totalStudents * 100).toFixed(2)
    //     : 0;

    //   grade.subjects.push({
    //     name: 'المتوسط العام',
    //     totalStudents,
    //     above75Count,
    //     above75Percent,
    //     judgment: this.getJudgment(above75Percent),
    //     isAverageRow: true
    //   });
    // }
  }



  // helper to map percentage → judgment
  private getJudgment(percent: number): string {
    if (percent >= 70) return 'متميز';
    if (percent >= 60) return 'جيد';
    if (percent >= 50) return 'ملائم';
    if (percent >= 40) return 'غير ملائم';
    return 'يحتاج إلى تدخل سريع';
  }

} 