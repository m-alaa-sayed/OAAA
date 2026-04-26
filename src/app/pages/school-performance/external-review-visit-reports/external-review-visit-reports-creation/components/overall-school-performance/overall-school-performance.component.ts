import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {JudgmentCode} from 'src/app/core/enum/judgment-code';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BaseModal} from "../../../../../../shared/base-modal";
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {
    OnJudgmentChangeUtilsService
} from "../../../../../../shared/domain-evaluation/on-judgment-change-utils.service";
import {VisitDomain} from "../../../../../../core/enum/visit-domain";
import {Subscription} from "rxjs";
import {AuthService} from 'src/app/core/services/auth.service';
import {Permission} from 'src/app/core/enum/permission';
import {Router} from '@angular/router';

@Component({
    selector: 'overall-school-performance',
    templateUrl: './overall-school-performance.component.html',
    styleUrl: './overall-school-performance.component.scss'
})
export class OverallSchoolPerformanceComponent extends BaseModal implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() schoolView: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() showAttachments: boolean = true;
    @Input() canEditJudgmentAndJustification: boolean = false;
    @Input() importedDomainSummary: any[] = [];
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    isLoadingDomains = false;
    protected JudgmentCode = JudgmentCode;
    judgmentCodeList: any[] = [];

    @ViewChild("submitForm") submitForm?: NgForm;

    isSubmitting = false;
    selectedFileName: any;
    selectedFile: File | null = null;
    subscription!: Subscription;


    constructor(private commonService: CommonService,
                private toastService: ToastService,
                public translate: TranslateService,
                public override modalService: NgbModal,
                public onJudgmentChangeUtilsService: OnJudgmentChangeUtilsService,
                private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                private authService: AuthService,
                private router: Router
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.onJudgmentChangeUtilsService.judgmentChange$.subscribe(evt => {
            this.onDomainJudgmentChange(evt);
        });
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
        
        // Initialize judgment code list for dropdown
        this.judgmentCodeList = [
            {value: 0, label: this.translate.instant('PAGES.COMMON.LABELS.SELECT')},
            ...Array.from({length: 5}, (_, i) => ({
                value: i + 1,
                label: (i + 1).toString()
            }))
        ];
    }

    get isCreationView(): boolean {
        // Check if we're in creation view - if request.id doesn't exist, we're in creation view
        return !this.visitReportSubmissionRequestInfo.request?.id;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadFile();
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            console.warn('No file selected');
            return;
        }
        const bucket = 'oaaaqa';
        this.commonService.uploadFileToOci(bucket, this.selectedFile)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    this.visitReportSubmissionRequestInfo.judgmentChangeAttachmentBucketName = data.bucketName;
                    this.visitReportSubmissionRequestInfo.judgmentChangeAttachmentFileName = data.objectName;
                },
                error: (error) => {
                    console.error('Error uploading file:', error);
                }
            });
    }

    downloadUploadedFile(objectName: any, bucketName: any): void {
        if (!objectName || !bucketName) {
            console.warn('Missing file data');
            return;
        }

        this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
            .subscribe({
                next: (res) => {
                    const downloadUrl = res.data;

                    fetch(downloadUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('File download failed.');
                            }
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
                            console.error('Download via blob failed:', err);
                        });
                },
                error: (err) => {
                    console.error('Download failed:', err);
                }
            });
    }

    save() {
        // Check if we're in creation view - skip validation for Save action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // REMOVED: Validation in creation view for Save action
        // Fields are now only required on Submit, not on Save
        // Validation for Submit is handled in isValid() method in service

        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;
        
        // Collect all empty required fields
        const emptyFields: string[] = [];
        
            // Validate Professional Judgment if field is editable
            if (this.canEditJudgmentAndJustification && !this.schoolView) {
                const professionalJudgment = this.visitReportSubmissionRequestInfo.overallProfessionalJudgment;
                if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                    emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.PROFESSIONAL_JUDGMENT'));
                }
            }

            // Validate Strengths Analysis
            const strengthsAnalysis = (this.visitReportSubmissionRequestInfo.strengthsAnalysis || '').trim();
            if (!strengthsAnalysis || strengthsAnalysis === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_STRENGTHS'));
            }

            // Validate Improvements Analysis
            const improvementsAnalysis = (this.visitReportSubmissionRequestInfo.improvementsAnalysis || '').trim();
            if (!improvementsAnalysis || improvementsAnalysis === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_IMPROVEMENT_AREAS'));
            }
            
            // Validate Recommendations
            const recommendations = (this.visitReportSubmissionRequestInfo.recommendations || '').trim();
            if (!recommendations || recommendations === '') {
                emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.RECOMMENDATIONS'));
            }

            // Validate Judgment Change Justification if judgments differ and field is editable
            if (this.canEditJudgmentAndJustification && !this.schoolView) {
                const systemJudgment = this.visitReportSubmissionRequestInfo.overallSystemJudgment;
                const professionalJudgment = this.visitReportSubmissionRequestInfo.overallProfessionalJudgment;
                const status = this.visitReportSubmissionRequestInfo.status;
                
                if (systemJudgment != null && professionalJudgment != null && 
                    systemJudgment !== professionalJudgment && 
                    status !== 'REPORT_REJECTED') {
                    const judgmentChangeJustification = (this.visitReportSubmissionRequestInfo.judgmentChangeJustification || '').trim();
                    if (!judgmentChangeJustification || judgmentChangeJustification === '') {
                        emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.JUDGMENT_CHANGE_JUSTIFICATIONS'));
                    }
                }
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
            
            this.isSubmitting = false;
        }

        // Only call saveTempObject (POST request) if validation passed
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    next() {
        // Check if we're in creation view - skip validation for Next action in creation view
        const isRequestDetailsView = this.visitReportSubmissionRequestInfo.request?.id;
        
        // REMOVED: Validation in creation view for Next action
        // Fields are now only required on Submit, not on Next
        // Validation for Submit is handled in isValid() method in service

        // Validate required fields only in request-details view when field is editable (isEditMode is true)
        if (this.isEditMode === true && isRequestDetailsView) {
            this.isSubmitting = true;
            
            // Collect all empty required fields
            const emptyFields: string[] = [];

            // Validate Strengths Analysis
            const strengthsAnalysis = (this.visitReportSubmissionRequestInfo.strengthsAnalysis || '').trim();
            if (!strengthsAnalysis || strengthsAnalysis === '') {
            emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_STRENGTHS'));
        }
        
            // Validate Improvements Analysis
            const improvementsAnalysis = (this.visitReportSubmissionRequestInfo.improvementsAnalysis || '').trim();
            if (!improvementsAnalysis || improvementsAnalysis === '') {
            emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.KEY_IMPROVEMENT_AREAS'));
        }
        
        // Validate Recommendations
            const recommendations = (this.visitReportSubmissionRequestInfo.recommendations || '').trim();
            if (!recommendations || recommendations === '') {
            emptyFields.push(this.translate.instant('PAGES.EXTERNAL_REVIEW_VISIT_REPORTS.LABELS.RECOMMENDATIONS'));
            }
        
            // If there are empty fields, show error message and PREVENT NEXT
        if (emptyFields.length > 0) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                classname: 'bg-danger text-white',
                delay: 5000
            });
            this.isSubmitting = false;
                return; // PREVENT NEXT - DO NOT EMIT nextEvent
        }
        
            this.isSubmitting = false;
        }
        
        // Only emit nextEvent if validation passed
        this.nextEvent.emit();
    }

    importFromDomainSummary(content: any) {
        // if (this.importedDomainSummary.length == 0)
        //     this.getDomainSummary();
        this.modalService.open(content, {centered: true, size: 'xl'});
    }

    calculateOverallJudgment(): number {
        const getJudgment = (domainName: VisitDomain): number => {
            const found = this.visitReportSubmissionRequestInfo.domainEvaluations?.find(d => d.domain === domainName);
            return found?.professionalJudgment ?? 0;
        };

        const academic = getJudgment(VisitDomain.ACADEMIC_ACHIEVEMENT);
        const teaching = getJudgment(VisitDomain.TEACHING_AND_ASSESSMENT);
        const leadership = getJudgment(VisitDomain.LEADERSHIP_AND_GOVERNANCE);
        const personal = getJudgment(VisitDomain.PERSONAL_DEVELOPMENT);
        const environment = getJudgment(VisitDomain.LEARNING_ENVIRONMENT);

        // Urgent intervention (any core domain is 5)
        if (academic === 5 || teaching === 5 || leadership === 5) return 5;

        // Inadequate due to personal or climate being 5
        if (personal === 5 || environment === 5) return 4;

        // Inadequate due to one core domain being 4
        if (academic === 4 || teaching === 4 || leadership === 4) return 4;

        // Adequate
        if (
            (academic === 3 || teaching === 3 || leadership === 3) &&
            academic <= 3 && teaching <= 3 && leadership <= 3 &&
            personal <= 4 && environment <= 4
        ) return 3;

        // Good
        if (
            (academic === 2 || teaching === 2 || leadership === 2) &&
            academic <= 2 && teaching <= 2 && leadership <= 2 &&
            personal <= 3 && environment <= 3
        ) return 2;

        // Excellent
        if (
            academic === 1 && teaching === 1 && leadership === 1 &&
            personal <= 2 && environment <= 2
        ) return 1;

        return 0;
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.visitReportSubmissionRequestInfo.domainEvaluations?.forEach((domain) => {
            if (domain.domain === event.domain.domain) {
                domain.professionalJudgment = event.domain.professionalJudgment === 0 ? null : event.domain.professionalJudgment;
            }
        })
        this.visitReportSubmissionRequestInfo.overallProfessionalJudgment = this.calculateOverallJudgment();
    }

    addAttchment(attachmentObject: any) {
        if (!this.visitReportSubmissionRequestInfo.attachments) {
            this.visitReportSubmissionRequestInfo.attachments = []
        }
        this.visitReportSubmissionRequestInfo.attachments.push(attachmentObject);
    }

    removeAttchment(index: number) {
        this.visitReportSubmissionRequestInfo.attachments?.splice(index, 1);
    }

    get isFieldEditableForSchoolReview(): boolean {
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        const hasPermission = !!this.authService.getUserClaim()?.permissions?.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW);
        return stepCode === 'VISIT_REPORT_SCHOOL_REVIEW' && hasPermission;
    }

    get shouldShowAttachments(): boolean {
        // Hide attachments if user has SCHOOLMANAGER role
        const userClaim = this.authService.getUserClaim();
        if (userClaim?.roles?.includes('SCHOOLMANAGER')) {
            return false;
        }
        
        const stepCode = this.visitReportSubmissionRequestInfo.request?.serviceStep?.stepCode;
        return this.showAttachments && stepCode !== 'VISIT_REPORT_SCHOOL_REVIEW';
    }
}
