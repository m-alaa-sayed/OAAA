import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AppResponse} from 'src/app/core/models/app-response';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {RequestDto} from "../../../user-tasks/model/request-dto";
import {User} from "../../../../core/models/auth.models";


export interface ImportVisitFormDto {
    formCode: string;
    activityDate: string;
    user: User;
    summary?: string;
    learningEnvironmentQualityDomain?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SafetyAndSecurityService {

    constructor(private http: HttpClient, public translate: TranslateService) {
    }

    getImportVisitFormsByScheduledSchoolVisitIdAndFormType(scheduledSchoolVisitId: number, formType: string): Observable<ImportVisitFormDto[]> {
        if (scheduledSchoolVisitId === null) {
            return of([]);
        }
        const url = `${AppConstants.API.FORM_VISIT}import/${formType}/${scheduledSchoolVisitId}/`;
        return this.http.get<AppResponse<any[]>>(url).pipe(
            map(res => res?.data ?? []),
            catchError(() => of([]))
        );
    }
}
