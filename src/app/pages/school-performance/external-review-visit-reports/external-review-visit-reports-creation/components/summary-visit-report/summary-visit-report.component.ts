import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { UiSwitchModule } from "ngx-ui-switch";
import { VisitReportSubmissionRequestInfo } from "../../../../types/visit-report-submission-request-info";
import { ToastService } from "../../../../../../core/services/toast-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
    ExternalReviewVisitReportsWizaredService
} from "../../../../service/external-review-visit-reports-wizared.service";
import { SafetyAndSecurityService } from "../../../services/safety-and-security.service";
import { Subscription } from "rxjs";
import { LanguageUtil } from "../../../../../../core/util/language.util";

@Component({
    selector: 'app-summary-visit-report',
    templateUrl: './summary-visit-report.component.html',
    styleUrl: './summary-visit-report.component.scss'
})
export class SummaryVisitReportComponent implements OnInit {
    @Input() showButtons: boolean = true;
    @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;
    @Input() isEditMode: boolean = false;
    @Input() showSaveBtn: boolean = true;
    @Input() schoolView: boolean = false;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    // @ViewChild("submitForm") submitForm?: NgForm;
    // isLoadingForms = false;
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
}
