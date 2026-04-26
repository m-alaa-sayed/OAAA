import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {VisitReportRequestsOverview} from '../types/visit-report-requests-overview';
import {AppResponse} from 'src/app/core/models/app-response';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {VisitReportSubmissionRequestInfo} from '../types/visit-report-submission-request-info';
import {VisitReportRequest} from '../types/visit-report-request';
import {VisitReportCompletionRequest} from '../types/visit-report-completion-request';
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ExternalReviewVisitReportsService {


    constructor(private http: HttpClient) {
    }


    getCurrentReports() {
        return this.http.get<AppResponse<VisitReportRequestsOverview[]>>(`${AppConstants.API.VISIT_REPORT_SUBMISSION}`);
    }

    availableForReporting() {
        return this.http.get<AppResponse<VisitReportRequestsOverview[]>>(`${AppConstants.API.AVAILABLE_FOR_REPORTING}`);
    }

    //---
    getInitialReportView(visitId: number) {
        return this.http.get<AppResponse<VisitReportSubmissionRequestInfo>>(`${AppConstants.API.INITIAL_REPORT_VIEW}${visitId}`);
    }


    getReportDetailsById(id: number) {
        return this.http.get<AppResponse<VisitReportSubmissionRequestInfo>>(`${AppConstants.API.REPORT_DETAILS}${id}`);
    }


    handleVisitReportRequest(visitReportRequest: VisitReportRequest) {
        return this.http.post<AppResponse<any>>(`${AppConstants.API.VISIT_REPORT_SUBMISSION}`, visitReportRequest).pipe(map((ret) => ret.data));
    }

    getReportDetailsByRequestId(requestId: any, taskId: any) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.REPORT_DETAILS}request/${requestId}/${taskId}`);
    }


    completeVisitPlanProcess(requestObject: VisitReportCompletionRequest) {
        return this.http.put<AppResponse<any>>(
            `${AppConstants.API.COMPLETE_VISIT_REPORT}`, requestObject
        );
    }

    generateReportDocument(id: number, format: string, type: string) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.GENERATE_VISIT_REPORT}${id}/${format}/${type}`);
    }
}
