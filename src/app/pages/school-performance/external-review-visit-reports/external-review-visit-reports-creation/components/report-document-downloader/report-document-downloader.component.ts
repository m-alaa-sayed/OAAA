import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Permission} from 'src/app/core/enum/permission';
import {AuthService} from 'src/app/core/services/auth.service';
import {HasPermissionDirective} from 'src/app/core/directives/has-permission.directive';

export interface ReportDownloaderEvent {
    format: string;
    type: string;
}

@Component({
    selector: 'app-report-document-downloader',
    standalone: true,
    imports: [
        TranslateModule,
        CommonModule,
        HasPermissionDirective
    ],
    templateUrl: './report-document-downloader.component.html',
    styleUrl: './report-document-downloader.component.scss'
})
export class ReportDocumentDownloaderComponent {
    @Output() generateReport = new EventEmitter<ReportDownloaderEvent>();
    @Input() visitReportSubmissionRequestInfo: any

    @Input() permissionsPDF: Permission[] = [];
    @Input() permissionsWord: Permission[] = [];
    protected readonly Permission = Permission;

    constructor(private authService: AuthService) {

    }

    generateReportDocument(reportDownloaderEvent: ReportDownloaderEvent): void {
        this.generateReport.emit(reportDownloaderEvent);
    }

    showGeneratePdfButton(): boolean {
        const userClaim = this.authService.getUserClaim();
        const userPermissions = userClaim?.permissions ?? [];

        if (userPermissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW)) {
            return this.visitReportSubmissionRequestInfo?.status === 'APPROVED';
        }
        return true;
    }

    showGenerateReportDocumentButton(): boolean {
        const userClaim = this.authService.getUserClaim();
        const userPermissions = userClaim?.permissions ?? [];

        if (!userPermissions.includes(Permission.VISIT_REPORT_SCHOOL_REVIEW)) {
            return true;
        }

        return false;
    }
}
