import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {VisitReportDomainEvaluation} from '../../pages/school-performance/types/visit-report-domain-evaluation';

@Injectable({providedIn: 'root'})
export class OnJudgmentChangeUtilsService {
    private judgmentChangeSub = new Subject<{ domain: VisitReportDomainEvaluation; judgment: number }>();

    readonly judgmentChange$: Observable<{ domain: VisitReportDomainEvaluation; judgment: number }> =
        this.judgmentChangeSub.asObservable();

    notifyJudgmentChange(event: { domain: VisitReportDomainEvaluation; judgment: number }): void {
        this.judgmentChangeSub.next(event);
    }
}