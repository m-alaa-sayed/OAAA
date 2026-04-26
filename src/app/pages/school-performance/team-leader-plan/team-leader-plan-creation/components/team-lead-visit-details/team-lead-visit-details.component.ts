import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {VisitPlanRequestInfo} from 'src/app/pages/school-performance/types/visit-plan-request-info';
import {ToastService} from "../../../../../../core/services/toast-service";

@Component({
    selector: 'team-lead-visit-details',
    templateUrl: './team-lead-visit-details.component.html',
    styleUrl: './team-lead-visit-details.component.scss'
})
export class TeamLeadVisitDetailsComponent {

    @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
    @Input() showButtons: boolean = true;
    @Input() isEditMode: boolean = false;


    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Output() saveEvent = new EventEmitter<void>();


    constructor(
        public toastService: ToastService,
        public translate: TranslateService) {
    }

    validateVisitPeriod(): void {
        const from = this.visitPlanRequestInfo.preliminaryVisitPeriodFrom;
        if (from) {
            this.visitPlanRequestInfo.preliminaryVisitPeriodTo = from;
        }
    }

}
