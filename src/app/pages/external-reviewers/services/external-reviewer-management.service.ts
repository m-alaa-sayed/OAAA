import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { AppResponse } from 'src/app/core/models/app-response';
import { ExternalReviewer } from '../types/external-reviewer';
import { Audit } from 'src/app/core/models/audit';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerManagementService {

  constructor(private http: HttpClient) { }

  getExternalReviewersByModule(module: any) {
    return this.http.get<AppResponse<any>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewers/${module}`);
  }

  deleteExternalReviewer(module: string, externalReviewerId: number, removeReason: string) {
    const params = new HttpParams().set('removeReason', removeReason);
    const url = `${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewers/${module}/${externalReviewerId}`;
    return this.http.delete<AppResponse<void>>(url, { params });
  }

  updateExternalReviewerStatus(module: string, externalReviewerId: number, status: string, note: string) {
    const params = new HttpParams()
      .set('status', status)
      .set('note', note);

    const url = `${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewers/${module}/${externalReviewerId}`;
    return this.http.patch<AppResponse<void>>(url, null, { params });
  }

  updateExternalReviewerNotifications(module: string, note: string, externalReviewerIds: number[]) {
    const body = {
      note,
      externalReviewerIds
    };

    const url = `${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewers/update-notifications/${module}`;
    return this.http.patch<AppResponse<void>>(url, body);
  }


  getExternalReviewerFiles() {
    return this.http.get<AppResponse<ExternalReviewer[]>>(`${AppConstants.API.EXTERNAL_REVIEWER_FILES}`);
  }

  getExternalReviewerByIdAndLoggedUserId(id: number) {
    return this.http.get<AppResponse<ExternalReviewer>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/${id}`);
  }

  getExternalReviewerById(id: number) {
    return this.http.get<AppResponse<ExternalReviewer>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT_BY_ID}/${id}`);
  }

  getExternalReviewerByModuleAndLoggedUserId(module: any) {
    return this.http.get<AppResponse<ExternalReviewer>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewers/${module}/me`);
  }

  updateExternalReviewer(externalReviewer: ExternalReviewer) {
    return this.http.patch<AppResponse<void>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/${externalReviewer.id}`, externalReviewer);
  }

  getAvailabilityAudit(externalReviewerId: any) {
    return this.http.get<AppResponse<Audit[]>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/audit/${externalReviewerId}`);
  }

  getExternalReviwerOperationsAudit(externalReviewerId: any) {
    return this.http.get<AppResponse<Audit[]>>(`${AppConstants.API.EXTERNAL_REVIEWER_MANAGEMENT}/external-reviewer-operations/${externalReviewerId}`);
  }
}
