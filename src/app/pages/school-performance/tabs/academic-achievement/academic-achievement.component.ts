import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InternationalTest, SchoolInfo } from '../../types/school-info';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';


@Component({
  selector: 'app-academic-achievement',
  templateUrl: './academic-achievement.component.html',
  styleUrls: ['./academic-achievement.component.scss']
})
export class AcademicAchievementComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  internationalTestsColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing
  //internationalTestsNotApplicable: boolean = false;

  constructor(private translate: TranslateService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initializeData();
    this.setupGridColumns();
    if (this.isEditable) {
      this.setupGridActions();
      this.setupPinnedRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolData changes
      this.setupPinnedRow();
    }
  }

  private initializeData(): void {
    if (!this.schoolInfo.internationalTestsData) {
      this.schoolInfo.internationalTestsData = [];
    }
    // this.schoolInfo.internationalTestsData = [
    //   {
    //     id: 'pirls',
    //     testName: 'PIRLS',
    //     testNameAr: 'PIRLS',
    //     testNameEn: 'PIRLS',
    //     result: '520',
    //     participantCount: 150,
    //     schoolManagementApplication: 'تطبيق برنامج تحسين القراءة',
    //     year: 2024,
    //     status: 'completed',
    //     score: 75
    //   },
    //   {
    //     id: 'timss',
    //     testName: 'TIMSS',
    //     testNameAr: 'TIMSS',
    //     testNameEn: 'TIMSS',
    //     result: '485',
    //     participantCount: 180,
    //     schoolManagementApplication: 'برنامج تعزيز الرياضيات والعلوم',
    //     year: 2024,
    //     status: 'completed',
    //     score: 68
    //   },
    //   {
    //     id: 'other',
    //     testName: 'أخرى',
    //     testNameAr: 'أخرى',
    //     testNameEn: 'Others',
    //     result: '100',
    //     participantCount: 0,
    //     schoolManagementApplication: 'لم يتم التطبيق بعد',
    //     year: 2024,
    //     status: 'not_participated',
    //     score: 100
    //   }
    // ];
  }

  private setupPinnedRow(): void {
    this.pinnedBottomRowData = [
      {
        testNameAr: '',
        testNameEn: '',
        participantCount: null,
        grade: null,
        result: '0',
        schoolComments: '',
        isNewRow: true // Flag to identify this as the new row
      }
    ];
  }

  private setupGridColumns(): void {
    this.internationalTestsColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.TEST_NAME_AR'),
        field: 'testNameAr',
        width: 150,
        editable: (params: any) => {
          return params.node.rowPinned === 'bottom' && !this.schoolInfo.internationalTestsNotApplicable
          && this.isEditable;
        },
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          min: 1,
          step: 1
        },
        cellRenderer: (params: any) => {
          return `<div class="grade-cell">
            <span class="grade-number">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.NATIONAL_TESTS.TEST_NAME_EN'),
        field: 'testNameEn',
        width: 150,
        editable: (params: any) => {
          return params.node.rowPinned === 'bottom' && !this.schoolInfo.internationalTestsNotApplicable
          && this.isEditable
          ;
        },
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          min: 1,
          step: 1
        },
        cellRenderer: (params: any) => {
          return `<div class="grade-cell">
            <span class="grade-number">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.PARTICIPATING_STUDENTS'),
        field: 'participantCount',
        width: 200,
        editable: this.isEditable,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 0,
          step: 1
        },
        cellRenderer: (params: any) => {
          return `<div class="participant-cell">
            <span class="participant-count">${params.value || 0}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.GRADE'),
        field: 'grade',
        width: 150,
        editable: this.isEditable,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 1,
          max: 12,
          step: 1
        },
        cellRenderer: (params: any) => {
          return `<div class="grade-cell">
            <span class="grade-number">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.RESULT'),
        field: 'result',
        width: 150,
        editable: this.isEditable,
        cellEditor: 'agTextCellEditor',
        cellEditorParams: {
          min: 0,
          max: 100,
          step: 0.01
        },
        cellRenderer: (params: any) => {
          if (params.value === null || params.value === undefined || params.value === '') {
            return `<div class="result-cell no-result">
              <span class="no-result-text">-</span>
            </div>`;
          }
          // Ensure we have a valid number
          const numValue = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
          if (isNaN(numValue)) {
            return `<div class="result-cell no-result">
              <span class="no-result-text">-</span>
            </div>`;
          }
          return `<div class="result-cell has-result">
            <span class="result-score">${params.value}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.SCHOOL_COMMENTS'),
        field: 'schoolComments',
        width: 400,
        editable: this.isEditable,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 50
        },
        cellRenderer: (params: any) => {
          return `<div class="comments-cell">
            <span class="comments-text">${params.value || ''}</span>
          </div>`;
        },
        cellStyle: {
          'white-space': 'normal',
          'line-height': '1.4'
        }
      }
    ];
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.ADD_NEW_TEST'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewTest();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new test entry row)
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteTest(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new test entry row)
          return !row.data?.isNewRow && row.data.deletable;
        }
      }
    ];
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new test entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      // Just update the pinned row data without validation for now
      this.handleNewTestEntry(data);
      return;
    }

    // Update existing test data
    const index = this.schoolInfo.internationalTestsData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      this.schoolInfo.internationalTestsData[index] = { ...data };
    }
  }

  private handleNewTestEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Test + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  addNewTest(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and internationalTestsData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.internationalTestsData) {
        this.schoolInfo.internationalTestsData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate mandatory fields
      if (!pinnedRowData.participantCount || pinnedRowData.participantCount <= 0) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.PARTICIPANT_COUNT_REQUIRED'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      if (!pinnedRowData.grade || pinnedRowData.grade < 1 || pinnedRowData.grade > 12) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.GRADE_REQUIRED'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      // Convert result to number if it's a string
      let resultValue = pinnedRowData.result;
      if (typeof resultValue === 'string' && resultValue.trim() !== '') {
        resultValue = parseFloat(resultValue);
      }

      // Allow result to be optional for now - just check if provided value is valid
      if (resultValue !== null && resultValue !== undefined && resultValue !== '' &&
        (isNaN(resultValue) || resultValue < 0 || resultValue > 100)) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.RESULT_REQUIRED'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      if (!pinnedRowData.schoolComments || pinnedRowData.schoolComments.trim() === '') {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.COMMENTS_REQUIRED'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      // Create new test with the entered data
      const newTest: InternationalTest = {
        id: (this.schoolInfo.internationalTestsData.length + 1).toString(), // Simple ID generation
        testName: `Grade ${pinnedRowData.grade} Test`,
        testNameAr: pinnedRowData.testNameAr,
        testNameEn: pinnedRowData.testNameEn,
        grade: pinnedRowData.grade,
        result: resultValue.toString(),
        participantCount: pinnedRowData.participantCount,
        schoolManagementApplication: pinnedRowData.schoolComments,
        year: new Date().getFullYear(),
        status: 'completed',
        score: resultValue,
        schoolComments: pinnedRowData.schoolComments,
        deletable:true
      };

      this.schoolInfo.internationalTestsData.push(newTest);

      // Force grid refresh
      this.schoolInfo.internationalTestsData = [...this.schoolInfo.internationalTestsData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.TEST_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.TEST_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }

  deleteTest(row: any): void {
    const index = this.schoolInfo.internationalTestsData.findIndex(
      item => item.testName === row.testName &&
        item.id === row.id
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.DELETE_TEST_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.DELETE_TEST_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.internationalTestsData.splice(index, 1);

          // Force grid refresh by creating a new array reference
          this.schoolInfo.internationalTestsData = [...this.schoolInfo.internationalTestsData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.TEST_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  getTotalParticipants(): number {
    return this.schoolInfo.internationalTestsData.reduce((total, test) => total + test.participantCount, 0);
  }

  getActiveTestsCount(): number {
    return this.schoolInfo.internationalTestsData.filter(test => test.status === 'completed').length;
  }

  getAverageScore(): number {
    const completedTests = this.schoolInfo.internationalTestsData.filter(test => test.status === 'completed' && test.score);
    if (completedTests.length === 0) return 0;

    const totalScore = completedTests.reduce((sum, test) => sum + (test.score || 0), 0);
    return Math.round(totalScore / completedTests.length);
  }

  getImprovementRate(): number {
    // Mock improvement rate - in real implementation this would compare with previous year
    return 8.5;
  }

  getBestPerformingTest(): string {
    const completedTests = this.schoolInfo.internationalTestsData.filter(test => test.status === 'completed' && test.score);
    if (completedTests.length === 0) return 'لا توجد بيانات';

    const bestTest = completedTests.reduce((best, current) =>
      (current.score || 0) > (best.score || 0) ? current : best
    );

    return bestTest.testName;
  }

  getNeedsImprovementTest(): string {
    const completedTests = this.schoolInfo.internationalTestsData.filter(test => test.status === 'completed' && test.score);
    if (completedTests.length === 0) return 'لا توجد بيانات';

    const worstTest = completedTests.reduce((worst, current) =>
      (current.score || 0) < (worst.score || 0) ? current : worst
    );

    return worstTest.testName;
  }

  getParticipationRate(): number {
    const totalTests = this.schoolInfo.internationalTestsData.length;
    const participatedTests = this.schoolInfo.internationalTestsData.filter(test => test.status === 'completed').length;

    if (totalTests === 0) return 0;
    return Math.round((participatedTests / totalTests) * 100);
  }

  getResultClass(result: string | null): string {
    if (!result) return 'no-result';

    const score = parseInt(result);
    if (score >= 500) return 'excellent-result';
    if (score >= 450) return 'good-result';
    if (score >= 400) return 'average-result';
    return 'poor-result';
  }

  viewTestDetails(test: InternationalTest): void {
    // Implementation for viewing test details
    console.log('Viewing details for test:', test);
    alert(`عرض تفاصيل اختبار ${test.testName}`);
  }

  editTestInfo(test: InternationalTest): void {
    // Implementation for editing test information
    console.log('Editing test:', test);
    alert(`تحرير معلومات اختبار ${test.testName}`);
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد الانتظار';
      case 'not_participated': return 'لم يشارك';
      default: return 'غير محدد';
    }
  }
} 