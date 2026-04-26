import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.models';
import { CountryDto } from 'src/app/core/models/country-dto';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { ExternalReviewerRegistrationWizardService } from 'src/app/core/services/external-reviewer-registration-wizard.service';
import { UserState } from 'src/app/core/states/user.state';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-personal-info-step',
  templateUrl: './personal-info-step.component.html',
  styleUrl: './personal-info-step.component.scss'
})
export class PersonalInfoStepComponent extends BaseStepComponent implements OnInit {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() countryList: CountryDto[] = [];
  @Input() prefixList: SystemLookupDto[] = [];
  @Input() organizationList: SystemLookupDto[] = [];
  @Input() genderList: SystemLookupDto[] = [];
  @Input() governorateList: GovernorateDto[] = [];



  user: User = new User();

  constructor(public externalReviewerRegistrationWizardService: ExternalReviewerRegistrationWizardService,
    protected override router: Router) {
    super(externalReviewerRegistrationWizardService, router);
  }


  ngOnInit(): void {
    UserState.getUserState().subscribe(user => {
      if (user !== null) {
        this.user = user;
      }
    });
  }


}
