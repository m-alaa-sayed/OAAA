import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { ExternalReviewerRegistrationWizardService } from 'src/app/core/services/external-reviewer-registration-wizard.service';
import { BroadField } from 'src/app/pages/external-reviewers/types/broad-field';
import { CseqaGeneralSpecialization } from 'src/app/pages/external-reviewers/types/cseqa-general-specialization';
import { CseqaSpecificSpecialization } from 'src/app/pages/external-reviewers/types/cseqa-specific-specialization';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { GeneralSpecialization } from 'src/app/pages/external-reviewers/types/general-specialization';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-qualafications-and-skills-step',
  templateUrl: './qualafications-and-skills-step.component.html',
  styleUrl: './qualafications-and-skills-step.component.scss'
})
export class QualaficationsAndSkillsStepComponent extends BaseStepComponent implements OnInit {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() languageList: SystemLookupDto[] = [];
  @Input() higherEducationList: SystemLookupDto[] = [];
  @Input() institutionList: SystemLookupDto[] = [];
  @Input() broadFieldList: BroadField[] = [];
  @Input() generalSpecializationList: GeneralSpecialization[] = [];
  @Input() cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  @Input() cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];
  @Input() expertiseYearList: SystemLookupDto[] = [];


  constructor(public externalReviewerRegistrationWizardService: ExternalReviewerRegistrationWizardService,
    protected override router: Router) {
    super(externalReviewerRegistrationWizardService, router);
  }

  ngOnInit(): void {

  }

}
