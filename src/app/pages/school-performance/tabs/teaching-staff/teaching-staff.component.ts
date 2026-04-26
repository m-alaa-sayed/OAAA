import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolInfo, TeachingStaffMember, SubjectTeachersData } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';
import { ToastService } from 'src/app/core/services/toast-service';
import { AuthService } from '../../../../core/services/auth.service';
import { ScheduledSchoolVisit } from '../../types/scheduled-school-visit';

@Component({
  selector: 'app-teaching-staff',
  templateUrl: './teaching-staff.component.html',
  styleUrls: ['./teaching-staff.component.scss']
})
export class TeachingStaffComponent implements OnInit, OnChanges, OnDestroy {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isReadonly: boolean = false;
  @Input() showMajorDevelopments: boolean = false;
  @Input() isSchoolCommentEditable: boolean = false;
  @Input() scheduledSchoolVisit?: ScheduledSchoolVisit;
  @Input() isSubmitting: boolean = false;
  @Input() isSelfEvaluationDocument: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() stepCode?: string;

  teachingStaffColumns: any[] = [];
  subjectTeachersColumns: any[] = [];
  pinnedBottomRowData: any[] = [];
  gridActions: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing


  private percentageChangeHandler = (event: any) => {
    const { field, value, rowIndex } = event.detail;
    if (this.schoolInfo.subjectTeachersData[rowIndex]) {
      this.schoolInfo.subjectTeachersData[rowIndex].percentageValue = parseFloat(value) || 0;
    }
  };

