import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Audit } from 'src/app/core/models/audit';
import { ExternalReviewerManagementService } from 'src/app/pages/external-reviewers/services/external-reviewer-management.service';

@Component({
  selector: 'external-reviewer-operations',
  templateUrl: './external-reviewer-operations.component.html',
  styleUrl: './external-reviewer-operations.component.scss'
})
export class ExternalReviewerOperationsComponent implements OnInit {
  @Input() externalReviewerId: any;

  operations: any[] = [];

  auditPage: number = 1;
  auditPageSize: number = 5;
  auditTotal: number = 0;

  auditLogs: Audit[] = [];
  paginatedAuditLogs: Audit[] = [];
  constructor(public translate: TranslateService,
     private externalReviewerManagementService: ExternalReviewerManagementService
  ) {}

  ngOnInit() {
    this.getAuditLogs();
  }


  getAuditLogs(): void {
    this.externalReviewerManagementService.getExternalReviwerOperationsAudit(this.externalReviewerId).subscribe({
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

