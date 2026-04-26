import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReviewerRegistrationWizardService } from 'src/app/core/services/external-reviewer-registration-wizard.service';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-experience-information-step',
  templateUrl: './experience-information-step.component.html',
  styleUrl: './experience-information-step.component.scss'
})
export class ExperienceInformationStepComponent extends BaseStepComponent  {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;


  constructor(public externalReviewerRegistrationWizardService: ExternalReviewerRegistrationWizardService,
    protected override router: Router) {
    super(externalReviewerRegistrationWizardService, router);
  }

}
