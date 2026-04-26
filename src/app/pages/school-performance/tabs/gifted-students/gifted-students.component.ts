import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolInfo } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-gifted-students',
  templateUrl: './gifted-students.component.html',
  styleUrls: ['./gifted-students.component.scss']
})
export class GiftedStudentsComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  giftedStudentsColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing
  private gridApi: any;

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal
  ) {
    // Subscribe to language changes to update column headers
    this.translate.onLangChange.subscribe(() => {
      this.setupGridColumns();
    });
  }

  ngOnInit(): void {
    // this.initializeData();
    this.setupGridColumns();
    if (this.isEditable) {
      this.setupGridActions();
      this.setupPinnedRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      // this.initializeData(); // Re-initialize data if schoolData changes
      this.setupPinnedRow();
    }
  }


  private setupPinnedRow(): void {
    this.pinnedBottomRowData = [
      {
        category: '',
        categoryAr: '',
        categoryEn: '',
        studentCount: 0,
        enrichmentPrograms: '',
        isNewRow: true // Flag to identify this as the new row
      }
    ];
  }

  private setupGridColumns(): void {
    this.giftedStudentsColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.FIELDS'),
        field: 'category',
        width: 350,
        cellStyle: {
          'text-align': 'right',
          'padding-right': '15px',
          'font-weight': '500',
          'color': '#1F487E'
        },
        headerClass: 'wrapped-header',
        editable: (params: any) => {
          // Make editable only for pinned rows (new entries)
          return params.node.rowPinned === 'bottom';
        },
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: 100,
          rows: 2,
          cols: 30
        },
        pinned: 'right'
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.STUDENT_COUNT'),
        field: 'studentCount',
        width: 180,
        type: 'numericColumn',
        cellEditor: 'agNumberCellEditor',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        editable: this.isEditable,
        cellEditorParams: {
          min: 0,
          step: 1
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.ENRICHMENT_PROGRAMS'),
        field: 'enrichmentPrograms',
        width: 500,
        cellEditor: 'agLargeTextCellEditor',
        cellStyle: {
          'text-align': 'right',
          'padding': '10px',
          'white-space': 'pre-wrap'
        },
        headerClass: 'wrapped-header',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 500,
          rows: 3,
          cols: 50
        }
      }
    ];
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.ADD_NEW_CATEGORY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewCategory();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new category entry row)
          return row.data?.isNewRow;
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
          return !row.data?.isNewRow && row.data.deletable;
        }
      }
    ];
  }

  getTotalGiftedStudents(): number {
    return this.schoolInfo.giftedStudentsData.reduce((total, category) => total + (category.studentCount || 0), 0);
  }

  getTopCategory(): string {
    if (this.schoolInfo.giftedStudentsData.length === 0) return '';

    const topCategory = this.schoolInfo.giftedStudentsData.reduce((max, category) =>
      (category.studentCount || 0) > (max.studentCount || 0) ? category : max
    );

    return topCategory.category;
  }

  getAverageStudentsPerCategory(): number {
    if (this.schoolInfo.giftedStudentsData.length === 0) return 0;

    const total = this.getTotalGiftedStudents();
    return Math.round(total / this.schoolInfo.giftedStudentsData.length);
  }

  getCategoriesWithPrograms(): number {
    return this.schoolInfo.giftedStudentsData.filter(category =>
      category.enrichmentPrograms && category.enrichmentPrograms.trim().length > 0
    ).length;
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new category entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewCategoryEntry(data);
      return;
    }

    console.log(`Updated ${field} for category ${data.category}: ${newValue}`);

    // Update the data array
    const index = this.schoolInfo.giftedStudentsData.findIndex(item => item.id === data.id);
    if (index !== -1) {
      this.schoolInfo.giftedStudentsData[index] = { ...data };
    }
  }

  private handleNewCategoryEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Category + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  addNewCategory(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and giftedStudentsData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.giftedStudentsData) {
        this.schoolInfo.giftedStudentsData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.category && pinnedRowData.category.trim() !== '') ||
        (pinnedRowData.studentCount && pinnedRowData.studentCount > 0) ||
        (pinnedRowData.enrichmentPrograms && pinnedRowData.enrichmentPrograms.trim() !== '')
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
        id: this.schoolInfo.giftedStudentsData.length + 1, // Simple ID generation
        category: pinnedRowData.category || '',
        categoryAr: pinnedRowData.category || '',
        categoryEn: pinnedRowData.category || '',
        studentCount: pinnedRowData.studentCount || 0,
        enrichmentPrograms: pinnedRowData.enrichmentPrograms || '',
        deletable:true
      };

      this.schoolInfo.giftedStudentsData.push(newCategory);

      // Force grid refresh
      this.schoolInfo.giftedStudentsData = [...this.schoolInfo.giftedStudentsData];

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

  deleteCategory(row: any): void {
    const index = this.schoolInfo.giftedStudentsData.findIndex(
      item => item.category === row.category &&
        item.id === row.id
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.DELETE_CATEGORY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GIFTED_STUDENTS.DELETE_CATEGORY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.giftedStudentsData.splice(index, 1);

          // Force grid refresh by creating a new array reference
          this.schoolInfo.giftedStudentsData = [...this.schoolInfo.giftedStudentsData];

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

  onGridReady(params: any): void {
    this.gridApi = params.api;

    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();

    // Auto-size all columns to fit their content
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

} 
