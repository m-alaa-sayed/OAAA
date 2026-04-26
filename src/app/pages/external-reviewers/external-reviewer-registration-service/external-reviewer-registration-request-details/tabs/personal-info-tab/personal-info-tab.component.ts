import { Component, Input } from '@angular/core';
import { CountryDto } from 'src/app/core/models/country-dto';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-personal-info-tab',
  templateUrl: './personal-info-tab.component.html',
  styleUrl: './personal-info-tab.component.scss'
})
export class PersonalInfoTabComponent extends BaseTabComponent {
  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() countryList: CountryDto[] = [];
  @Input() prefixList: SystemLookupDto[] = [];
  @Input() genderList: SystemLookupDto[] = [];
  @Input() organizationList: SystemLookupDto[] = [];
  @Input() governorateList: GovernorateDto[] = [];
  @Input() noObjectionCertificateEnable : boolean = true;
  @Input() user: User = new User();
  @Input() noObjectionCertificateVisible: boolean = true;
  
}
