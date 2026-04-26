import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolActivity, SchoolInfo } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-school-activities',
  templateUrl: './school-activities.component.html',
  styleUrls: ['./school-activities.component.scss']
})
export class SchoolActivitiesComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  schoolActivitiesColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing

  constructor(
    private translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    console.log('SchoolActivities ngOnInit - schoolInfo:', this.schoolInfo);
    this.initializeData();
    console.log('SchoolActivities after initializeData - schoolActivitiesData:', this.schoolInfo.schoolActivitiesData);
    this.setupGridColumns();
    if (this.isEditable) {
      this.setupGridActions();
      this.setupPinnedRow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolInfo'] && changes['schoolInfo'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolInfo changes
      this.setupPinnedRow();
    }
  }

  private setupPinnedRow(): void {
    this.pinnedBottomRowData = [
      {
        project: '',
        programImplementationTimeframe: '',
        programSupportingActivities: '',
        isNewRow: true // Flag to identify this as the new row
      }
    ];
  }

  private initializeData(): void {
    console.log('initializeData called - schoolInfo before:', this.schoolInfo);

    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
      console.log('Created new schoolInfo object');
    }

    if (!this.schoolInfo.schoolActivitiesData) {
      this.schoolInfo.schoolActivitiesData = [];
    }

    // // Always initialize with mock data for now
    // this.schoolInfo.schoolActivitiesData = [
    //   {
    //     project: 'مشروع تطوير المهارات الرياضية',
    //     programImplementationTimeframe: 'سبتمبر 2024 - يونيو 2025',
    //     programSupportingActivities: 'تدريب المدربين، شراء المعدات الرياضية، تنظيم المسابقات الداخلية والخارجية'
    //   },
    //   {
    //     project: 'مشروع تعزيز الثقافة والأدب',
    //     programImplementationTimeframe: 'أكتوبر 2024 - مايو 2025',
    //     programSupportingActivities: 'ورش الكتابة الإبداعية، مسابقات الشعر، معارض الكتب، النوادي الأدبية'
    //   },
    //   {
    //     project: 'مشروع العلوم والتكنولوجيا',
    //     programImplementationTimeframe: 'نوفمبر 2024 - أبريل 2025',
    //     programSupportingActivities: 'معارض العلوم، ورش الروبوتات، برامج البرمجة، مختبرات متطورة'
    //   },
    //   {
    //     project: 'مشروع الفنون والإبداع',
    //     programImplementationTimeframe: 'ديسمبر 2024 - مارس 2025',
    //     programSupportingActivities: 'ورش الرسم والتصوير، العروض المسرحية، المعارض الفنية، الحرف اليدوية'
    //   },
    //   {
    //     project: 'مشروع الخدمة المجتمعية',
    //     programImplementationTimeframe: 'يناير 2025 - ديسمبر 2025',
    //     programSupportingActivities: 'برامج التطوع، زيارة دور الرعاية، حملات التوعية، مشاريع خدمة البيئة'
    //   },
    //   {
    //     project: 'مشروع الاستدامة البيئية',
    //     programImplementationTimeframe: 'فبراير 2025 - نوفمبر 2025',
    //     programSupportingActivities: 'برامج إعادة التدوير، الحدائق المدرسية، ورش التوعية البيئية، مشاريع الطاقة المتجددة'
    //   }
    // ];

    console.log('initializeData completed - schoolActivitiesData:', this.schoolInfo.schoolActivitiesData);
  }

  private setupGridColumns(): void {
    console.log('Setting up grid columns...');
    this.schoolActivitiesColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.PROJECT'),
        field: 'project',
        width: 350,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 200,
          rows: 2,
          cols: 40
        },
        cellRenderer: (params: any) => {
          return `<div class="project-cell">
            <span class="project-text">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.PROGRAM_IMPLEMENTATION_TIMEFRAME'),
        field: 'programImplementationTimeframe',
        width: 350,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 200,
          rows: 2,
          cols: 40
        },
        cellRenderer: (params: any) => {
          return `<div class="timeframe-cell">
            <span class="timeframe-text">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.PROGRAM_SUPPORTING_ACTIVITIES'),
        field: 'programSupportingActivities',
        width: 450,
        cellEditor: 'agLargeTextCellEditor',
        editable: this.isEditable,
        cellEditorParams: {
          maxLength: 300,
          rows: 3,
          cols: 50
        },
        cellRenderer: (params: any) => {
          return `<div class="supporting-cell">
            <span class="supporting-text">${params.value || ''}</span>
          </div>`;
        }
      }
    ];
    console.log('Grid columns setup completed:', this.schoolActivitiesColumns);
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.ADD_NEW_ACTIVITY'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewActivity();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new activity entry row)
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteActivity(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new activity entry row)
          return !row.data?.isNewRow;
        }
      }
    ];
  }

  deleteActivity(row: any): void {
    const index = this.schoolInfo.schoolActivitiesData.findIndex(
      item => item.project === row.project &&
        item.programImplementationTimeframe === row.programImplementationTimeframe
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.DELETE_ACTIVITY_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.DELETE_ACTIVITY_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.schoolActivitiesData.splice(index, 1);
          this.schoolInfo.schoolActivitiesData = [...this.schoolInfo.schoolActivitiesData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.ACTIVITY_DELETED_SUCCESS'),
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  getTotalActivities(): number {
    return this.schoolInfo.schoolActivitiesData.filter(activity =>
      activity.project && activity.project.trim().length > 0
    ).length;
  }

  getCompletedActivities(): number {
    return this.schoolInfo.schoolActivitiesData.filter(activity =>
      activity.project && activity.project.trim().length > 0 &&
      activity.programImplementationTimeframe && activity.programImplementationTimeframe.trim().length > 0 &&
      activity.programSupportingActivities && activity.programSupportingActivities.trim().length > 0
    ).length;
  }

  getActivitiesWithTargetGroups(): number {
    return this.schoolInfo.schoolActivitiesData.filter(activity =>
      activity.programImplementationTimeframe && activity.programImplementationTimeframe.trim().length > 0
    ).length;
  }

  getActivitiesWithSupport(): number {
    return this.schoolInfo.schoolActivitiesData.filter(activity =>
      activity.programSupportingActivities && activity.programSupportingActivities.trim().length > 0
    ).length;
  }

  getCompletionPercentage(): number {
    const total = this.schoolInfo.schoolActivitiesData.length;
    const completed = this.getCompletedActivities();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getMostCommonActivityType(): string {
    const activities = this.schoolInfo.schoolActivitiesData
      .filter(activity => activity.project && activity.project.trim().length > 0)
      .map(activity => activity.project);

    if (activities.length === 0) return '';

    const frequency: { [key: string]: number } = {};
    activities.forEach(activity => {
      frequency[activity] = (frequency[activity] || 0) + 1;
    });

    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new activity entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewActivityEntry(data);
      return;
    }

    // Update existing activity data
    const index = this.schoolInfo.schoolActivitiesData.findIndex(item =>
      item.project === data.project &&
      item.programImplementationTimeframe === data.programImplementationTimeframe &&
      item.programSupportingActivities === data.programSupportingActivities
    );
    if (index !== -1) {
      this.schoolInfo.schoolActivitiesData[index] = { ...data };
    }
  }

  private handleNewActivityEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Activity + icon
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  addNewActivity(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and schoolActivitiesData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.schoolActivitiesData) {
        this.schoolInfo.schoolActivitiesData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.project && pinnedRowData.project.trim() !== '') ||
        (pinnedRowData.programImplementationTimeframe && pinnedRowData.programImplementationTimeframe.trim() !== '') ||
        (pinnedRowData.programSupportingActivities && pinnedRowData.programSupportingActivities.trim() !== '')
      );

      if (!hasData) {
        // Show validation message asking user to enter data first
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0; // Reset to allow retry
        return;
      }

      // Create new activity with the entered data
      const newActivity: SchoolActivity = {
        project: pinnedRowData.project || '',
        programImplementationTimeframe: pinnedRowData.programImplementationTimeframe || '',
        programSupportingActivities: pinnedRowData.programSupportingActivities || ''
      };

      this.schoolInfo.schoolActivitiesData.push(newActivity);

      // Force grid refresh
      this.schoolInfo.schoolActivitiesData = [...this.schoolInfo.schoolActivitiesData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.ACTIVITY_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.SCHOOL_ACTIVITIES.ACTIVITY_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }

  removeActivity(index: number): void {
    this.schoolInfo.schoolActivitiesData.splice(index, 1);
  }

} 
