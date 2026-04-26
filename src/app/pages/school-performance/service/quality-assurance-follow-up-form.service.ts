import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AppResponse} from 'src/app/core/models/app-response';
import {ToastService} from 'src/app/core/services/toast-service';
import {QaFollowUpFormSubmission} from '../types/qa-follow-up-form-submission';
import {VisitReportEvaluationScores} from "../types/visit-report-evaluation-scores";
import {TeamLeaderEvaluationScores} from "../types/team-leader-evaluation-scores";
import {PreVisitFollowUpScores} from "../types/pre-visit-follow-up-scores";
import {DuringVisitFollowUpScores} from "../types/during-visit-follow-up-scores";
import {SchoolPreparednessScores} from "../types/school-preparedness-scores";
import {TeamEvaluationScores} from "../types/team-evaluation-scores";
import {BehaviorSubject, map} from "rxjs";

type AnyScores =
    | PreVisitFollowUpScores
    | DuringVisitFollowUpScores
    | SchoolPreparednessScores
    | TeamEvaluationScores
    | TeamLeaderEvaluationScores
    | VisitReportEvaluationScores;

@Injectable({
    providedIn: 'root'
})
export class QualityAssuranceFollowUpFormService {

    public submitFormSubject = new BehaviorSubject<boolean>(false);
    public submitFormData$ = this.submitFormSubject.asObservable();

    constructor(private http: HttpClient, public translate: TranslateService,
                private router: Router,
                private toastService: ToastService) {
    }

    getQaFollowUpFormSubmissionDtoList() {
        const url = `${AppConstants.API.QUALITY_ASSURANCE_FORM}`;
        return this.http.get<AppResponse<any[]>>(url);
    }

    getScheduledSchoolVisits() {
        const url = `${AppConstants.API.QUALITY_ASSURANCE_FORM}visits/`;
        return this.http.get<AppResponse<any[]>>(url);
    }

    deleteQualityAssuranceForm(formId: number) {
        const url = `${AppConstants.API.QUALITY_ASSURANCE_FORM}${formId}/`;
        return this.http.delete(url);
    }

    getQualityAssuranceFollowUpFormById(id: number) {
        return this.http.get<AppResponse<any>>(
            `${AppConstants.API.QUALITY_ASSURANCE_FORM}${id}/`
        );
    }

    getVisitTeamMembers(scheduledSchoolVisitId: number) {
        return this.http.get<AppResponse<any>>(
            `${AppConstants.API.QUALITY_ASSURANCE_FORM}members/${scheduledSchoolVisitId}/`
        );
    }

    saveComments(comments: any[], id: number) {
        return this.http.post<AppResponse<void>>(`${AppConstants.API.QUALITY_ASSURANCE_FORM}save-comments/${id}/`, comments);
    }

    saveQAFollowUpInfo(obj: QaFollowUpFormSubmission, action: string) {
        let params = new HttpParams();
        params = params.set('action', action);
        return this.http.post<AppResponse<any>>(`${AppConstants.API.QUALITY_ASSURANCE_FORM}init/`, obj, {params}).pipe(map((ret) => ret.data));
    }

