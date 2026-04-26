import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { GradeData, SchoolInfo, StudentCountByGender, StudentCountByStage, StudentRatios } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.scss']
})
export class StudentDataComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  gradeColumns: any[] = [];

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.getAverageSchoolDensity();
    this.setupGridColumns();
  }

  private initializeData() {
    if (!this.schoolInfo.studentCountByGender) {
      this.schoolInfo.studentCountByGender = {} as StudentCountByGender;
    }
    if (!this.schoolInfo.studentCountByStage) {
      this.schoolInfo.studentCountByStage = {} as StudentCountByStage;
    }
    if (!this.schoolInfo.studentRatios) {
      this.schoolInfo.studentRatios = {} as StudentRatios;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      // this.initializeData(); // Re-initialize data if schoolData changes
    }
  }

  // private initializeData(): void {
  //   this.schoolInfo.gradeData = [
  //     { rowNumber: 1, educationalStage: ' 1', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 2, educationalStage: ' 2', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 3, educationalStage: ' 3', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 4, educationalStage: ' 4', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 5, educationalStage: ' 5', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 6, educationalStage: ' 6', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 7, educationalStage: '7', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 8, educationalStage: ' 8', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 9, educationalStage: ' 9', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 10, educationalStage: ' 10', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 11, educationalStage: ' 11', classesPerGrade: '', averageDensityPerClass: '' },
  //     { rowNumber: 12, educationalStage: ' 12', classesPerGrade: '', averageDensityPerClass: '' }
  //   ];
  // }

  private setupGridColumns(): void {
    this.gradeColumns = [

      {
        headerName: 'PAGES.SCHOOL_PERFORMANCE.STUDENT_DATA.EDUCATIONAL_STAGES',
        field: 'educationalStage',
        editable: false,
        width: 250,
        cellStyle: { 'text-align': 'center', 'font-weight': 'bold' },
        headerClass: 'ag-header-cell-center'
      },
      {
        headerName: 'PAGES.SCHOOL_PERFORMANCE.STUDENT_DATA.CLASSES_PER_GRADE',
        field: 'classesPerGrade',
        editable: this.isEditable,
        width: 250,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'ag-header-cell-center',
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          maxLength: 3
        },
        valueSetter: (params: any) => {
          const newValue = params.newValue;

          // Allow empty values
          if (newValue === '' || newValue === null || newValue === undefined) {
            params.data[params.colDef.field] = '';
            return true;
          }

          // Convert to string and check if it's a valid positive integer
          const stringValue = String(newValue).trim();
          const numberValue = parseInt(stringValue, 10);

          // Validate: must be positive integer, no decimals, no negative
          if (!/^\d+$/.test(stringValue) || numberValue <= 0 || isNaN(numberValue)) {
            // Invalid input - keep old value
            return false;
          }

          // Valid input - set the value
          params.data[params.colDef.field] = stringValue;
          return true;
        },
        cellClassRules: {
          'invalid-cell': (params: any) => {
            const value = params.value;
            if (value === '' || value === null || value === undefined) return false;
            const numberValue = parseInt(String(value), 10);
            return !/^\d+$/.test(String(value)) || numberValue <= 0 || isNaN(numberValue);
          }
        }
      },
      {
        headerName: 'PAGES.SCHOOL_PERFORMANCE.STUDENT_DATA.AVERAGE_DENSITY_PER_CLASS',
        field: 'averageDensityPerClass',
        editable: this.isEditable,
        width: 250,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'ag-header-cell-center',
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          maxLength: 6
        },
        valueSetter: (params: any) => {
          const newValue = params.newValue;

          // Allow empty values
          if (newValue === '' || newValue === null || newValue === undefined) {
            params.data[params.colDef.field] = '';
            return true;
          }

          // Convert to string and check if it's a valid positive number (integer or decimal)
          const stringValue = String(newValue).trim();
          const numberValue = parseFloat(stringValue);

          // Validate: must be positive number (decimal or integer), no negative
          if (!/^\d+(\.\d+)?$/.test(stringValue) || numberValue <= 0 || isNaN(numberValue)) {
            // Invalid input - keep old value
            return false;
          }

          // Valid input - set the value (keep as string to preserve decimal places)
          params.data[params.colDef.field] = stringValue;
          return true;
        },
        cellClassRules: {
          'invalid-cell': (params: any) => {
            const value = params.value;
            if (value === '' || value === null || value === undefined) return false;
            const numberValue = parseFloat(String(value));
            return !/^\d+(\.\d+)?$/.test(String(value)) || numberValue <= 0 || isNaN(numberValue);
          }
        }
      }
    ];
  }

  private calculateTotals(): void {
    // Calculate stage totals based on row numbers
    const stage1Total = this.schoolInfo.gradeData
      .filter(grade => grade.rowNumber && grade.rowNumber >= 1 && grade.rowNumber <= 4)
      .reduce((sum, grade) => sum + (grade.totalStudents || 0), 0);

    const stage2Total = this.schoolInfo.gradeData
      .filter(grade => grade.rowNumber && grade.rowNumber >= 5 && grade.rowNumber <= 8)
      .reduce((sum, grade) => sum + (grade.totalStudents || 0), 0);

    const stage3Total = this.schoolInfo.gradeData
      .filter(grade => grade.rowNumber && grade.rowNumber >= 9 && grade.rowNumber <= 12)
      .reduce((sum, grade) => sum + (grade.totalStudents || 0), 0);

    this.schoolInfo.studentCountByStage = {
      stage1to4: stage1Total,
      stage5to8: stage2Total,
      stage9to12: stage3Total
    };
  }

  private calculateRatios(): void {
    const totalStudents = this.schoolInfo.studentCountByGender.total;

    this.schoolInfo.studentRatios.maleStudentsRatio = totalStudents > 0 ?
      Math.round((this.schoolInfo.studentCountByGender.males / totalStudents) * 100 * 100) / 100 : 0;

    this.schoolInfo.studentRatios.femaleStudentsRatio = totalStudents > 0 ?
      Math.round((this.schoolInfo.studentCountByGender.females / totalStudents) * 100 * 100) / 100 : 0;

    this.schoolInfo.studentRatios.averageStudentsPerClass = this.schoolInfo.gradeData.length > 0 ?
      Math.round((this.schoolInfo.gradeData.reduce((sum, grade) => sum + (grade.averageStudentsPerClass || 0), 0) / this.schoolInfo.gradeData.length) * 100) / 100 : 0;

    // Placeholder values - these would typically come from backend
    this.schoolInfo.studentRatios.studentToTeacherRatio = 24.5;
    this.schoolInfo.studentRatios.nonOmaniStudentsRatio = 8.2;
  }

  // Getter methods for statistics
  getTotalStudents(): number {
    return this.schoolInfo.studentCountByGender.total;
  }

  getMaleStudentsTotal(): number {
    return this.schoolInfo.studentCountByGender.males;
  }

  getFemaleStudentsTotal(): number {
    return this.schoolInfo.studentCountByGender.females;
  }

  getStage1to4Total(): number {
    return this.schoolInfo.studentCountByStage.stage1to4;
  }

  getStage5to8Total(): number {
    return this.schoolInfo.studentCountByStage.stage5to8;
  }

  getStage9to12Total(): number {
    return this.schoolInfo.studentCountByStage.stage9to12;
  }

  getLargestStage(): string {
    const stages = [
      { name: ' (1-4)', count: this.schoolInfo.studentCountByStage.stage1to4 },
      { name: ' (5-8)', count: this.schoolInfo.studentCountByStage.stage5to8 },
      { name: ' (9-12)', count: this.schoolInfo.studentCountByStage.stage9to12 }
    ];

    const largest = stages.reduce((max, stage) => stage.count > max.count ? stage : max);
    return largest.name;
  }

  getAverageStudentsPerGrade(): number {
    return this.schoolInfo.gradeData.length > 0 ?
      Math.round((this.schoolInfo.studentCountByGender.total / this.schoolInfo.gradeData.length) * 100) / 100 : 0;
  }

  onCellValueChanged(event: any): void {
    // Handle cell value changes
    console.log('Cell value changed:', event);
  }

  getStagePercentage(stage: 'stage1to4' | 'stage5to8' | 'stage9to12'): number {
    const totalStudents = this.getTotalStudentsFromStages();
    if (totalStudents === 0) return 0;

    const stageCount = this.schoolInfo.studentCountByStage[stage] || 0;
    return Math.round((stageCount / totalStudents) * 100 * 10) / 10; // Round to 1 decimal place
  }

  private getTotalStudentsFromStages(): number {
    return (this.schoolInfo.studentCountByStage.stage1to4 || 0) +
      (this.schoolInfo.studentCountByStage.stage5to8 || 0) +
      (this.schoolInfo.studentCountByStage.stage9to12 || 0);
  }

  getAverageSchoolDensity() {
    if(this.schoolInfo.averageSchoolDensity === 0){
      const totalStudents = this.getTotalStudentsFromStages();
      // This is a placeholder calculation - adjust based on actual requirements
      // For now, assuming it's total students divided by some factor
      this.schoolInfo.averageSchoolDensity =  Math.round(totalStudents / 100 * 10) / 10;
    }
  }

  getOmaniStudentsRatio(): number {
    const nonOmaniRatio = this.schoolInfo.studentRatios.nonOmaniStudentsRatio || 0;
    return Math.round((100 - nonOmaniRatio) * 10) / 10;
  }

  onGenderCountChange(field: keyof StudentCountByGender, value: number): void {
    this.schoolInfo.studentCountByGender[field] = value || 0;

    if (field !== 'total') {
      this.schoolInfo.studentCountByGender.total = this.schoolInfo.studentCountByGender.males + this.schoolInfo.studentCountByGender.females;
    }

    this.calculateRatios();
    console.log(`Updated ${field}:`, value);
  }

  onStageCountChange(field: keyof StudentCountByStage, value: number): void {
    this.schoolInfo.studentCountByStage[field] = value || 0;
    console.log(`Updated ${field}:`, value);
  }

  onRatioChange(field: keyof StudentRatios, value: number): void {
    this.schoolInfo.studentRatios[field] = value || 0;
    console.log(`Updated ${field}:`, value);
  }

  addGradeRow(): void {
    const newGrade = this.schoolInfo.gradeData.length + 1;
    const educationalStage = newGrade <= 4 ? ' (1-4)' :
      newGrade <= 8 ? ' (5-8)' :
        ' (9-12)';

    const newRow: GradeData = {
      grade: newGrade,
      educationalStage: educationalStage,
      maleStudents: 0,
      femaleStudents: 0,
      totalStudents: 0,
      averageStudentsPerClass: 0
    };

    this.schoolInfo.gradeData.push(newRow);
    this.calculateTotals();
    this.calculateRatios();
    console.log('Added new grade row:', newRow);
  }

} 
