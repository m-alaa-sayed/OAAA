import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { AppResponse } from 'src/app/core/models/app-response';
import { SummaryVisitReportRequestsOverview } from '../types/summary-visit-report-requests-overview';
import { SummaryVisitReportSubmissionRequestInfo } from '../types/summary-visit-report-submission-request-info';
import { SummaryVisitReportRequest } from '../types/summary-visit-report-request';
import { SummaryVisitReportCompletionRequest } from '../types/summary-visit-Report-completion-request';
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VisitReportSummaryService {

  constructor(private http: HttpClient) { }


  getCurrentSummaryReports() {
    return this.http.get<AppResponse<SummaryVisitReportRequestsOverview[]>>(`${AppConstants.API.SUMMARY_VISIT_REPORT}`);
  }

  getSummaryReportDetailsById(id: number) {
    return this.http.get<AppResponse<SummaryVisitReportSubmissionRequestInfo>>(`${AppConstants.API.SUMMARY_VISIT_REPORT}${id}`);
  }


  saveSummaryVisitReportRequest(summaryVisitReportRequest: SummaryVisitReportRequest) {
    return this.http.post<AppResponse<any>>(`${AppConstants.API.SUMMARY_VISIT_REPORT}`, summaryVisitReportRequest).pipe(map((ret) => ret.data));
  }


  getReportDetailsByRequestId(requestId: any, taskId: any) {
    return this.http.get<AppResponse<any>>(`${AppConstants.API.SUMMARY_VISIT_REPORT}request/${requestId}/${taskId}`);
  }

  
    completeSummaryVisitReportProcess(requestObject: SummaryVisitReportCompletionRequest) {
      return this.http.put<AppResponse<any>>(
        `${AppConstants.API.SUMMARY_VISIT_REPORT}complete/`, requestObject
      );
    }

}
