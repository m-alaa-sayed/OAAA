import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalReviewerRegistrationWizardService } from 'src/app/core/services/external-reviewer-registration-wizard.service';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';
import { ExternalReviewerSettingDto } from "../../../../types/external-reviewer-setting.dto";
import { ExternalReviewersRegistrationRequest } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';

@Component({
  selector: 'app-pledge-step',
  templateUrl: './pledge-step.component.html',
  styleUrl: './pledge-step.component.scss'
})
export class PledgeStepComponent extends BaseStepComponent implements OnInit {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;

  @Input() externalReviewerSettingDto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();

  constructor(public externalReviewerRegistrationWizardService: ExternalReviewerRegistrationWizardService,
    protected override router: Router) {
    super(externalReviewerRegistrationWizardService, router);
  }

  ngOnInit(): void {

  }

}
