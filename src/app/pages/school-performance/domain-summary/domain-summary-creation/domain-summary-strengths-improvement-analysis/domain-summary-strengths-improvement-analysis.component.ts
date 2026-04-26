import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {DomainSummaryService} from '../../../service/domain-summary.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseModal} from 'src/app/shared/base-modal';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainSummarySubmissionRequestInfo} from '../../../types/domain-summary-submission-request-info';
import {LanguageUtil} from "../../../../../core/util/language.util";
import { Permission } from 'src/app/core/enum/permission';

@Component({
    selector: 'domain-summary-strengths-improvement-analysis',
    templateUrl: './domain-summary-strengths-improvement-analysis.component.html',
    styleUrl: './domain-summary-strengths-improvement-analysis.component.scss'
})
export class DomainSummaryStrengthsImprovementAnalysisComponent extends BaseModal {
    protected readonly Permission = Permission;

    @ViewChild('forms') commentModal!: TemplateRef<any>;
    @Input() domainSummaryRequestInfo!: DomainSummarySubmissionRequestInfo;
    @Input() editable: boolean = true;
    @Input() isSubmitted: boolean = false;

    importVisitForms: any[] = [];
    protected readonly LanguageUtil = LanguageUtil;

    constructor(
        public domainSummaryService: DomainSummaryService,
        public override modalService: NgbModal,
        public translate: TranslateService,
        public toastService: ToastService
    ) {
        super(modalService);
    }

    ngOnInit(): void {
    }

    getFroms(content: any) {
        this.getImportVisitFormsByScheduledSchoolVisitId(content, this.domainSummaryRequestInfo.scheduledSchoolVisitId);
    }

    getImportVisitFormsByScheduledSchoolVisitId(content: any, scheduledSchoolVisitId: any) {
        this.domainSummaryService.getImportVisitFormsByScheduledSchoolVisitId(scheduledSchoolVisitId).subscribe({
            next: (response) => {
                this.importVisitForms = response.data.filter((item: {
                    formCode: string;
                }) => item.formCode.toUpperCase() !== "TEMP-CODE");
                this.importVisitForms.forEach(form => {
                    switch (form.type) {
                        case 'CLASSROOM_OBSERVATION': {
                            form.subject = this.translateOrOther(form.subject, form.otherSubject, 'PAGES.VISIT_FORM.CLASSROOM_OBSERVATION.');
                            break;
                        }
                        case 'GENERAL_EVIDENCE': {
                            form.activityType = this.translateOrOther(form.activityType, form.customActivityName, 'PAGES.VISIT_FORM.LABELS.');
                            break;
                        }
                    }
                });
                this.modalService.open(content, {size: 'xl'});
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    private translateOrOther(value: string | undefined, other: string | undefined, keyPrefix: string): string {
        const code = value?.trim().toUpperCase();
        return code && code !== 'OTHER' ? this.translate.instant(`${keyPrefix}${code}`) : (other ?? '');
    }
}

