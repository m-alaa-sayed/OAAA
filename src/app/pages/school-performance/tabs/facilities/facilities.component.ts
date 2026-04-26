import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolFacility, SchoolInfo } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  facilitiesColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal
  ) {
    // Initialize schoolInfo if not provided
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }
  }

  ngOnInit(): void {
    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }

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

  private setupPinnedRow(): void {
    this.pinnedBottomRowData = [
      {
        facilityName: '',
        totalCount: 0,
        nonFunctioningCount: 0,
        notes: '',
        isNewRow: true // Flag to identify this as the new row
      }
    ];
  }

  private initializeData(): void {
    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }

    if (!this.schoolInfo.facilitiesData) {
      this.schoolInfo.facilitiesData = [
        {
          facilityName: 'معامل (معامل التعلم - الملاعب - دورات المياه - قاعات الأنشطة ...)',
          totalCount: 4,
          nonFunctioningCount: 4,
          notes: 'صالحة للعب وآمنة'
        },
        {
          facilityName: 'قاعات دراسية',
          totalCount: 25,
          nonFunctioningCount: 0,
          notes: 'جميعها مجهزة بأحدث التقنيات التعليمية'
        },
        {
          facilityName: 'مكتبة مدرسية',
          totalCount: 1,
          nonFunctioningCount: 0,
          notes: 'تحتوي على مجموعة متنوعة من الكتب والمراجع'
        },
        {
          facilityName: 'ملاعب رياضية',
          totalCount: 2,
          nonFunctioningCount: 0,
          notes: 'ملعب كرة قدم وملعب كرة سلة'
        },
        {
          facilityName: 'معامل علوم',
          totalCount: 3,
          nonFunctioningCount: 1,
          notes: 'معمل فيزياء ومعمل كيمياء ومعمل أحياء'
        },
        {
          facilityName: 'معمل حاسوب',
          totalCount: 2,
          nonFunctioningCount: 0,
          notes: 'مجهز بأحدث أجهزة الحاسوب والبرامج التعليمية'
        },
        {
          facilityName: 'قاعة متعددة الأغراض',
          totalCount: 1,
          nonFunctioningCount: 0,
          notes: 'تستخدم للفعاليات والاجتماعات المدرسية'
        },
        {
          facilityName: 'مقصف مدرسي',
          totalCount: 1,
          nonFunctioningCount: 0,
          notes: 'يقدم وجبات صحية ومتوازنة للطلبة'
        }
      ];
    }
  }

  private setupGridColumns(): void {
    this.facilitiesColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.FACILITY_NAME'),
        field: 'facilityName',
        width: 400,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 200,
          rows: 3,
          cols: 50
        },
        cellRenderer: (params: any) => {
          return `<div class="facility-cell">
            <span class="facility-name">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.TOTAL_COUNT'),
        field: 'totalCount',
        width: 120,
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable,
        cellRenderer: (params: any) => {
          return `<div class="count-cell">
            <span class="total-count">${params.value || 0}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.NON_FUNCTIONING_COUNT'),
        field: 'nonFunctioningCount',
        width: 150,
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable,
        cellRenderer: (params: any) => {
          const value = params.value || 0;
          const isWorking = value === 0;
          return `<div class="non-functioning-cell">
            <span class="non-functioning-count ${isWorking ? 'working' : 'not-working'}">${value}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.NOTES'),
        field: 'notes',
        width: 350,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 300,
          rows: 2,
          cols: 40
        },
        cellRenderer: (params: any) => {
          return `<div class="notes-cell">
            <span class="notes-text">${params.value || ''}</span>
          </div>`;
        }
      }
    ];
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.ADD_NEW_FACILITY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewFacility();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new facility entry row)
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteFacility(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new facility entry row)
          return !row.data?.isNewRow;
        }
      }
    ];
  }

  deleteFacility(row: any): void {
    const index = this.schoolInfo.facilitiesData.findIndex(
      item => item.facilityName === row.facilityName &&
        item.totalCount === row.totalCount
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.DELETE_FACILITY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.DELETE_FACILITY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.facilitiesData.splice(index, 1);

          // Force grid refresh by creating a new array reference
          this.schoolInfo.facilitiesData = [...this.schoolInfo.facilitiesData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.FACILITY_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  getTotalFacilities(): number {
    return this.schoolInfo.facilitiesData.reduce((total, facility) => total + (facility.totalCount || 0), 0);
  }

  getFunctioningFacilities(): number {
    return this.schoolInfo.facilitiesData.reduce((total, facility) =>
      total + ((facility.totalCount || 0) - (facility.nonFunctioningCount || 0)), 0
    );
  }

  getNonFunctioningFacilities(): number {
    return this.schoolInfo.facilitiesData.reduce((total, facility) => total + (facility.nonFunctioningCount || 0), 0);
  }

  getFacilityTypes(): number {
    return this.schoolInfo.facilitiesData.filter(facility =>
      facility.facilityName && facility.facilityName.trim().length > 0
    ).length;
  }

  getFunctionalityRate(): number {
    const total = this.getTotalFacilities();
    const functioning = this.getFunctioningFacilities();
    return total > 0 ? Math.round((functioning / total) * 100) : 0;
  }

  getMaintenanceNeeded(): number {
    return this.schoolInfo.facilitiesData.filter(facility =>
      (facility.nonFunctioningCount || 0) > 0
    ).length;
  }

  getAverageFacilitiesPerType(): number {
    const totalFacilities = this.getTotalFacilities();
    const facilityTypes = this.getFacilityTypes();
    return facilityTypes > 0 ? Math.round(totalFacilities / facilityTypes) : 0;
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new facility entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewFacilityEntry(data);
      return;
    }

    // Validate that non-functioning count doesn't exceed total count
    if (field === 'nonFunctioningCount' || field === 'totalCount') {
      if (data.nonFunctioningCount > data.totalCount) {
        data.nonFunctioningCount = data.totalCount;
        event.api.refreshCells({ rowNodes: [event.node], force: true });
      }
    }

    // Update existing facility data
    const index = this.schoolInfo.facilitiesData.findIndex(item =>
      item.facilityName === data.facilityName
    );
    if (index !== -1) {
      this.schoolInfo.facilitiesData[index] = { ...data };
    }
  }

  private handleNewFacilityEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Facility + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  addNewFacility(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and facilitiesData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.facilitiesData) {
        this.schoolInfo.facilitiesData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.facilityName && pinnedRowData.facilityName.trim() !== '') ||
        (pinnedRowData.totalCount && pinnedRowData.totalCount > 0) ||
        (pinnedRowData.notes && pinnedRowData.notes.trim() !== '')
      );

      if (!hasData) {
        // Show validation message asking user to enter data first
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0; // Reset to allow retry
        return;
      }

      // Create new facility with the entered data
      const newFacility: SchoolFacility = {
        facilityName: pinnedRowData.facilityName || '',
        totalCount: pinnedRowData.totalCount || 0,
        nonFunctioningCount: pinnedRowData.nonFunctioningCount || 0,
        notes: pinnedRowData.notes || ''
      };

      // Validate that non-functioning count doesn't exceed total count
      if (newFacility.nonFunctioningCount > newFacility.totalCount) {
        newFacility.nonFunctioningCount = newFacility.totalCount;
      }

      this.schoolInfo.facilitiesData.push(newFacility);

      // Force grid refresh
      this.schoolInfo.facilitiesData = [...this.schoolInfo.facilitiesData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.FACILITY_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.FACILITIES.FACILITY_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }

  removeFacility(index: number): void {
    this.schoolInfo.facilitiesData.splice(index, 1);
  }
} 