    save(obj: QaFollowUpFormSubmission, action: string) {
        this.saveQAFollowUpInfo(obj, action).subscribe({
            next: (response) => {
                if (action === 'SAVE') {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                            classname: 'bg-success text-white',
                            delay: 3000
                        }
                    );
                    this.router.navigate(['/jawda/school-performance/quality-assurance-form/creation', response.scheduledSchoolVisitId, response.id]);
                } else {
                    this.router.navigate(['/jawda/success-page'], {
                        state: {requestApplicationNo: response.data, action: action}
                    });
                }
            },
            error: (error) => this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                classname: 'bg-danger text-white', autohide: false
            })
        });
    }

    downloadReport(id: number) {
        return this.http.get<AppResponse<any>>(`${AppConstants.API.QUALITY_ASSURANCE_FORM}report/${id}`);
    }


    prepareVisitData(visitData: any) {
        return {
            visitNumber: visitData.visitNumber,
            planNumber: visitData.planNumber,
            visitFrom: visitData.visitFrom,
            visitTo: visitData.visitTo,
            schoolNameAr: visitData.school.nameAr,
            schoolNameEn: visitData.school.nameEn,
            principalName: visitData?.school?.principalName,
            phone: visitData?.school?.phone,
            schoolCode: visitData.school.code,
            schoolType: visitData.school.type,
            studentsGender: visitData.school.gender,
            schoolGovernorateAr: visitData.school.governorate.nameAr,
            schoolGovernorateEn: visitData.school.governorate.nameEn,
            wilayatAr: visitData.school.wilayat.nameAr,
            wilayatEn: visitData.school.wilayat.nameEn,
            village: visitData?.school?.village,
            grades: visitData.school.classes,
            scheduledSchoolVisitId: visitData.id,
            selfEvaluationDocumentNumber: visitData.selfEvaluationDocumentNumber

        }
    }

    validateQualityAssuranceFollowUpFormMandatoryFields(info: QaFollowUpFormSubmission, visitFrom?: string, visitTo?: string): boolean {
        const isNonEmpty = (s?: string) => typeof s === 'string' && s.trim() !== '';

        const scoresFilled = (
            o: AnyScores | undefined,
            skipKeys: string[] = []
        ): boolean => {
            if (!o) return false;
            return Object.entries(o)
                .filter(([key]) => !skipKeys.includes(key))
                .every(([, v]) => v !== null && v !== '' && v !== 0);
        };

        const notify = (key: string): false => {
            scrollTo(0, 0);
            this.submitFormSubject.next(true);
            this.toastService.show(this.translate.instant(key), {
                classname: 'bg-danger text-white', autohide: false
            });
            return false;
        };

        const checks: ReadonlyArray<[boolean, string]> = [
            [isNonEmpty(info.qaReviewTeamFeedback), 'PAGES.QUALITY_ASSURANCE.MESSAGES.QUALITY_ASSURER_OPINION_ON_REVIEW_TEAM_FORMATION_REQUIRED'],
            [scoresFilled(info.preVisitFollowUpScores), 'PAGES.QUALITY_ASSURANCE.MESSAGES.ADD_ALL_BEFORE_VISIT_MANDATORY_FIELDS_FOR_SUBMIT'],
            [scoresFilled(info.duringVisitFollowUpScores), 'PAGES.QUALITY_ASSURANCE.MESSAGES.DURING_VISIT_FOLLOWUP_SCORES'],
            [scoresFilled(info.schoolPreparednessScores), 'PAGES.QUALITY_ASSURANCE.MESSAGES.SCHOOL_PREPAREDNESS_SCORES'],
            [scoresFilled(info.teamEvaluationScores), 'PAGES.QUALITY_ASSURANCE.MESSAGES.TEAM_EVALUATION_SCORES'],
            [scoresFilled(info.teamLeaderEvaluationScores), 'PAGES.QUALITY_ASSURANCE.MESSAGES.TEAM_LEADER_EVALUATION_SCORES'],
            [scoresFilled(info.visitReportEvaluationScores, ['notes']), 'PAGES.QUALITY_ASSURANCE.MESSAGES.VISIT_REPORT_EVALUATION_SCORES'],
        ];

        for (const [ok, key] of checks) if (!ok) return notify(key);

        if (!this.isDateBetweenStrings(info?.duringVisitFollowUpScores?.fieldVisitDate ?? '', visitFrom ?? '', visitTo ?? '')) {
            notify('PAGES.QUALITY_ASSURANCE.MESSAGES.FIELD_VISIT_DATE_ERROR');
            return false;
        }
        return true;
    }

    isDateBetweenStrings(dateStr?: string, startStr?: string, endStr?: string): boolean {
        if (!dateStr || !startStr || !endStr) return false;
        return dateStr >= startStr && dateStr <= endStr;
    }
}
