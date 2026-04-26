import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { AdditionalStaffData, SchoolInfo, StaffMember } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';
import { CommonService } from 'src/app/core/services/common.service';
import { CountryDto } from 'src/app/core/models/country-dto';
import { ToastService } from 'src/app/core/services/toast-service';

@Component({
  selector: 'app-staff-data',
  templateUrl: './staff-data.component.html',
  styleUrls: ['./staff-data.component.scss']
})
export class StaffDataComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  staffColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing
  countries: CountryDto[] = [];
  constructor(
    public translate: TranslateService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private toastService: ToastService
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
    this.getAllCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolData changes
      this.setupPinnedRow();
    }
  }

  onGridReady(params: any): void {
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit();

    // Auto-size all columns to fit their content
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  private initializeData(): void {
    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }

    if (!this.schoolInfo.staffData) {
      this.schoolInfo.staffData = [];
    }

    if (!this.schoolInfo.additionalStaffData) {
      this.schoolInfo.additionalStaffData = {
        numberOfGuards: 2,
        numberOfCleaners: 4,
        others: 3
      };
    }
  }

  private setupGridColumns(): void {
    this.staffColumns = [
      {
        headerName: 'الاسم',
        field: 'name',
        width: 150,
        cellStyle: {
          'text-align': 'right',
          'padding-right': '15px',
          'font-weight': '500'
        },
        headerClass: 'wrapped-header',
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable
      },
      {
        headerName: 'الجنسية',
        field: 'nationality',
        width: 120,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agSelectCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          // values:this.countries.filter(c => !!c.countryNameAr) 
          //         .map(c => c.countryNameAr!)
          values: ['سلطنة', 'مصرية', 'أردنية', 'سورية', 'لبنانية', 'فلسطينية', 'أخرى']
        }
      },
      {
        headerName: 'المؤهل التربوي',
        field: 'educationalQualification',
        width: 140,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agSelectCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          values: ['دكتوراه', 'ماجستير', 'بكالوريوس', 'دبلوم', 'ثانوية عامة']
        }
      },
      {
        headerName: 'الوظيفة / مادة\nالتدريس',
        field: 'jobRole',
        width: 140,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable
      },
      {
        headerName: 'الصفوف التي\nيدرسها',
        field: 'classesTeaching',
        width: 120,
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agTextCellEditor',
        editable: this.isEditable
      },
      {
        headerName: 'سنوات العمل بالتدريس',
        field: 'totalExperience',
        width: 120,
        type: 'numericColumn',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable
      },
      {
        headerName: 'سنوات العمل\nبالمدرسة',
        field: 'schoolExperience',
        width: 120,
        type: 'numericColumn',
        cellStyle: { 'text-align': 'center' },
        headerClass: 'wrapped-header',
        cellEditor: 'agNumberCellEditor',
        editable: this.isEditable
      }
    ];
  }

  getAllCountries() {
    this.commonService.getAllCountries().subscribe({
      next: (res) => {
        this.countries = res.data || [];
      },
      error: () => {
        this.countries = [];
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.ADD_NEW_STAFF_MEMBER'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewStaffMember();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new staff member entry row)
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteStaffMember(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new staff member entry row)
          return !row.data?.isNewRow;
        }
      }
    ];
  }

  private setupPinnedRow(): void {
    this.pinnedBottomRowData = [
      {
        id: null,
        name: '',
        nationality: '',
        educationalQualification: '',
        jobRole: '',
        classesTeaching: '',
        totalExperience: 0,
        schoolExperience: 0,
        isNewRow: true // Flag to identify this as the new row
      }
    ];
  }

  getTotalStaff(): number {
    return this.schoolInfo.staffData.length;
  }

  getAverageExperience(): number {
    if (this.schoolInfo.staffData.length === 0) return 0;

    const totalExperience = this.schoolInfo.staffData.reduce(
      (sum, staff) => sum + (staff.totalExperience || 0), 0
    );
    return Math.round(totalExperience / this.schoolInfo.staffData.length);
  }

  getHighestQualification(): string {
    const qualifications = this.schoolInfo.staffData.map(s => s.educationalQualification);
    const qualificationRank = {
      'دكتوراه': 4,
      'ماجستير': 3,
      'بكالوريوس': 2,
      'دبلوم': 1,
      'ثانوية عامة': 0
    };

    let highest = '';
    let highestRank = -1;

    qualifications.forEach(qual => {
      const rank = qualificationRank[qual as keyof typeof qualificationRank] || 0;
      if (rank > highestRank) {
        highestRank = rank;
        highest = qual;
      }
    });

    return highest;
  }

  getOverallTotal(): number {
    return this.getTotalStaff() +
      this.schoolInfo.additionalStaffData.numberOfGuards +
      this.schoolInfo.additionalStaffData.numberOfCleaners +
      this.schoolInfo.additionalStaffData.others;
  }

  getQualificationDistribution(): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    this.schoolInfo.staffData.forEach(staff => {
      const qualification = staff.educationalQualification || 'غير محدد';
      distribution[qualification] = (distribution[qualification] || 0) + 1;
    });
    return distribution;
  }

  getExperiencedStaffCount(): number {
    return this.schoolInfo.staffData.filter(s => s.totalExperience >= 8).length;
  }

  getNewStaffCount(): number {
    return this.schoolInfo.staffData.filter(s => s.totalExperience < 3).length;
  }

  getManagementPositionsCount(): number {
    return this.schoolInfo.staffData.filter(s =>
      s.jobRole.includes('مدير') || s.jobRole.includes('وكيل')
    ).length;
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new staff member entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewStaffEntry(data);
      return;
    }

    // Update existing staff data
    const rowIndex = event.rowIndex;
    if (rowIndex !== undefined && this.schoolInfo.staffData[rowIndex]) {
      this.schoolInfo.staffData[rowIndex] = { ...data };
    }
  }

  private handleNewStaffEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Staff Member + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  onAdditionalDataChange(field: keyof AdditionalStaffData, value: number): void {
    this.schoolInfo.additionalStaffData[field] = value || 0;
  }

  addNewStaffMember(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and staffData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.staffData) {
        this.schoolInfo.staffData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.name && pinnedRowData.name.trim() !== '') ||
        (pinnedRowData.jobRole && pinnedRowData.jobRole.trim() !== '') ||
        (pinnedRowData.classesTeaching && pinnedRowData.classesTeaching.trim() !== '')
      );

      if (!hasData) {
        // Show validation message asking user to enter data first
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0; // Reset to allow retry
        return;
      }

      // Create new staff member with the entered data
      const newId = Math.max(...this.schoolInfo.staffData.map(s => s.id || 0), 0) + 1;
      const newStaff: StaffMember = {
        id: newId,
        name: pinnedRowData.name || '',
        nationality: pinnedRowData.nationality || 'سلطنة',
        educationalQualification: pinnedRowData.educationalQualification || 'بكالوريوس',
        jobRole: pinnedRowData.jobRole || '',
        classesTeaching: pinnedRowData.classesTeaching || '',
        totalExperience: pinnedRowData.totalExperience || 0,
        schoolExperience: pinnedRowData.schoolExperience || 0
      };

      this.schoolInfo.staffData.push(newStaff);

      // Force grid refresh
      this.schoolInfo.staffData = [...this.schoolInfo.staffData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.STAFF_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.STAFF_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }

  deleteStaffMember(row: any): void {
    const index = this.schoolInfo.staffData.findIndex(
      item => item.id === row.id && item.name === row.name
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.DELETE_STAFF_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.DELETE_STAFF_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.staffData.splice(index, 1);
          this.schoolInfo.staffData = [...this.schoolInfo.staffData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.STAFF_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

} 
