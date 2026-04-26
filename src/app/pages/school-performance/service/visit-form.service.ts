import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AppResponse} from 'src/app/core/models/app-response';
import {VisitFormRequestInfo} from '../types/visit-form-request-info';
import {LkStandard} from '../types/lk-standard';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToastService} from 'src/app/core/services/toast-service';
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VisitFormService {
    private visitData: any = null;

    setVisitData(data: any): void {
        this.visitData = data;
    }

    getVisitData(): any {
        return this.visitData;
    }

    constructor(private http: HttpClient, public translate: TranslateService,
                private router: Router,
                private toastService: ToastService) {
    }

    getCurrentPlansOverview(status?: string) {
        const url = `${AppConstants.API.VISIT_PLAN}${status}`;
        return this.http.get<AppResponse<any[]>>(url);
    }

    getVisitFormRequestInfoByScheduledSchoolVisitId(visitFormType: any, scheduledSchoolVisitId: any) {
        return this.http.get<AppResponse<VisitFormRequestInfo[]>>(`${AppConstants.API.FORM_VISIT}${visitFormType}/${scheduledSchoolVisitId}/`);
    }

    deleteVisitForm(visitFormType: string, id: number) {
        const url = `${AppConstants.API.FORM_VISIT}/${visitFormType}/${id}/`;
        return this.http.delete(url);
    }

    saveVisitFormRequestInfo(visitFormType: string, obj: VisitFormRequestInfo, action?: string) {
        let params = new HttpParams();
        if (action) {
            params = params.set('action', action);
        }
        return this.http.post<AppResponse<any>>(`${AppConstants.API.FORM_VISIT}${visitFormType}/`, obj, {params}).pipe(map((ret) => ret.data));
    }

    getVisitFormRequestInfoByRequestId(id: number) {
        return this.http.get<AppResponse<VisitFormRequestInfo>>(
            `${AppConstants.API.FORM_VISIT}form/request/${id}/`
        );
    }

    getVisitFormRequestInfoByInfoId(id: number) {
        return this.http.get<AppResponse<VisitFormRequestInfo>>(
            `${AppConstants.API.FORM_VISIT}form/${id}/`
        );
    }

    getLkStandards() {
        return this.http.get<AppResponse<LkStandard[]>>(
            `${AppConstants.API.FORM_VISIT}standards/`
        );
    }

    validateVisitPlanStatus(visitFormType: string, scheduledSchoolVisitId: number) {
        return this.http.get<AppResponse<void>>(
            `${AppConstants.API.FORM_VISIT}${visitFormType}/validate/${scheduledSchoolVisitId}/`
        );
    }

    save(obj: VisitFormRequestInfo) {
        this.saveVisitFormRequestInfo(obj.type, obj)
            .subscribe({
                next: (response) => {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                            classname: 'bg-success text-white',
                            delay: 3000
                        }
                    );
                    this.router.navigate(['/jawda/school-performance/visit-form', response.type, 'creation', response.id, response.formStatus]);
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                        classname: 'bg-danger text-white',
                        autohide: false
                    });
                }
            });
    }

    reSubmitVisitFormRequestInfo(
        visitFormType: string,
        visitFormRequestInfo: VisitFormRequestInfo,
        comment: string,
        action?: string
    ) {
        const obj = {
            visitFormDomainEvaluations: visitFormRequestInfo.visitFormDomainEvaluations,
            action: action,
            comment: comment,
            details: visitFormRequestInfo.details,
            summary: visitFormRequestInfo.summary,
            strengthsAnalysis: visitFormRequestInfo.strengthsAnalysis,
            improvementsAnalysis: visitFormRequestInfo.improvementsAnalysis,
            scheduledSchoolVisitId: visitFormRequestInfo.scheduledSchoolVisitId,
            visitFormRequestInfoId: visitFormRequestInfo.id
        };
        return this.http.post<AppResponse<void>>(
            `${AppConstants.API.FORM_VISIT}${visitFormType}/resubmit/`,
            obj
        );
    }

    completeVisitFormRequestInfo(
        visitFormType: string,
        visitFormRequestInfo: VisitFormRequestInfo,
        comment: string,
        action?: string
    ) {
        const obj = {
            visitFormDomainEvaluations: visitFormRequestInfo.visitFormDomainEvaluations,
            action: action,
            comment: comment,
            scheduledSchoolVisitId: visitFormRequestInfo.scheduledSchoolVisitId,
            visitFormRequestInfoId: visitFormRequestInfo.id
        };
        return this.http.post<AppResponse<void>>(
            `${AppConstants.API.FORM_VISIT}${visitFormType}/complete/`, obj
        );
    }


    validateVisitFormRequestInfoMandatoryFields(obj: VisitFormRequestInfo): boolean {
        if (obj.type === 'CLASSROOM_OBSERVATION') {
            if (
                !obj.actualClassVisitDate ||
                !obj.subject?.trim() ||
                !obj.grade?.trim() ||
                !obj.className?.trim() ||
                obj.sessionNumber == null ||
                !obj.improvementsAnalysis?.trim() || !obj.strengthsAnalysis?.trim() ||
                obj.totalStudentsInClass == null ||
                obj.absenceCount == null ||
                // ✅ Additional validation:
                obj.totalStudentsInClass <= 0 ||
                obj.absenceCount < 0 ||
                obj.absenceCount > obj.totalStudentsInClass
            ) {

                return false;
            }

            const schoolAchievementEvaluations = obj.visitFormDomainEvaluations?.filter(
                e => e.standard?.domain === 'ACADEMIC_ACHIEVEMENT' || e.standard?.domain === 'TEACHING_AND_ASSESSMENT'
            );

            const allJudgmentsValid = schoolAchievementEvaluations?.every(
                e => e.judgment != null && e.judgment !== 0
            );

            if (!allJudgmentsValid) {
                return false;
            }

        } else if (obj.type === 'GENERAL_EVIDENCE') {
            if (
                !obj.activityDate ||
                !obj.activityType?.trim()
            ) {

                return false;
            }
        }

        return true;
    }

    downloadPdfReport(id: number, type: string) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.FORM_VISIT}report/${type}/${id}`);
    }
}
