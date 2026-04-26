import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {DomainStandardsComponent} from '../domain-standards/domain-standards.component';
import {TranslateService} from '@ngx-translate/core';
import {VisitReportDomainEvaluation} from 'src/app/pages/school-performance/types/visit-report-domain-evaluation';
import {ToastService} from 'src/app/core/services/toast-service';
import {Subscription} from "rxjs";

@Component({
    selector: 'external-review-results',
    templateUrl: './external-review-results.component.html',
    styleUrl: './external-review-results.component.scss'
})
export class ExternalReviewResultsComponent implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() canEditJudgmentAndJustification: boolean = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() professionalJudgmentChange = new EventEmitter<{
        domain: VisitReportDomainEvaluation,
        judgment: number
    }>();

    @ViewChildren(DomainStandardsComponent) domainStandardsComponents!: QueryList<DomainStandardsComponent>;

    isSubmitting: boolean = false;
    subscription!: Subscription;

    constructor(private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
                private toastService: ToastService,
                public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    onDomainJudgmentChange(event: { domain: VisitReportDomainEvaluation, judgment: number }) {
        this.professionalJudgmentChange.emit(event);
    }

    /*    checkAllJustificationFields(): boolean {
            let allValid = true;
            this.domainStandardsComponents.forEach(comp => {
                if (!comp.validate()) {
                    allValid = false;
                }
            });
            if (!allValid) {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), { classname: 'bg-danger text-white', autohide: false });
                scrollTo(0, 0);
                return false;
            }
            return true;
        }*/
}
