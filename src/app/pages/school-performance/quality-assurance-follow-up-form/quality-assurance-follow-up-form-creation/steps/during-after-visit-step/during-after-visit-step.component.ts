import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    QualityAssuranceFollowUpFormWizardService
} from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import {QaFollowUpFormSubmission} from 'src/app/pages/school-performance/types/qa-follow-up-form-submission';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'app-during-after-visit-step',
    templateUrl: './during-after-visit-step.component.html',
    styleUrl: './during-after-visit-step.component.scss'
})
export class DuringAfterVisitStepComponent extends BaseStepComponent {

    @Input() visitFrom?: string;
    @Input() visitTo?: string;
    @Input() qualityAssuranceFormInfo: QaFollowUpFormSubmission = {} as QaFollowUpFormSubmission;

    constructor(public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
                public toastService: ToastService,
                protected override router: Router) {
        super(qualityAssuranceFormService, router);
    }
}
