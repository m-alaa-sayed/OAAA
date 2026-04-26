import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VisitFormService} from 'src/app/pages/school-performance/service/visit-form.service';
import {Router} from "@angular/router";
import {ToastService} from "../../../../../../core/services/toast-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'details-and-summary',
    templateUrl: './details-and-summary.component.html',
    styleUrl: './details-and-summary.component.scss'
})
export class DetailsAndSummaryComponent implements OnInit {
    @Input() visitFormRequestInfo: any;
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() nextEvent = new EventEmitter<void>();
    @Input() showButtons: boolean = true;
    @Input() editable: boolean = true;

    constructor(public visitFormService: VisitFormService,
                private router: Router,
                private toastService: ToastService,
                private translate: TranslateService) {

    }

    ngOnInit(): void {

    }

    addAttchment(attachmentObject: any) {
        if (!this.visitFormRequestInfo.visitFormAttachments) {
            this.visitFormRequestInfo.visitFormAttachments = []
        }
        this.visitFormRequestInfo.visitFormAttachments.push(attachmentObject);
    }

    removeAttchment(index: number) {
        this.visitFormRequestInfo.visitFormAttachments.splice(index, 1);
    }

    validateForm(action?: string) {
        if (!this.visitFormService.validateVisitFormRequestInfoMandatoryFields(this.visitFormRequestInfo)) {
            scrollTo(0, 0);
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), {
                classname: 'bg-danger text-white', autohide: false
            });
            return;
        }
        this.save(action);
    }

    save(action?: string) {
        const visitFormType = this.visitFormRequestInfo.type;

        this.visitFormService.saveVisitFormRequestInfo(visitFormType, this.visitFormRequestInfo, action)
            .subscribe({
                next: (response) => {
                    if (action === 'SAVE') {
                        this.toastService.show(
                            this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                                classname: 'bg-success text-white',
                                delay: 3000
                            }
                        );
                        this.router.navigate(['/jawda/school-performance/visit-form', response.type, 'creation', response.id, response.formStatus]);
                    } else {
                        this.router.navigate(['/jawda/success-page'], {
                            state: {requestApplicationNo: response.applicationNo, action: action}
                        });
                    }
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                        classname: 'bg-danger text-white', autohide: false
                    });
                }
            });
    }
}
