import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {BaseModal} from 'src/app/shared/base-modal';
import {ServiceStep} from 'src/app/shared/types/service-step';
import {ExternalReviewVisitReportsWizaredService} from "../../service/external-review-visit-reports-wizared.service";

@Component({
    selector: 'external-review-visit-reports-actions',
    templateUrl: './external-review-visit-reports-actions.component.html',
    styleUrl: './external-review-visit-reports-actions.component.scss'
})
export class ExternalReviewVisitReportsActionsComponent extends BaseModal {

    actionTitles: { [key: string]: string } = {
        'APPROVE': 'PAGES.COMMON.LABELS.APPROVE',
        'RETURN_FOR_EDIT': 'PAGES.COMMON.LABELS.RETURN_FOR_EDIT',
        'SUBMIT': 'PAGES.COMMON.LABELS.SUBMIT',
        'REJECT_REPORT': 'PAGES.COMMON.LABELS.REJECT_REPORT',
        'SEND_TO_GM': 'PAGES.COMMON.LABELS.SEND_TO_GM',
        'SEND_TO_PROOFREADER': 'PAGES.COMMON.LABELS.SEND_TO_PROOFREADER',
        'REJECT_REPORT_AND_CANCEL_VISIT': 'PAGES.COMMON.LABELS.REJECT_REPORT_AND_CANCEL_VISIT'
    };
    action: string | undefined;

    @Input() requestObject: any;
    @Output() actionEventEmitter = new EventEmitter<any>();
    @Output() validationEventEmitter = new EventEmitter<boolean>(false);

    mode!: ServiceStep;
    submitted = false;
    comment!: string;

    constructor(public route: ActivatedRoute,
                public override modalService: NgbModal,
                public toastService: ToastService,
                public translate: TranslateService,
                public router: Router, private externalReviewVisitReportsWizaredService: ExternalReviewVisitReportsWizaredService) {
        super(modalService);
    }

    ngOnInit(): void {
        this.mode = this.requestObject.serviceStep.stepCode;
    }


    setAction(action: any, content: any) {
        this.action = action;
        if (this.handleSpecialErrorCases(action)) {
            this.comment = "";
            this.open(content);
        }
    }

    closePopup() {
        (this.comment = ''), (this.submitted = false);
        this.close();
    }

    sendAction() {
        if (!this.comment && (this.action == 'RETURN_FOR_EDIT' || this.action == 'REJECT')) {
            this.submitted = true;
        } else {
            this.close();
            this.actionEventEmitter.emit({comment: this.comment, action: this.action})
        }
    }

    returnToList() {
        this.close();
        this.router.navigate(['/jawda/service-management/service-catalogue-list']);
    }

    handleSpecialErrorCases(event: any): boolean {
        const {stepCode} = this.requestObject.serviceStep;
        return true;
    }


    private showErrorMessageAndEmit(message: string) {
        //this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

    getActionTitle(): string {
        return this.action && this.actionTitles[this.action] ? this.actionTitles[this.action] : '';
    }

    save() {
        this.externalReviewVisitReportsWizaredService.saveTempObject(this.requestObject.visitReportSubmissionRequestInfoDto);
    }
}
