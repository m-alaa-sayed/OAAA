import {Injectable} from '@angular/core';
import {ExternalReviewVisitReportsService} from "../../service/external-review-visit-reports.service";
import {VisitReportSubmissionRequestInfo} from "../../types/visit-report-submission-request-info";
import {ToastService} from "../../../../core/services/toast-service";
import {TranslateService} from "@ngx-translate/core";
import {
    ReportDownloaderEvent
} from "../external-review-visit-reports-creation/components/report-document-downloader/report-document-downloader.component";

@Injectable({
    providedIn: 'root'
})
export class VisitReportDocumentDownloaderService {

    constructor(private externalReviewVisitReportsService: ExternalReviewVisitReportsService, public toastService: ToastService, public translate: TranslateService) {

    }

    generateReportDocument(visitReportSubmissionRequestInfoDto: VisitReportSubmissionRequestInfo, reportDownloaderEvent: ReportDownloaderEvent) {
        const id = visitReportSubmissionRequestInfoDto.id;
        if (id) {
            const format = reportDownloaderEvent.format;
            const type = reportDownloaderEvent.type;
            this.externalReviewVisitReportsService.generateReportDocument(id, format, type)
                .subscribe({
                    next: (response => {
                        const contentType = format.toLowerCase() === 'word' ?
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                            'application/pdf';
                        const dataUri = 'data:' + contentType + ';base64,' + response.data.file;
                        const a = document.createElement('a');
                        document.body.appendChild(a);
                        a.href = dataUri;
                        a.download = response.data.fileName;
                        a.click();
                        window.URL.revokeObjectURL(dataUri);
                    }),
                    error: (err) => this.handleError(err)
                });
        }
    }

    public handleError(error: any) {
        let message = 'PAGES.COMMON.MESSAGES.';
        message += error;
        // }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }
}
