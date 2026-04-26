import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { EducationalProgram, SchoolInfo } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-educational-programs',
  templateUrl: './educational-programs.component.html',
  styleUrls: ['./educational-programs.component.scss']
})
export class EducationalProgramsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isReadonly: boolean = false;
  educationalProgramsColumns: any[] = [];
  gridActions: any[] = [];
  pinnedBottomRowData: any[] = [];
  lastAddTime: number = 0; // Track last add time for debouncing
  private licenseChangeHandler?: (event: any) => void;
gridApi: any;
gridColumnApi: any;
  constructor(
    private translate: TranslateService,
    private modalService: NgbModal,
    public commonService: CommonService
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
    if (!this.isReadonly) {
      this.setupGridActions();
      this.setupPinnedRow();
    }
    this.setupEventListeners();

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
        programName: '',
        gradeLevels: '',
        studentCount: 0,
        licenseIndicator: false,
        attachments: [],
        isNewRow: true ,
          objectName:'',
        bucketName:''
        // Flag to identify this as the new row
      }
    ];
  }

  private setupEventListeners(): void {
    // Set up event listener for license checkbox changes
    this.licenseChangeHandler = (event: any) => {
      const detail = event.detail;
      const rowIndex = detail.rowIndex;
      const newValue = detail.newValue;
      const isPinnedRow = detail.isPinnedRow;

      if (isPinnedRow) {
        // Update pinned row data
        if (this.pinnedBottomRowData[0]) {
          this.pinnedBottomRowData[0].licenseIndicator = newValue;
        }
      } else if (this.schoolInfo.educationalProgramsData[rowIndex]) {
        // Update regular row data
        this.schoolInfo.educationalProgramsData[rowIndex].licenseIndicator = newValue;

        // Trigger the component's cellValueChanged handler
        this.onCellValueChanged({
          data: this.schoolInfo.educationalProgramsData[rowIndex],
          colDef: { field: 'licenseIndicator' },
          newValue: newValue,
          rowIndex: rowIndex
        });
      }
    };

    setTimeout(() => {
      document.addEventListener('licenseChanged', this.licenseChangeHandler as EventListener);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.licenseChangeHandler) {
      document.removeEventListener('licenseChanged', this.licenseChangeHandler as EventListener);
    }
  }

  private initializeData(): void {
    // Ensure schoolInfo is initialized
    if (!this.schoolInfo) {
      this.schoolInfo = {} as SchoolInfo;
    }
    // this.schoolInfo.educationalProgramsData = [
    //   {
    //     programName: 'البرنامج البريطاني (Cambridge)',
    //     gradeLevels: 'الصفوف 10-12',
    //     studentCount: 120,
    //     licenseIndicator: true,
    //     attachments: ['cambridge_license.pdf', 'curriculum_guide.pdf']
    //   },
    //   {
    //     programName: 'البرنامج الأمريكي (AP)',
    //     gradeLevels: 'الصفوف 11-12',
    //     studentCount: 85,
    //     licenseIndicator: true,
    //     attachments: ['ap_certification.pdf']
    //   },
    //   {
    //     programName: 'البكالوريا الدولية (IB)',
    //     gradeLevels: 'الصفوف 11-12',
    //     studentCount: 65,
    //     licenseIndicator: true,
    //     attachments: ['ib_authorization.pdf', 'program_details.pdf']
    //   },
    //   {
    //     programName: 'برنامج اللغة الفرنسية',
    //     gradeLevels: 'الصفوف 5-10',
    //     studentCount: 200,
    //     licenseIndicator: true,
    //     attachments: ['french_program_license.pdf']
    //   },
    //   {
    //     programName: 'برنامج التعليم المهني',
    //     gradeLevels: 'الصفوف 10-12',
    //     studentCount: 150,
    //     licenseIndicator: false,
    //     attachments: []
    //   },
    //   {
    //     programName: 'برنامج STEM المتقدم',
    //     gradeLevels: 'الصفوف 9-12',
    //     studentCount: 95,
    //     licenseIndicator: true,
    //     attachments: ['stem_approval.pdf', 'equipment_list.pdf']
    //   }
    // ];
  }

  private setupGridColumns(): void {
    this.educationalProgramsColumns = [
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.PROGRAM_NAME'),
        field: 'programName',
        width: 300,
        cellEditor: 'agLargeTextCellEditor',
        editable: !this.isReadonly,
        cellEditorParams: {
          maxLength: 150,
          rows: 2,
          cols: 40
        },
        cellRenderer: (params: any) => {
          return `<div class="program-cell">
            <span class="program-name">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.GRADE_LEVELS'),
        field: 'gradeLevels',
        width: 150,
        cellEditor: 'agTextCellEditor',
        editable: !this.isReadonly,
        cellRenderer: (params: any) => {
          return `<div class="grade-cell">
            <span class="grade-text">${params.value || ''}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.STUDENT_COUNT'),
        field: 'studentCount',
        width: 120,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: {
          min: 0,
          step: 1,
          precision: 0
        },
        editable: !this.isReadonly,
        valueParser: (params: any) => {
          const value = parseInt(params.newValue);
          return isNaN(value) || value < 0 ? 0 : value;
        },
        cellRenderer: (params: any) => {
          return `<div class="count-cell">
            <span class="student-count">${params.value || 0}</span>
          </div>`;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.LICENSE_INDICATOR'),
        field: 'licenseIndicator',
        width: 150,
        editable: !this.isReadonly,
        cellRenderer: (params: any) => {
          const checked = params.value ? 'checked' : '';
          const labelText = params.value ? this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.LICENSED') : this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.UNLICENSED');

          const wrapper = document.createElement('div');
          wrapper.classList.add('license-cell');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = params.value;
          checkbox.disabled = this.isReadonly;

          const label = document.createElement('label');
          label.textContent = labelText;

          checkbox.addEventListener('change', () => {
            params.node.setDataValue('licenseIndicator', checkbox.checked); // ✅ Update AG Grid data
            label.textContent = checkbox.checked ? this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.LICENSED') : this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.UNLICENSED');
          });

          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
          console.log('wrapper--->: ', wrapper);
          console.log('rowData: : ', this.schoolInfo.educationalProgramsData);
          
          return wrapper;
        }
      },
      {
        headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.ATTACHMENTS'),
        field: 'bucketName', 
        width: 120,
        editable: false,
        cellRenderer: (params: any) => {
            const bucketName = params.data?.bucketName || '';
            const objectName = params.data?.objectName || '';

            const wrapper = document.createElement('div');
            const btn = document.createElement('button');
            btn.classList.add('attachment-btn');
            const icon = document.createElement('i');
            icon.classList.add(bucketName && objectName ? 'ri-download-line' : 'ri-upload-line');
            btn.appendChild(icon);
            wrapper.appendChild(btn);

            if (bucketName && objectName) {
              btn.classList.add('has-files');
              btn.addEventListener('click', () => {
                // هنا this مرتبطة بالكومبوننت
                params.context.componentParent.downloadUploadedFile(objectName, bucketName);
              });
            } else {
              btn.classList.add('no-files');
              btn.addEventListener('click', () => {
                // bind this بالدالة
                params.context.componentParent.uploadFileForRow(params);
              });
            }

            return wrapper;
          }

      }

    ];
  }

  private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.ADD_NEW_PROGRAM'),
        icon: 'ri-add-line',
        class: 'btn-success',
        callback: (row: any) => {
          this.addNewProgram();
        },
        show: (row: any) => {
          // Show add action only for pinned rows (new program entry row)
          return row.data?.isNewRow;
        }
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteProgram(row.data || row);
        },
        show: (row: any) => {
          // Hide delete action for pinned rows (new program entry row)
          return !row.data?.isNewRow;
        }
      }
    ];
  }

  getTotalPrograms(): number {
    return this.schoolInfo.educationalProgramsData.filter(program =>
      program.programName && program.programName.trim().length > 0
    ).length;
  }

  getTotalStudents(): number {
    return this.schoolInfo.educationalProgramsData.reduce((total, program) =>
      total + (program.studentCount || 0), 0
    );
  }

  getLicensedPrograms(): number {
    return this.schoolInfo.educationalProgramsData.filter(program =>
      program.licenseIndicator === true
    ).length;
  }

  getUnlicensedPrograms(): number {
    return this.schoolInfo.educationalProgramsData.filter(program =>
      program.licenseIndicator === false
    ).length;
  }

  getLicenseRate(): number {
    const total = this.getTotalPrograms();
    const licensed = this.getLicensedPrograms();
    return total > 0 ? Math.round((licensed / total) * 100) : 0;
  }

  getAverageStudentsPerProgram(): number {
    const total = this.getTotalPrograms();
    const totalStudents = this.getTotalStudents();
    return total > 0 ? Math.round(totalStudents / total) : 0;
  }

  getProgramsWithAttachments(): number {
    return this.schoolInfo.educationalProgramsData.filter(program =>
      program.attachments && program.attachments.length > 0
    ).length;
  }

  onCellValueChanged(event: any): void {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;

    // Check if this is the pinned row (new program entry)
    if (event.node.rowPinned === 'bottom' && data.isNewRow) {
      this.handleNewProgramEntry(data);
      return;
    }

    // Update existing program data
    const index = this.schoolInfo.educationalProgramsData.findIndex(item =>
      item.programName === data.programName
    );
    if (index !== -1) {
      this.schoolInfo.educationalProgramsData[index] = { ...data };
    }
  }

  private handleNewProgramEntry(data: any): void {
    // Just update the pinned row data - don't auto-save
    // User will save explicitly using the Add Program button
    this.pinnedBottomRowData[0] = { ...data, isNewRow: true };
  }

  onDownloadAttachments(event: any): void {
    const data = event.detail.data;
    const attachments = data.attachments || [];

    if (attachments.length === 0) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.NO_ATTACHMENTS'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'warning'
      );
      return;
    }

    // Simulate file download
    attachments.forEach((filename: string) => {
      // In a real application, you would implement actual file download logic here
    });

    ModalConfirmComponent.openAlert(
      this.modalService,
      this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.ATTACHMENTS_DOWNLOADED'),
      this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
      'success'
    );
  }

  addNewProgram(): void {
    const timestamp = Date.now();

    // Add protection against double execution (1 second debounce)
    if (timestamp - this.lastAddTime < 1000) {
      return;
    }

    this.lastAddTime = timestamp;

    try {
      // Ensure schoolInfo and educationalProgramsData are initialized
      if (!this.schoolInfo) {
        return;
      }

      if (!this.schoolInfo.educationalProgramsData) {
        this.schoolInfo.educationalProgramsData = [];
      }

      // Check if there's data in the pinned row
      const pinnedRowData = this.pinnedBottomRowData[0];

      // Validate that user has entered at least some data
      const hasData = pinnedRowData && (
        (pinnedRowData.programName && pinnedRowData.programName.trim() !== '') ||
        (pinnedRowData.gradeLevels && pinnedRowData.gradeLevels.trim() !== '') ||
        (pinnedRowData.studentCount && pinnedRowData.studentCount > 0)
      );

      if (!hasData) {
        // Show validation message asking user to enter data first
        ModalConfirmComponent.openAlert(
          this.modalService,
          this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.PLEASE_ENTER_DATA'),
          this.translate.instant('PAGES.COMMON.LABELS.WARNING'),
          'warning'
        );
        this.lastAddTime = 0; // Reset to allow retry
        return;
      }

      let newProgram: EducationalProgram;

      // Create program with the entered data
      newProgram = {
        programName: pinnedRowData.programName || '',
        gradeLevels: pinnedRowData.gradeLevels || '',
        studentCount: pinnedRowData.studentCount || 0,
        licenseIndicator: pinnedRowData.licenseIndicator === true, // Explicitly preserve boolean state
        attachments: pinnedRowData.attachments || [],
        objectName:pinnedRowData.objectName,
        bucketName:pinnedRowData.bucketName
      };

      this.schoolInfo.educationalProgramsData.push(newProgram);

      // Force grid refresh
      this.schoolInfo.educationalProgramsData = [...this.schoolInfo.educationalProgramsData];

      // Reset the pinned row
      this.setupPinnedRow();

      // Show success message
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.PROGRAM_ADDED_SUCCESS'),
        this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
        'success'
      );

      this.lastAddTime = 0; // Reset last add time after successful addition
    } catch (error) {
      ModalConfirmComponent.openAlert(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.PROGRAM_ADD_ERROR'),
        this.translate.instant('PAGES.COMMON.LABELS.ERROR'),
        'error'
      );
      this.lastAddTime = 0; // Ensure flag is reset even on error
    }
  }

  removeProgram(index: number): void {
    this.schoolInfo.educationalProgramsData.splice(index, 1);
  }

  deleteProgram(row: any): void {
    const index = this.schoolInfo.educationalProgramsData.findIndex(
      item => item.programName === row.programName &&
        item.gradeLevels === row.gradeLevels &&
        item.studentCount === row.studentCount
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.DELETE_PROGRAM_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.DELETE_PROGRAM_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.educationalProgramsData.splice(index, 1);

          // Force grid refresh by creating a new array reference
          this.schoolInfo.educationalProgramsData = [...this.schoolInfo.educationalProgramsData];

          ModalConfirmComponent.openAlert(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.EDUCATIONAL_PROGRAMS.PROGRAM_DELETED_SUCCESS'),
            this.translate.instant('PAGES.COMMON.LABELS.SUCCESS'),
            'success'
          );
        }
      });
    }
  }

  uploadAttachment(programIndex: number, file: File): void {
    // Simulate file upload
    const program = this.schoolInfo.educationalProgramsData[programIndex];
    if (program) {
      program.attachments.push(file.name);
    }
  }


uploadFileForRow(params: any): void {
  const rowNode = params.node; // خد rowNode مباشرة من params
  const rowData = rowNode.data;

  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, file).subscribe({
      next: (response) => {
        const data = response.data;

        rowData.bucketName = data.bucketName;
        rowData.objectName = data.objectName;

        // عمل Refresh للصف
        rowNode.setData(rowData);
      },
      error: (error) => {
        console.error('Error uploading file:', error);
      }
    });
  };

  input.click();
}


downloadUploadedFile(objectName: string, bucketName: string): void {
  if (!bucketName || !objectName) return;

  this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
    .subscribe({
      next: (res) => {
        const downloadUrl = res.data;

        fetch(downloadUrl)
          .then(response => {
            if (!response.ok) throw new Error('File download failed.');
            return response.blob();
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = objectName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          })
          .catch(err => {
            console.error('Download failed:', err);
          });
      },
      error: (err) => {
        console.error('Pre-auth URL failed:', err);
      }
    });
}

onGridReady(params: any) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
}

  
}