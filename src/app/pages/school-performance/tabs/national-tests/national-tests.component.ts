import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { GradesComments, PerformanceAnalysis, SchoolInfo, TestResult } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';


@Component({
  selector: 'app-national-tests',
  templateUrl: './national-tests.component.html',
  styleUrls: ['./national-tests.component.scss']
})
export class NationalTestsComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  // Grade 4 Data
  grade4Columns: any[] = [];
  //grade4Comments: string = '';
  //grade4NotApplicable: boolean = false;

  // Grade 7 Data
  grade7Columns: any[] = [];
  //grade7Comments: string = '';
  // grade7NotApplicable: boolean = false;

  // Grade 10 Data
  grade10Columns: any[] = [];
  //grade10Comments: string = '';
  //grade10NotApplicable: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.setupGridColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolData changes
    }
  }

  private initializeData(): void {
    if (!this.schoolInfo.gradesComments) {
      this.schoolInfo.gradesComments = {} as GradesComments;
    }
    this.initializeGrade4Data();
    this.initializeGrade7Data();
    this.initializeGrade10Data();
  }

  private initializeGrade4Data(): void {
    if (!this.schoolInfo.grade4TestsData) {
      this.schoolInfo.grade4TestsData = [];
    }
  }

  private initializeGrade7Data(): void {
    if (!this.schoolInfo.grade7TestsData) {
      this.schoolInfo.grade7TestsData = [];
    }
  }

  private initializeGrade10Data(): void {
    if (!this.schoolInfo.grade10TestsData) {
      this.schoolInfo.grade10TestsData = [];
    }
  }

  private setupGridColumns(): void {
    this.setupGrade4Columns();
    this.setupGrade7Columns();
    this.setupGrade10Columns();
  }

  private setupGrade4Columns(): void {
    this.grade4Columns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.SUBJECT'),
        field: 'subject',
        width: 200,
        editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agTextCellEditor',
        valueSetter: (params: any) => {
          if (params.newValue && params.newValue.trim()) {
            params.data.subject = params.newValue.trim();
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.PARTICIPATING_STUDENTS'),
        field: 'participatingStudents',
        width: 150,
        editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 0,
          max: 999
        },
        valueSetter: (params: any) => {
          const newValue = parseInt(params.newValue) || 0;
          if (newValue >= 0 && newValue <= 999) {
            params.data.participatingStudents = newValue;
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2022'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2022SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2022NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable  || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2023'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2023SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2023NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2024'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2024SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2024NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade4NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade4NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      }
    ];
  }

  private setupGrade7Columns(): void {
    this.grade7Columns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.SUBJECT'),
        field: 'subject',
        width: 200,
        editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agTextCellEditor',
        valueSetter: (params: any) => {
          if (params.newValue && params.newValue.trim()) {
            params.data.subject = params.newValue.trim();
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.PARTICIPATING_STUDENTS'),
        field: 'participatingStudents',
        width: 150,
        editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 0,
          max: 999
        },
        valueSetter: (params: any) => {
          const newValue = parseInt(params.newValue) || 0;
          if (newValue >= 0 && newValue <= 999) {
            params.data.participatingStudents = newValue;
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2022'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2022SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2022NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2023'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2023SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2023NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2024'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2024SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2024NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade7NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade7NotApplicable || !this.isEditable) ?  'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      }
    ];
  }

  private setupGrade10Columns(): void {
    this.grade10Columns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.SUBJECT'),
        field: 'subject',
        width: 200,
        editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agTextCellEditor',
        valueSetter: (params: any) => {
          if (params.newValue && params.newValue.trim()) {
            params.data.subject = params.newValue.trim();
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.PARTICIPATING_STUDENTS'),
        field: 'participatingStudents',
        width: 150,
        editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
        cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 0,
          max: 999
        },
        valueSetter: (params: any) => {
          const newValue = parseInt(params.newValue) || 0;
          if (newValue >= 0 && newValue <= 999) {
            params.data.participatingStudents = newValue;
            return true;
          }
          return false;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2022'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2022SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2022NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2022NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2023'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2023SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2023NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2023NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.YEAR_2024'),
        children: [
          {
            headerName: 'نتيجة\nالمدرسة',
            field: 'year2024SchoolResult',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024SchoolResult = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          },
          {
            headerName: 'المتوسط\nالوطني',
            field: 'year2024NationalAverage',
            width: 120,
            editable: () => !this.schoolInfo.gradesComments.grade10NotApplicable && this.isEditable,
            cellClass: () => (this.schoolInfo.gradesComments.grade10NotApplicable || !this.isEditable) ? 'disabled-cell' : '',
            cellEditor: 'agNumberCellEditor',
            cellEditorParams: {
              min: 0,
              max: 100,
              precision: 1
            },
            valueSetter: (params: any) => {
              const newValue = parseFloat(params.newValue) || 0;
              if (newValue >= 0 && newValue <= 100) {
                params.data.year2024NationalAverage = newValue;
                return true;
              }
              return false;
            },
            cellRenderer: (params: any) => {
              return params.value ? `${params.value}%` : '-';
            }
          }
        ]
      }
    ];
  }

  getTotalParticipants(): number {
    const grade4Total = this.schoolInfo.grade4TestsData.reduce((sum, test) => sum + (test.participatingStudents || 0), 0);
    const grade7Total = this.schoolInfo.grade7TestsData.reduce((sum, test) => sum + (test.participatingStudents || 0), 0);
    const grade10Total = this.schoolInfo.grade10TestsData.reduce((sum, test) => sum + (test.participatingStudents || 0), 0);
    return grade4Total + grade7Total + grade10Total;
  }

  getAveragePerformance(): number {
    const allResults: number[] = [];

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult) allResults.push(test.year2022SchoolResult);
    });

    return allResults.length > 0 ? Math.round(allResults.reduce((sum, score) => sum + score, 0) / allResults.length) : 0;
  }

  getBestPerformingSubject(): string {
    let bestScore = 0;
    let bestSubject = '';

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2022SchoolResult > bestScore) {
        bestScore = test.year2022SchoolResult;
        bestSubject = test.subject;
      }
    });

    return bestSubject || 'لا توجد بيانات';
  }

  getBestPerformingScore(): number {
    let bestScore = 0;

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2022SchoolResult > bestScore) {
        bestScore = test.year2022SchoolResult;
      }
    });

    return bestScore;
  }

  getNeedsImprovementSubject(): string {
    let worstScore = 100;
    let worstSubject = '';

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2022SchoolResult < worstScore) {
        worstScore = test.year2022SchoolResult;
        worstSubject = test.subject;
      }
    });

    return worstSubject || 'لا توجد بيانات';
  }

  getNeedsImprovementScore(): number {
    let worstScore = 100;

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2022SchoolResult < worstScore) {
        worstScore = test.year2022SchoolResult;
      }
    });

    return worstScore === 100 ? 0 : worstScore;
  }

  getPerformanceAnalysis(): PerformanceAnalysis[] {
    const grades = [
      { data: this.schoolInfo.grade4TestsData, name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.GRADE_4_TITLE') || 'الصف الرابع' },
      { data: this.schoolInfo.grade7TestsData, name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.GRADE_7_TITLE') || 'الصف السابع' },
      { data: this.schoolInfo.grade10TestsData, name: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.GRADE_10_TITLE') || 'الصف العاشر' }
    ];

    return grades.map(grade => {
      const scores = grade.data.map(test => test.year2022SchoolResult || 0);
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      const subjects = grade.data.map(test => ({
        name: test.subject,
        schoolScore: test.year2022SchoolResult || 0,
        nationalScore: test.year2022NationalAverage || 0,
        comparisonClass: this.getComparisonClass(test.year2022SchoolResult || 0, test.year2022NationalAverage || 0)
      }));

      return {
        grade: grade.name,
        averageScore: Math.round(averageScore),
        performanceClass: this.getPerformanceClass(averageScore),
        subjects: subjects
      };
    });
  }

  private getComparisonClass(schoolScore: number, nationalScore: number): string {
    const difference = schoolScore - nationalScore;
    if (difference >= 5) return 'much-better';
    if (difference >= 2) return 'better';
    if (difference >= -2) return 'similar';
    if (difference >= -5) return 'worse';
    return 'much-worse';
  }

  private getPerformanceClass(score: number): string {
    if (score >= 85) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 65) return 'average';
    return 'poor';
  }

  getHighestImprovement(): string {
    // Calculate improvement from 2022 to 2024
    let maxImprovement = 0;
    let improvementSubject = '';

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2024SchoolResult) {
        const improvement = test.year2024SchoolResult - test.year2022SchoolResult;
        if (improvement > maxImprovement) {
          maxImprovement = improvement;
          improvementSubject = test.subject;
        }
      }
    });

    return improvementSubject || 'لا توجد بيانات';
  }

  getDecliningPerformance(): string {
    // Find subject with worst decline from 2022 to 2024
    let maxDecline = 0;
    let decliningSubject = '';

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2024SchoolResult) {
        const decline = test.year2022SchoolResult - test.year2024SchoolResult;
        if (decline > maxDecline) {
          maxDecline = decline;
          decliningSubject = test.subject;
        }
      }
    });

    return decliningSubject || 'لا توجد انخفاض';
  }

  getConsistentPerformance(): string {
    // Find subject with most consistent performance
    let minVariation = 100;
    let consistentSubject = '';

    [...this.schoolInfo.grade4TestsData, ...this.schoolInfo.grade7TestsData, ...this.schoolInfo.grade10TestsData].forEach(test => {
      if (test.year2022SchoolResult && test.year2023SchoolResult && test.year2024SchoolResult) {
        const scores = [test.year2022SchoolResult, test.year2023SchoolResult, test.year2024SchoolResult];
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variation = Math.max(...scores) - Math.min(...scores);

        if (variation < minVariation) {
          minVariation = variation;
          consistentSubject = test.subject;
        }
      }
    });

    return consistentSubject || 'لا توجد بيانات';
  }

} 