  private notesChangeHandler = (event: any) => {
    const { field, value, rowIndex } = event.detail;
    if (this.schoolInfo.subjectTeachersData[rowIndex]) {
      const currentRow = this.schoolInfo.subjectTeachersData[rowIndex];

      // Initialize notes as object if it doesn't exist
      if (!currentRow.notes) {
        currentRow.notes = {};
      }

      // Convert string notes to object format
      if (typeof currentRow.notes === 'string') {
        const oldValue = currentRow.notes;
        currentRow.notes = {
          general: oldValue
        };
      }

      // Now we can safely assign the field value
      if (typeof currentRow.notes === 'object' && currentRow.notes !== null) {
        currentRow.notes[field] = value;
      }
    }
  };

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private authService: AuthService
  ) { }

  /**
   * Check if ratio fields (teacherStudentRatio, teachingStaffTurnoverRate) should be editable
   * Uses the same condition as MAJOR_DEVELOPMENTS field
   * - Field is dimmed (readonly) when: stepCode === 'VISIT_REPORT_QUALITY_INITIAL_REVIEW' AND isEditMode === false (creation view)
   * - Field is not editable when: stepCode === 'VISIT_REPORT_SCHOOL_REVIEW'
   * - Otherwise, field is editable based on existing conditions (isReadonly)
   */
  get isRatioFieldsEditable(): boolean {
    // If stepCode is VISIT_REPORT_SCHOOL_REVIEW, field is not editable
    if (this.stepCode === 'VISIT_REPORT_SCHOOL_REVIEW') {
      return false;
    }
    // If stepCode is VISIT_REPORT_QUALITY_INITIAL_REVIEW AND we're in creation view (isEditMode === false), field is readonly (dimmed)
    if (this.stepCode === 'VISIT_REPORT_QUALITY_INITIAL_REVIEW' && this.isEditMode === false) {
      return false; // Field is dimmed
    }
    // Otherwise, use the existing isReadonly logic (same as isMajorDevelopmentsEditable)
    return !this.isReadonly;
  }

  /**
   * Check if Major Developments field should be editable
   * - Field is dimmed (readonly) when: stepCode === 'VISIT_REPORT_QUALITY_INITIAL_REVIEW' AND isEditMode === false (creation view)
   * - Field is not editable when: stepCode === 'VISIT_REPORT_SCHOOL_REVIEW'
   * - Otherwise, field is editable based on existing conditions (isReadonly)
   */
  get isMajorDevelopmentsEditable(): boolean {
    // If stepCode is VISIT_REPORT_SCHOOL_REVIEW, field is not editable
    if (this.stepCode === 'VISIT_REPORT_SCHOOL_REVIEW') {
      return false;
    }
    // If stepCode is VISIT_REPORT_QUALITY_INITIAL_REVIEW AND we're in creation view (isEditMode === false), field is readonly (dimmed)
    if (this.stepCode === 'VISIT_REPORT_QUALITY_INITIAL_REVIEW' && this.isEditMode === false) {
      return false; // Field is dimmed
    }
    // Otherwise, use the existing isReadonly logic
    return !this.isReadonly;
  }

  get isTableEditable(): boolean {
    // If isReadonly is true, table is not editable (e.g., when status is SUBMITTED in self-evaluation-document)
    if (this.isReadonly) {
      return false;
    }
    // If stepCode is VISIT_REPORT_SCHOOL_REVIEW, table is not editable
    if (this.stepCode === 'VISIT_REPORT_SCHOOL_REVIEW') {
      return false;
    }
    const userClaim = this.authService.getUserClaim();
    if (userClaim && userClaim.roles && userClaim.roles.includes('SCHOOLMANAGER')) {
      return true; // SCHOOLMANAGER can always edit (when not readonly)
    }
    return !this.isReadonly; // Others follow isReadonly setting
  }

  // Helper method to get note value for a specific field
  private getNoteValue(notes: string | { [key: string]: string } | undefined, field: string): string {
    if (!notes) return '';
    if (typeof notes === 'string') return notes;
    if (typeof notes === 'object' && notes[field]) return notes[field];
    return '';
  }

  // Helper method to create value setter for numeric columns
  private createValueSetter() {
    return (params: any) => {
      const newValue = params.newValue;
      if (newValue === '' || newValue === null || newValue === undefined) {
        params.data[params.colDef.field] = 0;
        return true;
      }
      const stringValue = String(newValue).trim();
      const numberValue = parseInt(stringValue, 10);
      if (!/^\d+$/.test(stringValue) || numberValue < 0 || isNaN(numberValue)) {
        return false;
      }
      params.data[params.colDef.field] = numberValue;
      return true;
    };
  }

  // Helper method to create cell renderer
  private createCellRenderer(params: any, fieldName: string): string {
    if (params.data.isSpecialRow) {
      if (params.data.notesRow) {
        const noteValue = this.getNoteValue(params.data.notes, fieldName);
        return `<textarea class="form-control notes-textarea" 
                         placeholder="ملاحظات..." 
                         rows="1"
                         onchange="this.dispatchEvent(new CustomEvent('notesChange', {
                           detail: { field: '${fieldName}', value: this.value, rowIndex: ${params.rowIndex} },
                           bubbles: true
                         }))"
                         ${this.isReadonly ? 'readonly' : ''}>${noteValue}</textarea>`;
      }
      return '';
    }
    return `<div class="number-cell">${params.value || 0}</div>`;
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupGridColumns();
    this.setupEventListeners();
    this.setupPinnedRow();
    this.setupGridActions();
  }

  private setupEventListeners(): void {
    // Listen for custom events from the cell renderers
    document.addEventListener('percentageChange', this.percentageChangeHandler);
    document.addEventListener('notesChange', this.notesChangeHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData();
      this.setupPinnedRow();

    }
    if (changes['isReadonly']) {
      this.setupGridColumns();
      this.setupGridActions();
      this.setupPinnedRow();
    }
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    document.removeEventListener('percentageChange', this.percentageChangeHandler);
    document.removeEventListener('notesChange', this.notesChangeHandler);
  }

  private initializeData(): void {
    // Initialize teaching staff data only if missing or empty
    if (!Array.isArray(this.schoolInfo.teachingStaffData) || this.schoolInfo.teachingStaffData.length === 0) {
      this.schoolInfo.teachingStaffData = [
        {
          category: 'أعداد الهيئات الإدارية والفنية والتعليمية بالمدرسة',
          directorsAndAssistants: 0,
          departmentHeads: 0,
          firstTeachers: 0,
          teachers: 0,
          technicians: 0,
          specialists: 0,
          supervisors: 0,
          others: 0,
          notes: ''
        }
      ];
    }

    // Initialize subject teachers data only if missing or empty
    if (!Array.isArray(this.schoolInfo.subjectTeachersData) || this.schoolInfo.subjectTeachersData.length === 0) {
      this.schoolInfo.subjectTeachersData = [
        {
          subject: 'التربية الإسلامية',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        },
        {
          subject: 'اللغة العربية',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        },
        {
          subject: 'اللغة الإنجليزية',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        },
        {
          subject: 'الرياضيات',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        },
        {
          subject: 'العلوم',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        },
        {
          subject: 'الدراسات الاجتماعية',
          approvedTeachers: 0,
          currentTeachers: 0,
          newTeachers: 0,
          shortageSeniorTeachers: 0,
          shortageRegularTeachers: 0,
          deficitSeniorTeachers: 0,
          deficitRegularTeachers: 0
        }
        
        
      ];
    }
  }


  private setupGridColumns(): void {
    // Main teaching staff table columns
    this.teachingStaffColumns = [
      {
        headerName: 'المدير\nوالمساعدون',
        field: 'directorsAndAssistants',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'رؤساء\nالأقسام',
        field: 'departmentHeads',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'المعلمون\nالأوائل',
        field: 'firstTeachers',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'المعلمون',
        field: 'teachers',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'الفنيون',
        field: 'technicians',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'الاختصاصيون',
        field: 'specialists',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'المنسقون',
        field: 'supervisors',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'أخرى',
        field: 'others',

        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      {
        headerName: 'ملاحظات',
        field: 'notes',
        width: 200,
        cellEditor: 'agLargeTextCellEditor',
        cellStyle: { 'text-align': 'right', 'padding': '8px' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        cellRenderer: (params: any) => {
          return `<div class="notes-cell">${params.value || ''}</div>`;
        }
      }
    ];

    // Subject teachers table - 5 main column groups: approved, current, new, shortage, deficit
    this.subjectTeachersColumns = [
      // المواد (Subjects) - rightmost column in RTL
      {
        headerName: 'المواد',
        field: 'subject',
        width: 200,
        cellStyle: {
          'text-align': 'right',
          'padding-right': '15px',
          'font-weight': '500'
        },
        headerClass: 'wrapped-header',
        editable: (params: any) => params.node.rowPinned === 'bottom',
        pinned: 'right'
      },
      // عدد المعلمين المعتمد - single column
      {
        headerName: 'عدد المعلمين\nالمعتمد',
        field: 'approvedTeachers',
        width: 120,
        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        valueSetter: this.createValueSetter(),
        cellRenderer: (params: any) => this.createCellRenderer(params, 'approvedTeachers')
      },
      // عدد المعلمين الحالي - single column
      {
        headerName: 'عدد المعلمين\nالحالي',
        field: 'currentTeachers',
        width: 120,
        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        valueSetter: this.createValueSetter(),
        cellRenderer: (params: any) => this.createCellRenderer(params, 'currentTeachers')
      },
      // عدد المعلمين الجدد - single column
      {
        headerName: 'عدد المعلمين\nالجدد',
        field: 'newTeachers',
        width: 120,
        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isTableEditable,
        valueSetter: this.createValueSetter(),
        cellRenderer: (params: any) => {
          if (params.data.isSpecialRow) {
            if (params.data.isPercentageRow) {
              return `<input type="number" class="form-control percentage-input" 
                             value="${params.data.percentageValue || 0}" 
                             min="0" max="100" step="0.1" 
                             onchange="this.dispatchEvent(new CustomEvent('percentageChange', {
                               detail: { field: 'percentageValue', value: this.value, rowIndex: ${params.rowIndex} },
                               bubbles: true
                             }))"
                             ${this.isReadonly ? 'readonly' : ''}>`;
            } else if (params.data.notesRow) {
              const noteValue = this.getNoteValue(params.data.notes, 'newTeachers');
              return `<textarea class="form-control notes-textarea" 
                               placeholder="ملاحظات..." 
                               rows="1"
                               onchange="this.dispatchEvent(new CustomEvent('notesChange', {
                                 detail: { field: 'newTeachers', value: this.value, rowIndex: ${params.rowIndex} },
                                 bubbles: true
                               }))"
                               ${this.isReadonly ? 'readonly' : ''}>${noteValue}</textarea>`;
            }
            return '';
          }
          return `<div class="number-cell">${params.value || 0}</div>`;
        }
      },
      // النقص group
      {
        headerName: 'النقص',
        headerClass: 'wrapped-header group-header',
        children: [
          {
            headerName: 'المعلمون الأوائل',
            field: 'shortageSeniorTeachers',
            width: 110,
            type: 'numericColumn',
            cellEditor: 'agNumberCellEditor',
            cellStyle: { 'text-align': 'center' },
            headerClass: 'wrapped-header final-header',
            editable: this.isTableEditable,
            valueSetter: this.createValueSetter(),
            cellRenderer: (params: any) => this.createCellRenderer(params, 'shortageSeniorTeachers')
          },
          {
            headerName: 'المعلمون',
            field: 'shortageRegularTeachers',
            width: 110,
            type: 'numericColumn',
            cellEditor: 'agNumberCellEditor',
            cellStyle: { 'text-align': 'center' },
            headerClass: 'wrapped-header final-header',
            editable: this.isTableEditable,
            valueSetter: this.createValueSetter(),
            cellRenderer: (params: any) => {
              if (params.data.isSpecialRow) {
                if (params.data.isPercentageRow) {
                  return '<span class="percentage-symbol">%</span>';
                } else if (params.data.notesRow) {
                  const noteValue = this.getNoteValue(params.data.notes, 'shortageRegularTeachers');
                  return `<textarea class="form-control notes-textarea" 
                                   placeholder="ملاحظات..." 
                                   rows="1"
                                   onchange="this.dispatchEvent(new CustomEvent('notesChange', {
                                     detail: { field: 'shortageRegularTeachers', value: this.value, rowIndex: ${params.rowIndex} },
                                     bubbles: true
                                   }))"
                                   ${this.isReadonly ? 'readonly' : ''}>${noteValue}</textarea>`;
                }
                return '';
              }
              return `<div class="number-cell">${params.value || 0}</div>`;
            }
          }
        ]
      },
      // العجز group - leftmost
      {
        headerName: 'العجز',
        headerClass: 'wrapped-header group-header',
        children: [
          {
            headerName: 'المعلمون الأوائل',
            field: 'deficitSeniorTeachers',
            width: 110,
            type: 'numericColumn',
            cellEditor: 'agNumberCellEditor',
            cellStyle: { 'text-align': 'center' },
            headerClass: 'wrapped-header final-header',
            editable: this.isTableEditable,
            valueSetter: this.createValueSetter(),
            cellRenderer: (params: any) => this.createCellRenderer(params, 'deficitSeniorTeachers')
          },
          {
            headerName: 'المعلمون',
            field: 'deficitRegularTeachers',
            width: 110,
            type: 'numericColumn',
            cellEditor: 'agNumberCellEditor',
            cellStyle: { 'text-align': 'center' },
            headerClass: 'wrapped-header final-header',
            editable: this.isTableEditable,
            valueSetter: this.createValueSetter(),
            cellRenderer: (params: any) => this.createCellRenderer(params, 'deficitRegularTeachers')
          }
        ]
      },

      {
        headerName: 'الملاحظات',
        field: 'notes',
        width: 200,
        editable: this.isTableEditable,
        cellEditor: 'agLargeTextCellEditor',   // built-in text area editor
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 30,
          placeholder: 'ملاحظات...'
        },
        cellStyle: {
          'text-align': 'right',
          'padding-right': '15px',
          'font-weight': '500'
        }
      }
    ];
  }


  private setupPinnedRow(): void {
    // Don't show pinned row (add new row) when in readonly mode
    if (this.isReadonly) {
      this.pinnedBottomRowData = [];
    } else {
    this.pinnedBottomRowData = [
      {
        subject: '',
        approvedTeachers: 0,
        currentTeachers: 0,
        newTeachers: 0,
        shortageSeniorTeachers: 0,
        shortageRegularTeachers: 0,
        deficitSeniorTeachers: 0,
        deficitRegularTeachers: 0,
        notes: '',
        isNewRow: true
      }
    ];
    }
  }


  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.ADD_NEW_CATEGORY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewRow();
        },
        show: (row: any) => {
          return this.isTableEditable && row.data?.isNewRow;
        }
      },

      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteCategory(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new category entry row)
          return this.isTableEditable && row.data?.newAdded;
        }
      }
    ];
  }


  deleteCategory(row: any): void {
    const index = this.schoolInfo.subjectTeachersData.findIndex(
      item => item.subject === row.subject &&
        item.approvedTeachers === row.approvedTeachers &&
        item.currentTeachers === row.currentTeachers
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.DELETE_CATEGORY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.DELETE_CATEGORY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.subjectTeachersData.splice(index, 1);

          // Force grid refresh by creating a new array reference
          this.schoolInfo.subjectTeachersData = [...this.schoolInfo.subjectTeachersData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.CATEGORY_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  addNewRow(): void {
    const timestamp = Date.now();
    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and subjectTeachersData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.subjectTeachersData) {
        this.schoolInfo.subjectTeachersData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.subject && pinnedRowData.subject.trim() !== '') ||
        (pinnedRowData.approvedTeachers && pinnedRowData.approvedTeachers > 0) ||
        (pinnedRowData.currentTeachers && pinnedRowData.currentTeachers.trim() !== '') ||
        (pinnedRowData.newTeachers && pinnedRowData.newTeachers.trim() !== '') ||
        (pinnedRowData.shortageSeniorTeachers && pinnedRowData.shortageSeniorTeachers.trim() !== '') ||
        (pinnedRowData.shortageRegularTeachers && pinnedRowData.shortageRegularTeachers.trim() !== '') ||
        (pinnedRowData.deficitSeniorTeachers && pinnedRowData.deficitSeniorTeachers.trim() !== '') ||
        (pinnedRowData.deficitRegularTeachers && pinnedRowData.deficitRegularTeachers.trim() !== '')
      );

      if (!hasData) {
        // Show validation message asking user to enter data first
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0; // Reset to allow retry
        return;
      }

      // Create new category with the entered data
      const newCategory = {
        newAdded: true,
        subject: pinnedRowData.subject,
        approvedTeachers: pinnedRowData.approvedTeachers,
        currentTeachers: pinnedRowData.currentTeachers,
        newTeachers: pinnedRowData.newTeachers,
        shortageSeniorTeachers: pinnedRowData.shortageSeniorTeachers,
        shortageRegularTeachers: pinnedRowData.shortageRegularTeachers,
        deficitSeniorTeachers: pinnedRowData.deficitSeniorTeachers,
        deficitRegularTeachers: pinnedRowData.deficitRegularTeachers,
        notes: pinnedRowData.notes
      };

      this.schoolInfo.subjectTeachersData.push(newCategory);

      // Force grid refresh
      this.schoolInfo.subjectTeachersData = [...this.schoolInfo.subjectTeachersData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.CATEGORY_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.CATEGORY_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }


  // Statistics calculation methods
  getTotalStaff(): number {
    if (!this.schoolInfo.teachingStaffData || this.schoolInfo.teachingStaffData.length === 0) return 0;
    const data = this.schoolInfo.teachingStaffData[0];
    return (data.directorsAndAssistants || 0) +
      (data.departmentHeads || 0) +
      (data.firstTeachers || 0) +
      (data.teachers || 0) +
      (data.technicians || 0) +
      (data.specialists || 0) +
      (data.supervisors || 0) +
      (data.others || 0);
  }

  getTotalTeachers(): number {
    if (!this.schoolInfo.teachingStaffData || this.schoolInfo.teachingStaffData.length === 0) return 0;
    const data = this.schoolInfo.teachingStaffData[0];
    return (data.firstTeachers || 0) + (data.teachers || 0);
  }

  getTotalManagement(): number {
    if (!this.schoolInfo.teachingStaffData || this.schoolInfo.teachingStaffData.length === 0) return 0;
    const data = this.schoolInfo.teachingStaffData[0];
    return (data.directorsAndAssistants || 0) + (data.departmentHeads || 0);
  }

  getTotalSupport(): number {
    if (!this.schoolInfo.teachingStaffData || this.schoolInfo.teachingStaffData.length === 0) return 0;
    const data = this.schoolInfo.teachingStaffData[0];
    return (data.technicians || 0) + (data.specialists || 0) + (data.supervisors || 0) + (data.others || 0);
  }

  getTotalSubjectTeachers(): number {
    if (!this.schoolInfo.subjectTeachersData) return 0;
    return this.schoolInfo.subjectTeachersData.reduce((total, subject) =>
      total + (subject.total || 0), 0
    );
  }

  getSubjectTeachersTotal(field: string): number {
    if (!this.schoolInfo.subjectTeachersData) return 0;
    return this.schoolInfo.subjectTeachersData.reduce((total, subject) => {
      const value = subject[field as keyof SubjectTeachersData];
      return total + (typeof value === 'number' ? value : 0);
    }, 0);
  }

  // Event handlers
  onFirstGridReady(params: any): void {
    params.api.sizeColumnsToFit();
    // Auto-size all columns to fit content
    const allColumnIds: string[] = [];
    params.columnApi.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  onSecondGridReady(params: any): void {
    params.api.sizeColumnsToFit();
    // Auto-size all columns to fit content
    const allColumnIds: string[] = [];
    params.columnApi.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    console.log(`Updated ${field} for teaching staff: ${newValue}`);

    // Update the data
    const rowIndex = event.rowIndex;
    if (rowIndex !== undefined && this.schoolInfo.teachingStaffData[rowIndex]) {
      this.schoolInfo.teachingStaffData[rowIndex] = { ...data };
    }
  }

  onSubjectTeachersCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    console.log(`Updated ${field} for subject teachers: ${newValue}`);

    // Check if this is the pinned row (new category entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewCategoryEntry(data);
      return;
    }

    // Update the data and recalculate total
    const rowIndex = event.rowIndex;
    if (rowIndex !== undefined && this.schoolInfo.subjectTeachersData[rowIndex]) {
      this.schoolInfo.subjectTeachersData[rowIndex] = { ...data };

      // Recalculate total for this row
      const subject = this.schoolInfo.subjectTeachersData[rowIndex];
      subject.total = (subject.approvedTeachers || 0) +
        (subject.currentTeachers || 0) +
        (subject.newTeachers || 0);
    }
  }

  private handleNewCategoryEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Category + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  validatePercentage(field: 'teacherStudentRatio' | 'teachingStaffTurnoverRate') {
    const value = this.schoolInfo[field];
    if (value < 0 || value > 100 || value == null) {
      this.schoolInfo[field] = 0; 
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.PERCENTAGE_FIELD_VALIDATION_MESSAGE'), { classname: 'bg-danger text-white', autohide: false });
    }
  }

  /**
   * Check if school comments should be visible
   * - If isSelfEvaluationDocument is true, check visitStatus === 'WAITING_REPORT'
   * - If not provided (other pages), always show
   */
  get shouldShowSchoolComments(): boolean {
    // If no scheduledSchoolVisit is provided, show comments regularly (other pages)
    if (!this.scheduledSchoolVisit) {
      return true;
    }

    // Only check visitStatus if we're in self-evaluation document context
    if (this.isSelfEvaluationDocument) {
      // Check if visitStatus is 'WAITING_REPORT'
      return this.scheduledSchoolVisit.visitStatus === 'WAITING_REPORT';
    }

    // In other views, always show if scheduledSchoolVisit is provided
    return true;
  }

} 
