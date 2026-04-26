import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'quality-assurance-visit-details-step',
    templateUrl: './visit-details-step.component.html',
    styleUrl: './visit-details-step.component.scss'
})
export class QualityAssuranceVisitDetailsStepComponent extends BaseStepComponent {

    @Input() visitData: any;
    @Input() scheduledSchoolVisitId: any;
    @Input() qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;

    constructor(public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
                protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }
}
