import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolInfo, ChronicDiseasesCategory, MultipleDisabilitiesCategory } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-special-needs',
  templateUrl: './special-needs.component.html',
  styleUrls: ['./special-needs.component.scss']
})
export class SpecialNeedsComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  specialNeedsColumns: any[] = [];
  chronicDiseasesColumns: any[] = [];
  multipleDisabilitiesColumns: any[] = [];

  // Grid actions for each grid
  specialNeedsGridActions: any[] = [];
  chronicDiseasesGridActions: any[] = [];
  multipleDisabilitiesGridActions: any[] = [];

  // Pinned row data for each grid
  specialNeedsPinnedBottomRowData: any[] = [];
  chronicDiseasesPinnedBottomRowData: any[] = [];
  multipleDisabilitiesPinnedBottomRowData: any[] = [];

  // Debounce tracking
  lastAddTime: number = 0;

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.setupGridColumns();
    this.setupChronicDiseasesGridColumns();
    this.setupMultipleDisabilitiesGridColumns();

    if (this.isEditable) {
      this.setupSpecialNeedsGridActions();
      this.setupChronicDiseasesGridActions();
      this.setupMultipleDisabilitiesGridActions();
      this.setupSpecialNeedsPinnedRow();
      this.setupChronicDiseasesPinnedRow();
      this.setupMultipleDisabilitiesPinnedRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolData changes
    }
  }

  private initializeData(): void {

    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }

    // this.schoolInfo.specialNeedsData = [
    //   {
    //     id: 1,
    //     category: 'صعوبات التعلم',
    //     categoryAr: 'صعوبات التعلم',
    //     categoryEn: 'Learning Disabilities',
    //     studentCount: 8,
    //     supportPrograms: 'برامج تعليم فردية، تقنيات تعليمية مساعدة، وقت إضافي للاختبارات'
    //   },
    //   {
    //     id: 2,
    //     category: 'الإعاقة البصرية',
    //     categoryAr: 'الإعاقة البصرية',
    //     categoryEn: 'Visual Impairment',
    //     studentCount: 3,
    //     supportPrograms: 'كتب بطريقة برايل، أجهزة قراءة صوتية، مرافق ومعدات مخصصة'
    //   },
    //   {
    //     id: 3,
    //     category: 'الإعاقة السمعية',
    //     categoryAr: 'الإعاقة السمعية',
    //     categoryEn: 'Hearing Impairment',
    //     studentCount: 2,
    //     supportPrograms: 'مترجم لغة الإشارة، أجهزة سمعية مساعدة، مقاعد أمامية'
    //   },
    //   {
    //     id: 4,
    //     category: 'الإعاقة الحركية',
    //     categoryAr: 'الإعاقة الحركية',
    //     categoryEn: 'Physical Disability',
    //     studentCount: 4,
    //     supportPrograms: 'مقاعد وطاولات قابلة للتعديل، مساعدات حركية، إمكانية وصول معززة'
    //   },
    //   {
    //     id: 5,
    //     category: 'اضطراب طيف التوحد',
    //     categoryAr: 'اضطراب طيف التوحد',
    //     categoryEn: 'Autism Spectrum Disorder',
    //     studentCount: 6,
    //     supportPrograms: 'بيئة تعليمية منظمة، برامج تعديل السلوك، تدريب المهارات الاجتماعية'
    //   },
    //   {
    //     id: 6,
    //     category: 'الإعاقة الذهنية',
    //     categoryAr: 'الإعاقة الذهنية',
    //     categoryEn: 'Intellectual Disability',
    //     studentCount: 5,
    //     supportPrograms: 'منهج مبسط، تعليم مهارات الحياة، برامج تأهيل مهني'
    //   },
    //   {
    //     id: 7,
    //     category: 'اضطراب نقص الانتباه وفرط النشاط',
    //     categoryAr: 'اضطراب نقص الانتباه وفرط النشاط',
    //     categoryEn: 'ADHD',
    //     studentCount: 7,
    //     supportPrograms: 'استراتيجيات إدارة الانتباه، فترات راحة منتظمة، بيئة قليلة التشتيت'
    //   },
    //   {
    //     id: 8,
    //     category: 'أخرى (ذكر)',
    //     categoryAr: 'أخرى (ذكر)',
    //     categoryEn: 'Others (Specify)',
    //     studentCount: 3,
    //     supportPrograms: 'برامج دعم مخصصة حسب الحاجة الفردية'
    //   }
    // ];

    // Initialize chronic diseases data
    // this.schoolInfo.chronicDiseasesData = [
    //   {
    //     id: 1,
    //     condition: 'السكري',
    //     conditionAr: 'السكري',
    //     conditionEn: 'Diabetes',
    //     studentCount: 3,
    //     awarenessProvided: 'برامج توعية غذائية، تدريب على إدارة مستوى السكر، خطط طوارئ طبية'
    //   },
    //   {
    //     id: 2,
    //     condition: 'الحساسية',
    //     conditionAr: 'الحساسية',
    //     conditionEn: 'Allergies',
    //     studentCount: 5,
    //     awarenessProvided: 'تحديد مسببات الحساسية، خطط إدارة الطوارئ، تدريب الكادر على الإسعافات الأولية'
    //   },
    //   {
    //     id: 3,
    //     condition: 'الربو',
    //     conditionAr: 'الربو',
    //     conditionEn: 'Asthma',
    //     studentCount: 4,
    //     awarenessProvided: 'برامج التوعية التنفسية، إدارة الأدوية، بيئة صحية خالية من المحفزات'
    //   },
    //   {
    //     id: 4,
    //     condition: 'أخرى',
    //     conditionAr: 'أخرى',
    //     conditionEn: 'Others',
    //     studentCount: 2,
    //     awarenessProvided: 'برامج دعم مخصصة حسب نوع الحالة المرضية'
    //   }
    // ];

    // Initialize multiple disabilities data
    // this.schoolInfo.multipleDisabilitiesData = [
    //   {
    //     id: 1,
    //     category: 'الإعاقات الذهنية',
    //     categoryAr: 'الإعاقات الذهنية',
    //     categoryEn: 'Intellectual Disabilities',
    //     studentCount: 2,
    //     awarenessProvided: 'برامج تأهيل شاملة، تعديل السلوك، تدريب المهارات الحياتية'
    //   },
    //   {
    //     id: 2,
    //     category: 'الإعاقات البصرية',
    //     categoryAr: 'الإعاقات البصرية',
    //     categoryEn: 'Visual Impairments',
    //     studentCount: 1,
    //     awarenessProvided: 'تقنيات مساعدة بصرية، تدريب على التنقل، مواد تعليمية مكيفة'
    //   },
    //   {
    //     id: 3,
    //     category: 'الإعاقات السمعية',
    //     categoryAr: 'الإعاقات السمعية',
    //     categoryEn: 'Hearing Impairments',
    //     studentCount: 1,
    //     awarenessProvided: 'أجهزة سمعية مساعدة، لغة الإشارة، تكنولوجيا التواصل البديل'
    //   },
    //   {
    //     id: 4,
    //     category: 'الإعاقات الحركية',
    //     categoryAr: 'الإعاقات الحركية',
    //     categoryEn: 'Physical Disabilities',
    //     studentCount: 2,
    //     awarenessProvided: 'معدات مساعدة للحركة، تعديل البيئة التعليمية، العلاج الطبيعي'
    //   },
    //   {
    //     id: 5,
    //     category: 'الإعاقات المتعددة',
    //     categoryAr: 'الإعاقات المتعددة',
    //     categoryEn: 'Multiple Disabilities',
    //     studentCount: 1,
    //     awarenessProvided: 'برامج تدخل شاملة، فريق متعدد التخصصات، خطط فردية مكثفة'
    //   }
    // ];
  }

  private setupGridColumns(): void {
    this.specialNeedsColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CATEGORY'),
        field: 'category',
        width: 300,
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable,
        cellRenderer: (params: any) => {
          return `<div class="category-cell">
            <span class="category-name">${params.value}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.STUDENT_COUNT'),
        field: 'studentCount',
        width: 150,
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          min: 0,
          step: 1
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.SUPPORT_PROGRAMS'),
        field: 'supportPrograms',
        width: 400,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 50
        },
        cellRenderer: (params: any) => {
          return `<div class="programs-cell">
            <span class="programs-text">${params.value || ''}</span>
          </div>`;
        }
      }
    ];
  }

  private setupChronicDiseasesGridColumns(): void {
    this.chronicDiseasesColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CHRONIC_CONDITION'),
        field: 'condition',
        width: 300,
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.STUDENT_COUNT'),
        field: 'studentCount',
        width: 150,
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          min: 0,
          step: 1
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.AWARENESS_PROVIDED'),
        field: 'awarenessProvided',
        width: 400,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 50
        }
      }
    ];
  }

  private setupMultipleDisabilitiesGridColumns(): void {
    this.multipleDisabilitiesColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DISABILITY_CATEGORY'),
        field: 'category',
        width: 300,
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.STUDENT_COUNT'),
        field: 'studentCount',
        width: 150,
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          min: 0,
          step: 1
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.AWARENESS_PROVIDED'),
        field: 'awarenessProvided',
        width: 400,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 50
        }
      }
    ];
  }

  private setupSpecialNeedsGridActions(): void {
    this.specialNeedsGridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.ADD_NEW_CATEGORY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewSpecialNeed();
        },
        show: (row: any) => {
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteSpecialNeed(row.data || row);
        },
        show: (row: any) => {
          return !row.data?.isNewRow && row.data.deletable;
        }
      }
    ];
  }

  private setupChronicDiseasesGridActions(): void {
    this.chronicDiseasesGridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.ADD_NEW_CONDITION'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewChronicDisease();
        },
        show: (row: any) => {
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteChronicDisease(row.data || row);
        },
        show: (row: any) => {
          return !row.data?.isNewRow && row.data.deletable;
        }
      }
    ];
  }

  private setupMultipleDisabilitiesGridActions(): void {
    this.multipleDisabilitiesGridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.ADD_NEW_DISABILITY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewMultipleDisability();
        },
        show: (row: any) => {
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteMultipleDisability(row.data || row);
        },
        show: (row: any) => {
          return !row.data?.isNewRow && row.data.deletable;
        }
      }
    ];
  }

  private setupSpecialNeedsPinnedRow(): void {
    this.specialNeedsPinnedBottomRowData = [
      {
        category: '',
        categoryAr: '',
        categoryEn: '',
        studentCount: 0,
        supportPrograms: '',
        isNewRow: true
      }
    ];
  }

  private setupChronicDiseasesPinnedRow(): void {
    this.chronicDiseasesPinnedBottomRowData = [
      {
        condition: '',
        conditionAr: '',
        conditionEn: '',
        studentCount: 0,
        awarenessProvided: '',
        isNewRow: true
      }
    ];
  }

  private setupMultipleDisabilitiesPinnedRow(): void {
    this.multipleDisabilitiesPinnedBottomRowData = [
      {
        category: '',
        categoryAr: '',
        categoryEn: '',
        studentCount: 0,
        awarenessProvided: '',
        isNewRow: true
      }
    ];
  }

  getTotalSpecialNeedsStudents(): number {
    const specialNeeds = this.schoolInfo.specialNeedsData.reduce((total, category) => total + (category.studentCount || 0), 0);
    const chronicDiseases = this.schoolInfo.chronicDiseasesData?.reduce((total, condition) => total + (condition.studentCount || 0), 0) || 0;
    const multipleDisabilities = this.schoolInfo.multipleDisabilitiesData?.reduce((total, category) => total + (category.studentCount || 0), 0) || 0;
    return specialNeeds + chronicDiseases + multipleDisabilities;
  }

  getTopCategory(): string {
    if (this.schoolInfo.specialNeedsData.length === 0) return '';

    const topCategory = this.schoolInfo.specialNeedsData.reduce((max, category) =>
      (category.studentCount || 0) > (max.studentCount || 0) ? category : max
    );

    return topCategory.category;
  }

  getAverageStudentsPerCategory(): number {
    if (this.schoolInfo.specialNeedsData.length === 0) return 0;

    const total = this.getTotalSpecialNeedsStudents();
    return Math.round(total / this.schoolInfo.specialNeedsData.length);
  }

  getCategoriesWithPrograms(): number {
    return this.schoolInfo.specialNeedsData.filter(category =>
      category.supportPrograms && category.supportPrograms.trim().length > 0
    ).length;
  }

  getInclusionRate(): number {
    const totalStudents = this.getTotalSpecialNeedsStudents();
    const totalSchoolPopulation = 850; // This would come from school data
    return totalStudents > 0 ? Math.round((totalStudents / totalSchoolPopulation) * 100 * 10) / 10 : 0;
  }

  getMostCommonNeed(): string {
    if (this.schoolInfo.specialNeedsData.length === 0) return '';

    // Exclude "Others" category for this calculation
    const filteredData = this.schoolInfo.specialNeedsData.filter(category =>
      !category.category.includes('أخرى') && !category.category.includes('Others')
    );

    if (filteredData.length === 0) return '';

    const mostCommon = filteredData.reduce((max, category) =>
      (category.studentCount || 0) > (max.studentCount || 0) ? category : max
    );

    return mostCommon.category;
  }

  onCellValueChanged(event: any): void {

    const data = event.data;
    const field = event.colDef.field;
    let newValue = event.newValue;
    let showWarning = false;

    // Check if this is the pinned row (new entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewSpecialNeedEntry(data);
      return;
    }

    // Validate studentCount field
    if (field === 'studentCount') {
      const originalValue = newValue;

      // Convert to number and validate
      const numValue = Number(newValue);

      // Check for various invalid conditions
      // Note: ag-grid's number editor with min/step constraints converts invalid input to null
      if (isNaN(numValue) || newValue === null || newValue === undefined) {
        // Invalid number (like text input) or null from ag-grid validation
        newValue = 0;
        showWarning = true;
      } else if (numValue < 0) {
        // Negative number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.abs(numValue);
        showWarning = true;
      } else if (!Number.isInteger(numValue)) {
        // Decimal number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.floor(numValue);
        showWarning = true;
      } else {
        // Valid positive integer
        newValue = numValue;
      }

      // Ensure the value is set in the data
      data[field] = newValue;

      // Show warning message if any validation occurred
      if (showWarning) {

        // Force grid refresh to show corrected value
        this.schoolInfo.specialNeedsData = [...this.schoolInfo.specialNeedsData];

        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.INVALID_STUDENT_COUNT'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
      }
    }

    // Update the data array
    const index = this.schoolInfo.specialNeedsData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      this.schoolInfo.specialNeedsData[index] = { ...data };
    }
  }

  private handleNewSpecialNeedEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    this.specialNeedsPinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  onChronicDiseasesCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    let newValue = event.newValue;
    let showWarning = false;

    // Check if this is the pinned row (new entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewChronicDiseaseEntry(data);
      return;
    }

    // Validate studentCount field
    if (field === 'studentCount') {
      const originalValue = newValue;

      // Convert to number and validate
      const numValue = Number(newValue);

      // Check for various invalid conditions
      // Note: ag-grid's number editor with min/step constraints converts invalid input to null
      if (isNaN(numValue) || newValue === null || newValue === undefined) {
        // Invalid number (like text input) or null from ag-grid validation
        newValue = 0;
        showWarning = true;
      } else if (numValue < 0) {
        // Negative number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.abs(numValue);
        showWarning = true;
      } else if (!Number.isInteger(numValue)) {
        // Decimal number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.floor(numValue);
        showWarning = true;
      } else {
        // Valid positive integer
        newValue = numValue;
      }

      // Ensure the value is set in the data
      data[field] = newValue;

      // Show warning message if any validation occurred
      if (showWarning) {
        // Force grid refresh to show corrected value
        this.schoolInfo.chronicDiseasesData = [...this.schoolInfo.chronicDiseasesData];

        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.INVALID_STUDENT_COUNT'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
      }
    }

    // Update the data array
    const index = this.schoolInfo.chronicDiseasesData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      this.schoolInfo.chronicDiseasesData[index] = { ...data };
    }
  }

  private handleNewChronicDiseaseEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    this.chronicDiseasesPinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  onMultipleDisabilitiesCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    let newValue = event.newValue;
    let showWarning = false;

    // Check if this is the pinned row (new entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewMultipleDisabilityEntry(data);
      return;
    }

    // Validate studentCount field
    if (field === 'studentCount') {
      const originalValue = newValue;

      // Convert to number and validate
      const numValue = Number(newValue);

      // Check for various invalid conditions
      // Note: ag-grid's number editor with min/step constraints converts invalid input to null
      if (isNaN(numValue) || newValue === null || newValue === undefined) {
        // Invalid number (like text input) or null from ag-grid validation
        newValue = 0;
        showWarning = true;
      } else if (numValue < 0) {
        // Negative number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.abs(numValue);
        showWarning = true;
      } else if (!Number.isInteger(numValue)) {
        // Decimal number (shouldn't happen with ag-grid constraints, but keeping for safety)
        newValue = Math.floor(numValue);
        showWarning = true;
      } else {
        // Valid positive integer
        newValue = numValue;
      }

      // Ensure the value is set in the data
      data[field] = newValue;

      // Show warning message if any validation occurred
      if (showWarning) {
        // Force grid refresh to show corrected value
        this.schoolInfo.multipleDisabilitiesData = [...this.schoolInfo.multipleDisabilitiesData];

        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.INVALID_STUDENT_COUNT'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
      }
    }

    // Update the data array
    const index = this.schoolInfo.multipleDisabilitiesData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      this.schoolInfo.multipleDisabilitiesData[index] = { ...data };
    }
  }

  private handleNewMultipleDisabilityEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    this.multipleDisabilitiesPinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  // Special Needs Actions
  deleteSpecialNeed(row: any): void {
    const index = this.schoolInfo.specialNeedsData.findIndex(
      item => item.id === row.id && item.category === row.category
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_CATEGORY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_CATEGORY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.specialNeedsData.splice(index, 1);
          this.schoolInfo.specialNeedsData = [...this.schoolInfo.specialNeedsData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CATEGORY_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  addNewSpecialNeed(): void {
    const timestamp = Date.now();

    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      const pinnedRowData = this.specialNeedsPinnedBottomRowData[0];

      const hasData = pinnedRowData && (
        (pinnedRowData.category && pinnedRowData.category.trim() !== '') ||
        (pinnedRowData.supportPrograms && pinnedRowData.supportPrograms.trim() !== '')
      );

      if (!hasData) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      const newId = Math.max(...this.schoolInfo.specialNeedsData.map(s => s.id || 0), 0) + 1;
      const newCategory = {
        id: newId,
        category: pinnedRowData.category || '',
        categoryAr: pinnedRowData.categoryAr || pinnedRowData.category || '',
        categoryEn: pinnedRowData.categoryEn || '',
        studentCount: pinnedRowData.studentCount || 0,
        supportPrograms: pinnedRowData.supportPrograms || '',
        deletable:true
      };

      this.schoolInfo.specialNeedsData.push(newCategory);
      this.schoolInfo.specialNeedsData = [...this.schoolInfo.specialNeedsData];
      this.setupSpecialNeedsPinnedRow();

      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CATEGORY_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0;
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CATEGORY_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0;
    }
  }

  // Chronic Diseases Actions
  deleteChronicDisease(row: any): void {
    const index = this.schoolInfo.chronicDiseasesData.findIndex(
      item => item.id === row.id && item.condition === row.condition
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_CONDITION_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_CONDITION_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.chronicDiseasesData.splice(index, 1);
          this.schoolInfo.chronicDiseasesData = [...this.schoolInfo.chronicDiseasesData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CONDITION_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  addNewChronicDisease(): void {
    const timestamp = Date.now();

    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      const pinnedRowData = this.chronicDiseasesPinnedBottomRowData[0];

      const hasData = pinnedRowData && (
        (pinnedRowData.condition && pinnedRowData.condition.trim() !== '') ||
        (pinnedRowData.awarenessProvided && pinnedRowData.awarenessProvided.trim() !== '')
      );

      if (!hasData) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      const newId = Math.max(...this.schoolInfo.chronicDiseasesData.map(s => s.id || 0), 0) + 1;
      const newCondition = {
        id: newId,
        condition: pinnedRowData.condition || '',
        conditionAr: pinnedRowData.conditionAr || pinnedRowData.condition || '',
        conditionEn: pinnedRowData.conditionEn || '',
        studentCount: pinnedRowData.studentCount || 0,
        awarenessProvided: pinnedRowData.awarenessProvided || '',
        deletable:true
      };

      this.schoolInfo.chronicDiseasesData.push(newCondition);
      this.schoolInfo.chronicDiseasesData = [...this.schoolInfo.chronicDiseasesData];
      this.setupChronicDiseasesPinnedRow();

      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CONDITION_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0;
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.CONDITION_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0;
    }
  }

  // Multiple Disabilities Actions
  deleteMultipleDisability(row: any): void {
    const index = this.schoolInfo.multipleDisabilitiesData.findIndex(
      item => item.id === row.id && item.category === row.category
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_DISABILITY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DELETE_DISABILITY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.multipleDisabilitiesData.splice(index, 1);
          this.schoolInfo.multipleDisabilitiesData = [...this.schoolInfo.multipleDisabilitiesData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DISABILITY_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  addNewMultipleDisability(): void {
    const timestamp = Date.now();

    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      const pinnedRowData = this.multipleDisabilitiesPinnedBottomRowData[0];

      const hasData = pinnedRowData && (
        (pinnedRowData.category && pinnedRowData.category.trim() !== '') ||
        (pinnedRowData.awarenessProvided && pinnedRowData.awarenessProvided.trim() !== '')
      );

      if (!hasData) {
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0;
        return;
      }

      const newId = Math.max(...this.schoolInfo.multipleDisabilitiesData.map(s => s.id || 0), 0) + 1;
      const newDisability = {
        id: newId,
        category: pinnedRowData.category || '',
        categoryAr: pinnedRowData.categoryAr || pinnedRowData.category || '',
        categoryEn: pinnedRowData.categoryEn || '',
        studentCount: pinnedRowData.studentCount || 0,
        awarenessProvided: pinnedRowData.awarenessProvided || '',
        deletable:true
      };

      this.schoolInfo.multipleDisabilitiesData.push(newDisability);
      this.schoolInfo.multipleDisabilitiesData = [...this.schoolInfo.multipleDisabilitiesData];
      this.setupMultipleDisabilitiesPinnedRow();

      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DISABILITY_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0;
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SPECIAL_NEEDS.DISABILITY_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0;
    }
  }
} 
