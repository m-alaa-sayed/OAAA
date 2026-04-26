import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    QualityAssuranceFollowUpFormService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form.service';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {limitWords} from "../../../../../../shared/utils/word-utils";
import {Subscription} from "rxjs";

@Component({
    selector: 'formation-of-review-visit-team',
    templateUrl: './formation-of-review-visit-team.component.html',
    styleUrl: './formation-of-review-visit-team.component.scss'
})
export class FormationOfReviewVisitTeamComponent implements OnInit {
    @Input() qualityAssuranceInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;
    @Input() scheduledSchoolVisitId: any;
    @Input() showButtons: boolean = true;
    @Input() editable: boolean = true;
    @Input() isSubmitted = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    list: any[] = [];
    subscription!: Subscription;

    constructor(
        public translate: TranslateService,
        private router: Router,
        public toastService: ToastService,
        private qualityAssuranceFollowUpFormService: QualityAssuranceFollowUpFormService,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.subscription = this.qualityAssuranceFollowUpFormService.submitFormData$.subscribe(message => this.isSubmitted = message);
        this.route.paramMap.subscribe(params => {
            this.scheduledSchoolVisitId = params.get('scheduledSchoolVisitId');
            this.getVisitTeamMembers(this.scheduledSchoolVisitId);
        });
    }

    getVisitTeamMembers(scheduledSchoolVisitId: any) {
        this.qualityAssuranceFollowUpFormService.getVisitTeamMembers(scheduledSchoolVisitId).subscribe({
            next: (response) => {
                this.list = response.data.map((item: { domains: string[]; subjects: string[] }) => {
                    const domainsTranslated = item.domains?.map((d: string) =>
                        this.translateOrFallback('PAGES.TEAM_LEADER_PLAN.LABELS', d)
                    ) ?? [];

                    const subjectsTranslated =
                        item.subjects?.map((s: string) =>
                            this.translateOrFallback('PAGES.TEAM_LEADER_PLAN.LABELS', s)
                        ) ?? [];
                    return {
                        ...item,
                        domainsUpperTranslated: domainsTranslated.join(', '),
                        subjectsUpperTranslated: subjectsTranslated.join(', ')
                    };
                });

            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }


    private translateOrFallback(prefix: string, value: string): string {
        const key = `${prefix}.${value}`;
        const translated = this.translate.instant(key);
        return translated === key ? value : translated;
    }

    onTextChange(): void {
        const result = limitWords(this.qualityAssuranceInfo.qaReviewTeamFeedback || '', 250);
        this.qualityAssuranceInfo.qaReviewTeamFeedback = result.trimmedText;
    }

    save() {
        this.qualityAssuranceFollowUpFormService.save(this.qualityAssuranceInfo, 'SAVE');
    }
}





