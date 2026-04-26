import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    BasicSchoolInfo,
    ContactInfo,
    GradeLevels,
    PrincipalInfo,
    SchoolInfo,
    SchoolSchedule
} from 'src/app/pages/school-performance/types/school-info';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {right} from "@popperjs/core";
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'appendices',
    templateUrl: './appendices.component.html',
    styleUrl: './appendices.component.scss'
})
export class AppendicesComponent implements OnInit, OnDestroy {


    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;


    @Input() showButtons: boolean = true;
    @Input() showSaveBtn: boolean = true;
    @Input() isEditMode: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();


    school: any = {};

    activeTab: string = 'general-data';
    isSubmitting: boolean = false;
    subscription!: Subscription;


    tabs = [
        {
            id: 'general-data',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.GENERAL_SCHOOL_DATA',
            route: 'general-data'
        },
        {
            id: 'student-data',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.STUDENT_DATA',
            route: 'student-data'
        },
        {
            id: 'teaching-staff',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.TEACHING_STAFF_NUMBERS',
            route: 'teaching-staff'
        },
        {
            id: 'evidence-collection-forms-statistics',
            label: 'PAGES.SCHOOL_PERFORMANCE.TABS.EVIDENCE_COLLECTION_STATS',
            route: 'evidence-collection-forms-statistics'
        }

    ];

    constructor(private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                private authService: AuthService,
                public translate: TranslateService,
                private toastService: ToastService) {
    }

    ngOnInit(): void {
        if (!this.visitReportSubmissionRequestInfo.editableSchoolInfo) {
            this.visitReportSubmissionRequestInfo.editableSchoolInfo = {} as SchoolInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.basicInfo = {} as BasicSchoolInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.principalInfo = {} as PrincipalInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.gradeLevels = {} as GradeLevels;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.contactInfo = {} as ContactInfo;
            this.visitReportSubmissionRequestInfo.editableSchoolInfo.localSchoolSchedule = {} as SchoolSchedule;
        }
        this.school = {...this.visitReportSubmissionRequestInfo.scheduledSchoolVisit?.school};
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }


    selectTab(tab: any): void {
        this.activeTab = tab.id;
    }


    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;

            const emptyFields: string[] = [];
            const basicInfo = this.visitReportSubmissionRequestInfo.editableSchoolInfo?.basicInfo;

            if (!basicInfo) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                this.isSubmitting = false;
                return; // PREVENT POST REQUEST
            }

            // Validate School Name AR
            const arSchoolName = (basicInfo.arSchoolName || '').trim();
            if (!arSchoolName || arSchoolName === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SCHOOL_NAME_AR'));
            }

            // Validate School Name EN
            const enSchoolName = (basicInfo.enSchoolName || '').trim();
            if (!enSchoolName || enSchoolName === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SCHOOL_NAME_EN'));
            }

            // Validate School Code
            const schoolCode = (basicInfo.schoolCode || '').trim();
            if (!schoolCode || schoolCode === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SCHOOL_CODE'));
            }

            // Validate Email - must be valid email format
            const email = (basicInfo.email || '').trim();
            if (!email || email === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.EMAIL'));
            } else {
                // Validate email format
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(email)) {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.VALIDATION.INVALID_EMAIL'), {
                        classname: 'bg-danger text-white',
                        delay: 5000
                    });
                    this.isSubmitting = false;
                    return; // PREVENT POST REQUEST - INVALID EMAIL FORMAT
                }
            }

            // Validate Special Class Available
            const isSpecialClass = (basicInfo.isSpecialClass || '').trim();
            if (!isSpecialClass || isSpecialClass === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.GENERAL_DATA.SPECIAL_CLASS_AVAILABLE'));
            }

            // Validate Major Developments
            const schoolAboutData = this.visitReportSubmissionRequestInfo.editableSchoolInfo?.schoolAboutData;
            const majorDevelopments = (schoolAboutData?.majorDevelopments || '').trim();
            if (!majorDevelopments || majorDevelopments === '') {
                emptyFields.push(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ABOUT_SCHOOL.MAJOR_DEVELOPMENTS'));
            }

            // If there are empty fields, show error message and PREVENT POST REQUEST
            if (emptyFields.length > 0) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                this.isSubmitting = false;
                return; // PREVENT POST REQUEST - DO NOT CALL saveTempObject
            }
            this.isSubmitting = false; // Reset submitting flag after successful validation
        }

        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    /**
     * Check if user has permission to edit school info
     * Checks for EDIT_SCHOOL_INFO_IN_REPORT permission string (even if not in enum)
     * Same condition used for visit details tab
     */
    get hasEditSchoolInfoPermission(): boolean {
        const userClaim = this.authService.getUserClaim();
        // Check if permission exists in user's permissions array (as string, not enum)
        const permissions = userClaim?.permissions ?? [];
        // Convert to string array and check
        const permissionStrings = permissions.map(p => String(p));
        return permissionStrings.includes('EDIT_SCHOOL_INFO_IN_REPORT');
    }

    get isAppendicesEditable(): boolean {
        // Appendices should be editable only if:
        // 1. User has EDIT_SCHOOL_INFO_IN_REPORT permission (same condition as visit details tab)
        // 2. AND isEditMode is true (request-details view)
        // This makes appendices NOT editable for QA users (who don't have EDIT_SCHOOL_INFO_IN_REPORT permission)
        if (!this.hasEditSchoolInfoPermission) {
            return false; // No permission to edit - QA users don't have this permission
        }
        
        // Appendices should be editable only in request-details view when isEditMode is true
        // Not editable in creation view (where isEditMode is false or undefined)
        return this.isEditMode === true;
    }

    get isSchoolCommentEditable(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }

    get isEvidenceTabVisible(): boolean {
        // Hide evidence tab if user has SCHOOLMANAGER role
        const userClaim = this.authService.getUserClaim();
        if (userClaim?.roles?.includes('SCHOOLMANAGER')) {
            return false;
        }
        
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        return stepCode !== 'VISIT_REPORT_SCHOOL_REVIEW';
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    protected readonly right = right;
    protected readonly String = String;
}
