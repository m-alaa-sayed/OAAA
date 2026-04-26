import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ChangeDetectorRef,
    NgZone
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SchoolDataService, SchoolData} from '../../service/school-data.service';
import {Subscription} from 'rxjs';
import {School} from '../../types/school';
import {BasicSchoolInfo, ContactDetails, GradeLevels, SchoolInfo} from "../../types/school-info";
import {ModalConfirmComponent} from '../../../../shared/app-modal-confirm/modal-confirm.component';
import {ContactAddModalComponent} from '../../../../shared/contact-add-modal/contact-add-modal.component';
import {AgGridAngular} from 'ag-grid-angular';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';
import {WilayatDto} from 'src/app/core/models/wilayat-dto';
import {ScheduledSchoolVisit} from '../../types/scheduled-school-visit';

@Component({
    selector: 'app-general-data',
    templateUrl: './general-data.component.html',
    styleUrls: ['./general-data.component.scss']
})
export class GeneralDataComponent implements OnInit, OnDestroy {

    @Input() schoolInfo!: SchoolInfo;
    @Input() isViewMode: boolean = false; // Default to view mode
    @Input() isSchoolCommentEditable: boolean = false;
    @Input() showSchoolCommentsSection: boolean = true; // Show school comments section by default
    @Input() isSubmitting: boolean = false;
    @Input() scheduledSchoolVisit?: ScheduledSchoolVisit;
    @Input() isSelfEvaluationDocument: boolean = false;

    @ViewChild('contactGrid') contactGrid!: AgGridAngular;

    contactColumns: any[] = [];

