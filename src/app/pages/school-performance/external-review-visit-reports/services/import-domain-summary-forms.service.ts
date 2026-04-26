import {Injectable} from '@angular/core';
import {DomainSummaryService} from '../../service/domain-summary.service';
import {ToastService} from '../../../../core/services/toast-service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {VisitDomain} from '../../../../core/enum/visit-domain';

const DOMAIN_ORDER: readonly VisitDomain[] = [
    VisitDomain.ACADEMIC_ACHIEVEMENT,
    VisitDomain.PERSONAL_DEVELOPMENT,
    VisitDomain.TEACHING_AND_ASSESSMENT,
    VisitDomain.LEARNING_ENVIRONMENT,
    VisitDomain.LEADERSHIP_AND_GOVERNANCE
];

function sortByDomain<T>(
    items: T[],
    domainSelector: (item: T) => VisitDomain | string | null | undefined
): T[] {
    const orderMap = new Map<VisitDomain, number>(
        DOMAIN_ORDER.map((d, i) => [d, i])
    );
    return [...items].sort((a, b) => {
        const da = domainSelector(a) as VisitDomain | undefined;
        const db = domainSelector(b) as VisitDomain | undefined;
        const ia = orderMap.get(da as VisitDomain) ?? 999;
        const ib = orderMap.get(db as VisitDomain) ?? 999;
        return ia - ib;
    });
}

@Injectable({providedIn: 'root'})
export class ImportDomainSummaryFormsService {
    constructor(
        public domainSummaryService: DomainSummaryService,
        private readonly toastService: ToastService,
        public translate: TranslateService
    ) {
    }

    importDomainSummaryForms(scheduledSchoolVisitId: number): Observable<any[]> {
        return this.domainSummaryService
            .getDomainSummarySubmissionRequestInfoListByScheduledSchoolVisitId(scheduledSchoolVisitId)
            .pipe(
                map(resp => sortByDomain(resp?.data ?? [], x => (x as any)?.domain)),
                catchError(err => {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
                    return of([]);
                })
            );
    }
}
