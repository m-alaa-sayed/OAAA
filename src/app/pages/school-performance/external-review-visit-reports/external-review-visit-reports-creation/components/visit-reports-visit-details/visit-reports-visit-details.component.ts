import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {CommonService} from 'src/app/core/services/common.service';
import {WilayatDto} from 'src/app/core/models/wilayat-dto';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {Subscription} from 'rxjs';

@Component({
    selector: 'visit-reports-visit-details',
    templateUrl: './visit-reports-visit-details.component.html',
    styleUrl: './visit-reports-visit-details.component.scss'
})
export class VisitReportsVisitDetailsComponent implements OnInit, OnDestroy {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    introductionEnabled: boolean = false;
    genders: string[] = ['MALE', 'FEMALE', 'MIXED'];
    schoolTypes: string[] = ['GOVERNMENT', 'PRIVATE'];
    wilayatList: WilayatDto[] = [];
    governorateList: GovernorateDto[] = [];

    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    isSubmitting = false;
    private validationSubscription?: Subscription;

    constructor(public translate: TranslateService,
                private toastService: ToastService,
                public externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                private commonService: CommonService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.ensureSchoolInfo();
        this.loadGovernorates();
        /*if (!this.visitReportSubmissionRequestInfo.status || ['IN_PROGRESS', 'RETURN_FOR_EDIT'].includes(this.visitReportSubmissionRequestInfo.status)) {
            this.introductionEnabled = true;
        }*/
        
        // Subscribe to validation errors to show field-level error messages
        this.validationSubscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(
            (hasValidationError) => {
                if (hasValidationError) {
                    // Set isSubmitting to true to trigger Angular form validation error display
                    this.isSubmitting = true;
                }
            }
        );
    }

    ngOnDestroy(): void {
        if (this.validationSubscription) {
            this.validationSubscription.unsubscribe();
        }
    }

    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;
            
