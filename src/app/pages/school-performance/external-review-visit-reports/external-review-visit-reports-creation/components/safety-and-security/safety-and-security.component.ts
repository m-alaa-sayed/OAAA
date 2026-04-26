import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    ExternalReviewVisitReportsWizaredService
} from 'src/app/pages/school-performance/service/external-review-visit-reports-wizared.service';
import {
    VisitReportSubmissionRequestInfo
} from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import {LanguageUtil} from "../../../../../../core/util/language.util";
import {VisitFormDomainEvaluation} from 'src/app/pages/school-performance/types/visit-form-domain-evaluation';
import {LkIndicator} from "../../../../types/lk-indicator";
import {DomainSummaryService} from "../../../../service/domain-summary.service";
import {ImportVisitFormDto, SafetyAndSecurityService} from "../../../services/safety-and-security.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs/operators';
import {Subscription} from "rxjs";

@Component({
    selector: 'safety-and-security',
    templateUrl: './safety-and-security.component.html',
    styleUrl: './safety-and-security.component.scss'
})
export class SafetyAndSecurityComponent implements OnInit {

    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() importedSafetyForms: any[] = [];
    @Input() showSaveBtn: boolean = true;
    @Input() schoolView: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    @ViewChild("submitForm") submitForm?: NgForm;
    isLoadingForms = false;
    isSubmitting = false;
    subscription!: Subscription;

    constructor(
        private toastService: ToastService,
        public translate: TranslateService,
        private modalService: NgbModal,
        private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService,
        public safetyAndSecurityService: SafetyAndSecurityService
    ) {
    }

    ngOnInit(): void {
        this.subscription = this.externalReviewVisitReportsWizaredService.visitReportSubmissionData$.subscribe(message => this.isSubmitting = message);
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.visitReportSubmissionRequestInfo);
    }

    protected readonly LanguageUtil = LanguageUtil;

    importForms(content: any) {
        this.modalService.open(content, {size: 'xl'});
    }

    toMultilineText(text?: string): string {
        return (text || '').replace(/(،|؛|\.|!|؟)\s*/g, '$1\n');
    }
}
