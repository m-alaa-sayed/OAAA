import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {JudgmentCode} from 'src/app/core/enum/judgment-code';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    SummaryVisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/summary-visit-report-submission-request-info';
import {
    VisitReportSummaryWizardService
} from 'src/app/pages/school-performance/service/visit-report-summary-wizard.service';
import {Subscription} from "rxjs";


@Component({
    selector: 'summary-overall-school-performance',
    templateUrl: './summary-overall-school-performance.component.html',
    styleUrl: './summary-overall-school-performance.component.scss'
})
export class SummaryOverallSchoolPerformanceComponent implements OnInit {

    @Input() summaryVisitReportSubmissionRequestInfo: SummaryVisitReportSubmissionRequestInfo = {} as SummaryVisitReportSubmissionRequestInfo;

    @Input() showButtons: boolean = true;
    @Input() isEditMode: boolean = true;
    @Input() showSaveBtn: boolean = false;
    @Input() canEditJudgmentAndJustification: boolean = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    protected JudgmentCode = JudgmentCode;
    judgmentCodeList: any[] = [];

    @ViewChild("submitForm") submitForm?: NgForm;

    isSubmitting = false;
    selectedFileName: any;
    selectedFile: File | null = null;

    subscription!: Subscription;

    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private visitReportSummaryWizardService: VisitReportSummaryWizardService) {
    }

    ngOnInit(): void {
        this.subscription = this.visitReportSummaryWizardService.summaryVisitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
        
        // Initialize judgment code list for dropdown
        this.judgmentCodeList = [
            {value: 0, label: this.translate.instant('PAGES.COMMON.LABELS.SELECT')},
            ...Array.from({length: 5}, (_, i) => ({
                value: i + 1,
                label: (i + 1).toString()
            }))
        ];
    }

    save() {
        // Validate required fields in creation view (when isEditMode is false and canEditJudgmentAndJustification is true)
        if (this.isEditMode === false && this.canEditJudgmentAndJustification) {
            this.isSubmitting = true;

            // Validate Professional Judgment - must be selected (not 0, null, or undefined)
            const professionalJudgment = this.summaryVisitReportSubmissionRequestInfo.overallProfessionalJudgment;
            if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                    classname: 'bg-danger text-white',
                    delay: 5000
                });
                this.isSubmitting = false;
                return; // PREVENT POST REQUEST - DO NOT CALL saveTempObject
            }

            this.isSubmitting = false;
        }

        this.visitReportSummaryWizardService.saveTempObject(this.summaryVisitReportSubmissionRequestInfo).subscribe({
            next: (res) => {
                this.summaryVisitReportSubmissionRequestInfo = res.summaryVisitReportSubmissionRequestInfoDto
            }
        });
    }

    next() {
        // Validate required fields before moving to next step (same validation as save)
        this.isSubmitting = true;
        let isValid = true;

        // Validate Professional Judgment (when isEditMode is false and canEditJudgmentAndJustification is true)
        if (this.isEditMode === false && this.canEditJudgmentAndJustification) {
            const professionalJudgment = this.summaryVisitReportSubmissionRequestInfo.overallProfessionalJudgment;
            if (professionalJudgment == null || professionalJudgment === 0 || professionalJudgment === undefined) {
                isValid = false;
            }
        }

        // Validate Strengths Analysis
        const strengthsAnalysis = (this.summaryVisitReportSubmissionRequestInfo.strengthsAnalysis || '').trim();
        if (!strengthsAnalysis || strengthsAnalysis === '') {
            isValid = false;
        }

        // Validate Improvements Analysis
        const improvementsAnalysis = (this.summaryVisitReportSubmissionRequestInfo.improvementsAnalysis || '').trim();
        if (!improvementsAnalysis || improvementsAnalysis === '') {
            isValid = false;
        }

        // Validate Recommendations
        const recommendations = (this.summaryVisitReportSubmissionRequestInfo.recommendations || '').trim();
        if (!recommendations || recommendations === '') {
            isValid = false;
        }

        // Validate Summary
        const summary = (this.summaryVisitReportSubmissionRequestInfo.summary || '').trim();
        if (!summary || summary === '') {
            isValid = false;
        }

        if (!isValid) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                classname: 'bg-danger text-white',
                delay: 5000
            });
            this.isSubmitting = false;
            return; // PREVENT NEXT - DO NOT EMIT nextEvent
        }

        this.isSubmitting = false;
        // Only emit nextEvent if validation passed
        this.nextEvent.emit();
    }
}