            const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
            if (!school) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.FIELD_REQUIRED'), {
                    classname: 'bg-danger text-white',
                    delay: 3000
                });
                this.isSubmitting = false;
                return; // PREVENT POST REQUEST
            }

            // Collect all empty required fields
            const emptyFields: string[] = [];

            // Validate School Name - check both nameAr and nameEn
            const nameAr = (school.nameAr || '').trim();
            const nameEn = (school.nameEn || '').trim();
            const schoolName = this.translate.currentLang === 'ar' ? nameAr : nameEn;
            if (!schoolName || schoolName === '' || schoolName.trim() === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHOOL_NAME'));
            }

            // Validate School Code
            const schoolCode = (school.code || '').trim();
            if (!schoolCode || schoolCode === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHOOL_CODE'));
            }

            // Validate School Type
            if (!school.type || school.type === null || school.type === undefined || school.type === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHOOL_TYPE'));
            }

            // Validate School Gender
            if (!school.gender || school.gender === null || school.gender === undefined || school.gender === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.SCHOOL_GENDER'));
            }

            // Validate Grades
            const schoolClasses = (school.classes || '').trim();
            if (!schoolClasses || schoolClasses === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.GRADES'));
            }

            // Validate Introduction (otherUpdates)
            const introduction = (this.visitReportSubmissionRequestInfo.otherUpdates || '').trim();
            if (!introduction || introduction === '') {
                emptyFields.push(this.translate.instant('PAGES.SELF_EVALUATION_DOCUMENT.LABELS.INTRODUCTION'));
            }

            // If there are empty fields, show error message and PREVENT POST REQUEST
            // Keep isSubmitting = true so Angular form validation errors continue to show
            if (emptyFields.length > 0) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                // Keep isSubmitting = true so error messages continue to show
                return; // PREVENT POST REQUEST - DO NOT CALL saveTempObject
            }
            
            this.isSubmitting = false;
        }

        // Ensure all IDs are properly set before saving
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
        if (school) {
            // ALWAYS set wilayaId from wilayat object if wilayat exists (override any existing value)
            if (school.wilayat?.id !== undefined && school.wilayat?.id !== null) {
                school.wilayaId = school.wilayat.id;
            }
            // ALWAYS set governmentId from governorate object if governorate exists (override any existing value)
            if (school.governorate?.id !== undefined && school.governorate?.id !== null) {
                school.governmentId = school.governorate.id;
            }
        }
        
        // Save - the service will show success message "تم الحفظ بنجاح" after successful save
        // Navigation is delayed by 2 seconds to ensure the message is visible
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    next() {
        this.nextEvent.emit()
    }

    onIntroductionChange(value: string): void {
        // If isSubmitting is true (validation was triggered), keep it true so error shows when field becomes invalid
        // This matches the behavior of other fields like "أبرز جوانب القوة"
        // The error will automatically show/hide based on Angular's form validation (invalid property)
    }

    onSchoolNameChange(value: string) {
        if (!this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school) return;
        if (this.translate.currentLang === 'ar') {
            this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school.nameAr = value;
        } else {
            this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school.nameEn = value;
        }
    }

    onGovernorateSelect(id: number) {
        const selected = this.governorateList.find(g => g.id === id);
        if (!selected || !this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school) return;
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school;
        
        // Ensure school object exists
        if (!school) {
            this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school = {} as any;
        }
        
        // Set both governmentId and governorate object with all fields
        school.governmentId = selected.id;
        school.governorate = {
            id: selected.id,
            nameAr: selected.nameAr,
            nameEn: selected.nameEn
        };
        
        // Clear wilayat when governorate changes and reload wilayat for new governorate
        school.wilayaId = undefined;
        school.wilayat = undefined;
        this.wilayatList = [];
        this.loadWilayat();
    }

    onWilayatSelect(id: number) {
        const selected = this.wilayatList.find(w => w.id === id);
        if (!selected || !this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school) return;
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school;
        
        // Ensure school object exists
        if (!school) {
            this.visitReportSubmissionRequestInfo.scheduledSchoolVisit.school = {} as any;
        }
        
        // Set both wilayaId and wilayat object with all fields
        // IMPORTANT: Set wilayaId FIRST, then wilayat object to ensure consistency
        school.wilayaId = selected.id;
        school.wilayat = {
            id: selected.id,
            nameAr: selected.nameAr,
            nameEn: selected.nameEn,
            governorateId: selected.governorateId
        };
        
        // Verify the change was applied
        if (school.wilayaId !== selected.id) {
            console.error('ERROR: wilayaId was not set correctly!', {
                expected: selected.id,
                actual: school.wilayaId
            });
        }
    }

    loadWilayat() {
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
        const governorateId = school?.governorate?.id || school?.governmentId;
        
        if (!governorateId) {
            // No governorate ID available, keep wilayat list empty
            return;
        }

        this.commonService.getWilayatByGovernorateId(governorateId).subscribe({
            next: (response) => {
                this.wilayatList = response.data || [];
                this.hydrateWilayatFromExistingId();
            },
            error: () => {
                // keep silent; dropdown will stay empty
            }
        });
    }

    loadGovernorates() {
        this.commonService.getAllGovernorates().subscribe({
            next: (response) => {
                this.governorateList = response.data || [];
                this.hydrateGovernorateFromExistingId();
                // Load wilayat after governorates are loaded
                this.loadWilayat();
            },
            error: () => {
                // keep silent; dropdown will stay empty
            }
        });
    }

    get selectedGovernorateId(): number | undefined {
        return this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.governorate?.id
            || this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.governmentId;
    }

    get selectedGovernorateDisplayName(): string {
        const selectedId = this.selectedGovernorateId;
        if (!selectedId) return '';
        const fromState = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.governorate;
        if (fromState?.id === selectedId) {
            return this.translate.currentLang === 'ar' ? (fromState.nameAr || '') : (fromState.nameEn || '');
        }
        const match = this.governorateList.find(g => g.id === selectedId);
        if (!match) return '';
        return this.translate.currentLang === 'ar' ? match.nameAr : match.nameEn;
    }

    get selectedWilayatId(): number | undefined {
        return this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.wilayat?.id
            || this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.wilayaId;
    }

    get selectedWilayatDisplayName(): string {
        const selectedId = this.selectedWilayatId;
        if (!selectedId) return '';
        const fromState = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school?.wilayat;
        if (fromState?.id === selectedId) {
            return this.translate.currentLang === 'ar' ? (fromState.nameAr || '') : (fromState.nameEn || '');
        }
        const match = this.wilayatList.find(w => w.id === selectedId);
        if (!match) return '';
        return this.translate.currentLang === 'ar' ? match.nameAr : match.nameEn;
    }

    /**
     * Check if user has permission to edit school info
     * Checks for EDIT_SCHOOL_INFO_IN_REPORT permission string (even if not in enum)
     */
    get hasEditSchoolInfoPermission(): boolean {
        const userClaim = this.authService.getUserClaim();
        // Check if permission exists in user's permissions array (as string, not enum)
        const permissions = userClaim?.permissions ?? [];
        // Convert to string array and check
        const permissionStrings = permissions.map(p => String(p));
        return permissionStrings.includes('EDIT_SCHOOL_INFO_IN_REPORT');
    }

    get isSchoolInfoEditable(): boolean {
        // School info should be editable only if:
        // 1. User has EDIT_SCHOOL_INFO_IN_REPORT permission (checked via *ngIf in template)
        // 2. AND isEditMode is true (request-details view)
        if (!this.hasEditSchoolInfoPermission) {
            return false; // No permission to edit
        }
        
        // School info should be editable only in request-details view when isEditMode is true
        // Not editable in creation view (where isEditMode is false or undefined)
        return this.isEditMode === true;
    }

    /**
     * Check if Introduction field should be required
     * Required when field is editable (isEditMode is true)
     */
    get isIntroductionRequired(): boolean {
        return this.isEditMode === true;
    }

    private ensureSchoolInfo() {
        if (!this.visitReportSubmissionRequestInfo.scheduledSchoolVisit) {
            this.visitReportSubmissionRequestInfo.scheduledSchoolVisit = {} as any;
        }
        const visit: any = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit;
        visit.school = visit.school || {};
        visit.school.governorate = visit.school.governorate || {};
        visit.school.wilayat = visit.school.wilayat || {};
    }

    private hydrateGovernorateFromExistingId() {
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
        if (!school) return;
        const existingId = school.governmentId || school.governorate?.id;
        if (!existingId || school.governorate?.id) return;
        const match = this.governorateList.find(g => g.id === existingId);
        if (match) {
            school.governorate = {
                id: match.id,
                nameAr: match.nameAr,
                nameEn: match.nameEn
            };
        }
    }

    private hydrateWilayatFromExistingId() {
        const school = this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school;
        if (!school) return;
        const existingId = school.wilayaId || school.wilayat?.id;
        if (!existingId || school.wilayat?.id) return;
        const match = this.wilayatList.find(w => w.id === existingId);
        if (match) {
            school.wilayat = {
                id: match.id,
                nameAr: match.nameAr,
                nameEn: match.nameEn,
                governorateId: match.governorateId
            };
        }
    }
}
