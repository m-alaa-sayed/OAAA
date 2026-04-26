import { Component, Input } from '@angular/core';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { BroadField } from 'src/app/pages/external-reviewers/types/broad-field';
import { CseqaGeneralSpecialization } from 'src/app/pages/external-reviewers/types/cseqa-general-specialization';
import { CseqaSpecificSpecialization } from 'src/app/pages/external-reviewers/types/cseqa-specific-specialization';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { GeneralSpecialization } from 'src/app/pages/external-reviewers/types/general-specialization';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-qualafications-and-skills-tab',
  templateUrl: './qualafications-and-skills-tab.component.html',
  styleUrl: './qualafications-and-skills-tab.component.scss'
})
export class QualaficationsAndSkillsTabComponent extends BaseTabComponent {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() languageList: SystemLookupDto[] = [];
  @Input() higherEducationList: SystemLookupDto[] = [];
  @Input() institutionList: SystemLookupDto[] = [];
  @Input() broadFieldList: BroadField[] = [];
  @Input() generalSpecializationList: GeneralSpecialization[] = [];
  @Input() cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  @Input() cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];
  @Input() expertiseYearList: SystemLookupDto[] = [];
  @Input() isEditMode: boolean = false;

}
