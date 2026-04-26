import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalReviewersWithdrawalRequest } from '../types/external-reviewers-withdrawal-request';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { AppResponse } from 'src/app/core/models/app-response';
import { ExternalReviewersWithdrawalComplete } from '../types/external-reviewers-withdrawal-complete';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerWithdrawalService {

  constructor(private http: HttpClient) { }

  createRequest(serviceCode: string, dto: ExternalReviewersWithdrawalRequest) {
    return this.http.post<any>(`${AppConstants.API.EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST}/${serviceCode}/create/`, dto);
  }

  getRequestByRequestIdAndTaskId(requestId: any, taskId: any) {
    return this.http.get<AppResponse<any>>(`${AppConstants.API.EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST}/${requestId}/${taskId}`);
  }

  complete(requestObject: ExternalReviewersWithdrawalComplete) {
    return this.http.post<AppResponse<any>>(
      `${AppConstants.API.EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST_COMPLETE}`, requestObject
    );
  }

  getRequests(serviceCode: any) {
    const params = new HttpParams().set('includeAll', 'true');
    const url = `${AppConstants.API.EXTERNAL_REVIEWERS_WITHDRAWAL_REQUEST}/${serviceCode}/previous-requests`;
    return this.http.get<AppResponse<any>>(url, { params });
  }

}
