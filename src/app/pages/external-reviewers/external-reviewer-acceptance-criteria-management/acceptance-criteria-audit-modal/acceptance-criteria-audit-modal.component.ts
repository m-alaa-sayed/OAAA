import {Component, Input, ViewChild} from '@angular/core';
import {
    ExternalReviewersAcceptanceCriteriaManagemenService
} from "../../services/external-reviewers-acceptance-criteria-managemen.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "../../../../core/services/toast-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Audit} from "../../../../core/models/audit";

@Component({
    selector: 'app-acceptance-criteria-audit-modal',
    templateUrl: './acceptance-criteria-audit-modal.component.html',
    styleUrl: './acceptance-criteria-audit-modal.component.scss'
})
export class AcceptanceCriteriaAuditModalComponent {

    auditLogs: Audit[] = [];
    @Input() criterionId?: number;
    @Input() module: 'CSEQA' | 'CHEQA' | 'OQF' = 'CHEQA';
    @ViewChild('auditModal') auditModalTemplate: any;

    constructor(
        private criteriaManagementService: ExternalReviewersAcceptanceCriteriaManagemenService,
        private modalService: NgbModal,
        public translate: TranslateService,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    openAuditPopup(): void {
        this.getAuditLogs();
        this.modalService.open(this.auditModalTemplate, { size: 'lg', centered: true });
    }

    openVersion(version: number | string): void {
        const url = `/jawda/external-reviewers/external-reviewers-acceptance-sub-criteria-list/${this.module}/${this.criterionId}/${version}`;
        window.open(url, '_blank');
    }

    getAuditLogs(): void {
        this.criteriaManagementService.getAuditByModuleAndCriterionId(this.module, this.criterionId).subscribe({
            next: logs => {
                this.auditLogs = logs;
            }
        })
    }
}
