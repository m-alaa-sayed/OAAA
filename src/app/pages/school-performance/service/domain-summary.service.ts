import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AppResponse} from 'src/app/core/models/app-response';
import {ToastService} from 'src/app/core/services/toast-service';
import {DomainSummarySubmissionRequestInfo} from '../types/domain-summary-submission-request-info';
import {ScheduledSchoolVisit} from '../types/scheduled-school-visit';
import {VisitPlanDomainSummary} from '../types/visit-plan-domain-summary';
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DomainSummaryService {

    constructor(private http: HttpClient, public translate: TranslateService,
                private router: Router,
                private toastService: ToastService) {
    }

    getStartedScheduledSchoolVisitsForAcceptedUser() {
        const url = `${AppConstants.API.SCHEDULED_SCHOOL_VISIT}started-visited/`;
        return this.http.get<AppResponse<ScheduledSchoolVisit[]>>(url);
    }

    getDomainSummarySubmissionRequestInfoListByScheduledSchoolVisitId(scheduledSchoolVisitId: any) {
        const url = `${AppConstants.API.DOMAIN_SUMMARY}scheduled-visit/${scheduledSchoolVisitId}/`;
        return this.http.get<AppResponse<DomainSummarySubmissionRequestInfo[]>>(url);
    }

    getDomainSummarySubmissionRequestInfoList(scheduledSchoolVisitId: any) {
        return this.http.get<AppResponse<VisitPlanDomainSummary[]>>(`${AppConstants.API.DOMAIN_SUMMARY}${scheduledSchoolVisitId}/`);
    }

    validateDomainSummarySubmission(domain: string, scheduledSchoolVisitId: number) {
        return this.http.get<AppResponse<void>>(
            `${AppConstants.API.DOMAIN_SUMMARY}validate/${scheduledSchoolVisitId}/${domain}/`
        );
    }

    getDomainSummaryRequestInfoByInfoId(infoId: number) {
        return this.http.get<AppResponse<DomainSummarySubmissionRequestInfo>>(
            `${AppConstants.API.DOMAIN_SUMMARY}domain-summary/${infoId}/`
        );
    }

    getDomainSummaryRequestInfoByRequestId(requestId: number, taskId: number) {
        return this.http.get<AppResponse<any>>(
            `${AppConstants.API.DOMAIN_SUMMARY}domain-summary/request/${requestId}/${taskId}/`
        );
    }

    getInitStandardsAverages(domain: string, scheduledSchoolVisitId: number) {
        let params = new HttpParams()
            .set('scheduledSchoolVisitId', scheduledSchoolVisitId)
            .set('domain', domain);

        return this.http.get<AppResponse<any>>(
            `${AppConstants.API.FORM_VISIT}init/standards/average`, {params}
        );
    }

    getImportVisitFormsByScheduledSchoolVisitId(scheduledSchoolVisitId: number) {
        return this.http.get<AppResponse<any>>(
            `${AppConstants.API.FORM_VISIT}import/${scheduledSchoolVisitId}/`
        );
    }

    saveDomainSummaryRequestInfo(obj: DomainSummarySubmissionRequestInfo, action: string) {
        let params = new HttpParams();
        params = params.set('action', action);
        return this.http.post<AppResponse<any>>(`${AppConstants.API.DOMAIN_SUMMARY}init/`, obj, {params}).pipe(map((ret) => ret.data));
    }

    completeVisitFormRequestInfo(obj: any) {
        return this.http.put<AppResponse<void>>(
            `${AppConstants.API.DOMAIN_SUMMARY}complete/`, obj
        );
    }

    downloadReport(id: number) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.DOMAIN_SUMMARY}report/${id}`);
    }

    validateDomainSummaryRequestInfoMandatoryFields(info: any) {
        if (!info.strengthsAnalysis?.trim() ||
            !info.improvementsAnalysis?.trim() ||
            !info.domainSummary?.trim()) {
            return false;
        }
        return true;
    }
}
