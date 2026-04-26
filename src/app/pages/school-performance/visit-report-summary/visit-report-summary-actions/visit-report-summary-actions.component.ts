import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {BaseModal} from 'src/app/shared/base-modal';
import {ServiceStep} from 'src/app/shared/types/service-step';
import {VisitReportSummaryWizardService} from "../../service/visit-report-summary-wizard.service";

@Component({
    selector: 'visit-report-summary-actions',
    templateUrl: './visit-report-summary-actions.component.html',
    styleUrl: './visit-report-summary-actions.component.scss'
})
export class VisitReportSummaryActionsComponent extends BaseModal {

    @Input() requestObject: any;
    @Output() actionEventEmitter = new EventEmitter<any>();
    @Output() validationEventEmitter = new EventEmitter<boolean>(false);

    mode!: ServiceStep;
    action: string | undefined;
    submitted = false;
    comment!: string;

    constructor(public route: ActivatedRoute,
                public override modalService: NgbModal,
                public toastService: ToastService,
                private visitReportSummaryWizardService: VisitReportSummaryWizardService,
                public translate: TranslateService,
                public router: Router) {
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
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

    save() {
        this.visitReportSummaryWizardService.saveTempObject(this.requestObject.summaryVisitReportSubmissionRequestInfoDto).subscribe({
            next: (res) => {
                this.requestObject.summaryVisitReportSubmissionRequestInfoDto = res.summaryVisitReportSubmissionRequestInfoDto
            }
        });
    }
}
