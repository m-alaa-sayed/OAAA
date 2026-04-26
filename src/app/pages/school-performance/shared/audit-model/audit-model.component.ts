import { Component, Input, ViewChild } from '@angular/core';
import { Audit } from 'src/app/core/models/audit';
import { SelfEvaluationDocument } from '../../types/self-evaluation-document';
import { SelfEvaluationDocumentService } from '../../service/self-evaluation-document.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'audit-model',
  templateUrl: './audit-model.component.html',
  styleUrl: './audit-model.component.scss'
})
export class AuditModelComponent {
    auditLogs: Audit[] = [];
    paginatedAuditLogs: Audit[] = [];
    auditPage: number = 1;
    auditPageSize: number = 5;
    auditTotal: number = 0;
    @Input() documentId?: number;
    @ViewChild('auditModal') auditModalTemplate: any;

    constructor(
        private selfEvaluationDocumentService: SelfEvaluationDocumentService,
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

    getAuditLogs(): void {
        this.selfEvaluationDocumentService.getAvailabilityAudit(this.documentId).subscribe({
            next: (logs) => {
                this.auditLogs = logs.data;
                this.auditTotal = logs.data.length;
                this.paginateLogItems();
            },
            error: (err) => {
                console.error('Failed to load audit logs:', err);
            }
        });
    }

        
    paginateLogItems() {
        const start = (this.auditPage - 1) * this.auditPageSize;
        const end = start + this.auditPageSize;
        this.paginatedAuditLogs = this.auditLogs.slice(start, end);
    }

    onAuditPageChange(page: number) {
        this.auditPage = page;
        this.paginateLogItems();
    }
}
