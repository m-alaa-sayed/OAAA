import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ToastService} from "../../../core/services/toast-service";
import {AppConstants} from "../../../core/constants/app-constants";
import {AppResponse} from "../../../core/models/app-response";
import {map} from "rxjs";
import {SchoolDocumentDeliveryVisitInfo} from "../types/school-document-delivery-visit-info";
import {SchoolDocumentDelivery} from "../types/school-document-delivery";
import {SchoolDocumentDeliveryItem} from "../types/school-document-delivery-item";
import {ScheduledSchoolVisit} from "../types/scheduled-school-visit";

const toDateOnly = (d: string | Date): Date => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return new Date(NaN);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

@Injectable({
    providedIn: 'root'
})
export class SchoolDocumentDeliveryService {

    constructor(private http: HttpClient, public translate: TranslateService,
                private router: Router,
                private toastService: ToastService) {
    }

    validateDocumentItems(requestInfo: SchoolDocumentDelivery, isTlUser: boolean, isSchoolUser: boolean) {
        return requestInfo.schoolDocumentDeliveryItems.every(item => this.validateDocumentItem(item, isTlUser, isSchoolUser));
    }

    validateDocumentItem(item: SchoolDocumentDeliveryItem, isTlUser: boolean, isSchoolUser: boolean): boolean {
        if (!item?.documentName || !item.documentType) return false;

        const status = item.deliveryStatus?.trim();

        if (isSchoolUser) {
            if (!status) return false;
            if (status === 'YES' && !item.deliveryDate) return false;
            if (status === 'FAILED' && !item.notes) return false;
        }

        if (isTlUser && item.isReceived && !item.receivingDate) return false;

        return true;
    }

    validateScheduledSchoolVisitStatus(visit: ScheduledSchoolVisit): boolean {
        const {visitStatus, selfEvaluationDocumentSubmissionDate, visitTo} = visit ?? {};
        if (!visitStatus || !selfEvaluationDocumentSubmissionDate || !visitTo) return true;

        const today = toDateOnly(new Date());
        const from = toDateOnly(selfEvaluationDocumentSubmissionDate);
        const to = toDateOnly(visitTo);

        if ([from, to, today].some(d => isNaN(d.getTime()))) return true;

        const approved = String(visitStatus).toUpperCase() === 'APPROVED';
        const inRange = +today >= +from && +today <= +to;

        return !(approved && inRange);
    }


    getVisitDtoList() {
        const url = `${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}visits/`;
        return this.http.get<AppResponse<SchoolDocumentDeliveryVisitInfo[]>>(url).pipe(map((ret) => ret.data));
    }

    getSchoolDocumentDeliveryRequestInfoByScheduledSchoolVisitId(scheduledSchoolVisitId: any) {
        const url = `${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}${scheduledSchoolVisitId}/`;
        return this.http.get<AppResponse<SchoolDocumentDelivery>>(url).pipe(map((ret) => ret.data));
    }

    getSchoolDocumentDeliveryRequestInfoByRequestId(requestId: any) {
        const url = `${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}request/${requestId}/`;
        return this.http.get<AppResponse<any>>(url).pipe(map((ret) => ret.data));
    }

    saveSchoolDocumentDeliveryRequestInfo(obj: SchoolDocumentDelivery, action: string) {
        let params = new HttpParams();
        params = params.set('action', action);
        return this.http.post<AppResponse<any>>(`${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}init/`, obj, {params}).pipe(map((ret) => ret.data));
    }

    completeSchoolDocumentDeliveryRequestInfo(obj: any) {
        return this.http.put<AppResponse<void>>(
            `${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}complete/`, obj
        );
    }

    downloadReport(scheduledSchoolVisitId: number) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.SCHOOL_DOCUMENT_DELIVERY}report/${scheduledSchoolVisitId}`);
    }
}