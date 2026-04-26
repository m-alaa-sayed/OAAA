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

    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    protected JudgmentCode = JudgmentCode;

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
    }

    save() {
        this.visitReportSummaryWizardService.saveTempObject(this.summaryVisitReportSubmissionRequestInfo).subscribe({
            next: (res) => {
                this.summaryVisitReportSubmissionRequestInfo = res.summaryVisitReportSubmissionRequestInfoDto
            }
        });
    }
}