    // Dropdown options
    schoolTypes = [
        {value: 'government', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GOVERNMENT_SCHOOL'},
        {value: 'private', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.PRIVATE_SCHOOL'},
        {value: 'international_private', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.INTERNATIONAL_PRIVATE_SCHOOL'}
    ];

    studentGenders = [
        {value: 'male', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.MALE_ONLY'},
        {value: 'female', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.FEMALE_ONLY'},
        {value: 'mixed', label: 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.MIXED'}
    ];

    studentGenderMap: { [key: string]: string } = {
        'مشترك': 'mixed',
        'ذكور': 'male',
        'إناث': 'female'
    };

    schoolTypeMap: { [key: string]: string } = {
        'حكومي': 'government',
        'خاص': 'private',
        'خاص دولي': 'international_private'
    };

    governorates: GovernorateDto[] = [];

    wilayats: WilayatDto[] = [];

    // Available grades for multi-select dropdown
    availableGrades: Array<{ key: string, label: string }> = [];

    // Selected grades as a property (not a method call)
    selectedGrades: string[] = [];

    // Additional properties
    isSpecialClassEnabled: boolean = false;

    private subscription: Subscription = new Subscription();

    gridActions: any[] = [];

    constructor(
        public translate: TranslateService,
        private schoolDataService: SchoolDataService,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private toastService: ToastService,
        private commonService: CommonService
    ) {
    }

    ngOnInit(): void {
        this.setupContactGrid();
        this.initializePrivateSchoolInfo();
        this.initializeAvailableGrades();
        this.updateSelectedGrades();
        this.getAllGovernorates();

        console.log("isViewMode", this.isViewMode);
        this.schoolInfo.basicInfo.studentGender = this.normalizeGender(this.schoolInfo.basicInfo.studentGender);
        this.schoolInfo.basicInfo.schoolType = this.normalizeSchoolType(this.schoolInfo.basicInfo.schoolType);

        // Format dates for input fields
        if (this.schoolInfo.basicInfo.buildDate) {
            this.schoolInfo.basicInfo.buildDate = this.formatDateForInput(this.schoolInfo.basicInfo.buildDate);
        }
        if (this.schoolInfo.privateSchoolInfo?.accreditationDate) {
            this.schoolInfo.privateSchoolInfo.accreditationDate = this.formatDateForInput(this.schoolInfo.privateSchoolInfo.accreditationDate);
        }

        if(!this.isReadonly){
            this.setupGridActions();
        }
    }

    getAllGovernorates() {
        this.commonService.getAllGovernorates().subscribe({
            next: (res) => {
                this.governorates = res.data || [];
            },
            error: () => {
                this.governorates = [];
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
                    {classname: 'bg-danger text-white', autohide: false}
                );
            }
        });
    }

    onGovernorateChange(event: any) {
        const selectedId = +event.target.value;
        this.loadWilayatsByGovernorateId(selectedId);
    }

    loadWilayatsByGovernorateId(governorateId: number) {
        this.commonService.getWilayatByGovernorateId(governorateId).subscribe({
            next: (res) => {
                this.wilayats = res.data || [];
            },
            error: () => {
                this.wilayats = [];
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
                    {classname: 'bg-danger text-white', autohide: false}
                );
            }
        });
    }

    private initializePrivateSchoolInfo(): void {
        if (this.schoolInfo && !this.schoolInfo.privateSchoolInfo) {
            this.schoolInfo.privateSchoolInfo = {
                ownerName: '',
                ownerNumber: '',
                appliedCurriculum: '',
                internationalProgram: '',
                accreditationBody: '',
                accreditationDate: ''
            };
        }

        if (!this.schoolInfo.basicInfo) {
            this.schoolInfo.basicInfo = {} as BasicSchoolInfo;
        }

        // Ensure principalInfo is initialized
        if (this.schoolInfo && !this.schoolInfo.principalInfo) {
            this.schoolInfo.principalInfo = {
                principalName: '',
                assistantPrincipal1: '',
                assistantPrincipal2: '',
                principalPhone: '',
                principalEmail: '',
                assistantPrincipal1Phone: '',
                assistantPrincipal1Email: '',
                assistantPrincipal2Phone: '',
                assistantPrincipal2Email: ''
            };
        }

        // Ensure localSchoolSchedule is initialized
        if (this.schoolInfo && !this.schoolInfo.localSchoolSchedule) {
            this.schoolInfo.localSchoolSchedule = {
                startTime: '',
                endTime: '',
                workingDays: [],
                totalHoursPerWeek: 0
            };
        }

        // Ensure contactDetails is initialized
        if (this.schoolInfo && !this.schoolInfo.contactDetails) {
            this.schoolInfo.contactDetails = [];
        }

        // Ensure gradeLevels is initialized
        if (this.schoolInfo && !this.schoolInfo.gradeLevels) {
            this.schoolInfo.gradeLevels = {
                kg: false,
                grade1: false,
                grade2: false,
                grade3: false,
                grade4: false,
                grade5: false,
                grade6: false,
                grade7: false,
                grade8: false,
                grade9: false,
                grade10: false,
                grade11: false,
                grade12: false
            };
        }

        if (this.schoolInfo.basicInfo.governorateId) {
            this.loadWilayatsByGovernorateId(Number(this.schoolInfo.basicInfo.governorateId));
        }
    }

    private initializeAvailableGrades(): void {
        this.availableGrades = [
            {key: 'kg', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.KG')},
            {key: 'grade1', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_1')},
            {key: 'grade2', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_2')},
            {key: 'grade3', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_3')},
            {key: 'grade4', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_4')},
            {key: 'grade5', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_5')},
            {key: 'grade6', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_6')},
            {key: 'grade7', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_7')},
            {key: 'grade8', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_8')},
            {key: 'grade9', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_9')},
            {key: 'grade10', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_10')},
            {key: 'grade11', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_11')},
            {key: 'grade12', label: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_12')}
        ];
    }

    ngOnDestroy(): void {
        // Clean up subscription if needed
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    get isReadonly(): boolean {
        return this.isViewMode;
    }

    get isRTL(): boolean {
        return this.translate.currentLang === 'ar';
    }

    private setupContactGrid(): void {
        this.contactColumns = [
            {
                headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SCHOOL_MANAGEMENT_SUPERVISOR_NAME'),
                field: 'name',
                editable: !this.isReadonly,
                width: 300
            },
            {
                headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.EMAIL'),
                field: 'email',
                editable: !this.isReadonly,
                width: 250
            },
            {
                headerName: this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.PHONE'),
                field: 'phone',
                editable: !this.isReadonly,
                width: 150
            }
        ];
    }

    getGradeLevel(grade: string): boolean {
        if (!this.schoolInfo || !this.schoolInfo.gradeLevels) {
            return false;
        }
        return this.schoolInfo.gradeLevels[grade as keyof GradeLevels] || false;
    }

    onGradeLevelChange(grade: string, event: any): void {
        this.schoolInfo.gradeLevels[grade as keyof GradeLevels] = event.target.checked;
        // Update the selectedGrades property to keep it in sync
        this.updateSelectedGrades();
    }

    // Update the selectedGrades property from the data
    private updateSelectedGrades(): void {
        try {
            if (!this.schoolInfo || !this.schoolInfo.gradeLevels) {
                this.selectedGrades = [];
                return;
            }

            this.selectedGrades = Object.keys(this.schoolInfo.gradeLevels).filter(grade =>
                this.schoolInfo.gradeLevels[grade as keyof GradeLevels]
            );
        } catch (error) {
            console.error('Error updating selected grades:', error);
            this.selectedGrades = [];
        }
    }

    // Keep the method for backward compatibility but now it just returns the property
    getSelectedGrades(): string[] {
        return this.selectedGrades;
    }

    getGradeDisplayName(grade: string): string {
        const gradeNames: { [key: string]: string } = {
            'kg': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.KG',
            'grade1': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_1',
            'grade2': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_2',
            'grade3': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_3',
            'grade4': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_4',
            'grade5': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_5',
            'grade6': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_6',
            'grade7': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_7',
            'grade8': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_8',
            'grade9': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_9',
            'grade10': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_10',
            'grade11': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_11',
            'grade12': 'PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.GRADE_12'
        };
        return this.translate.instant(gradeNames[grade] || grade);
    }

    onGradesChanged(selectedGrades: string[]): void {
        if (!this.isReadonly && this.schoolInfo && this.schoolInfo.gradeLevels) {
            try {
                // Check if there's actually a change to prevent unnecessary updates
                const hasChanged = selectedGrades.length !== this.selectedGrades.length ||
                    selectedGrades.some(grade => !this.selectedGrades.includes(grade));

                if (!hasChanged) {
                    return; // No actual change
                }

                // Update the property first
                this.selectedGrades = [...selectedGrades];

                // Reset all grades to false first
                Object.keys(this.schoolInfo.gradeLevels).forEach(grade => {
                    this.schoolInfo.gradeLevels[grade as keyof GradeLevels] = false;
                });

                // Set selected grades to true
                selectedGrades.forEach(grade => {
                    if (this.schoolInfo.gradeLevels.hasOwnProperty(grade)) {
                        this.schoolInfo.gradeLevels[grade as keyof GradeLevels] = true;
                    }
                });

                this.updateGradeData();
                console.log("gradeData got updated....")

            } catch (error) {
                console.error('Error updating grade levels:', error);
            }
        }
    }

    updateGradeData() {
        const toNum = (k: string) => (k === 'kg' ? 0 : Number(k.replace('grade', '')));
        const labelFor = (k: string) =>
            this.availableGrades.find(g => g.key === k)?.label ?? k;

        // 2) sync gradeData (use gradeLevels only)
        const enabledKeys = Object.keys(this.schoolInfo.gradeLevels)
            .filter(k => this.schoolInfo.gradeLevels[k as keyof GradeLevels]);

        const wantNums = new Set(enabledKeys.map(toNum));

        // remove disabled
        this.schoolInfo.gradeData = (this.schoolInfo.gradeData ?? []).filter(r =>
            typeof r.grade === 'number' && wantNums.has(r.grade)
        );

        // add newly enabled (with localized label from availableGrades)
        const haveNums = new Set(this.schoolInfo.gradeData.map(r => r.grade as number));
        for (const k of enabledKeys) {
            const g = toNum(k);
            if (!haveNums.has(g)) {
                this.schoolInfo.gradeData.push({
                    grade: g,
                    educationalStage: labelFor(k), // ← localized label
                    maleStudents: 0,
                    femaleStudents: 0,
                    totalStudents: 0,
                    averageStudentsPerClass: 0,
                    classesPerGrade: '0',
                    averageDensityPerClass: '0'
                });
            }
        }

        // tidy: sort + row numbers
        this.schoolInfo.gradeData
            .sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0))
            .forEach((r, i) => (r.rowNumber = i + 1));
    }

    removeGrade(grade: string, event?: Event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.isReadonly) {
            this.schoolInfo.gradeLevels[grade as keyof GradeLevels] = false;
        }
    }

    trackByGrade(index: number, grade: string): string {
        return grade;
    }

    getGradePillClass(grade: string): string {
        const colorMap: { [key: string]: string } = {
            'kg': 'grade-pill-success',
            'grade1': 'grade-pill-primary',
            'grade2': 'grade-pill-warning',
            'grade3': 'grade-pill-danger',
            'grade4': 'grade-pill-info',
            'grade5': 'grade-pill-secondary',
            'grade6': 'grade-pill-success',
            'grade7': 'grade-pill-primary',
            'grade8': 'grade-pill-warning',
            'grade9': 'grade-pill-danger',
            'grade10': 'grade-pill-info',
            'grade11': 'grade-pill-secondary',
            'grade12': 'grade-pill-dark'
        };
        return colorMap[grade] || 'grade-pill-primary';
    }

    addContactRow(): void {
        if (this.isReadonly) {
            // In view mode, show info message that adding is not allowed
            ModalConfirmComponent.openAlert(
                this.modalService,
                this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.VIEW_MODE_MESSAGE'),
                this.translate.instant('PAGES.COMMON.LABELS.INFO'),
                'info'
            );
            return;
        }

        this.openAddContactModal();
    }

    openAddContactModal(): void {
        const modalRef = this.modalService.open(ContactAddModalComponent, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false
        });

        // modalRef.componentInstance.title = this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.ADD_CONTACT');
        modalRef.componentInstance.title = this.translate.instant('PAGES.COMMON.LABELS.ADD');

        modalRef.result.then((result: ContactDetails) => {
            if (result) {
                // Ensure contactDetails array exists
                if (!this.schoolInfo.contactDetails) {
                    this.schoolInfo.contactDetails = [];
                }

                result.id = result.id || this.schoolInfo.contactDetails.length + 1

                // Ensure updates happen within Angular's zone
                this.ngZone.run(() => {
                    // Create new array reference to trigger change detection
                    this.schoolInfo.contactDetails = [...this.schoolInfo.contactDetails, result];

                    // Force Angular change detection to update UI
                    this.cdr.detectChanges();
                });

                // Also trigger change detection in next tick to ensure UI updates
                setTimeout(() => {
                    this.cdr.detectChanges();

                    // Force grid refresh to ensure it displays the new data
                    if (this.contactGrid) {
                        // Try multiple refresh methods
                        if (this.contactGrid.api) {
                            this.contactGrid.api.refreshCells();
                            this.contactGrid.api.redrawRows();
                        }

                        // Force the grid to re-read the data
                        try {
                            this.contactGrid.ngOnChanges({
                                dataList: {
                                    currentValue: this.schoolInfo.contactDetails,
                                    previousValue: [],
                                    firstChange: false,
                                    isFirstChange: () => false
                                }
                            });
                        } catch (e) {
                            // Grid ngOnChanges failed silently
                        }
                    }
                }, 100);
            }
        }).catch(() => {
            // Modal dismissed
        });
    }

    onContactCellValueChanged(event: any): void {
        // Handle contact cell value changes if needed
    }

    isFormValid(): boolean {
        return !!(this.schoolInfo.basicInfo.arSchoolName &&
            this.schoolInfo.basicInfo.enSchoolName &&
            this.schoolInfo.basicInfo.schoolType &&
            this.schoolInfo.basicInfo.studentGender &&
            this.isScheduleValid());
    }

    isScheduleValid(): boolean {
        const startTime = this.schoolInfo.localSchoolSchedule?.startTime;
        const endTime = this.schoolInfo.localSchoolSchedule?.endTime;

        // Both times must be provided
        if (!startTime || !endTime) {
            return false;
        }

        // Convert times to comparable format
        const startMinutes = this.timeToMinutes(startTime);
        const endMinutes = this.timeToMinutes(endTime);

        // End time must be after start time
        return endMinutes > startMinutes;
    }

    getScheduleValidationMessage(): string {
        const startTime = this.schoolInfo.localSchoolSchedule?.startTime;
        const endTime = this.schoolInfo.localSchoolSchedule?.endTime;

        if (!startTime || !endTime) {
            return this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SCHEDULE_REQUIRED');
        }

        if (!this.isScheduleValid()) {
            return this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.INVALID_TIME_RANGE');
        }

        return '';
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    getTodayDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    formatDateForInput(date: any): string {
        if (!date) return '';

        // If it's already in YYYY-MM-DD format, return it
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        // Convert to Date object and format
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';

        return dateObj.toISOString().split('T')[0];
    }

    getCompletionPercentage(): number {
        const totalFields = 15; // Basic info fields
        let completedFields = 0;

        if (this.schoolInfo.basicInfo.arSchoolName) completedFields++;
        if (this.schoolInfo.basicInfo.enSchoolName) completedFields++;
        if (this.schoolInfo.basicInfo.schoolType) completedFields++;
        if (this.schoolInfo.basicInfo.studentGender) completedFields++;
        if (this.schoolInfo.basicInfo.address) completedFields++;
        if (this.schoolInfo.basicInfo.governorate) completedFields++;
        if (this.schoolInfo.basicInfo.wilayat) completedFields++;
        if (this.schoolInfo.basicInfo.village) completedFields++;
        if (this.schoolInfo.basicInfo.email) completedFields++;
        if (this.schoolInfo.basicInfo.tel1) completedFields++;
        if (this.schoolInfo.basicInfo.buildDate) completedFields++;
        if (this.schoolInfo.basicInfo.schoolStartYear) completedFields++;
        if (this.schoolInfo.basicInfo.schoolOperatingHours) completedFields++;
        if (this.schoolInfo.principalInfo.principalName) completedFields++;
        if (this.schoolInfo.principalInfo.principalPhone) completedFields++;

        return Math.round((completedFields / totalFields) * 100);
    }

    getTotalSelectedGrades(): number {
        return this.getSelectedGrades().length;
    }

    getSchoolAgeRange(): string {
        const selectedGrades = this.getSelectedGrades();
        if (selectedGrades.length === 0) return '';

        const gradeNumbers = selectedGrades
            .filter(grade => grade.startsWith('grade'))
            .map(grade => parseInt(grade.replace('grade', '')))
            .sort((a, b) => a - b);

        if (gradeNumbers.length === 0) return '';

        const minGrade = Math.min(...gradeNumbers);
        const maxGrade = Math.max(...gradeNumbers);

        if (minGrade === maxGrade) {
            return `${minGrade}`;
        } else {
            return `${minGrade} - ${maxGrade}`;
        }
    }

    getSchoolLevel(): string {
        const grades = this.getSelectedGrades();
        const hasElementary = grades.some(g => ['kg', 'grade1', 'grade2', 'grade3', 'grade4'].includes(g));
        const hasMiddle = grades.some(g => ['grade5', 'grade6', 'grade7', 'grade8'].includes(g));
        const hasHigh = grades.some(g => ['grade9', 'grade10', 'grade11', 'grade12'].includes(g));

        if (hasElementary && hasMiddle && hasHigh) return 'COMPLETE_SCHOOL';
        if (hasElementary && hasMiddle) return 'BASIC_SCHOOL';
        if (hasElementary) return 'ELEMENTARY_SCHOOL';
        if (hasMiddle) return 'MIDDLE_SCHOOL';
        if (hasHigh) return 'HIGH_SCHOOL';
        return 'UNKNOWN';
    }

    resetForm(): void {
        if (this.isReadonly) {
            // In view mode, show info message that editing is not allowed
            ModalConfirmComponent.openAlert(
                this.modalService,
                this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.VIEW_MODE_MESSAGE'),
                this.translate.instant('PAGES.COMMON.LABELS.INFO'),
                'info'
            );
            return;
        }

        ModalConfirmComponent.openConfirm(
            this.modalService,
            this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.CONFIRM_RESET'),
            this.translate.instant('PAGES.COMMON.LABELS.CONFIRM')
        ).then((result) => {
            if (result) {
                // this.initializeData();
            }
        });
    }

    // onSpecialClassChange(enabled: boolean): void {
    //   this.isSpecialClassEnabled = enabled;
    //   this.schoolInfo.basicInfo.isSpecialClass = enabled ? 'true' : 'false';
    // }

    private setGradeLevelsFromClasses(classes: string): void {
        // Initialize all grades to false
        const gradeLevels: GradeLevels = {
            kg: false,
            grade1: false,
            grade2: false,
            grade3: false,
            grade4: false,
            grade5: false,
            grade6: false,
            grade7: false,
            grade8: false,
            grade9: false,
            grade10: false,
            grade11: false,
            grade12: false
        };

        // Parse classes string like "1A,1B,2A,2B" or "KG,1A,1B,2A,2B" to extract grade numbers
        const classNames = classes.split(',').map(c => c.trim());

        classNames.forEach(className => {
            // Check for Kindergarten first
            if (className.toUpperCase().includes('KG') || className === '0') {
                gradeLevels.kg = true;
            } else {
                // Extract the grade number from class name (e.g., "1A" -> "1", "2B" -> "2")
                const gradeMatch = className.match(/^(\d+)/);
                if (gradeMatch) {
                    const gradeNumber = parseInt(gradeMatch[1]);

                    // Map grade numbers to grade level properties
                    if (gradeNumber >= 1 && gradeNumber <= 12) {
                        const gradeKey = `grade${gradeNumber}` as keyof GradeLevels;
                        gradeLevels[gradeKey] = true;
                    }
                }
            }
        });

        this.schoolInfo.gradeLevels = gradeLevels;
    }

    isPrivateSchool(): boolean {
        return this.schoolInfo?.basicInfo?.schoolType === 'private' ||
            this.schoolInfo?.basicInfo?.schoolType === 'international_private';
    }


    normalizeGender(rawGender: string): string {
        if (this.studentGenders.some(g => g.value === rawGender)) {
            return rawGender;
        }
        return this.studentGenderMap[rawGender] || rawGender;
    }

    normalizeSchoolType(rawType: string): string {
        if (this.schoolTypes.some(t => t.value === rawType)) {
            return rawType;
        }
        return this.schoolTypeMap[rawType] || rawType;
    }


 private setupGridActions(): void {
    this.gridActions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-line',
        class: 'btn-delete',
        callback: (row: any) => {
          this.deleteStaffMember(row.data || row);
        }
      }
    ];
  }

  
  deleteStaffMember(row: any): void {
    const index = this.schoolInfo.contactDetails.findIndex(
      item => item.id === row.id && item.name === row.name
    );

    if (index !== -1) {
      ModalConfirmComponent.openConfirm(
        this.modalService,
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.DELETE_STAFF_CONFIRM'),
        this.translate.instant('PAGES.SCHOOL_PERFORMANCE.STAFF_DATA.DELETE_STAFF_TITLE')
      ).then(result => {
        if (result) {
          this.schoolInfo.contactDetails.splice(index, 1);
          this.schoolInfo.contactDetails = [...this.schoolInfo.contactDetails];

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

  getSchoolTypeLabel(value: string): string {
    const type = this.schoolTypes.find(t => t.value === value);
    return type ? type.label : value || '-';
  }

  getStudentGenderLabel(value: string): string {
    const gender = this.studentGenders.find(g => g.value === value);
    return gender ? gender.label : value || '-';
  }

  formatTime(time: string): string {
    if (!time) return '-';

    // Parse the time (expected format: HH:mm)
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

    if (isNaN(hours) || isNaN(minutes)) return time;

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const periodAr = hours >= 12 ? 'م' : 'ص'; // م for مساءً (PM), ص for صباحاً (AM)

    // Convert to 12-hour format
    const hour12 = hours % 12 || 12;

    // Format with leading zeros
    const formattedTime = `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    // Return with appropriate period based on current language
    const periodText = this.translate.currentLang === 'ar' ? periodAr : period;
    return `${formattedTime} ${periodText}`;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove any non-numeric characters
    const numericValue = input.value.replace(/[^0-9]/g, '');

    // Update the input value and model
    if (input.value !== numericValue) {
      input.value = numericValue;
      this.schoolInfo.basicInfo.tel1 = numericValue;
    }
  }

  onPhoneBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Ensure only numeric characters remain
    const numericValue = input.value.replace(/[^0-9]/g, '');

    // Update the model and input value
    this.schoolInfo.basicInfo.tel1 = numericValue;
    input.value = numericValue;
  }

  onEmailBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const emailValue = input.value.trim();

    // Email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // If the value is not empty and doesn't match the pattern, clear it or show error
    if (emailValue && !emailPattern.test(emailValue)) {
      // Keep the invalid value but let Angular validation handle the error display
      // The pattern validation will show the error message
      this.schoolInfo.basicInfo.email = emailValue;
    } else {
      // Update the model with trimmed value
      this.schoolInfo.basicInfo.email = emailValue;
      input.value = emailValue;
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
