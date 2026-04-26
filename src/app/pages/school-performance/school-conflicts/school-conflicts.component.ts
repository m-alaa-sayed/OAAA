import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckboxRendererComponent } from './checkbox-renderer.component';
import { InputRendererComponent } from './input-renderer.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { SchoolConflictsService } from 'src/app/core/services/school-conflicts.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-school-conflicts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './school-conflicts.component.html',
  styleUrl: './school-conflicts.component.scss'
})
export class SchoolConflictsComponent implements OnInit, OnDestroy {

  columnDefs = [
    { 
      field: 'schoolName', 
      headerName: this.translate.currentLang == 'ar' ? 'اسم المدرسة': 'School Name', 
      width: 180
    },
    { 
      field: 'code', 
      headerName: this.translate.currentLang == 'ar' ? 'الرمز': 'Code', 
      width: 100
    },
    { 
      field: 'type', 
      headerName: this.translate.currentLang == 'ar' ? 'النوع': 'Type', 
      width: 100
    },
    { 
      field: 'governorate', 
      headerName: this.translate.currentLang == 'ar' ? 'المحافظة': 'Governorate', 
      width: 120
    },
    { 
      field: 'wilayat', 
      headerName: this.translate.currentLang == 'ar' ? 'الولاية': 'Wilayat', 
      width: 120
    },
    { 
      field: 'studentCount', 
      headerName: this.translate.currentLang == 'ar' ? 'عدد الطلبة': 'Number of Students', 
      width: 100
    },
    { 
      field: 'gender', 
      headerName: this.translate.currentLang == 'ar' ? 'الجنس': 'Gender', 
      width: 100
    },
    { 
      field: 'classes', 
      headerName: this.translate.currentLang == 'ar' ? 'الصفوف': 'Grades', 
      width: 180
    },
    {
      field: 'conflictOfInterest',
      headerName: this.translate.currentLang == 'ar' ? 'تضارب المصالح': 'Conflict of Interest',
      cellRenderer: CheckboxRendererComponent,
      width: 130,
      cellClass: 'd-flex justify-content-center align-items-center',
      sortable: false,
      filter: false,
    },
    {
      field: 'justification',
      headerName: this.translate.currentLang == 'ar' ? 'المبررات': 'Justifications',
      cellRenderer: InputRendererComponent,
      width: 250,
      sortable: false,
      filter: false,
      suppressKeyboardEvent: (params: any) => {
        // Suppress AG Grid keyboard handling so the textarea can handle Ctrl+A natively
        return true;
      }
    }
  ];

  rowData: any[] = [];
  private rawData: any[] = [];
  private gridApi: any;
  private searchSubject = new Subject<any>();
  private currentFilters: any = {};

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal,
    private schoolConflictsService: SchoolConflictsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getSchoolConflicts();
    
    // // Set up debounced search
    // this.searchSubject.pipe(
    //   debounceTime(500)
    // ).subscribe(filters => {
    //   this.performSearch(filters);
    // });
    
