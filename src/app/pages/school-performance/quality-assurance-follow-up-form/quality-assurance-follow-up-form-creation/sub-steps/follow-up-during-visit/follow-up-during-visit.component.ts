import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {DuringVisitFollowUpScores} from 'src/app/pages/school-performance/types/during-visit-follow-up-scores';
import {VisitDayEnum, visitDays} from 'src/app/pages/school-performance/types/education.enums';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';
import {QualityAssuranceFollowUpFormService} from "../../../../service/quality-assurance-follow-up-form.service";
import {Subscription} from "rxjs";
import {LanguageUtil} from "../../../../../../core/util/language.util";

@Component({
    selector: 'app-follow-up-during-visit',
    templateUrl: './follow-up-during-visit.component.html',
    styleUrl: './follow-up-during-visit.component.scss'
})
export class FollowUpDuringVisitComponent extends BaseStepComponent {
    @Input() qualityAssuranceFormInfo!: QaFollowUpFormSubmission;
    @Input() editable: boolean = true;
    @Input() visitFrom: string = '';
    @Input() visitTo: string = '';

    dayLabel: string = '';
    isSubmitted = false;
    subscription!: Subscription;
    days: VisitDayEnum[] = visitDays;

    constructor(
        public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
        public qualityAssuranceFollowUpFormService: QualityAssuranceFollowUpFormService,
        public translate: TranslateService,
        protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }

    labels = {
        schoolManagerInterview: 'SCHOOL_MANAGER_INTERVIEW',
        visitPlan: 'VISIT_PLAN',
        classroomObservationForms: 'CLASSROOM_OBSERVATION_FORMS',
        generalEvidenceForms: 'GENERAL_EVIDENCE_FORMS',
        evidenceCollectionAndDocumentation: 'EVIDENCE_COLLECTION_AND_DOCUMENTATION',
        professionalConductRules: 'PROFESSIONAL_CONDUCT_RULES',
        dailyFeedbackSession: 'DAILY_FEEDBACK_SESSION',
        finalFeedbackSession: 'FINAL_FEEDBACK_SESSION'
    };

    ngOnInit() {
        this.subscription = this.qualityAssuranceFollowUpFormService.submitFormData$.subscribe(message => this.isSubmitted = message);
        if (!this.qualityAssuranceFormInfo.duringVisitFollowUpScores) {
            this.qualityAssuranceFormInfo.duringVisitFollowUpScores = {
                schoolManagerInterview: 0,
                visitPlan: 0,
                classroomObservationForms: 0,
                generalEvidenceForms: 0,
                evidenceCollectionAndDocumentation: 0,
                professionalConductRules: 0,
                dailyFeedbackSession: 0,
                finalFeedbackSession: 0,
                fieldVisitDate: '',
                dayNum: ''
            };
        }
        this.updateDayNum(this.qualityAssuranceFormInfo.duringVisitFollowUpScores.fieldVisitDate);
    }

    updateDayNum(date?: string | Date | null): void {
        if (!date) return;

        const visitDate = typeof date === 'string' ? new Date(date) : date;
        const dayNum = this.getTodayDayInPeriod(this.visitFrom, this.visitTo, visitDate);

        if (dayNum === null) {
            this.qualityAssuranceFormInfo.duringVisitFollowUpScores!.dayNum = '';
            return;
        }

        const day = visitDays[dayNum];

        if (!day) {
            this.qualityAssuranceFormInfo.duringVisitFollowUpScores!.dayNum = (dayNum + 1).toString();
            this.dayLabel = this.translate.instant("PAGES.QUALITY_ASSURANCE.LABELS.DAY") + " " + this.qualityAssuranceFormInfo.duringVisitFollowUpScores!.dayNum;
        } else {
            this.dayLabel = LanguageUtil.isArabic ? day.valueAr : day.valueEn;
            this.qualityAssuranceFormInfo.duringVisitFollowUpScores!.dayNum = day.code;
        }
    }

    parseYmdDate(dateStr: string): Date {
        const [yearStr, monthStr, dayStr] = dateStr.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr) - 1;
        const day = Number(dayStr);
        const d = new Date(year, month, day);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    getTodayDayInPeriod(startStr: string, endStr: string, today: Date = new Date()): number | null {
        const start = this.parseYmdDate(startStr);
        const end = this.parseYmdDate(endStr);

        if (start > end) throw new Error("Start date must be before or equal to end date");

        const current = new Date(today);
        current.setHours(0, 0, 0, 0);

        if (current < start || current > end) return null;

        const diffMs = current.getTime() - start.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        return diffDays;
        /*const visitDay = visitDays[diffDays];

        if (!visitDay) return null;
        return visitDay.code;*/
    }

}