    this.translate.onLangChange.subscribe(() => {
      this.mapData();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  getSchoolConflicts() {
    this.schoolConflictsService.getSchoolConflictsOverview().subscribe({
      next: (data) => {
        this.rawData = data;
        this.mapData();
      },
      error: (error) => {
        console.error('Error fetching school conflicts:', error);
        if (error === 'FORBIDDEN') {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.NOT_EXTERNAL_REVIEWER_CSEQA'), { classname: 'bg-danger text-white', autohide: false });
        } else {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
        }
      }
    });
  }

  mapData() {
    this.rowData = this.rawData.map(item => ({
      schoolName: this.translate.currentLang === 'ar' ? item.schoolNameAr : item.schoolNameEn,
      code: item.schoolCode,
      type: this.translate.instant(`PAGES.COMMON.LABELS.${item.schoolType}`),
      governorate: this.translate.currentLang === 'ar' ? item.governorateNameAr : item.governorateNameEn,
      wilayat: this.translate.currentLang === 'ar' ? item.wilayatNameAr : item.wilayatNameEn,
      studentCount: item.studentsNumber,
      gender: this.translate.instant(`PAGES.COMMON.LABELS.${item.schoolGender}`),
      classes: item.classes,
      conflictOfInterest: item.hasConflict,
      justification: item.justification,
      originalItem: item,
      showError: false
    }));
  }

  // onGridReady(event: any) {
  //   this.gridApi = event.api;
    
  //   // Listen to filter changes
  //   this.gridApi.addEventListener('filterChanged', () => {
  //     this.onFilterChanged();
  //   });
  // }

  // onFilterChanged() {
  //   if (!this.gridApi) return;

  //   const filterModel = this.gridApi.getFilterModel();
  //   const searchBody = this.buildSearchBody(filterModel);
    
  //   // Store current filters and trigger debounced search
  //   this.currentFilters = searchBody;
  //   this.searchSubject.next(searchBody);
  // }

  // buildSearchBody(filterModel: any): any {
  //   const searchBody: any = {
  //     schoolNameAr: '',
  //     schoolNameEn: '',
  //     schoolCode: '',
  //     schoolType: '',
  //     schoolGender: '',
  //     governorateNameAr: '',
  //     governorateNameEn: '',
  //     wilayatNameAr: '',
  //     wilayatNameEn: '',
  //     justification: '',
  //     createdOn: ''
  //   };

  //   // Map ag-grid filters to search body
  //   Object.keys(filterModel).forEach(field => {
  //     const filter = filterModel[field];
  //     const filterValue = filter.filter || filter.value || '';

  //     if (this.translate.currentLang === 'ar') {
  //       // When in Arabic mode
  //       switch (field) {
  //         case 'schoolName':
  //           searchBody.schoolNameAr = filterValue;
  //           break;
  //         case 'code':
  //           searchBody.schoolCode = filterValue;
  //           break;
  //         case 'type':
  //           searchBody.schoolType = this.reverseTranslateValue(filterValue, 'type');
  //           break;
  //         case 'governorate':
  //           searchBody.governorateNameAr = filterValue;
  //           break;
  //         case 'wilayat':
  //           searchBody.wilayatNameAr = filterValue;
  //           break;
  //         case 'gender':
  //             searchBody.schoolGender = this.reverseTranslateValue(filterValue, 'gender');
  //           break;
  //         case 'justification':
  //           searchBody.justification = filterValue;
  //           break;
  //       }
  //     } else {
  //       // When in English mode
  //       switch (field) {
  //         case 'schoolName':
  //           searchBody.schoolNameEn = filterValue;
  //           break;
  //         case 'code':
  //           searchBody.schoolCode = filterValue;
  //           break;
  //         case 'type':
  //           searchBody.schoolType = this.reverseTranslateValue(filterValue, 'type');
  //           break;
  //         case 'governorate':
  //           searchBody.governorateNameEn = filterValue;
  //           break;
  //         case 'wilayat':
  //           searchBody.wilayatNameEn = filterValue;
  //           break;
  //         case 'gender':
  //           searchBody.schoolGender = this.reverseTranslateValue(filterValue, 'gender');
  //           break;
  //         case 'justification':
  //           searchBody.justification = filterValue;
  //           break;
  //       }
  //     }
  //   });

  //   return searchBody;
  // }

  // reverseTranslateValue(translatedValue: string, type: 'type' | 'gender'): string {
  //   const possibleValues = new Set<string>();
  //   this.rawData.forEach(item => {
  //     if (type === 'type') {
  //       possibleValues.add(item.schoolType);
  //     } else if (type === 'gender') {
  //       possibleValues.add(item.schoolGender);
  //     }
  //   });

  //   for (const value of possibleValues) {
  //     const translated = this.translate.instant(`PAGES.COMMON.LABELS.${value}`);
  //     if (translated === translatedValue) {
  //       return value;
  //     }
  //   }

  //   return translatedValue;
  // }

  // performSearch(searchBody: any) {
  //   this.schoolConflictsService.searchSchoolConflicts(searchBody).subscribe({
  //     next: (data) => {
  //       this.rawData = data;
  //       this.mapData();
  //     },
  //     error: (err) => {
  //       console.error('Search error:', err);
  //       this.toastService.show(
  //         this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_OCCURRED'), 
  //         {
  //           classname: 'bg-danger text-white',
  //           delay: 5000
  //         }
  //       );
  //     }
  //   });
  // }

  openHistoryModal() {
    this.modalService.open(HistoryModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  get hasChanges(): boolean {
    return this.rowData.some(row => {        
        const originalConflict = row.originalItem.hasConflict;
        const currentConflict = row.conflictOfInterest;
        
        if (originalConflict !== currentConflict) {
            return true;
        }
        
        const originalJustification = (row.originalItem.justification || '').trim();
        const currentJustification = (row.justification || '').trim();
        
        if (originalJustification !== currentJustification) {
            return true;
        }
        
        return false;
    });
  }

  updateSchoolConflicts() {
    let isValid = true;
    let hasChecked = false;

    this.rowData.forEach(row => {
        if (row.conflictOfInterest) {
            hasChecked = true;
            if (!row.justification || !row.justification.trim()) {
                row.showError = true;
                isValid = false;
            } else {
                row.showError = false;
            }
        } else {
            row.showError = false;
        }
    });

    this.rowData = [...this.rowData];

    if (!isValid) {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
            classname: 'bg-danger text-white',
            delay: 5000
        });
        return;
    }

    const payload = this.rowData
      .filter(row => row.conflictOfInterest)
      .map(row => ({
        schoolId: row.originalItem.schoolId,
        justification: row.justification || ''
      }));

    this.schoolConflictsService.updateSchoolConflicts(payload).subscribe({
      next: (data) => {
         this.rawData = data;
         this.mapData();
         this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
            classname: 'bg-success text-white',
            delay: 5000
         });
      },
      error: (err) => console.error('Update failed', err)
    });
  }

}
